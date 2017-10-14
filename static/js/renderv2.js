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
  })
	.fail(function() {
		openError("There has been an error in getting the render save");
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
  })
	.fail(function() {
		openError("There has been an error in getting the render save");
	});
}
//////////////////////////////////////////////////////////////////////////////////
//		add aircraft or equipment to the scene
//////////////////////////////////////////////////////////////////////////////////
function add3d(daeLocation, regNumber, Id, position, rotation, isAircraft) {

		var objloader = new THREE.OBJLoader();
    var object3d;
    if (daeLocation === ""){
			console.log("i do not think there is a dae location for this object");
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
        }else{
          object3d.position.set(0, 0, 0);
        }

        //add user controll of object
        var EventsControls1 = new EventsControls(camera, renderer.domElement);
        EventsControls1.map = checkerboard;

        EventsControls1.attachEvent('mouseOver', function () {
					if (!addButton.is(":visible")){
						container.style.cursor = 'pointer';
						heading.css("background-color","#158cba");
					}

        });

        EventsControls1.attachEvent('mouseOut', function () {
            container.style.cursor = 'auto';
						heading.css("background-color","#f5f5f5");

        });
        EventsControls1.attachEvent('dragAndDrop', function () {
            controls.enabled = false;
            container.style.cursor = 'move';
        });

        EventsControls1.attachEvent('mouseUp', function () {
            controls.enabled = true;
            container.style.cursor = 'auto';

        });
        EventsControls1.attach(object3d);
        object3d.updateMatrix();
        //build up the user controls
        //heading
        var panel = $('<div />', {"class": "panel panel-default" });
        var heading = $('<div />', {"class": "panel-heading" });
        var headtxtholder = $('<h6 />', {"class": "panel-title"});
        var collapseID = "#collapse" + encodeURIComponent(regNumber);
        var headtxt = $('<a />',{
            text: regNumber,
            href: collapseID,
        });
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
						//if we are clicking add it means it should not have a position already
						//object3d.position.set(0,0,0);
            // add the object to the scene
            scene.add(object3d);
            //add the sprite label
            //var spritey = makeTextSprite( regNumber,
            //  { fontsize: 8, fontface: "Georgia", borderThickness:1, borderColor: {r:0, g:0, b:255, a:1.0} } );
            //spritey.position.set(0,50,0);
            //object3d.add( spritey );
            //console.log(spritey);
            addButton.hide();
            farleftButton.show();
            leftButton.show();
            rightButton.show();
            farrightButton.show();
            removeButton.show();
          }
        });
        var farleftButton = $('<button/>', {
          html: "<span class='glyphicon glyphicon-chevron-left'></span><span class='glyphicon glyphicon-chevron-left'></span>",
          click: function () {
            //rotate main
            var axis = new THREE.Vector3(0, 1, 0);
            object3d.rotateOnAxis(axis, Math.PI / 4);
            object3d.updateMatrix();
          }
        });
        var leftButton = $('<button/>', {
          html: "<span class='glyphicon glyphicon-chevron-left'></span>",
          click: function () {
            //rotate main
            var axis = new THREE.Vector3(0, 1, 0);
            object3d.rotateOnAxis(axis, Math.PI / 12);
            object3d.updateMatrix();
          }
        });
        var rightButton = $('<button/>', {
          html: "<span class='glyphicon glyphicon-chevron-right'></span>",
          click: function () {
            //rotate main
            var axis = new THREE.Vector3(0, 1, 0);
            object3d.rotateOnAxis(axis, -Math.PI / 12);
            object3d.updateMatrix();
          }
        });
        var farrightButton = $('<button/>', {
          html: "<span class='glyphicon glyphicon-chevron-right'></span><span class='glyphicon glyphicon-chevron-right'></span>",
          click: function () {
            //rotate main
            var axis = new THREE.Vector3(0, 1, 0);
            object3d.rotateOnAxis(axis, -Math.PI / 4);
            object3d.updateMatrix();
          }
        });
        var removeButton = $('<button/>', {
          html: "<span class='glyphicon glyphicon-remove'></span>",
          click: function () {
            scene.remove(object3d);
            addButton.show();
            farleftButton.hide();
            leftButton.hide();
            rightButton.hide();
            farrightButton.hide();
            removeButton.hide();
          }
        });
        //put it all together and add it in
        btngroup.append(farleftButton);
        btngroup.append(leftButton);
        btngroup.append(rightButton);
        btngroup.append(farrightButton);
        btngroup.append(addButton);
        btngroup.append(removeButton);
        body.append(btngroup);
        colapsein.append(body);
        panel.append(colapsein);
        $("#accordion").append(panel);
				headtxt.data("toggle","collapse");
				headtxt.data("parent", "#accordion");

        if (position === "" && rotation === "") {
            addButton.show();
            farleftButton.hide();
            leftButton.hide();
            rightButton.hide();
            farrightButton.hide();
            removeButton.hide();
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
    var location = "/hangarmodel/" + hangarId + "$" + todate.toISOString();
    window.location.href = location;
}

function next() {
    var todate = new Date(displayTime.getTime());
    todate.setDate(todate.getDate() + 1);
    todate.setHours(0);
    todate.setMinutes(0);
    todate.setSeconds(0);
    todate.setMilliseconds(0);
    var location = '/hangarmodel/' + hangarId + "$" + todate.toISOString();
    window.location.href = location;
}

//////////////////////////////////////////////////////////////////////////////////
//		save control
//////////////////////////////////////////////////////////////////////////////////
function save() {
    //find all the non-light elements
    var AClines = [];
    var EQlines = [];
    var value = $(".selector").slider("option", "value");

    for (var i = 0; i < scene.children.length; i++) {
        if (scene.children[i].name.startsWith("AC")) {
            var id = parseInt(scene.children[i].name.substring(2));
            var position = JSON.stringify(scene.children[i].position);
            var rotation = JSON.stringify(scene.children[i].rotation);
            AClines.push({
                id: id,
                position: position,
                rotation: rotation
            });
        }
        if (scene.children[i].name.startsWith("EQ")) {
            var id = parseInt(scene.children[i].name.substring(2));
            var position = JSON.stringify(scene.children[i].position);
            var rotation = JSON.stringify(scene.children[i].rotation);
            EQlines.push({
                id: id,
                position: position,
                rotation: rotation
            });
        }
    }
    var toSend = JSON.stringify({
        ACLines: AClines,
        EQLines: EQlines,
        Time: displayTime
    });

    $.post("/api/rendersave", toSend, function (data, status) {
			$("#goodsave").modal('toggle');
		})
		.fail(function() {
			openError("There has been an error saving the render");
		});

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

function SubmitBug(){
  var text = $('#bugText').val();
  var toSubmit = {
    Text: text
  };
  var json = JSON.stringify(toSubmit);
  $.post("/api/submitbug/", json, function (data, status) {})
		.fail(function() {
			openError("There has been an error in submitting a bug");
		});
  $('#filebug').modal('toggle');
}
