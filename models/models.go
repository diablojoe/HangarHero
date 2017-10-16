package models

import (
	"time"
)

type AircraftReport struct {
	Id                   string `orm:"pk"`
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
	ACInstances          []*ACInstance `orm:"reverse(many)"` // reverse relationship of fk
	ACModelCode          *ModelCode    `orm:"rel(fk)"`       // RelForeignKey relation

}
type ModelCode struct {
	Id        string `orm:"pk"`
	Make      string
	Model     string
	Reports   []*AircraftReport `orm:"reverse(many)"` // reverse relationship of fk
	Instances []*ACInstance     `orm:"reverse(many)"` // reverse relationship of fk
	ObjectRef *Object3d         `orm:"rel(fk);null"`  // RelForeignKey relation
}
type EquipmentCategory struct {
	Id      int64                   `orm:"auto;pk"`
	Name    string                  `orm:"unique"`
	SubCats []*EquipmentSubCategory `orm:"reverse(many)"` // reverse relationship of fk
}
type EquipmentSubCategory struct {
	Id       int64              `orm:"auto;pk"`
	Name     string             `orm:"unique"`
	Category *EquipmentCategory `orm:"rel(fk);null"`  // RelForeignKey relation
	Models   []*Equipment       `orm:"reverse(many)"` // reverse relationship of fk
}
type Equipment struct {
	Id          int64 `orm:"auto;pk"`
	Name        string
	SubCategory *EquipmentSubCategory `orm:"rel(fk)"`       // RelForeignKey relation
	Instances   []*EquipInstance      `orm:"reverse(many)"` // reverse relationship of fk
	ObjectRef   *Object3d             `orm:"rel(fk);null"`  // RelForeignKey relation
}
type Object3d struct {
	Id               int64        `orm:"auto;pk"`
	EquipmentCovered []*Equipment `orm:"reverse(many)"` // reverse relationship of fk
	ModelsCovered    []*ModelCode `orm:"reverse(many)"` // reverse relationship of fk
	Name             string
	ICAO             string `orm:"unique"`
	Location         string
}

type User struct {
	Id            int64 `orm:"auto;pk"`
	FirstName     string
	LastName      string
	OrgName       string `orm:"null"`
	Phone         string `orm:"null"`
	Email         string `orm:"unique"`
	Address       string `orm:"null"`
	City          string `orm:"null"`
	State         string `orm:"null"`
	Zip           string
	Country       string `orm:"null"`
	Password      string
	Reg_date      time.Time `orm:"auto_now_add;type(datetime)"`
	ValidUntil    time.Time `orm:"null"`
	LastInvoice   string    `orm:"null"`
	Uuid          string    `orm:"null"`
	RequestReset  bool
	VerifiedEmail bool
	Cc            string    `orm:"size(10000)"`
	Hangars       []*Hangar `orm:"reverse(many)"` // reverse relationship of fk
}

type Hangar struct {
	Id          int64 `orm:"auto;pk"`
	Name        string
	Definition  string        `orm:"size(10000)"`
	User        *User         `orm:"rel(fk)"`       // RelForeignKey relation
	ACInstances []*ACInstance `orm:"reverse(many)"` // reverse relationship of fk
}
type ACInstance struct {
	Id           int64           `orm:"auto;pk"`
	OwningHangar *Hangar         `orm:"rel(fk)"`       // RelForeignKey relation
	Registration *AircraftReport `orm:"rel(fk)"`       // RelForeignKey relation
	ModelInfo    *ModelCode      `orm:"rel(fk)"`       // RelForeignKey relation
	ACLines      []*ACLine       `orm:"reverse(many)"` // reverse relationship of fk
	StartTime    time.Time
	EndTime      time.Time
}
type ACLine struct {
	Id        int64       `orm:"auto;pk"`
	Instance  *ACInstance `orm:"rel(fk)"` // RelForeignKey relation
	Position  string
	Rotation  string
	StartTime time.Time
	EndTime   time.Time
}
type EQLine struct {
	Id        int64          `orm:"auto;pk"`
	Instance  *EquipInstance `orm:"rel(fk)"` // RelForeignKey relation
	Position  string
	Rotation  string
	StartTime time.Time
	EndTime   time.Time
}
type EquipInstance struct {
	Id           int64      `orm:"auto;pk"`
	EQLines      []*EQLine  `orm:"reverse(many)"` // reverse relationship of fk
	OwningHangar *Hangar    `orm:"rel(fk)"`       // RelForeignKey relation
	ModelInfo    *Equipment `orm:"rel(fk)"`       // RelForeignKey relation
	StartTime    time.Time
	EndTime      time.Time
}
type Admin struct {
	Id       int64 `orm:"auto;pk"`
	Name     string
	Password string
}
