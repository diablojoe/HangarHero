package controllers

import (
	"HangarHero/models"
	"fmt"
	"github.com/astaxie/beego/orm"
	"strconv"
	"strings"
)

type object3dResult struct {
	ModelId  int64
	Name     string
	ICAO     string
	Location string
}
type object3dListResult struct {
	Result  string
	Records []object3dResult
}
type object3dSingleResult struct {
	Result string
	Record object3dResult
}
type jTableError struct {
	Result  string
	Message string
}
type jTableSimple struct {
	Result string
}

func (c *MainController) Object3dListing() {
	if c.VerifyAdminSession() != nil {
		c.Abort("401")
	}
	o := orm.NewOrm()

	var instances []models.Object3d
	_, err := o.QueryTable("Object3d").All(&instances, "Id", "Name", "ICAO", "Location")
	if err != nil {
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "Error", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	var finishedList []object3dResult
	for _, v := range instances {
		results := object3dResult{}
		results.ICAO = v.ICAO
		results.Name = v.Name
		results.Location = v.Location
		results.ModelId = v.Id
		finishedList = append(finishedList, results)
	}
	toReturn := object3dListResult{Result: "OK", Records: finishedList}
	if err != nil {
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	c.Data["json"] = &toReturn
	c.ServeJSON()
}
func (c *MainController) Object3dInsert() {
	if c.VerifyAdminSession() != nil {
		c.Abort("401")
	}
	request := string(c.Ctx.Input.RequestBody)
	requestParts := strings.Split(request, "&")
	toAdd := models.Object3d{}
	for _, v := range requestParts {
		requestFields := strings.Split(v, "=")
		switch requestFields[0] {
		case "Name":
			toAdd.Name = strings.Replace(requestFields[1], "+", " ", -1)
		case "ICAO":
			toAdd.ICAO = strings.Replace(requestFields[1], "+", " ", -1)
		case "Location":
			toAdd.Location = strings.Replace(requestFields[1], "+", " ", -1)
			toAdd.Location = strings.Replace(toAdd.Location, "%2F", "/", -1)
		}
	}
	o := orm.NewOrm()
	o.Begin()
	_, err := o.Insert(&toAdd)
	if err != nil {
		o.Rollback()
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	o.Commit()
	echoData := object3dResult{ModelId: toAdd.Id, ICAO: toAdd.ICAO, Name: toAdd.Name, Location: toAdd.Location}
	echoResult := object3dSingleResult{Result: "OK", Record: echoData}
	c.Data["json"] = &echoResult
	c.ServeJSON()
}
func (c *MainController) Object3dEdit() {
	if c.VerifyAdminSession() != nil {
		c.Abort("401")
	}
	request := string(c.Ctx.Input.RequestBody)
	requestParts := strings.Split(request, "&")
	toAdd := models.Object3d{}
	for _, v := range requestParts {
		requestFields := strings.Split(v, "=")
		if requestFields[0] == "ModelId" {
			id, err := strconv.ParseInt(requestFields[1], 10, 64)
			if err != nil {
				fmt.Println(err.Error())
				errorResult := jTableError{Result: "ERROR", Message: err.Error()}
				c.Data["json"] = &errorResult
				c.ServeJSON()
			}
			toAdd.Id = id
			break
		}
	}
	//get the old record
	o := orm.NewOrm()
	o.Begin()
	err := o.Read(&toAdd)
	if err != nil {
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	for _, v := range requestParts {
		requestFields := strings.Split(v, "=")
		switch requestFields[0] {
		case "Name":
			toAdd.Name = strings.Replace(requestFields[1], "+", " ", -1)
		case "ICAO":
			toAdd.ICAO = strings.Replace(requestFields[1], "+", " ", -1)
		case "Location":
			toAdd.Location = strings.Replace(requestFields[1], "+", " ", -1)
			toAdd.Location = strings.Replace(toAdd.Location, "%2F", "/", -1)
		}
	}

	_, err = o.Update(&toAdd)
	if err != nil {
		o.Rollback()
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	o.Commit()
	echo := jTableSimple{Result: "OK"}
	c.Data["json"] = &echo
	c.ServeJSON()
}

func (c *MainController) Object3dDelete() {
	if c.VerifyAdminSession() != nil {
		c.Abort("401")
	}
	request := string(c.Ctx.Input.RequestBody)
	requestParts := strings.Split(request, "&")
	removeId := int64(0)
	for _, v := range requestParts {
		requestFields := strings.Split(v, "=")
		if requestFields[0] == "ModelId" {
			id, err := strconv.ParseInt(requestFields[1], 10, 64)
			removeId = id
			if err != nil {
				fmt.Println(err.Error())
				errorResult := jTableError{Result: "ERROR", Message: err.Error()}
				c.Data["json"] = &errorResult
				c.ServeJSON()
			}
			break
		}
	}
	//get the old record
	o := orm.NewOrm()
	o.Begin()
	toRemove := models.Object3d{}
	err := o.QueryTable("Object3d").Filter("Id", removeId).RelatedSel().One(&toRemove)
	if err != nil {
		o.Rollback()
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	if len(toRemove.EquipmentCovered) != 0 || len(toRemove.ModelsCovered) != 0 {
		o.Rollback()
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: "Aircract or Equipment is still associated with this"}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	_, err = o.Delete(&toRemove)
	o.Commit()
	echo := jTableSimple{Result: "OK"}
	c.Data["json"] = &echo
	c.ServeJSON()
}

//assocated modelcodes structs
type codeListing struct {
	ModelId int64
	CodeId  string
	Make    string
	Model   string
}
type codeListings struct {
	Result  string
	Records []codeListing
}
type codeListingSingle struct {
	Result string
	Record codeListing
}

//associated object3d to modelcode API
func (c *MainController) AssociatedModelCodeListing() {
	if c.VerifyAdminSession() != nil {
		c.Abort("401")
	}

	objectID := c.Ctx.Input.Param(":id")
	id, err := strconv.ParseInt(objectID, 10, 64)
	if err != nil {
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	o := orm.NewOrm()

	var instances []models.ModelCode
	_, err = o.QueryTable("ModelCode").Filter("ObjectRef", id).All(&instances)
	if err != nil {
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	var finished []codeListing
	for _, v := range instances {
		toAdd := codeListing{ModelId: id, CodeId: v.Id, Make: v.Make, Model: v.Model}
		finished = append(finished, toAdd)
	}
	toReturn := codeListings{Result: "OK", Records: finished}
	c.Data["json"] = &toReturn
	c.ServeJSON()

}
func (c *MainController) AssociatedModelCodeNew() {
	if c.VerifyAdminSession() != nil {
		c.Abort("401")
	}
	request := string(c.Ctx.Input.RequestBody)
	fmt.Println("I have the request", request)
	requestParts := strings.Split(request, "&")
	modelId := ""
	codeId := ""
	for _, v := range requestParts {
		requestFields := strings.Split(v, "=")
		switch requestFields[0] {
		case "ModelId":
			modelId = strings.Replace(requestFields[1], "+", " ", -1)
		case "CodeId":
			codeId = strings.Replace(requestFields[1], "+", " ", -1)
		}
	}
	o := orm.NewOrm()
	o.Begin()
	//find the code
	code := models.ModelCode{}
	err := o.QueryTable("ModelCode").Filter("Id", codeId).RelatedSel().One(&code)
	if err != nil {
		o.Rollback()
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	//find the object3d
	objRef := models.Object3d{}
	err = o.QueryTable("Object3d").Filter("Id", modelId).One(&objRef)
	if err != nil {
		o.Rollback()
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	//associate it with the object3d
	code.ObjectRef = &objRef
	_, err = o.Update(&code)
	if err != nil {
		o.Rollback()
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	o.Commit()
	echoData := codeListing{ModelId: objRef.Id, CodeId: code.Id, Make: code.Make, Model: code.Model}
	echoResult := codeListingSingle{Result: "OK", Record: echoData}
	c.Data["json"] = &echoResult
	c.ServeJSON()

}
func (c *MainController) AssociatedModelCodeDelete() {
	if c.VerifyAdminSession() != nil {
		c.Abort("401")
	}
	request := string(c.Ctx.Input.RequestBody)
	requestParts := strings.Split(request, "&")
	removeId := ""
	for _, v := range requestParts {
		requestFields := strings.Split(v, "=")
		if requestFields[0] == "CodeId" {
			removeId = requestFields[1]
			break
		} else {
			errorResult := jTableError{Result: "ERROR", Message: "Invalid request " + request}
			c.Data["json"] = &errorResult
			c.ServeJSON()
		}
	}
	//get the old record
	o := orm.NewOrm()
	o.Begin()
	toRemove := models.ModelCode{Id: removeId}
	err := o.Read(&toRemove)
	if err != nil {
		o.Rollback()
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	toRemove.ObjectRef = nil
	_, err = o.Update(&toRemove)
	if err != nil {
		o.Rollback()
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	o.Commit()
	echo := jTableSimple{Result: "OK"}
	c.Data["json"] = &echo
	c.ServeJSON()
}

//assocated equipment structs
type eqListing struct {
	ModelId         int64
	EquipmentId     int64
	Name            string
	SubCategoryName string
	CategoryName    string
}
type eqListings struct {
	Result  string
	Records []eqListing
}
type eqListingSingle struct {
	Result string
	Record eqListing
}

//AssociatedEquipmentListing lists associated object3d to equipment API routed to "/admin/api/associatedeqlist/?:id"
func (c *MainController) AssociatedEquipmentListing() {
	if c.VerifyAdminSession() != nil {
		c.Abort("401")
	}

	objectID := c.Ctx.Input.Param(":id")
	id, err := strconv.ParseInt(objectID, 10, 64)
	if err != nil {
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	o := orm.NewOrm()

	var instances []models.Equipment
	_, err = o.QueryTable("Equipment").Filter("ObjectRef", id).RelatedSel().All(&instances)
	if err != nil {
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	var finished []eqListing
	for _, v := range instances {
		toAdd := eqListing{ModelId: v.ObjectRef.Id, EquipmentId: v.Id, Name: v.Name, SubCategoryName: v.SubCategory.Name,
			CategoryName: v.SubCategory.Category.Name}
		finished = append(finished, toAdd)
	}
	toReturn := eqListings{Result: "OK", Records: finished}
	c.Data["json"] = &toReturn
	c.ServeJSON()

}

//AssociatedModelCodeNew creates a new association between equipment and model routed to "/admin/api/createassociatedeq"
func (c *MainController) AssociatedEquipmentNew() {
	if c.VerifyAdminSession() != nil {
		c.Abort("401")
	}
	request := string(c.Ctx.Input.RequestBody)
	fmt.Println("I have the request", request)
	requestParts := strings.Split(request, "&")
	modelIdstring := ""
	equipmentIdstring := ""
	for _, v := range requestParts {
		requestFields := strings.Split(v, "=")
		switch requestFields[0] {
		case "ModelId":
			modelIdstring = strings.Replace(requestFields[1], "+", " ", -1)
		case "EquipmentId":
			equipmentIdstring = strings.Replace(requestFields[1], "+", " ", -1)
		}
	}
	modelId, err := strconv.ParseInt(modelIdstring, 10, 64)
	if err != nil {
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	equipmentId, err := strconv.ParseInt(equipmentIdstring, 10, 64)
	if err != nil {
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	o := orm.NewOrm()
	o.Begin()
	//find the code
	equipment := models.Equipment{}
	err = o.QueryTable("Equipment").Filter("Id", equipmentId).One(&equipment)
	if err != nil {
		o.Rollback()
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	//find the object3d
	objRef := models.Object3d{}
	err = o.QueryTable("Object3d").Filter("Id", modelId).One(&objRef)
	if err != nil {
		o.Rollback()
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	//associate it with the object3d
	equipment.ObjectRef = &objRef
	_, err = o.Update(&equipment)
	if err != nil {
		o.Rollback()
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	o.Commit()
	echoData := eqListing{ModelId: equipment.ObjectRef.Id, EquipmentId: equipment.Id, Name: equipment.Name,
		SubCategoryName: equipment.SubCategory.Name, CategoryName: equipment.SubCategory.Category.Name}
	echoResult := eqListingSingle{Result: "OK", Record: echoData}
	c.Data["json"] = &echoResult
	c.ServeJSON()

}
func (c *MainController) AssociatedEquipmentDelete() {
	if c.VerifyAdminSession() != nil {
		c.Abort("401")
	}
	request := string(c.Ctx.Input.RequestBody)
	requestParts := strings.Split(request, "&")
	removeIdstring := ""
	for _, v := range requestParts {
		requestFields := strings.Split(v, "=")
		if requestFields[0] == "EquipmentId" {
			removeIdstring = requestFields[1]
			break
		} else {
			errorResult := jTableError{Result: "ERROR", Message: "Invalid request " + request}
			c.Data["json"] = &errorResult
			c.ServeJSON()
		}
	}
	removeId, err := strconv.ParseInt(removeIdstring, 10, 64)
	if err != nil {
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	//get the old record
	o := orm.NewOrm()
	o.Begin()
	toRemove := models.Equipment{Id: removeId}
	err = o.Read(&toRemove)
	if err != nil {
		o.Rollback()
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	toRemove.ObjectRef = nil
	_, err = o.Update(&toRemove)
	if err != nil {
		o.Rollback()
		fmt.Println(err.Error())
		errorResult := jTableError{Result: "ERROR", Message: err.Error()}
		c.Data["json"] = &errorResult
		c.ServeJSON()
	}
	o.Commit()
	echo := jTableSimple{Result: "OK"}
	c.Data["json"] = &echo
	c.ServeJSON()
}
