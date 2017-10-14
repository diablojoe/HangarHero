package controllers

import (
	//"strconv"
	"HangarHero/models"
	"fmt"
	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
)

//Manager is the main schedule routed to "/manager"
func (c *MainController) Manager() {
	c.TplName = "overviewtest.tpl"
	_, err := c.VerifySession()
	if err != nil {
		fmt.Println("about to redirect")
		c.Redirect("/login", 302)
		return
	}
	c.Render()
}

//Manager is the main schedule routed to "/managerv2"
func (c *MainController) Managerv2() {
	c.TplName = "overviewV2.tpl"
	//get the current hangar
	current, err := c.GetInt64(":id")
	if err != nil {
		current = 0
	}
	user, err := c.VerifySession()
	if err != nil {
		c.Redirect("/login", 302)
		return
	}
	//get a list of available hangars
	o := orm.NewOrm()
	var instances []*models.Hangar
	_, err = o.QueryTable("hangar").Filter("user", user).All(
		&instances)
	if err != nil {
		c.Abort("500")
	}
	//if current is not 0 set the current
	if current != 0 {
		c.Data["current"] = current
	} else {
		if len(instances) == 0 {
			c.Redirect("/addhangar", 301)
		} else {
			c.Data["current"] = instances[0].Id
		}
	}
	c.Data["hangars"] = &instances
	c.Render()
}

//UserAddHangar creates the hangar spance routedto "/useraddhangar"
func (c *MainController) UserAddHangar() {
	c.TplName = "useraddhangarv2.tpl"
	user, err := c.VerifySession()
	if err != nil {
		c.Redirect("/login", 302)
		return
	}
	if c.Ctx.Input.Method() == "POST" {
		name := c.GetString("name")
		definition := c.GetString("definition")
		valid := validation.Validation{}
		valid.Required(name, "Name")
		valid.Required(definition, "Definition")
		errormap := make(map[string]string)
		if valid.HasErrors() {
			// If there are error messages it means the validation didn't pass
			// Redirect to signup
			for _, err := range valid.Errors {
				errormap[err.Key] = err.Message
			}
			c.Data["errors"] = errormap
			c.Render()
			return
		}
		//check the number of hangars already stored
		o := orm.NewOrm()
		o.Begin()

		userdata := models.Hangar{Id: 0, Name: name, Definition: definition, User: user}
		_, err = o.Insert(&userdata)
		if err != nil {
			o.Rollback()
			errormap["Database Error"] = err.Error()
			c.Data["errors"] = errormap
			c.Render()
			return
		}

	}
	c.Render()
}

//UserRemoveHangar creates the hangar spance routedto "/userremovehangar"
func (c *MainController) UserRemoveHangar() {
	c.TplName = "removehangar.tpl"
	user, err := c.VerifySession()
	if err != nil {
		c.Redirect("/login", 302)
		return
	}
	//get the list of available hangars
	o := orm.NewOrm()
	o.Begin()
	var instances []*models.Hangar
	_, err = o.QueryTable("hangar").Filter("user", user).All(
		&instances)
	toreturn := make(map[int64]string)
	for _, v := range instances {
		toreturn[v.Id] = v.Name
	}
	c.Data["hangars"] = toreturn
	if c.Ctx.Input.Method() == "POST" {
		errormap := make(map[string]string)
		hangarid, err := c.GetInt64("select")
		if err != nil {
			errormap["Input Error"] = "Invalid Hangar ID"
			c.Data["errors"] = errormap
			c.Render()
			return
		}
		//verify the requested hangar is owned by the user
		_, err = c.VerifyHangar(hangarid)
		if err != nil {
			o.Rollback()
			errormap["Database Error"] = "You do not own this hangar"
			c.Data["errors"] = errormap
			c.Render()
			return
		}
		//remove the hangar
		userdata := models.Hangar{Id: hangarid}
		_, err = o.Delete(&userdata)
		if err != nil {
			o.Rollback()
			errormap["Database Error"] = err.Error()
			c.Data["errors"] = errormap
			c.Render()
			return
		}
		o.Commit()
		c.Redirect("/manager", 302)
		return
	}
	c.Render()
}
