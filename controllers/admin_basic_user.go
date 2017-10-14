package controllers

import (
	"HangarHero/models"
	"encoding/hex"
	"fmt"
	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
	"golang.org/x/crypto/bcrypt"
	"strconv"
	"time"
)

//AdminHome templates the home routeed to "/admin/home"
func (c *MainController) AdminHome() {
	err := c.VerifyAdminSession()
	if err != nil {
		c.Abort("401")
	}
	c.TplName = "adminhomev2.tpl"
	c.Render()
}

//LogInAdmin  places the admin cookie routed to "/admin/login"
func (c *MainController) LogInAdmin() {
	c.TplName = "signinadmin.tpl"
	if c.Ctx.Input.Method() == "POST" {
		username := c.GetString("email")
		password := c.GetString("password")

		valid := validation.Validation{}
		valid.Required(username, "username")
		valid.Required(password, "password")

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
		//******** Read password hash from database
		o := orm.NewOrm()
		user := models.Admin{}
		err := o.QueryTable("Admin").Filter("Name", username).One(&user)
		if err != nil {
			errormap["Login Failed"] = "Could not find user"
			c.Data["errors"] = errormap
			c.Render()
			return
		}

		//******** Compare submitted password with database
		dbPassword, err := hex.DecodeString(user.Password)
		if err != nil {
			errormap["Login Failed"] = "Database Error"
			c.Data["errors"] = errormap
			c.Render()
			return
		}
		if err := bcrypt.CompareHashAndPassword(dbPassword, []byte(password)); err != nil {
			errormap["Login Failed"] = "Invalid Email or Password"
			c.Data["errors"] = errormap
			c.Render()
			return
		}

		//******** Create session and go back to previous page
		m := make(map[string]string)
		m["userid"] = strconv.FormatInt(user.Id, 10)
		m["timestamp"] = time.Now().String()
		c.SetSession("hangarqueenAdmin", m)
		c.Redirect("/admin/home", 302)
		return
	}
	c.Render()
}

//LogOutAdmin Logs outthe Admin routed to "/admin/logout"
func (c *MainController) LogOutAdmin() {
	c.DelSession("hangarqueenAdmin")
	c.Redirect("/", 302)
}

//AddAdmin creates a new administrator account routed to "/admin/addadmin"
func (c *MainController) AddAdmin() {
	c.TplName = "addadmin.tpl"
	o := orm.NewOrm()
	var adminArray []models.Admin
	_, err := o.QueryTable("Admin").All(&adminArray)
	if err != nil {
		c.Abort("500")
	}
	//if there is no admin in the database allow the creation of one
	if len(adminArray) != 0 {
		err := c.VerifyAdminSession()
		if err != nil {
			c.Abort("401")
		}
	}

	if c.Ctx.Input.Method() == "POST" {
		email := c.GetString("email")
		password := c.GetString("password")
		password2 := c.GetString("password2")

		//validation of input
		valid := validation.Validation{}
		valid.Email(email, "Email")
		valid.Required(password, "Password")
		valid.Required(password2, "Password2")
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
		h, err := bcrypt.GenerateFromPassword([]byte(password), 10)
		if err != nil {
			errormap["Encryption Error"] = err.Error()
			c.Data["errors"] = errormap
			c.Render()
			return
		}
		hashpass := hex.EncodeToString(h)
		admindata := models.Admin{Id: 0, Name: email, Password: hashpass}
		fmt.Println(admindata.Id)
		_, err = o.Insert(&admindata)
		if err != nil {
			errormap["Database Error Admin"] = err.Error()
			c.Data["errors"] = errormap
			c.Render()
			return
		}
		c.Redirect("/admin/login", 302)
		return
	}
	c.Render()
}
