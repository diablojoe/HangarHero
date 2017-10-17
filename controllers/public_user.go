package controllers

import (
	"HangarHero/models"
	"encoding/hex"
	"strconv"
	"time"

	"HangarHero/utilities"
	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/validation"
	"github.com/satori/go.uuid"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/mailgun/mailgun-go.v1"
)

//Home renders the homepage routed to "/"
func (c *MainController) Home() {
	c.TplName = "index.tpl"
	c.Render()
}

//Company renders the homepage routed to "/"
func (c *MainController) Company() {
	c.TplName = "company.tpl"
	c.Render()
}

//Contact renders the homepage routed to "/"
func (c *MainController) Contact() {
	c.TplName = "contact.tpl"
	c.Render()
}

//Careers renders the homepage routed to "/"
func (c *MainController) Careers() {
	c.TplName = "careers.tpl"
	c.Render()
}

//AddUser creates anew account routed to "/adduser"
func (c *MainController) AddUser() {
	c.TplName = "adduserv2.tpl"
	if c.Ctx.Input.Method() == "POST" {
		firstname := c.GetString("firstname")
		lastname := c.GetString("lastname")
		orgname := c.GetString("orgname")
		//address := c.GetString("address")
		//city := c.GetString("city")
		//state := c.GetString("state")
		zip := c.GetString("zip")
		//country := c.GetString("country")
		//telephone := c.GetString("telephone")
		email := c.GetString("email")
		password := c.GetString("password")
		password2 := c.GetString("password2")

		//validation of input
		valid := validation.Validation{}
		valid.Required(firstname, "Firstname")
		valid.Required(lastname, "Lastname")
		//valid.Required(address, "Address")
		//valid.Required(city, "City")
		//valid.Required(state, "State")
		valid.Required(zip, "Zip Code")
		//valid.Required(country, "Country")
		valid.Required(password, "Password")
		valid.Required(password2, "Password2")
		//valid.ZipCode(zip, "not zip code")
		valid.Email(email, "Email")
		//valid.Phone(telephone, "not a phone number")
		if password != password2 {
			valid.SetError("Passwords", "do not match")
		}
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
		//verify they have accepted the TOS ans SA
		TOS := c.GetString("TOS")
		if TOS != "on" {
			errormap["Terms of Service"] = "You must read and accept the Terms of Service to continue"
			c.Data["errors"] = errormap
			c.Render()
			return
		}
		SA := c.GetString("SA")
		if SA != "on" {
			errormap["Service Agreement"] = "You must read and accept the Service Agreement to continue"
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
		now := time.Now()
		//build a uuid for email validation
		unique := uuid.NewV4().String()

		userdata := models.User{Id: 0, FirstName: firstname, LastName: lastname,
			OrgName: orgname, Email: email, Zip: zip, Password: hashpass,
			Reg_date: now, ValidUntil: now.AddDate(0, 1, 0), Uuid: unique, RequestReset: false,
			VerifiedEmail: false}
		o := orm.NewOrm()
		o.Begin()
		_, err = o.Insert(&userdata)
		if err != nil {
			o.Rollback()
			errormap["Database Error"] = err.Error()
			c.Data["errors"] = errormap
			c.Render()
			return
		}
		o.Commit()
		//set up the payment session
		m := make(map[string]string)
		m["username"] = userdata.Email
		m["userid"] = strconv.FormatInt(userdata.Id, 10)
		m["timestamp"] = time.Now().String()
		c.SetSession("hangarqueenpayment", m)
		c.Redirect("/adduserpay", 302)
		return
	}
	c.Render()
}

//VerifyEmail removes the uuid from verification routed to "/verify"
func (c *MainController) VerifyEmail() {
	unique := c.Ctx.Input.Param(":uuid")
	user := models.User{Uuid: unique}
	o := orm.NewOrm()
	err := o.Read(&user, "Uuid")
	if err != nil {
		c.Abort("404")
	}
	//set the uuid and flag
	user.Uuid = ""
	user.VerifiedEmail = true
	_, err = o.Update(&user)
	if err != nil {
		utilities.Papertrail("Error is writing to db for UUID: "+user.Uuid+" Error is: "+err.Error(), "Crit")
		c.Abort("500")
	}
	//******** Create session and go back to management page
	m := make(map[string]string)
	m["username"] = user.Email
	m["userid"] = strconv.FormatInt(user.Id, 10)
	m["timestamp"] = time.Now().String()
	c.SetSession("hangarqueen", m)
	c.Redirect("/manager", 302)
	return
}

//RequestResetPassword places a uuid to "/requestresetpassword"
func (c *MainController) RequestResetPassword() {
	c.TplName = "requestreset.tpl"
	errormap := make(map[string]string)
	if c.Ctx.Input.Method() == "POST" {
		username := c.GetString("email")
		user := models.User{}
		o := orm.NewOrm()
		err := o.QueryTable("User").Filter("Email", username).One(&user)
		if err != nil {
			errormap["Database Error"] = "Invalid E-mail"
			c.Data["errors"] = errormap
			c.Render()
			return
		}
		//set a uuid for the user and set request to true
		user.RequestReset = true
		unique := uuid.NewV4().String()
		user.Uuid = unique
		o.Begin()
		_, err = o.Update(&user)
		if err != nil {
			o.Rollback()
			errormap["Database Error"] = "Could not set up reset methods"
			c.Data["errors"] = errormap
			c.Render()
			return
		}
		//send reset email
		mg := mailgun.NewMailgun("mgdomain", "mgkey", "")
		m := mg.NewMessage(
			"HangarHero <verify@hangarhero.com>",                                              // From
			"Password Reset Request",                                                          // Subject
			"Please go to https://hangarhero.com/reset/"+user.Uuid+"  to reset your password", // Plain-text body
			user.FirstName+" "+user.LastName+" <"+user.Email+">")                              // Recipients (vararg list)
		m.SetHtml("<html><p>To reset your HangarHero password click the link bellow</p><a href='https://hangarhero.com/resetpassword/" + user.Uuid + "'>Please click here to reset your password</a></html>")

		_, _, err = mg.Send(m)
		if err != nil {
			utilities.Papertrail("Reset Password Unable to send email", err.Error())
			o.Rollback()
			errormap["E-mail Error"] = "Error Sending Email"
			c.Data["errors"] = errormap
			c.Render()
			return
		}
		o.Commit()
		c.Redirect("/static/html/resetsent.html", 302)

	}
	c.Render()
}

//ResetPassword routed to /resetpassword
func (c *MainController) ResetPassword() {
	c.TplName = "resetpassword.tpl"
	unique := c.Ctx.Input.Param(":uuid")
	c.Data["uuid"] = unique
	user := models.User{Uuid: unique}
	o := orm.NewOrm()
	err := o.Read(&user, "Uuid")
	if err != nil {
		c.Abort("404")
	}
	if c.Ctx.Input.Method() == "POST" {
		password := c.GetString("password")
		password2 := c.GetString("password2")
		valid := validation.Validation{}
		valid.Required(password, "Password")
		valid.Required(password2, "Password2")

		if password != password2 {
			valid.SetError("Passwords", "do not match")
		}
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
		user.Password = hashpass
		user.Uuid = ""
		user.RequestReset = false
		_, err = o.Update(&user)
		if err != nil {
			errormap["Update Error"] = err.Error()
			c.Data["errors"] = errormap
			c.Render()
			return
		}
		c.Redirect("/login", 302)
	}
	c.Render()
}

//Login places the cookie routed to "/login"
func (c *MainController) Login() {
	c.TplName = "signinv2.tpl"
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
		o.Using("default")
		user := models.User{}
		err := o.QueryTable("User").Filter("Email", username).One(&user)
		if err != nil {
			errormap["Login Failed"] = "Could not find user"
			c.Data["errors"] = errormap
			c.Render()
			return
		}
		if user.VerifiedEmail == false {
			errormap["Login Failed"] = "Unverified E-mail please check your inbox"
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
		//******** Check if user is valid if not go add payment cookie and go to payment page
		m := make(map[string]string)
		m["username"] = user.Email
		m["userid"] = strconv.FormatInt(user.Id, 10)
		m["timestamp"] = time.Now().String()
		if user.ValidUntil.Before(time.Now()) {
			c.SetSession("hangarqueenpayment", m)
			c.Redirect("/paymentmanager", 302)
			return
		} else {
			//set the payment token as well so they can get in to edit
			c.SetSession("hangarqueenpayment", m)
			c.SetSession("hangarqueen", m)
			c.Redirect("/manager", 302)
			return
		}
	}
	c.Render()
}

//Logout removes the cookie routed  to "/logout"
func (c *MainController) Logout() {
	c.DelSession("hangarqueen")
	c.Redirect("/", 302)
}
