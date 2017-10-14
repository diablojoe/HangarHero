package controllers

import (
	"HangarHero/models"
	"encoding/hex"
	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
	"golang.org/x/crypto/bcrypt"
)

func (c *MainController) EditAccount() {
	c.TplName = "editaccount.tpl"
	user, err := c.VerifySession()
	if err != nil {
		c.Redirect("/login", 302)
		return
	}
	//this is all well and good but we need the full user
	o := orm.NewOrm()
	err = o.QueryTable("user").Filter("id", user.Id).RelatedSel().One(user)
	errormap := make(map[string]string)
	if err != nil {
		errormap["Database Error Getting Full User"] = err.Error()
		c.Data["errors"] = errormap
		c.Render()
		return
	}
	//gather the information
	numhangars, err := o.QueryTable("hangar").Filter("user_id", user.Id).Count()
	if err != nil {
		errormap["Database Error Getting Number of Hangars"] = err.Error()
		c.Data["errors"] = errormap
		c.Render()
		return
	}
	numviewers, err := o.LoadRelated(user, "Viewers")
	if err != nil {
		errormap["Database Error Loading Viewers"] = err.Error()
		c.Data["errors"] = errormap
		c.Render()
		return
	}
	if c.Ctx.Input.Method() == "POST" {
		firstname := c.GetString("firstname")
		lastname := c.GetString("lastname")
		orgname := c.GetString("orgname")
		zip := c.GetString("zip")
		email := c.GetString("email")
		password := c.GetString("password")
		password2 := c.GetString("password2")

		//validation of input
		valid := validation.Validation{}
		valid.Required(firstname, "Firstname")
		valid.Required(lastname, "Lastname")
		valid.Required(zip, "Zip Code")
		valid.Email(email, "Email")
		userdata := models.User{}
		if password != "" {
			valid.Required(password, "Password")
			valid.Required(password, "Password 2")
			if password != password2 {
				valid.SetError("Passwords", "do not match")
			}
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
			h, err := bcrypt.GenerateFromPassword([]byte(password), 10)
			if err != nil {
				errormap["Encryption Error"] = err.Error()
				c.Data["errors"] = errormap
				c.Render()
				return
			}
			hashpass := hex.EncodeToString(h)

			userdata = models.User{Id: user.Id, FirstName: firstname, LastName: lastname,
				OrgName: orgname, Email: email, Zip: zip, Password: hashpass,
				RequestReset: false, VerifiedEmail: true}
		} else {
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
			userdata = models.User{Id: user.Id, FirstName: firstname, LastName: lastname, OrgName: orgname, Email: email, Zip: zip, RequestReset: false, VerifiedEmail: true}
		}
		o := orm.NewOrm()
		o.Begin()
		_, err = o.Update(&userdata)
		if err != nil {
			o.Rollback()
			errormap["Database Error"] = err.Error()
			c.Data["errors"] = errormap
			c.Render()
			return
		}
		o.Commit()
	}
	//gather up the details for the
	c.Data["user"] = user
	c.Data["numhangars"] = numhangars
	c.Data["numviewers"] = numviewers
	c.Render()
}
