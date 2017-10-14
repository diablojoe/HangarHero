package controllers

import (
	"HangarHero/models"
	"github.com/astaxie/beego/orm"
	"strconv"
)

func (c *MainController) AddEqCat() {
	c.TplName = "addequipmentcat.tpl"
	err := c.VerifyAdminSession()
	if err != nil {
		c.Redirect("/admin/login", 302)
		return
	}

	o := orm.NewOrm()

	if c.Ctx.Input.Method() == "POST" {
		action := c.GetString("action")
		errormap := make(map[string]string)
		switch action {
		case "add":
			catId := c.GetString("name")
			if err != nil {
				errormap["Database Error"] = "Invalid Input"
				c.Data["errors"] = errormap
				c.Render()
				return
			}
			userdata := models.EquipmentCategory{Name: catId}
			_, err = o.Insert(&userdata)
			if err != nil {
				errormap["Database Error"] = err.Error()
				c.Data["errors"] = errormap
				c.Render()
				return
			}
		case "update":
			catIdS := c.GetString("id")
			catId, err := strconv.ParseInt(catIdS, 10, 64)
			if err != nil {
				errormap["Parse Error"] = err.Error()
				c.Data["errors"] = errormap
				c.Render()
				return
			}
			catName := c.GetString("name")
			userdata := models.EquipmentCategory{Id: catId}
			err = o.Read(&userdata)
			if err != nil {
				errormap["Database Error"] = err.Error()
				c.Data["errors"] = errormap
				c.Render()
				return
			}
			userdata.Name = catName
			_, err = o.Update(&userdata)
			if err != nil {
				errormap["Database Error"] = err.Error()
				c.Data["errors"] = errormap
				c.Render()
				return
			}
		case "remove":
			catIdS := c.GetString("id")
			catId, err := strconv.ParseInt(catIdS, 10, 64)
			if err != nil {
				errormap["Parse Error"] = err.Error()
				c.Data["errors"] = errormap
				c.Render()
				return
			}
			userdata := models.EquipmentCategory{Id: catId}
			_, err = o.Delete(&userdata)
			if err != nil {
				errormap["Database Error"] = err.Error()
				c.Data["errors"] = errormap
				c.Render()
				return
			}
		default:
			errormap["Database Error"] = "No valid action"
			c.Data["errors"] = errormap
			c.Render()
			return
		}

	}
	//get the list of equipment cats
	var cats []*models.EquipmentCategory
	_, err = o.QueryTable("EquipmentCategory").All(&cats)
	toreturn := make(map[int64]string)
	for _, v := range cats {
		toreturn[v.Id] = v.Name
	}
	c.Data["eqcats"] = toreturn
	c.Render()
}

type Subcatlisting struct {
	Cat    string
	Subcat string
}

func (c *MainController) AddEqSubCat() {
	c.TplName = "addequipmentsubcat.tpl"
	err := c.VerifyAdminSession()
	if err != nil {
		c.Redirect("/admin/login", 302)
		return
	}

	o := orm.NewOrm()

	if c.Ctx.Input.Method() == "POST" {
		action := c.GetString("action")
		errormap := make(map[string]string)
		switch action {
		case "add":
			subcatName := c.GetString("name")
			catId, err := c.GetInt64("catid")
			if err != nil {
				errormap["Database Error"] = "Invalid Input"
				c.Data["errors"] = errormap
				c.Render()
				return
			}
			//get the cat
			category := models.EquipmentCategory{Id: catId}
			err = o.Read(&category)
			if err != nil {
				errormap["Database Error"] = "Invalid equipment category"
				c.Data["errors"] = errormap
				c.Render()
				return
			}
			userdata := models.EquipmentSubCategory{Name: subcatName, Category: &category}
			_, err = o.Insert(&userdata)
			if err != nil {
				errormap["Database Error"] = err.Error()
				c.Data["errors"] = errormap
				c.Render()
				return
			}
		case "update":
			catIdS := c.GetString("id")
			catId, err := strconv.ParseInt(catIdS, 10, 64)
			if err != nil {
				errormap["Parse Error"] = err.Error()
				c.Data["errors"] = errormap
				c.Render()
				return
			}
			catName := c.GetString("name")
			userdata := models.EquipmentSubCategory{Id: catId}
			err = o.Read(&userdata)
			if err != nil {
				errormap["Database Error"] = err.Error()
				c.Data["errors"] = errormap
				c.Render()
				return
			}
			userdata.Name = catName
			_, err = o.Update(&userdata)
			if err != nil {
				errormap["Database Error"] = err.Error()
				c.Data["errors"] = errormap
				c.Render()
				return
			}
		case "remove":
			catIdS := c.GetString("id")
			catId, err := strconv.ParseInt(catIdS, 10, 64)
			if err != nil {
				errormap["Parse Error"] = err.Error()
				c.Data["errors"] = errormap
				c.Render()
				return
			}
			userdata := models.EquipmentSubCategory{Id: catId}
			_, err = o.Delete(&userdata)
			if err != nil {
				errormap["Database Error"] = err.Error()
				c.Data["errors"] = errormap
				c.Render()
				return
			}
		default:
			errormap["Database Error"] = "No valid action"
			c.Data["errors"] = errormap
			c.Render()
			return
		}
	}
	//get the list of equipment subcats for display
	var subcats []*models.EquipmentSubCategory
	_, err = o.QueryTable("EquipmentSubCategory").RelatedSel().All(&subcats)
	toreturnsubs := make(map[int64]Subcatlisting)
	for _, v := range subcats {
		listing := Subcatlisting{Cat: v.Category.Name, Subcat: v.Name}
		toreturnsubs[v.Id] = listing
	}
	c.Data["eqsubcats"] = toreturnsubs

	//get the listing of all the cats for future inserts
	var cats []*models.EquipmentCategory
	_, err = o.QueryTable("EquipmentCategory").All(&cats)
	toreturncats := make(map[int64]string)
	for _, v := range cats {
		toreturncats[v.Id] = v.Name
	}
	c.Data["eqcats"] = toreturncats
	c.Render()
}

type EquipmentListing struct {
	Cat      string
	Subcat   string
	Name     string
	Object3d string
}

func (c *MainController) AddEq() {
	c.TplName = "addequipment.tpl"
	err := c.VerifyAdminSession()
	if err != nil {
		c.Redirect("/admin/login", 302)
		return
	}

	o := orm.NewOrm()

	if c.Ctx.Input.Method() == "POST" {
		action := c.GetString("action")
		errormap := make(map[string]string)
		switch action {
		case "add":
			eqName := c.GetString("name")
			subCatId, err := c.GetInt64("subcatid")
			if err != nil {
				errormap["Database Error"] = "Invalid Subcat Id"
				c.Data["errors"] = errormap
				c.Render()
				return
			}
			objectId, err := c.GetInt64("objectid")
			if err != nil {
				errormap["Database Error"] = "Invalid Object Id"
				c.Data["errors"] = errormap
				c.Render()
				return
			}
			//get the subcat
			subcategory := models.EquipmentSubCategory{Id: subCatId}
			err = o.Read(&subcategory)
			if err != nil {
				errormap["Database Error"] = "Invalid equipment sub category"
				c.Data["errors"] = errormap
				c.Render()
				return
			}
			//get the object3d
			object := models.Object3d{Id: objectId}
			err = o.Read(&object)
			if err != nil {
				errormap["Database Error"] = "Invalid object3d"
				c.Data["errors"] = errormap
				c.Render()
				return
			}
			//insert the new equipment
			userdata := models.Equipment{Name: eqName, SubCategory: &subcategory, ObjectRef: &object}
			_, err = o.Insert(&userdata)
			if err != nil {
				errormap["Database Error"] = err.Error()
				c.Data["errors"] = errormap
				c.Render()
				return
			}
		case "remove":
			catIdS := c.GetString("id")
			eqId, err := strconv.ParseInt(catIdS, 10, 64)
			if err != nil {
				errormap["Parse Error"] = err.Error()
				c.Data["errors"] = errormap
				c.Render()
				return
			}
			userdata := models.Equipment{Id: eqId}
			_, err = o.Delete(&userdata)
			if err != nil {
				errormap["Database Error"] = err.Error()
				c.Data["errors"] = errormap
				c.Render()
				return
			}
		default:
			errormap["Database Error"] = "No valid action"
			c.Data["errors"] = errormap
			c.Render()
			return
		}
	}
	//get the list of equipment for display
	var equipment []*models.Equipment
	_, err = o.QueryTable("Equipment").RelatedSel().All(&equipment)
	toreturnequipment := make(map[int64]EquipmentListing)
	for _, v := range equipment {
		listing := EquipmentListing{Cat: v.SubCategory.Category.Name, Subcat: v.SubCategory.Name,
			Name: v.Name, Object3d: v.ObjectRef.Name}
		toreturnequipment[v.Id] = listing
	}
	c.Data["equipment"] = toreturnequipment

	//get the listing of all the subcats for future inserts
	var subcats []*models.EquipmentSubCategory
	_, err = o.QueryTable("EquipmentSubCategory").All(&subcats)
	toreturnsubcats := make(map[int64]string)
	for _, v := range subcats {
		toreturnsubcats[v.Id] = v.Name
	}
	c.Data["eqsubcats"] = toreturnsubcats

	//get the listing of all the object3d for future inserts
	var objects []*models.Object3d
	_, err = o.QueryTable("Object3d").All(&objects)
	toreturnobjects := make(map[int64]string)
	for _, v := range objects {
		toreturnobjects[v.Id] = v.Name
	}
	c.Data["objects"] = toreturnobjects

	c.Render()
}

func (c *MainController) AddUnboundObject3d() {
	c.TplName = "addobject3d.tpl"
	err := c.VerifyAdminSession()
	if err != nil {
		c.Redirect("/admin/login", 302)
		return
	}

	o := orm.NewOrm()

	if c.Ctx.Input.Method() == "POST" {
		errormap := make(map[string]string)
		name := c.GetString("name")
		icao := c.GetString("icao")
		location := c.GetString("location")

		//insert the new object3d
		userdata := models.Object3d{Name: name, ICAO: icao, Location: location}
		_, err = o.Insert(&userdata)
		if err != nil {
			errormap["Database Error"] = err.Error()
			c.Data["errors"] = errormap
			c.Render()
			return
		}
	}
	//get the list of object3d for display
	var object3ds []*models.Object3d
	_, err = o.QueryTable("Object3d").All(&object3ds)
	c.Data["objects"] = object3ds

	c.Render()
}
