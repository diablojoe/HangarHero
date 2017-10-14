package controllers

//ModelManager controlls model associations and uploads models
func (c *MainController) ModelManager() {
	if c.VerifyAdminSession() != nil {
		c.Redirect("/admin/login", 302)
	}
	if c.Ctx.Input.Method() == "POST" {
		icao := c.GetString("ICAO")
		savepath := "/home/ec2-user/golang/src/hangarqueen/static/object3d/"
		_ = c.SaveToFile("objfile", savepath+icao+".obj")
	}
	c.TplName = "modelManager.tpl"
	c.Render()
}

//EquipmentModelManager controlls model associations for equipment
func (c *MainController) EquipmentModelManager() {
	if c.VerifyAdminSession() != nil {
		c.Redirect("/admin/login", 302)
	}
	c.TplName = "equipmentmodelmanager.tpl"
	c.Render()
}
