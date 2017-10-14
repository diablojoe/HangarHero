package controllers

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

//UserViewHangar is the 3d model template routed to "/hangarmodel/?:hangar"
func (c *MainController) UserViewHangar() {
	layout := "2006-01-02T15:04:05.000Z"
	raw := c.Ctx.Input.Param(":hangar")
	params := strings.Split(raw, "$")
	if len(params) < 2 {
		fmt.Println(raw)
		c.Abort("500")
	}
	hangarId := params[0]
	timeString := params[1]

	viewTime, err := time.Parse(layout, timeString)
	if err != nil {
		fmt.Println(err)
		c.Abort("500")
	}
	c.Data["date"] = viewTime
	c.Data["hangar"] = hangarId
	c.TplName = "queenv2.tpl"
	c.Render()
}

//UserViewHangar is the 3d model template routed to "/hangarmodel/?:hangar"
func (c *MainController) UserViewHangarV2() {
	//check for login
	_, err := c.VerifySession()
	if err != nil {
		c.Redirect("/login", 302)
		return
	}
	layout := "2006-01-02T15:04:05.000Z"
	raw := c.Ctx.Input.Param(":hangar")
	params := strings.Split(raw, "$")
	if len(params) < 2 {
		fmt.Println(raw)
		c.Abort("500")
	}
	hangarId := params[0]
	i, err := strconv.ParseInt(hangarId, 10, 64)
	if err != nil {
		c.Abort("500")
	}
	_, err = c.VerifyHangar(i)
	if err != nil {
		fmt.Println("about to redirect")
		c.Redirect("/login", 302)
		return
	}
	timeString := params[1]

	viewTime, err := time.Parse(layout, timeString)
	if err != nil {
		fmt.Println(err)
		c.Abort("500")
	}
	c.Data["date"] = viewTime
	c.Data["hangar"] = hangarId
	c.TplName = "queenv2.tpl"
	c.Render()
}
