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

//return struct for RenderInstance
type renderReturn struct {
	Hangar  models.Hangar
	AClines []models.ACLine
	EQlines []models.EQLine
}

//RenderInstance returns what must be rendered routed to "/api/renderinstance/?:hangar"
func (c *MainController) RenderInstance() {
	layout := "2006-01-02T15:04:05.000Z"
	raw := c.Ctx.Input.Param(":hangar")
	params := strings.Split(raw, "$")
	if len(params) < 2 {
		toReturn := errorReturn{Code: 500, English: "Too many Parameters"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	hangarId := params[0]
	timeString := params[1]
	i, err := strconv.ParseInt(hangarId, 10, 64)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Invalid Hangar Id"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	_, err = c.VerifyHangar(i)
	if err != nil {
		utilities.Papertrail("Unauthorized attempt to access: "+params[0], "Warn")
		toReturn := errorReturn{Code: 401, English: "This hangar does not belong to you"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()

	}
	viewTime, err := time.Parse(layout, timeString)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Unable to parse time"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	fmt.Println(hangarId, viewTime)
	o := orm.NewOrm()

	var instances []*models.ACInstance
	_, err = o.QueryTable("a_c_instance").Filter("OwningHangar", hangarId).
		Exclude("EndTime__lt", viewTime).Exclude("StartTime__gt", viewTime).RelatedSel().All(
		&instances)
	if err != nil && err.Error() != "<QuerySeter> no row found" {
		toReturn := errorReturn{Code: 500, English: "Database error finding instances"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	//go over each of these lines to find models that we do not have
	for _, v := range instances {
		if v.ModelInfo == nil {
			utilities.Papertrail("RenderInstance Instance without model info: "+strconv.FormatInt(v.Id, 10), "Warn")
			if v.ModelInfo.ObjectRef == nil {
				utilities.Papertrail("RenderInstance Instance without object3d: "+v.ModelInfo.Id, "Warn")
				if v.ModelInfo.ObjectRef.Location == "" {
					utilities.Papertrail("RenderInstance Object Ref without location: "+strconv.FormatInt(v.ModelInfo.ObjectRef.Id, 10), "Warn")
				}
			}
		}
	}

	//get all the aclines
	var lines []models.ACLine
	for _, v := range instances {
		var line models.ACLine
		err = o.QueryTable("a_c_line").Filter("Instance", v.Id).
			Exclude("EndTime__lt", viewTime).Exclude("StartTime__gt", viewTime).RelatedSel(10).One(
			&line)
		if err != nil {
			toReturn := errorReturn{Code: 500, English: "Database error finding AC Lines"}
			finishedJSON, _ := json.Marshal(toReturn)
			c.Data["json"] = string(finishedJSON)
			c.ServeJSON()
		}
		lines = append(lines, line)
	}
	var hangar models.Hangar
	err = o.QueryTable("hangar").Filter("Id", hangarId).One(&hangar)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Database error finding hangar"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	//Get all the Eq lines

	var eqinstances []*models.EquipInstance
	_, err = o.QueryTable("EquipInstance").Filter("OwningHangar", hangarId).
		Exclude("EndTime__lt", viewTime).Exclude("StartTime__gt", viewTime).RelatedSel().All(
		&eqinstances)
	if err != nil && err.Error() != "<QuerySeter> no row found" {
		toReturn := errorReturn{Code: 500, English: "Database error finding equipment instances"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	//we need to go over each of these lines to find models that we do not have
	for _, v := range eqinstances {
		if v.ModelInfo.ObjectRef.Location == "" {
			utilities.Papertrail("RenderInstance Instance without object3d: "+v.ModelInfo.ObjectRef.ICAO, "Warn")
		}
	}
	var eqlines []models.EQLine
	for _, v := range eqinstances {
		var eqline models.EQLine
		err = o.QueryTable("e_q_line").Filter("Instance", v.Id).
			Exclude("EndTime__lt", viewTime).Exclude("StartTime__gt", viewTime).RelatedSel(10).One(
			&eqline)
		if err != nil {
			toReturn := errorReturn{Code: 500, English: "Database error finding EQ Lines"}
			finishedJSON, _ := json.Marshal(toReturn)
			c.Data["json"] = string(finishedJSON)
			c.ServeJSON()
		}
		eqlines = append(eqlines, eqline)
	}

	fullmodel := renderReturn{Hangar: hangar, AClines: lines, EQlines: eqlines}
	finishedJSON, err := json.Marshal(fullmodel)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Unable to create Json responce"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}
	c.Data["json"] = string(finishedJSON)
	c.ServeJSON()
}

//Rendersave structs
type updateline struct {
	Id       int64
	Position string
	Rotation string
}
type lineUpdateRequest struct {
	AClines []updateline
	EQlines []updateline
	Time    time.Time
}

//RenderSave updates position and rotation routed to "/api/rendersave/"
func (c *MainController) RenderSave() {
	var request lineUpdateRequest
	//testing log for troubleshooting
	err := json.Unmarshal(c.Ctx.Input.RequestBody, &request)
	if err != nil {
		toReturn := errorReturn{Code: 500, English: "Unable to parse JSON"}
		finishedJSON, _ := json.Marshal(toReturn)
		c.Data["json"] = string(finishedJSON)
		c.ServeJSON()
	}

	o := orm.NewOrm()
	o.Begin()
	for _, v := range request.AClines {
		//testing log for troubleshooting
		line := models.ACLine{}
		err := o.QueryTable("ACLine").Filter("Id", v.Id).RelatedSel().One(
			&line)
		if err != nil {
			o.Rollback()
			toReturn := errorReturn{Code: 500, English: "Database error finding lines"}
			finishedJSON, _ := json.Marshal(toReturn)
			c.Data["json"] = string(finishedJSON)
			c.ServeJSON()
		}
		user, err := c.VerifyHangar(line.Instance.OwningHangar.Id)
		if err != nil {
			utilities.Papertrail("Update lines Unauthorized attempt to access: "+string(line.Instance.OwningHangar.Id)+user.Email, "Info")
			o.Rollback()
			toReturn := errorReturn{Code: 401, English: "This hangar does not belong to you"}
			finishedJSON, _ := json.Marshal(toReturn)
			c.Data["json"] = string(finishedJSON)
			c.ServeJSON()
		}
		if v.Position != line.Position || v.Rotation != line.Rotation {
			//check for update or new
			//if the position and rotation are not the same but the start time is we only need to save that data
			if line.StartTime.Equal(request.Time) {
				//testing log for troubleshooting
				line.Position = v.Position
				line.Rotation = v.Rotation
				_, err = o.Update(&line)
				if err != nil {
					o.Rollback()
					toReturn := errorReturn{Code: 500, English: "Database error unable to update position"}
					finishedJSON, _ := json.Marshal(toReturn)
					c.Data["json"] = string(finishedJSON)
					c.ServeJSON()
				}
			} else {
				//if the start time is differient then we are moving at a new time
				//take the old time and cut it down to the start time -1 second
				line.EndTime = request.Time.Add(time.Duration((-1) * time.Second))
				_, err = o.Update(&line)
				if err != nil {
					o.Rollback()
					toReturn := errorReturn{Code: 500, English: "Database error unable to update line time"}
					finishedJSON, _ := json.Marshal(toReturn)
					c.Data["json"] = string(finishedJSON)
					c.ServeJSON()
				}
				newLine := models.ACLine{Id: 0, Instance: line.Instance,
					Position: v.Position, Rotation: v.Rotation,
					StartTime: request.Time, EndTime: line.Instance.EndTime}
				_, err = o.Insert(&newLine)
				if err != nil {
					o.Rollback()
					toReturn := errorReturn{Code: 500, English: "Database error unable to create new line"}
					finishedJSON, _ := json.Marshal(toReturn)
					c.Data["json"] = string(finishedJSON)
					c.ServeJSON()
				}

				//remove all lines that start later than this one
				//for some reason it does not look like we are getting a full list of the ACLines
				//from the initial query so lets go get them our damn selves
				tocheck := []models.ACLine{}
				_, err := o.QueryTable("ACLine").Filter("Instance", newLine.Instance.Id).All(&tocheck)
				for _, x := range tocheck {
					if x.StartTime.After(line.StartTime) || x.StartTime.Equal(line.StartTime) {
						if x.Id != newLine.Id && x.Id != line.Id {
							_, err = o.Delete(&x)
							if err != nil {
								o.Rollback()
								toReturn := errorReturn{Code: 500, English: "Database error deleting old lines"}
								finishedJSON, _ := json.Marshal(toReturn)
								c.Data["json"] = string(finishedJSON)
								c.ServeJSON()
							}
						}
					}
				}
			}

		}
	}
	for _, v := range request.EQlines {
		//testing log for troubleshooting
		line := models.EQLine{}
		err := o.QueryTable("EQLine").Filter("Id", v.Id).RelatedSel().One(
			&line)
		if err != nil {
			o.Rollback()
			toReturn := errorReturn{Code: 500, English: "Database error finding eq lines"}
			finishedJSON, _ := json.Marshal(toReturn)
			c.Data["json"] = string(finishedJSON)
			c.ServeJSON()
		}
		user, err := c.VerifyHangar(line.Instance.OwningHangar.Id)
		if err != nil {
			if user.Email != "" {
				utilities.Papertrail("Update lines Unauthorized attempt to access: "+string(line.Instance.OwningHangar.Id)+user.Email, "Info")
			} else {
				utilities.Papertrail("Update lines Unauthorized attempt to access: "+string(line.Instance.OwningHangar.Id)+user.Email, "Info")
			}
			o.Rollback()
			toReturn := errorReturn{Code: 401, English: "This hangar does not belong to you"}
			finishedJSON, _ := json.Marshal(toReturn)
			c.Data["json"] = string(finishedJSON)
			c.ServeJSON()
		}
		if v.Position != line.Position || v.Rotation != line.Rotation {
			//check for update or new
			//if the position and rotation are not the same but the start time is we only need to save that data
			if line.StartTime.Equal(request.Time) {
				//testing log for troubleshooting
				line.Position = v.Position
				line.Rotation = v.Rotation
				_, err = o.Update(&line)
				if err != nil {
					o.Rollback()
					toReturn := errorReturn{Code: 500, English: "Database error unable to update position"}
					finishedJSON, _ := json.Marshal(toReturn)
					c.Data["json"] = string(finishedJSON)
					c.ServeJSON()
				}
			} else {
				//if the start time is differient then we are moving at a new time
				//take the old time and cut it down to the start time -1 second
				line.EndTime = request.Time.Add(time.Duration((-1) * time.Second))
				_, err = o.Update(&line)
				if err != nil {
					o.Rollback()
					toReturn := errorReturn{Code: 500, English: "Database error unable to update line time"}
					finishedJSON, _ := json.Marshal(toReturn)
					c.Data["json"] = string(finishedJSON)
					c.ServeJSON()
				}
				newLine := models.EQLine{Id: 0, Instance: line.Instance,
					Position: v.Position, Rotation: v.Rotation,
					StartTime: request.Time, EndTime: line.Instance.EndTime}
				_, err = o.Insert(&newLine)
				if err != nil {
					o.Rollback()
					toReturn := errorReturn{Code: 500, English: "Database error unable to create new line"}
					finishedJSON, _ := json.Marshal(toReturn)
					c.Data["json"] = string(finishedJSON)
					c.ServeJSON()
				}

				//remove all lines that start later than this one
				//for some reason it does not look like we are getting a full list of the ACLines
				//from the initial query so lets go get them our damn selves
				tocheck := []models.EQLine{}
				_, err := o.QueryTable("EQLine").Filter("Instance", newLine.Instance.Id).All(&tocheck)
				for _, x := range tocheck {
					if x.StartTime.After(line.StartTime) || x.StartTime.Equal(line.StartTime) {
						if x.Id != newLine.Id && x.Id != line.Id {
							_, err = o.Delete(&x)
							if err != nil {
								o.Rollback()
								toReturn := errorReturn{Code: 500, English: "Database error deleting old lines"}
								finishedJSON, _ := json.Marshal(toReturn)
								c.Data["json"] = string(finishedJSON)
								c.ServeJSON()
							}
						}
					}
				}
			}

		}
	}
	o.Commit()
}
