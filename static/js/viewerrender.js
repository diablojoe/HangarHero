var container;
var camera, scene, renderer, controls, loader;
var skyboxMesh, checkerboard;
var hangarId, displayTime;
var activeNames = [];

hangarId = $( "body" ).data( "hangarid" );
var rawtime =  $( "body" ).data( "date" );
displayTime = new Date(rawtime);

// set up the slider before we do the init
var slide = $("#slider").slider({
	tooltip: 'hide'
});
var startloc = dateToFrac(displayTime);
slide.slider('setValue', startloc);
slide.slider().on('slideStop', function(){
  //figure out the time we want
  var hour = Math.floor(slide.slider('getValue'));
  var minfrac = slide.slider('getValue') - hour;
  var minutes = fracToMin(minfrac);
  displayTime.setHours(hour);
  displayTime.setMinutes(minutes);
  update();
});

$('#loadingmodal').modal('toggle');
$('#protext').text("Starting to Load");
$('#probar').css("width", "0%");
init();
$('#loadingmodal').modal('toggle');
animate();

function init() {

  var containerWidth = document.getElementById('canvas').clientWidth;
  var containerHeight = document.getElementById('canvas').clientHeight;
  container = document.getElementById('canvas');

  //////////////////////////////////////////////////////////////////////////////////
  //		Init renderer
  //////////////////////////////////////////////////////////////////////////////////

  if ( Detector.webgl )
    renderer = new THREE.WebGLRenderer( {antialias:true} );
  else
    renderer = new THREE.CanvasRenderer();

  renderer.setSize(containerWidth, window.innerHeight * 0.7);

  container.appendChild( renderer.domElement );

  //////////////////////////////////////////////////////////////////////////////////
  //		Init camera & controls
  //////////////////////////////////////////////////////////////////////////////////
  $('#protext').text("Bringing up Camera and Controls");
  $('#probar').css("width", "5%");
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1500);
  camera.position.set(50, 150, 50);
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  controls.minDistance = 2;
  controls.maxDistance = 400;
  controls.minPolarAngle = 0; // radians
  controls.maxPolarAngle = Math.PI/2;
  //////////////////////////////////////////////////////////////////////////////////
  //		Init scene
  //////////////////////////////////////////////////////////////////////////////////
	scene = new THREE.Scene();

  //////////////////////////////////////////////////////////////////////////////////
  //		Init Skybox
  //////////////////////////////////////////////////////////////////////////////////
  $('#protext').text("Getting the SkyBox");
  $('#probar').css("width", "10%");
  //jimbo switched the z and y
  loader = new THREE.TextureLoader();
  var xpostex = loader.load('/static/img/skyboxv1-xpos.png');
  var xnegtex = loader.load('/static/img/skyboxv1-xneg.png');
  var zpostex = loader.load('/static/img/skyboxv1-ypos.png');
  var znegtex = loader.load('/static/img/skyboxv1-yneg.png');
  var ypostex = loader.load('/static/img/skyboxv1-zpos.png');
  var ynegtex = loader.load('/static/img/skyboxv1-zneg.png');
    // Create an array of materials to be used in a cube, one for each side
  var cubeMaterialArray = [];
  // order to add materials: x+,x-,y+,y-,z+,z-
  cubeMaterialArray.push( new THREE.MeshBasicMaterial( { map: xpostex, side: THREE.BackSide } ) );
  cubeMaterialArray.push( new THREE.MeshBasicMaterial( { map: xnegtex, side: THREE.BackSide } ) );
  cubeMaterialArray.push( new THREE.MeshBasicMaterial( { map: ypostex, side: THREE.BackSide } ) );
  cubeMaterialArray.push( new THREE.MeshBasicMaterial( { map: ynegtex, side: THREE.BackSide } ) );
  cubeMaterialArray.push( new THREE.MeshBasicMaterial( { map: zpostex, side: THREE.BackSide } ) );
  cubeMaterialArray.push( new THREE.MeshBasicMaterial( { map: znegtex, side: THREE.BackSide } ) );
  var cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );
  // Cube parameters: width (x), height (y), depth (z),
  //        (optional) segments along x, segments along y, segments along z
  var cubeGeometry = new THREE.CubeGeometry( 1000, 1000, 1000, 1, 1, 1 );
  // using THREE.MeshFaceMaterial() in the constructor below
  //   causes the mesh to use the materials stored in the geometry
  cube = new THREE.Mesh( cubeGeometry, cubeMaterials );
  cube.position.set(0, 499, 0);
  cube.userData.save = true;
  scene.add(cube);

  //////////////////////////////////////////////////////////////////////////////////
  //		Init lights
  //////////////////////////////////////////////////////////////////////////////////
  $('#protext').text("Starting the Lights");
  $('#probar').css("width", "15%");
  var light = new THREE.PointLight(0xfffff3, 0.8);
  light.position.set(-100, 200, 100);
  light.userData.save = true;
  scene.add(light);
  var sphereSize = 1;
  var light2 = new THREE.PointLight(0xd7f0ff, 0.2);
  light2.position.set(200, 200, 100);
  light2.userData.save = true;
  scene.add(light2);
  //this light has been moved outside of the skybox to check projection
  var light3 = new THREE.PointLight(0xFFFFFF);
  light3.position.set(0, 6000, 0);
  light3.userData.save = true;
  scene.add(light3);

  var spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(15, 40, 35);
  spotLight.castShadow = true;
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.05;
  spotLight.decay = 2;
  spotLight.distance = 200;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 200;
  scene.add(spotLight);

  var amlight = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( amlight );
  //////////////////////////////////////////////////////////////////////////////////
  //		Init floor and initial models
  //////////////////////////////////////////////////////////////////////////////////
  $('#protext').text("Starting to get floor and starting models");
  $('#probar').css("width", "20%");
  $.get("/api/renderinstance/" + hangarId + "$" + displayTime.toISOString(), function(data, status) {
    var savedata = JSON.parse(data);
    console.log(savedata);
    //set the name and time at the top
    $('#hangarname').text(savedata.Hangar.Name);
    $('#hangartime').text(displayTime);

    if (!savedata.hasOwnProperty("Code")) {
      $('#protext').text("Adding Floor");
      $('#probar').css("width", "30%");
      var hangarDefinition = JSON.parse(savedata.Hangar.Definition);
      var Texture = loader.load('/static/img/Asphalt.png');
      Texture.wrapS = Texture.wrapT = THREE.RepeatWrapping;
      Texture.repeat.set(4, 4);
      Texture.offset.set(0.5, 0);

      var Material = new THREE.MeshBasicMaterial({
          map: Texture,
          side: THREE.DoubleSide
      });

      var HangarPts = [];
      for (var i = 0; i < hangarDefinition.points.length; i++) {
          HangarPts.push(new THREE.Vector2(hangarDefinition.points[i].x, hangarDefinition.points[i].y));
      }
      var Shape = new THREE.Shape(HangarPts);
      var geometry = new THREE.ShapeGeometry(Shape);
      checkerboard = new THREE.Mesh(geometry, Material);
      checkerboard.position.set(0, 0, 0);
      checkerboard.rotation.x = Math.PI / 2;
      checkerboard.name = "floor";
      checkerboard.userData.save = true;
      scene.add(checkerboard);
      $('#protext').text("Starting to Load Aircraft");
      $('#probar').css("width", "35%");
      if (savedata.AClines !== null && typeof savedata.AClines !== "undefined") {
        for (var i = 0; i < savedata.AClines.length; i++) {
          if (savedata.AClines[i].Instance.ModelInfo.ObjectRef !== null) {
            add3d(savedata.AClines[i].Instance.ModelInfo.ObjectRef.Location, savedata.AClines[i].Instance.Registration.Id, savedata.AClines[i].Id, savedata.AClines[i].Position, savedata.AClines[i].Rotation, true);
            activeNames.push("AC" + savedata.AClines[i].Id);
          }
        }
      }
      $('#protext').text("Starting to Load Equipment");
      $('#probar').css("width", "85%");
      if (savedata.EQlines !== null && typeof savedata.EQlines !== "undefined") {
        for (var i = 0; i < savedata.EQlines.length; i++) {
          if (savedata.EQlines[i].Instance.ModelInfo.ObjectRef !== null) {
            add3d(savedata.EQlines[i].Instance.ModelInfo.ObjectRef.Location, savedata.EQlines[i].Instance.ModelInfo.Name, savedata.EQlines[i].Id, savedata.EQlines[i].Position, savedata.EQlines[i].Rotation, false);
            activeNames.push("EQ" + savedata.EQlines[i].Id);
          }
        }
      }
      }else{
        if (savedata.Code == 401) {
          window.location.href = "/login";
        }
        openError(savedata.English);
      }
  });
}

function animate() {
	requestAnimationFrame( animate );
	render();
  updatecon();

}

function updatecon()
{
	controls.update();
}

function render() {
	renderer.render( scene, camera );
}
//////////////////////////////////////////////////////////////////////////////////
//		Update aircraft or equipment
//////////////////////////////////////////////////////////////////////////////////
function update(){
  $('#loadingmodal').modal('toggle');
  $('#protext').text("Starting Update");
  $('#probar').css("width", "0%");
  //clear the accordion
  $('#accordion').empty();
  clear();

  $('#protext').text("Getting New Models");
  $('#probar').css("width", "20%");
  $('#hangartime').text(displayTime);
  $.get("/api/renderinstance/" + hangarId + "$" + displayTime.toISOString(), function(data, status) {
    var savedata = JSON.parse(data);
    console.log(savedata);
    $('#protext').text("Getting Aircraft");
    $('#probar').css("width", "40%");
    if (!savedata.hasOwnProperty("Code")) {
      if (savedata.AClines !== null && typeof savedata.AClines !== "undefined") {
        for (var i = 0; i < savedata.AClines.length; i++) {
          if (savedata.AClines[i].Instance.ModelInfo.ObjectRef !== null) {
            add3d(savedata.AClines[i].Instance.ModelInfo.ObjectRef.Location, savedata.AClines[i].Instance.Registration.Id, savedata.AClines[i].Id, savedata.AClines[i].Position, savedata.AClines[i].Rotation, true);
            activeNames.push("AC" + savedata.AClines[i].Id);
          }
        }
      }
      $('#protext').text("Getting Equipment");
      $('#probar').css("width", "20%");
      if (savedata.EQlines !== null && typeof savedata.EQlines !== "undefined") {
        for (var i = 0; i < savedata.EQlines.length; i++) {
          if (savedata.EQlines[i].Instance.ModelInfo.ObjectRef !== null) {
            add3d(savedata.EQlines[i].Instance.ModelInfo.ObjectRef.Location, savedata.EQlines[i].Instance.ModelInfo.Name, savedata.EQlines[i].Id, savedata.EQlines[i].Position, savedata.EQlines[i].Rotation, false);
            activeNames.push("EQ" + savedata.EQlines[i].Id);
          }
        }
      }
      $('#loadingmodal').modal('toggle');
      }else{
        if (savedata.Code == 401) {
          window.location.href = "/login";
        }
        openError(savedata.English);
      }
  });
}
//////////////////////////////////////////////////////////////////////////////////
//		add aircraft or equipment to the scene
//////////////////////////////////////////////////////////////////////////////////
function add3d(daeLocation, regNumber, Id, position, rotation, isAircraft) {
    var objloader = new THREE.OBJLoader();
    var object3d;
    if (daeLocation === ""){
      //build up the user controls
      //heading
      var panel = $('<div />', {"class": "panel panel-default" });
      var heading = $('<div />', {"class": "panel-heading" });
      var headtxtholder = $('<h6 />', {"class": "panel-title"});
      var collapseID = "#collapse" + regNumber;
      var headtxt = $('<a />',{
          text: regNumber,
          href: collapseID,
      });
      headtxt.data("toggle","collapse");
      headtxt.data("parent", "#accordion");
      headtxtholder.append(headtxt);
      heading.append(headtxtholder);
      panel.append(heading);
      //body
      var colapsein = $('<div />', {"class": "panel-collapse collapse in", id: collapseID});
      var body = $('<div />', {"class": "panel-body"});
      var notFoundText = $('<span />', {"class": ""}).html("Model not found. We should have one up for you within the week.");
      body.append(notFoundText);
      colapsein.append(body);
      panel.append(colapsein);
      $("#accordion").append(panel);
    }else{
    objloader.load(daeLocation, function (dae) {
        //dae.position.set(0, 0, 0); //x,z,y- if you think in blender dimensions ;)
        //dae.scale.set(1, 1, 1);
        //console.log(dae);
        var geometry = dae.children[0].geometry;
        var meshMaterial = new THREE.MeshPhongMaterial({
            color: 0xf2f2f2
        });
        object3d = new THREE.Mesh(geometry, meshMaterial);
        //console.log(object3d);
        object3d.material.color.setHex(0xf2f2f2);
        //console.log(object3d);
        //add a skin
        object3d.userData.aircraft = isAircraft;
        if (isAircraft) {
            object3d.name = "AC" + Id;
        } else {
            object3d.name = "EQ" + Id;
        }
        object3d.userData.id = Id;
        if (position !== "" && rotation !== "") {
            var rawpos = JSON.parse(position);
            var rawrot = JSON.parse(rotation);
            object3d.position.set(rawpos.x, rawpos.y, rawpos.z);
            object3d.rotation.set(rawrot._x, rawrot._y, rawrot._z);
            //console.log(object3d);
        }else{
          object3d.position.set(0, 0, 0);
        }

        object3d.updateMatrix();
        //build up the user controls
        //heading
        var panel = $('<div />', {"class": "panel panel-default" });
        var heading = $('<div />', {"class": "panel-heading" });
        var headtxtholder = $('<h6 />', {"class": "panel-title"});
        var collapseID = "#collapse" + regNumber;
        var headtxt = $('<a />',{
            text: regNumber,
            href: collapseID,
        });
        headtxt.data("toggle","collapse");
        headtxt.data("parent", "#accordion");
        headtxtholder.append(headtxt);
        heading.append(headtxtholder);
        panel.append(heading);
        //body
        var colapsein = $('<div />', {"class": "panel-collapse collapse in", id: collapseID});
        var body = $('<div />', {"class": "panel-body"});
        var btngroup = $('<div />', {"class": "btn-group", role: "group"});
        //if this object does not have a location give the user the option to add it
        var addButton = $('<button/>', {
          html: "<span class='glyphicon glyphicon-plus'></span>",
          click: function () {
            // add the object to the scene
            scene.add(object3d);
            //add the sprite label
            //var spritey = makeTextSprite( regNumber,
            //  { fontsize: 8, fontface: "Georgia", borderThickness:1, borderColor: {r:0, g:0, b:255, a:1.0} } );
            //spritey.position.set(0,50,0);
            //object3d.add( spritey );
            //console.log(spritey);
            addButton.hide();
          }
        });
        if (position === "" && rotation === "") {

        } else {
            addButton.click();
        }
    });
  }
}

//////////////////////////////////////////////////////////////////////////////////
//		previous and next day controls
//////////////////////////////////////////////////////////////////////////////////

function previous() {
    var todate = new Date(displayTime.getTime());
    todate.setDate(todate.getDate() - 1);
    todate.setHours(0);
    todate.setMinutes(0);
    todate.setSeconds(0);
    todate.setMilliseconds(0);
    var location = "/viewer/hangar/" + hangarId + "$" + todate.toISOString();
    window.location.href = location;
}

function next() {
    var todate = new Date(displayTime.getTime());
    todate.setDate(todate.getDate() + 1);
    todate.setHours(0);
    todate.setMinutes(0);
    todate.setSeconds(0);
    todate.setMilliseconds(0);
    var location = '/viewer/hangar/' + hangarId + "$" + todate.toISOString();
    window.location.href = location;
}

function goTime(){
  //figure out the time we want
  var hour = $('#hours').val();
  var minutes = $('#minutes').val();
  displayTime.setHours(hour);
  displayTime.setMinutes(minutes);
  update();
}
//////////////////////////////////////////////////////////////////////////////////
//		Helper Methods
//////////////////////////////////////////////////////////////////////////////////
//clear all from scene

function clear() {
    for (var i = scene.children.length - 1; i >= 0; i--) {
        if (scene.children[i].userData.save !== true) {
            scene.remove(scene.children[i]);
        }
    }
}
function fracToMin(frac) {
    switch (frac) {
        case 0.25:
            return 15;
        case 0.5:
            return 30;
        case 0.75:
            return 45;
        default:
            return 0;
    }
}

function dateToFrac(date) {
    var frac = date.getHours();
    var mins = date.getMinutes();
    switch (frac) {
        case 15:
            mins = 0.25;
            break;
        case 30:
            mins = 0.5;
            break;
        case 45:
            mins = 0.75;
            break;
        default:
            mins = 0;
    }
    frac += mins;
    return frac;
}

function openError(thrown) {
    $('#loadingmodal').modal('hide');
    $("#errormsg").text(thrown);
    $("#dialogerror").modal('show');
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();
}
function makeTextSprite( message, parameters ){
	if ( parameters === undefined ) parameters = {};

	var fontface = parameters.hasOwnProperty("fontface") ?
		parameters["fontface"] : "Arial";

	var fontsize = parameters.hasOwnProperty("fontsize") ?
		parameters["fontsize"] : 18;

	var borderThickness = parameters.hasOwnProperty("borderThickness") ?
		parameters["borderThickness"] : 4;

	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;

	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;

	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

	context.lineWidth = borderThickness;
	roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.

	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText( message, borderThickness, fontsize + borderThickness);

	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial(
		{ map: texture } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(100,50,1.0);
	return sprite;
}
function SubmitBug(){
  var text = $('#bugText').val();
  var toSubmit = {
    Text: text
  };
  var json = JSON.stringify(toSubmit);
  try {
    $.post("/viewer/submitbug/", json, function (data, status) {});
  } catch (err) {
    openError("Unable to contact server. Please check your connection and reload the page");
  }
  $('#filebug').modal('toggle');
}
