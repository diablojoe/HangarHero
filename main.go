package main

import (
	"HangarHero/models"
	_ "HangarHero/routers"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"github.com/caarlos0/env"
	_ "github.com/go-sql-driver/mysql"
	"log"
)

type config struct {
	DbUser    string `env:"HHDBUSER"`
	DbPass    string `env:"HHDBPASS"`
	DbAddr    string `env:"HHDBADDR"`
	DbPort    string `env:"HHDBPORT"`
	DbName    string `env:"HHDBNAME"`
	DbForce   bool   `env:"HHDBFORCE"`
	DbVerbose bool   `env:"HHDBVERBOSE"`
}

func init() {
	cfg := config{}
	err := env.Parse(&cfg)
	if err != nil {
		log.Fatal(err)
	}
	dataSource := cfg.DbUser + ":" + cfg.DbPass + "@tcp(" + cfg.DbAddr + ":" + cfg.DbPort + ")/" + cfg.DbName + "charset=utf8"
	//example: user:pass@tcp(172.17.0.2:3306)/queen?charset=utf8

	orm.RegisterDriver("mysql", orm.DRMySQL)
	orm.RegisterDataBase("default", "mysql", dataSource)

	orm.RegisterModel(new(models.AircraftReport), new(models.ModelCode),
		new(models.User), new(models.Hangar), new(models.ACInstance),
		new(models.Equipment), new(models.EquipmentCategory), new(models.EquipmentSubCategory),
		new(models.EquipInstance), new(models.Object3d), new(models.ACLine),
		new(models.EQLine), new(models.Admin))
	// Database alias
	name := "default"

	err = orm.RunSyncdb(name, cfg.DbForce, cfg.DbVerbose)
	if err != nil {
		log.Fatal(err)
	}
}
func main() {
	o := orm.NewOrm()
	o.Using("default") // Using default, you can use other database
	orm.Debug = true
	beego.SetStaticPath("/html", "html")
	beego.SetStaticPath("/dae", "dae")
	beego.SetViewsPath("views")
	beego.Run()
}
