package controllers

import (
	"HangarHero/models"
	"errors"
	"fmt"
	"github.com/astaxie/beego/orm"
	"strconv"
)

func (c MainController) VerifySession() (*models.User, error) {
	err := errors.New("unauthorized")
	empty := &models.User{}
	if c.GetSession("hangarqueen") == nil {
		return empty, err
	}
	session := c.GetSession("hangarqueen").(map[string]string)
	useridnumber, err := strconv.Atoi(session["userid"])
	if err != nil {
		return empty, err
	}
	user := models.User{}
	o := orm.NewOrm()
	err = o.QueryTable("User").Filter("Id", int64(useridnumber)).One(&user)
	if err != nil {
		return empty, err
	}
	return &user, nil
}

func (c MainController) VerifyAdminSession() error {
	err := errors.New("unauthorized")
	if c.GetSession("hangarqueenAdmin") == nil {
		return err
	}
	session := c.GetSession("hangarqueenAdmin").(map[string]string)
	useridnumber, err := strconv.Atoi(session["userid"])
	if err != nil {
		return err
	}
	user := models.Admin{}
	o := orm.NewOrm()
	err = o.QueryTable("Admin").Filter("Id", int64(useridnumber)).One(&user)
	if err != nil {
		return err
	}
	return nil

}

func (c MainController) VerifyHangar(hangarid int64) (*models.User, error) {

	user, err := c.VerifySession()
	if err != nil {
		fmt.Println("error in session validation")
		return user, err
	}
	err = errors.New("unauthorized")
	var hangar models.Hangar
	o := orm.NewOrm()
	err = o.QueryTable("Hangar").Filter("User", user).Filter("Id", hangarid).One(&hangar)
	if err != nil {
		return user, err
	}
	return user, nil
}
