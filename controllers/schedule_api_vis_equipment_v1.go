package controllers

import (
	"HangarHero/models"
	"HangarHero/utilities"
	"encoding/json"
	"fmt"
	"github.com/astaxie/beego/orm"
	"strconv"
	"strings"
	"time"
)

//return struct for GetScheduledEquipment

//GetScheduledEquipment returns equipment for the time routed to "/api/eqschedule/?:hangar"
func (c *MainController) GetScheduledEquipment() {
	layout := "2006-01-02T15:04:05.000Z"
	raw := c.Ctx.Input.Param(":hangar")
	params := strings.Split(raw, "$")
	if len(params) < 3 {
		toReturn := errorReturn{Code: 500, English: "Unable to parese request"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	hangarId := params[0]
	starttimestring := params[1]
	endtimestring := params[2]
	i, err := strconv.ParseInt(hangarId, 10, 64)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Unable to read request"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	fmt.Println("hangar to check is", i)
	user, err := c.VerifyHangar(i)
	if err != nil {
		utilities.Papertrail("Unauthorized attempt to access: "+user.Email, "Warn")

		toReturn := errorReturn{Code: 500, English: "This hangar does not belong to you"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()

	}
	viewstarttime, err := time.Parse(layout, starttimestring)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Unable toparse time"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	viewendtime, err := time.Parse(layout, endtimestring)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Unable to parse time"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	fmt.Println(hangarId, viewstarttime, viewendtime)
	o := orm.NewOrm()
	//get the instances and add them
	var instances []*models.EquipInstance
	_, err = o.QueryTable("EquipInstance").Filter("OwningHangar", hangarId).
		Exclude("EndTime__lte", viewstarttime).Exclude("StartTime__gte", viewendtime).Distinct().RelatedSel().All(
		&instances)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Database error finding instances"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	var schedules []schedule
	for _, v := range instances {
		var temp = schedule{Id: v.Id, Content: v.ModelInfo.Name,
			Start: v.StartTime, End: v.EndTime, Type: "background", Group: v.ModelInfo.SubCategory.Name}
		//strange bug where id 0 is inserted
		if temp.Id != 0 {
			schedules = append(schedules, temp)
		}
		//get the aclines and add them
		var saves []*models.EQLine
		_, err = o.QueryTable("e_q_line").Filter("Instance", v).
			Exclude("EndTime__lte", v.StartTime).Exclude("StartTime__gte", v.EndTime).Distinct().RelatedSel().All(
			&saves)
		if err != nil {
			toReturn := errorReturn{Code: 500, English: "Database error finding lines"}
			finishedJSON, _ := json.Marshal(toReturn)
			c.Data["json"] = string(finishedJSON)
			c.ServeJSON()
		}

		for _, s := range saves {
			fmt.Println(s.Id)
			var temp = schedule{Id: s.Id, Content: "",
				Start: s.StartTime, End: s.EndTime, Type: "", Group: v.ModelInfo.SubCategory.Name}
			if temp.Id != 0 {
				schedules = append(schedules, temp)
			}
		}
	}

	finishedJSON, err := json.Marshal(schedules)
	fmt.Println("finished json", string(finishedJSON))
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Unable to marshal JSON"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	c.Data["json"] = string(finishedJSON)
	c.ServeJSON()
}

//UpdateEQInstance updates an instance routed to "/api/updateeqinstance/"
func (c *MainController) UpdateEQInstance() {
	var request instanceUpdateRequest
	fmt.Println("request is:", c.Ctx.Input.RequestBody)
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &request)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Unable to parse request"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	o := orm.NewOrm()
	o.Begin()
	instance := models.EquipInstance{}
	err = o.QueryTable("EquipInstance").Filter("Id", request.Id).RelatedSel().One(
		&instance)
	if err != nil {
		o.Rollback()
		toReturn := errorReturn{Code: 500, English: "Database error unable to read equipment instance"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	//for some reason the related sel does not grab the instances so we have to do
	//it our damn selves
	lines := []models.EQLine{}
	_, err = o.QueryTable("EQLine").Filter("instance_id", instance.Id).RelatedSel().All(
		&lines)
	if err != nil {
		o.Rollback()
		toReturn := errorReturn{Code: 500, English: "Database error unable to read lines"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	user, err := c.VerifyHangar(instance.OwningHangar.Id)
	if err != nil {
		o.Rollback()
		utilities.Papertrail("Unauthorized attempt to access: "+user.Email, "Warn")
		toReturn := errorReturn{Code: 401, English: "This hangar does not belong to you"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	//figure out if any side is the same
	//movement at the end
	if request.StartTime.Equal(instance.StartTime) {
		//expanding movement
		fmt.Println("end movement")
		if request.EndTime.After(instance.EndTime) {
			//update the last line to reflect the new endtime
			for _, v := range lines {
				if v.EndTime.Equal(instance.EndTime) {
					v.EndTime = request.EndTime
					_, err := o.Update(&v)
					if err != nil {
						o.Rollback()
						toReturn := errorReturn{Code: 500, English: "Database error unable to update equipment time"}
						finishedJSON, _ := json.Marshal(toReturn)
						c.Data["json"] = string(finishedJSON)
						c.ServeJSON()
					}
				}
			}
			//update the instance to reflect the new endtime
			instance.EndTime = request.EndTime
			_, err := o.Update(&instance)
			if err != nil {
				o.Rollback()
				toReturn := errorReturn{Code: 500, English: "Database error unable to update equipment instance"}
				finishedJSON, _ := json.Marshal(toReturn)
				c.Data["json"] = string(finishedJSON)
				c.ServeJSON()
			}
		} else if request.EndTime.Before(instance.EndTime) {
			//contracting operation
			err := trimLinesEndEq(o, lines, instance.EndTime, request.EndTime)
			if err != nil {
				o.Rollback()
				toReturn := errorReturn{Code: 500, English: "Database error unable to trim equipment instance"}
				finishedJSON, _ := json.Marshal(toReturn)
				c.Data["json"] = string(finishedJSON)
				c.ServeJSON()
			}
			//update instance
			instance.EndTime = request.EndTime
			_, err = o.Update(&instance)
			if err != nil {
				o.Rollback()
				toReturn := errorReturn{Code: 500, English: "Database error unable to update equipment instance"}
				finishedJSON, _ := json.Marshal(toReturn)
				c.Data["json"] = string(finishedJSON)
				c.ServeJSON()
			}
		}
		//modification to the start time
	} else if request.EndTime.Equal(instance.EndTime) {
		fmt.Println("start movement")
		//expanding movement
		if request.StartTime.Before(instance.StartTime) {
			//update the last line to reflect the new starttime
			for _, v := range lines {
				if v.StartTime.Equal(instance.StartTime) {
					v.StartTime = request.StartTime
					_, err := o.Update(&v)
					if err != nil {
						o.Rollback()
						toReturn := errorReturn{Code: 500, English: "Database error unable to update equipment instance"}
						finishedJSON, _ := json.Marshal(toReturn)
						c.Data["json"] = string(finishedJSON)
						c.ServeJSON()
					}
				}
			}
			//update the instance to reflect the new endtime
			instance.StartTime = request.StartTime
			_, err := o.Update(&instance)
			if err != nil {
				o.Rollback()
				toReturn := errorReturn{Code: 500, English: "Database error unable to update equipment instance"}
				finishedJSON, _ := json.Marshal(toReturn)
				c.Data["json"] = string(finishedJSON)
				c.ServeJSON()
			}
		} else if request.StartTime.After(instance.StartTime) {
			//contracting operation
			err := trimLinesStartEq(o, lines, instance.StartTime, request.StartTime)
			if err != nil {
				o.Rollback()
				toReturn := errorReturn{Code: 500, English: "Database error unable to update equipment instance"}
				finishedJSON, _ := json.Marshal(toReturn)
				c.Data["json"] = string(finishedJSON)
				c.ServeJSON()
			}
			//update instance
			instance.StartTime = request.StartTime
			_, err = o.Update(&instance)
			if err != nil {
				o.Rollback()
				toReturn := errorReturn{Code: 500, English: "Database error unable to update equipment instance"}
				finishedJSON, _ := json.Marshal(toReturn)
				c.Data["json"] = string(finishedJSON)
				c.ServeJSON()
			}
		}
		//if no side is the same this is a full move
	} else {
		fmt.Println("all movement")
		//get the duration of the move
		duration := request.StartTime.Sub(instance.StartTime)
		durationCheck := request.EndTime.Sub(instance.EndTime)
		//if these are not the same the move is invalid
		fmt.Println(duration.String())
		if duration != durationCheck {
			o.Rollback()
			toReturn := errorReturn{Code: 500, English: "Movement does not have the same duration"}
			finishedJSON, _ := json.Marshal(toReturn)
			c.Data["json"] = string(finishedJSON)
			c.ServeJSON()
		}
		for _, v := range lines {
			v.StartTime = v.StartTime.Add(duration)
			v.EndTime = v.EndTime.Add(duration)
			_, err := o.Update(&v)
			if err != nil {
				o.Rollback()
				toReturn := errorReturn{Code: 500, English: "Database error unable to update equipment instance"}
				finishedJSON, _ := json.Marshal(toReturn)
				c.Data["json"] = string(finishedJSON)
				c.ServeJSON()
			}
			fmt.Println("changing line duration")
		}
		instance.StartTime = instance.StartTime.Add(duration)
		instance.EndTime = instance.EndTime.Add(duration)
		_, err := o.Update(&instance)
		if err != nil {
			o.Rollback()
			toReturn := errorReturn{Code: 500, English: "Database error unable to update equipment instance"}
			finishedJSON, _ := json.Marshal(toReturn)
			c.Data["json"] = string(finishedJSON)
			c.ServeJSON()
		}
	}
	fmt.Println("commiting")
	o.Commit()
}

//DeleteEQInstance removes an instance routed to "/api/removeeqinstance/"
func (c *MainController) DeleteEQInstance() {
	var request instanceUpdateRequest
	fmt.Println("request is:", c.Ctx.Input.RequestBody)
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &request)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Unable to parse request"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	o := orm.NewOrm()
	o.Begin()
	instance := models.EquipInstance{}
	err = o.QueryTable("EquipInstance").Filter("Id", request.Id).RelatedSel().One(
		&instance)
	if err != nil {
		o.Rollback()
		toReturn := errorReturn{Code: 500, English: "Database error unable to find instance"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	//for some reason the related sel does not grab the instances so we have to do
	//it our damn selves
	lines := []models.EQLine{}
	_, err = o.QueryTable("EQLine").Filter("instance_id", instance.Id).RelatedSel().All(
		&lines)
	if err != nil {
		o.Rollback()
		toReturn := errorReturn{Code: 500, English: "Database error unable find EQ lines"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	user, err := c.VerifyHangar(instance.OwningHangar.Id)
	if err != nil {
		o.Rollback()
		utilities.Papertrail("Unauthorized attempt to access: "+user.Email, "Warn")
		toReturn := errorReturn{Code: 401, English: "This hangar does not belong to you"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	for _, v := range lines {
		_, err := o.Delete(&v)
		if err != nil {
			o.Rollback()
			toReturn := errorReturn{Code: 500, English: "Database error unable to delete lines"}
			finishedJSON, _ := json.Marshal(toReturn)
			c.Data["json"] = string(finishedJSON)
			c.ServeJSON()
		}
	}
	_, err = o.Delete(&instance)
	if err != nil {
		o.Rollback()
		toReturn := errorReturn{Code: 500, English: "Database error unable to delete instance"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	o.Commit()
}

//helper function to trim the end of AC lines
func trimLinesEndEq(o orm.Ormer, lines []models.EQLine, startTime time.Time, endTime time.Time) error {
	var found models.EQLine
	for _, v := range lines {
		//look for the latest endtime
		if v.EndTime.Equal(startTime) {
			found = v
			break
		}
	}
	//if it no longer has a place get rid of it and continue
	if endTime.Before(found.StartTime) {
		tempTime := time.Unix(found.StartTime.Unix(), found.StartTime.UnixNano())
		fmt.Println(tempTime.String())
		_, err := o.Delete(&found)
		if err != nil {
			return err
		}
		return trimLinesEndEq(o, lines, tempTime, endTime)
	} else {
		found.EndTime = endTime
		_, err := o.Update(&found)
		if err != nil {
			return err
		}
		return nil
	}
}

//helper function to trim the start of ac lines
func trimLinesStartEq(o orm.Ormer, lines []models.EQLine, startTime time.Time, endTime time.Time) error {
	var found models.EQLine
	for _, v := range lines {
		//look for the latest endtime
		if v.StartTime.Equal(startTime) {
			found = v
			break
		}
	}
	//if it no longer has a place get rid of it and continue
	if endTime.After(found.EndTime) {
		tempTime := time.Unix(found.StartTime.Unix(), found.StartTime.UnixNano())
		_, err := o.Delete(&found)
		if err != nil {
			return err
		}
		return trimLinesStartEq(o, lines, tempTime, endTime)
	} else {
		found.StartTime = endTime
		_, err := o.Update(&found)
		if err != nil {
			return err
		}
		return nil
	}
}
