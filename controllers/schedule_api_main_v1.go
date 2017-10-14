package controllers

import (
	"HangarHero/models"
	"HangarHero/utilities"
	"encoding/json"
	"github.com/astaxie/beego/orm"
	"gopkg.in/mailgun/mailgun-go.v1"
	"strconv"
	"time"
)

type ErrorLog struct {
	Text string
}

func (c *MainController) ManualErrorLog() {
	user, err := c.VerifySession()
	if err != nil {
		utilities.Papertrail("Unauthorized attempt to access: "+user.Email, "Warn")
		c.Abort("500")
	}
	var request ErrorLog
	err = json.Unmarshal(c.Ctx.Input.RequestBody, &request)
	if err != nil {
		c.Abort("500")
	}
	utilities.Papertrail("User Reported a bug: "+request.Text+""+user.Email, "Crit")
	//Send us an email so we know

	mg := mailgun.NewMailgun("mgDomain", "mgKey", "")
	m := mg.NewMessage(
		"HangarHero <new@mg.hangarhero.com>", // From
		"Viewer reported bug",                // Subject
		user.Email+" has reported a bug."+request.Text,
		"Joseph Schuerman <joseph.schuerman@gmail.com>")
	m.SetHtml("<html><p>New user id is" + user.Email + " has reported a bug." + request.Text + "</p></html>")
	//we ignore any error here because it has no user impact
	mg.Send(m)
}

//struct for AircraftSearch
type searchreturn struct {
	Make  string
	Model string
	Owner string
	Id    string
}

//AircraftSearch finds the AC record routed to "/api/aircraft/?:id"
func (c *MainController) AircraftSearch() {
	user, err := c.VerifySession()
	if err != nil {
		utilities.Papertrail("Unauthorized attempt to access: "+user.Email, "Warn")
		toReturn := errorReturn{Code: 401, English: "Unable to verify session"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	regNumber := c.Ctx.Input.Param(":id")
	o := orm.NewOrm()
	var aircraftData models.AircraftReport
	err = o.QueryTable("AircraftReport").Filter("Nnumber", regNumber).One(&aircraftData)
	if err == orm.ErrMultiRows {
		toReturn := errorReturn{Code: 500, English: "Multiple aircraft share this N-number"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	if err != nil {
		utilities.Papertrail("Aircraft Search Unable to find registration for : "+regNumber, "Info")
		toReturn := errorReturn{Code: 500, English: "Database error finding aircraft"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	modelData := models.ModelCode{Id: aircraftData.ACModelCode.Id}
	err = o.Read(&modelData)
	if err != nil {
		utilities.Papertrail("Aircraft Search Unable to find model info for : "+regNumber, "Info")
		toReturn := errorReturn{Code: 500, English: "Database error finding model code"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	toReturn := searchreturn{Make: modelData.Make, Model: modelData.Model,
		Owner: aircraftData.Name, Id: aircraftData.Id}
	finishedJSON, err := json.Marshal(toReturn)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Unable to create JSON"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	c.Data["json"] = string(finishedJSON)
	c.ServeJSON()
}

//struct for GetEQCats
type eqSelect struct {
	Id   int64
	Name string
}

//GetEQCats returns the equipment categories Routed to "/api/getcats/"
func (c *MainController) GetEQCats() {
	_, err := c.VerifySession()
	if err != nil {
		toReturn := errorReturn{Code: 401, English: "Unable to verify session"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	var forSelect []eqSelect
	var cats []*models.EquipmentCategory
	o := orm.NewOrm()
	_, err = o.QueryTable("EquipmentCategory").OrderBy("Name").All(
		&cats)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Database error unable to read equipment categories"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	for _, v := range cats {
		temp := eqSelect{Id: v.Id, Name: v.Name}
		forSelect = append(forSelect, temp)
	}
	finishedJSON, err := json.Marshal(forSelect)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Database error unable to marshal JSON"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	c.Data["json"] = string(finishedJSON)
	c.ServeJSON()
}

//GetEQSubCats returns the equipment categories Routed to "/api/getsubcats/"
func (c *MainController) GetEQSubCats() {
	_, err := c.VerifySession()
	if err != nil {
		toReturn := errorReturn{Code: 401, English: "Unable to verify session"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	catNum := c.Ctx.Input.Param(":id")
	i, err := strconv.ParseInt(catNum, 10, 64)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Bad Category ID"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	var forSelect []eqSelect
	var subcats []*models.EquipmentSubCategory
	o := orm.NewOrm()
	_, err = o.QueryTable("EquipmentSubCategory").Filter("category", i).OrderBy("Name").All(&subcats)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Database error unable to read equipment categories"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	for _, v := range subcats {
		temp := eqSelect{Id: v.Id, Name: v.Name}
		forSelect = append(forSelect, temp)
	}
	finishedJSON, err := json.Marshal(forSelect)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Database error unable to marshal JSON"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	c.Data["json"] = string(finishedJSON)
	c.ServeJSON()
}

//GetEQNames returns names for eq an category routed to "/api/geteqnames/?:id"
func (c *MainController) GetEQNames() {
	_, err := c.VerifySession()
	if err != nil {
		toReturn := errorReturn{Code: 401, English: "Database error unable to verify session"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	catNum := c.Ctx.Input.Param(":id")
	i, err := strconv.ParseInt(catNum, 10, 64)
	var forSelect []eqSelect
	var equip []*models.Equipment
	o := orm.NewOrm()
	_, err = o.QueryTable("Equipment").Filter("SubCategory", i).OrderBy("Name").All(
		&equip)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Database error unable to read equipment"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	for _, v := range equip {
		temp := eqSelect{Id: v.Id, Name: v.Name}
		forSelect = append(forSelect, temp)
	}
	finishedJSON, err := json.Marshal(forSelect)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Database error unable to marshal JSON"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	c.Data["json"] = string(finishedJSON)
	c.ServeJSON()

}

//GetHangars returns all of the user's hangars routed to "/api/gethangars"
func (c *MainController) GetHangars() {
	user, err := c.VerifySession()
	if err != nil {
		utilities.Papertrail("Unauthorized attempt to access: "+user.Email, "Warn")
		toReturn := errorReturn{Code: 401, English: "Bad Session"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	o := orm.NewOrm()
	var instances []*models.Hangar
	_, err = o.QueryTable("hangar").Filter("user", user).All(
		&instances)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Database error finding hangars"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	finishedJSON, err := json.Marshal(instances)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Unable to marshal JSON"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	c.Data["json"] = string(finishedJSON)
	c.ServeJSON()
}

//structure for AddACInstance
type addACI struct {
	OwningHangar int64
	Registration string
	StartTime    time.Time
	EndTime      time.Time
}

//AddACInstance inserts an aircraft instance routed to "/api/addacinstance"
func (c *MainController) AddACInstance() {
	var request addACI
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &request)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Unable to unmarshal request"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	user, err := c.VerifyHangar(request.OwningHangar)
	if err != nil {
		utilities.Papertrail("Unauthorized attempt to access: "+user.Email, "Warn")
		toReturn := errorReturn{Code: 401, English: "This hangar does not belong to you"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	o := orm.NewOrm()
	o.Begin()
	//find the hangar
	hangar := models.Hangar{Id: request.OwningHangar}
	err = o.Read(&hangar)
	if err != nil {
		o.Rollback()
		toReturn := errorReturn{Code: 500, English: "Database error unable to read hangar"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	//find the registration
	report := models.AircraftReport{Id: request.Registration}
	err = o.Read(&report)
	if err != nil {
		o.Rollback()
		toReturn := errorReturn{Code: 500, English: "Database error reading aircraft"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	finished := models.ACInstance{Id: 0, OwningHangar: &hangar, Registration: &report,
		StartTime: request.StartTime, EndTime: request.EndTime, ModelInfo: report.ACModelCode}

	id, err := o.Insert(&finished)
	if err != nil {
		o.Rollback()
		toReturn := errorReturn{Code: 500, English: "Database error inserting instance"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	finished.Id = id
	//add the initial instance
	strangeInstance := models.ACInstance{Id: id}
	renderLine := models.ACLine{Id: 0, Instance: &strangeInstance, StartTime: request.StartTime, EndTime: request.EndTime}
	_, err = o.Insert(&renderLine)
	if err != nil {
		o.Rollback()
		toReturn := errorReturn{Code: 500, English: "Database error inserting line"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	o.Commit()
}

//struct for AddEQInstance
type addEQI struct {
	OwningHangar int64
	Id           int64
	StartTime    time.Time
	EndTime      time.Time
}

//AddEQInstance inserts an equipment instance routed to "/api/addeqinstance"
func (c *MainController) AddEQInstance() {
	var request addEQI
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &request)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Unable to unmarshal request"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	user, err := c.VerifyHangar(request.OwningHangar)
	if err != nil {
		utilities.Papertrail("Unauthorized attempt to access: "+user.Email, "Warn")
		toReturn := errorReturn{Code: 401, English: "This hangar does not belong to you"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	o := orm.NewOrm()
	o.Begin()
	//find the hangar
	hangar := models.Hangar{Id: request.OwningHangar}
	err = o.Read(&hangar)
	if err != nil {
		o.Rollback()
		toReturn := errorReturn{Code: 500, English: "Database error reading hangar"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	//find the equipment
	equipment := models.Equipment{Id: request.Id}
	err = o.Read(&equipment)
	if err != nil {
		o.Rollback()
		toReturn := errorReturn{Code: 500, English: "Database error reading equipment"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	//find the model from the record
	finished := models.EquipInstance{Id: 0, OwningHangar: &hangar, ModelInfo: &equipment,
		StartTime: request.StartTime, EndTime: request.EndTime}

	id, err := o.Insert(&finished)
	finished.Id = id
	if err != nil {
		o.Rollback()
		toReturn := errorReturn{Code: 500, English: "Database error inserting instance"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	//add the initial instance
	strangeInstance := models.EquipInstance{Id: id}
	renderLine := models.EQLine{Id: 0, Instance: &strangeInstance, StartTime: request.StartTime, EndTime: request.EndTime}
	_, err = o.Insert(&renderLine)
	if err != nil {
		o.Rollback()
		toReturn := errorReturn{Code: 500, English: "Database error unable to insert initial instance"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	o.Commit()
}
