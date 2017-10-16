package controllers

import (
	"HangarHero/models"
	"HangarHero/utilities"
	"encoding/json"
	"fmt"
	"github.com/astaxie/beego/orm"
	"io/ioutil"
	"time"
)

type pair struct {
	Man   string
	Model string
}
type ACReport struct {
	Id                   string
	Nnumber              string
	SerialNumber         string
	Status               string
	CertificateIssueDate string
	ExpirationDate       string
	TypeAircraft         string
	TypeEngine           string
	Name                 string
	Street               string
	City                 string
	State                string
	County               string
	ZipCode              string
	Country              string
	EngineManufacturer   string
	Classification       string
	EngineModel          string
	Category             string
	AWDate               string
	ACModelCode          string
}
type dbLoadReport struct {
	CodeLoaded   int64
	CodeUpdated  int64
	RecLoaded    int64
	RecUpdated   int64
	Transactions int64
	ManTime      string
	RecTime      string
	TotalTime    string
}

func (c *MainController) LoadUSDB() {
	const manufactuerInsert = "/home/ec2-user/manufacInsert.json"
	const manufactuerUpdate = "/home/ec2-user/manufacUpdate.json"
	const ownerInsert = "/home/ec2-user/acownersInsert.json"
	const ownerUpdate = "/home/ec2-user/acownersUpdate.json"
	report := dbLoadReport{CodeLoaded: 0, CodeUpdated: 0, RecLoaded: 0,
		RecUpdated: 0, Transactions: 0}
	//insert codes
	manStart := time.Now()
	inserts, transactions := insertCodes(manufactuerInsert, c)
	report.CodeLoaded = inserts
	report.Transactions += transactions
	//update codes
	inserts, transactions = updateCodes(manufactuerUpdate, c)
	report.CodeUpdated = inserts
	report.Transactions += transactions
	report.ManTime = time.Since(manStart).String()
	//insert AC records
	recStart := time.Now()
	inserts, transactions = insertACReport(ownerInsert, c)
	report.RecLoaded = inserts
	report.Transactions += transactions
	//update AC records
	inserts, transactions = updateACReport(ownerUpdate, c)
	report.RecUpdated = transactions
	report.Transactions += transactions
	report.RecTime = time.Since(recStart).String()
	report.TotalTime = time.Since(manStart).String()
	finishedJSON, err := json.Marshal(report)
	if err != nil {
		fmt.Println(err)
		c.Abort("500")
	}
	c.Data["json"] = string(finishedJSON)
	c.ServeJSON()
}

func insertCodes(location string, c *MainController) (int64, int64) {
	var inserts int64
	var transactions int64
	inserts = 0
	transactions = 0
	dat, err := ioutil.ReadFile(location)
	if err != nil {
		fmt.Println(err)
		c.Abort("500")
	}
	var codes []models.ModelCode
	err = json.Unmarshal(dat, &codes)
	if err != nil {
		fmt.Println(err)
		c.Abort("500")
	}
	o := orm.NewOrm()
	o.Begin()
	for _, v := range codes {
		_, err := o.Insert(&v)
		inserts++
		transactions++
		if err != nil {
			full, _ := json.Marshal(v)
			utilities.Papertrail(string(full), "Application")
		}
	}
	o.Commit()
	return inserts, transactions
}
func updateCodes(location string, c *MainController) (int64, int64) {
	var inserts int64
	var transactions int64
	inserts = 0
	transactions = 0
	dat, err := ioutil.ReadFile(location)
	if err != nil {
		fmt.Println(err)
		c.Abort("500")
	}
	var codes []models.ModelCode
	err = json.Unmarshal(dat, &codes)
	if err != nil {
		fmt.Println(err)
		c.Abort("500")
	}
	o := orm.NewOrm()
	o.Begin()
	for _, v := range codes {
		_, err := o.Update(&v)
		transactions++
		if err != nil {
			full, _ := json.Marshal(v)
			utilities.Papertrail(string(full), "Application")
		}
	}
	o.Commit()
	return inserts, transactions
}
func insertACReport(location string, c *MainController) (int64, int64) {
	var inserts int64
	var transactions int64
	dat, err := ioutil.ReadFile(location)
	if err != nil {
		fmt.Println(err)
		c.Abort("500")
	}
	var rawAC []ACReport
	err = json.Unmarshal(dat, &rawAC)
	if err != nil {
		fmt.Println(err)
		c.Abort("500")
	}
	o := orm.NewOrm()
	o.Begin()
	for _, v := range rawAC {
		tempRecord := reportToDb(v)
		tempModel := models.ModelCode{Id: v.ACModelCode}
		err = o.Read(&tempModel)
		if err != nil {
			full, _ := json.Marshal(v)
			utilities.Papertrail(string(full), "Application")
		}
		tempRecord.ACModelCode = &tempModel
		_, err := o.Insert(&tempRecord)
		if err != nil {
			full, _ := json.Marshal(v)
			utilities.Papertrail(string(full), "Application")
		}
		inserts++
		transactions++
	}
	o.Commit()
	return inserts, transactions
}
func updateACReport(location string, c *MainController) (int64, int64) {
	var inserts int64
	var transactions int64
	dat, err := ioutil.ReadFile(location)
	if err != nil {
		fmt.Println(err)
		c.Abort("500")
	}
	var rawAC []ACReport
	err = json.Unmarshal(dat, &rawAC)
	if err != nil {
		fmt.Println(err)
		c.Abort("500")
	}
	o := orm.NewOrm()
	o.Begin()
	for _, v := range rawAC {
		tempAc := reportToDb(v)
		tempModel := models.ModelCode{Id: v.ACModelCode}
		err = o.Read(&tempModel)
		if err != nil {
			full, _ := json.Marshal(v)
			utilities.Papertrail(string(full), "Application")
		}
		tempAc.ACModelCode = &tempModel
		_, err := o.Update(&tempAc)
		if err != nil {
			full, _ := json.Marshal(v)
			utilities.Papertrail(string(full), "Application")
		}
		inserts++
		transactions++
	}
	o.Commit()
	return inserts, transactions
}
func reportToDb(report ACReport) models.AircraftReport {
	toreturn := models.AircraftReport{Id: report.Id, Nnumber: report.Nnumber,
		SerialNumber: report.SerialNumber, Status: report.Status,
		CertificateIssueDate: report.CertificateIssueDate, ExpirationDate: report.ExpirationDate,
		TypeAircraft: report.TypeAircraft, TypeEngine: report.TypeEngine, Name: report.Name,
		Street: report.Street, City: report.City, State: report.State, County: report.County,
		ZipCode: report.ZipCode, Country: report.Country, EngineManufacturer: report.EngineManufacturer,
		Classification: report.Classification, EngineModel: report.EngineModel,
		Category: report.Category, AWDate: report.AWDate}
	return toreturn
}
