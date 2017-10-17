package routers

import (
	"HangarHero/controllers"

	"github.com/astaxie/beego"
)

func init() {
	//Public Access routes (public_user.go)
	beego.Router("/", &controllers.MainController{}, "*:Home")
	beego.Router("/contact", &controllers.MainController{}, "*:Contact")
	beego.Router("/adduser", &controllers.MainController{}, "*:AddUser")
	beego.Router("/login", &controllers.MainController{}, "*:Login")
	beego.Router("/logout", &controllers.MainController{}, "*:Logout")
	beego.Router("/verify/?:uuid", &controllers.MainController{}, "*:VerifyEmail")
	beego.Router("/requestresetpassword", &controllers.MainController{}, "*:RequestResetPassword")
	beego.Router("/resetpassword/?:uuid", &controllers.MainController{}, "*:ResetPassword")
	//User Routes
	//-Schedule Routes
	//--User templated (schedule_user.go)
	beego.Router("/manager/?:id", &controllers.MainController{}, "*:Managerv2")
	beego.Router("/managerv2/?:id", &controllers.MainController{}, "*:Managerv2")
	beego.Router("/addhangar", &controllers.MainController{}, "*:UserAddHangar")
	beego.Router("/removehangar", &controllers.MainController{}, "*:UserRemoveHangar")
	beego.Router("/account", &controllers.MainController{}, "*:EditAccount")
	//beego.Router("/changesubtype", &controllers.MainController{},"*:ChangePlan")
	//beego.Router("/addviewer", &controllers.MainController{}, "*:AddViewer")
	//beego.Router("/removeviewer", &controllers.MainController{}, "*:RemoveViewer")
	//--Viewer templated (viewer.go)
	//beego.Router("/viewer/login", &controllers.MainController{}, "*:ViewerLogin")
	//beego.Router("/viewer/logout", &controllers.MainController{}, "*:ViewerLogout")
	//beego.Router("/viewer/new/?:uuid", &controllers.MainController{}, "*:AddViewerPass")
	//beego.Router("/viewer/resetrequest", &controllers.MainController{}, "*:ViewerRequestResetPassword")
	//beego.Router("/viewer/schedule/?:id", &controllers.MainController{}, "*:ViewerSchedule")
	//beego.Router("/viewer/hangar/?:hangar", &controllers.MainController{}, "*:ViewerViewHangar")
	//beego.Router("/viewer/submitbug", &controllers.MainController{}, "*:ViewerErrorLog")
	//--API
	//---Main (schedule_api_main_v1.go)
	beego.Router("/api/submitbug", &controllers.MainController{}, "*:ManualErrorLog")
	beego.Router("/api/aircraft/?:id", &controllers.MainController{}, "*:AircraftSearch")
	beego.Router("/api/getcats/", &controllers.MainController{}, "*:GetEQCats")
	beego.Router("/api/getsubcats/?:id", &controllers.MainController{}, "*:GetEQSubCats")
	beego.Router("/api/geteqnames/?:id", &controllers.MainController{}, "*:GetEQNames")
	beego.Router("/api/gethangars", &controllers.MainController{}, "*:GetHangars")
	beego.Router("/api/addacinstance", &controllers.MainController{}, "*:AddACInstance")
	beego.Router("/api/addeqinstance", &controllers.MainController{}, "*:AddEQInstance")
	//---VIS
	//----Equipment (schedule_api_vis_equipment_v1.go)
	beego.Router("/api/eqschedule/?:hangar", &controllers.MainController{}, "*:GetScheduledEquipment")
	beego.Router("/api/updateeqinstance/", &controllers.MainController{}, "*:UpdateEQInstance")
	beego.Router("/api/removeeqinstance/", &controllers.MainController{}, "*:DeleteEQInstance")
	//----Aircraft (schedule_api_vis_aircraft_v1.go)
	beego.Router("/api/acschedule/?:hangar", &controllers.MainController{}, "*:GetScheduledAircraft")
	beego.Router("/api/updateacinstance/", &controllers.MainController{}, "*:UpdateACInstance")
	beego.Router("/api/removeacinstance/", &controllers.MainController{}, "*:DeleteACInstance")
	//-Model
	//--User Templated (model_user.go)
	beego.Router("/hangarmodel/?:hangar", &controllers.MainController{}, "*:UserViewHangar")
	beego.Router("/hangarmodelv2/?:hangar", &controllers.MainController{}, "*:UserViewHangarV2")
	//--API (model_api_v1.go)
	beego.Router("/api/renderinstance/?:hangar", &controllers.MainController{}, "*:RenderInstance")
	beego.Router("/api/rendersave/", &controllers.MainController{}, "*:RenderSave")

	//Administrator Routes
	//-Basic User templated (admin_basic_user.go)
	beego.Router("/admin/home", &controllers.MainController{}, "*:AdminHome")
	beego.Router("/admin/login", &controllers.MainController{}, "*:LogInAdmin")
	beego.Router("/admin/logout", &controllers.MainController{}, "*:LogOutAdmin")
	beego.Router("/admin/addadmin", &controllers.MainController{}, "*:AddAdmin")
	beego.Router("/admin/addequipmentcat", &controllers.MainController{}, "*:AddEqCat")
	beego.Router("/admin/addequipmentsubcat", &controllers.MainController{}, "*:AddEqSubCat")
	beego.Router("/admin/addequipment", &controllers.MainController{}, "*:AddEq")
	beego.Router("/admin/addobject3d", &controllers.MainController{}, "*:AddUnboundObject3d")
	//-Model Manager
	//--User Templated (modelmanager_user.go)
	beego.Router("/admin/modelmanager", &controllers.MainController{}, "*:ModelManager")
	beego.Router("/admin/equipmentmodelmanager", &controllers.MainController{}, "*:EquipmentModelManager")
	//--API (modelmanager_api_v1.go)
	beego.Router("/admin/api/listobject3d", &controllers.MainController{}, "*:Object3dListing")
	beego.Router("/admin/api/addobject3d", &controllers.MainController{}, "*:Object3dInsert")
	beego.Router("/admin/api/deleteobject3d", &controllers.MainController{}, "*:Object3dDelete")
	beego.Router("/admin/api/editobject3d", &controllers.MainController{}, "*:Object3dEdit")
	beego.Router("/admin/api/associatedaclist/?:id", &controllers.MainController{}, "*:AssociatedModelCodeListing")
	beego.Router("/admin/api/createassociatedcode", &controllers.MainController{}, "*:AssociatedModelCodeNew")
	beego.Router("/admin/api/removeassociatedcode", &controllers.MainController{}, "*:AssociatedModelCodeDelete")
	beego.Router("/admin/api/associatedeqlist/?:id", &controllers.MainController{}, "*:AssociatedEquipmentListing")
	beego.Router("/admin/api/createassociatedeq", &controllers.MainController{}, "*:AssociatedEquipmentNew")
	beego.Router("/admin/api/removeassociatedeq", &controllers.MainController{}, "*:AssociatedEquipmentDelete")

	//beego.Router("/admin/loadusdb", &controllers.MainController{}, "*:LoadUSDB")

}
