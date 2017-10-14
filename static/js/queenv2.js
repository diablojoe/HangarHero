/*global $, vis, document, jQuery, window, location, THREE, THREEx, requestAnimationFrame, EventsControls, time */
/*jslint plusplus: true */
$(document).ready(function () {
  this.stringdate = $('body').data("date");
  this.hangarId = $('body').data("hangarid");
  this.initialtime = new Date(this.stringdate);
  this.initialtime.setSeconds(0);
  this.initialtime.setMilliseconds(0);
  console.log("about to init with hangar id " + this.hangarId + " at time " + this.initialtime);
  this.scene = init(this.hangarId);
  this.activeNames = [];
  //we will come back to your slider scheduleAircraft
  $("#slider").slider({});
  //get the initial data
  GetData(this.hangarId, this.initialtime, this.scene);
  var startloc = dateToFrac(this.initialtime);
  this.slider = $('#slider').slider()
		.on('slideStop', function(value){

      //get the hours
      var hours = Math.floor(value);
      var minutes = fracToMin(value-hours);
      var stringdate = $('body').data("date");
      var hangarId = $('body').data("hangarid");
      var initialtime = new Date(this.stringdate);
      initialtime.setHours(hours);
      initialtime.setMinutes(minutes);
      initialtime.setSeconds(0);
      initialtime.setMilliseconds(0);
      GetData(hangarId, initialtime, this.scene);
  }.bind(this));
	$('#slider').data('slider-value', startloc);
});

function GetData(id, time, scene){
  this.scene = scene;
  $.get("/api/renderinstance/" + id + "$" + time.toISOString(), function(data, status) {
    savedata = JSON.parse(data);
    console.log(savedata);
    if (!savedata.hasOwnProperty("Code")) {
      var hangarDefinition = savedata.Hangar.Definition;
      addFloor(this.scene, hangarDefinition);
      console.log(savedata);
      if (savedata.AClines !== null) {
        for (var i = 0; i < savedata.AClines.length; i++) {
          if (savedata.AClines[i].Instance.ModelInfo.ObjectRef !== null) {
            add3d(this.scene, savedata.AClines[i].Instance.ModelInfo.ObjectRef.Location, savedata.AClines[i].Instance.Registration.Id, savedata.AClines[i].Id, savedata.AClines[i].Position, savedata.AClines[i].Rotation, true);
            this.activeNames.push("AC" + savedata.AClines[i].Id);
          }
        }
      }
      if (savedata.EQlines !== null) {
        for (var i = 0; i < savedata.EQlines.length; i++) {
          if (savedata.EQlines[i].Instance.ModelInfo.ObjectRef !== null) {
            add3d(this.scene, savedata.EQlines[i].Instance.ModelInfo.ObjectRef.Location, savedata.EQlines[i].Instance.ModelInfo.Name, savedata.EQlines[i].Id, savedata.EQlines[i].Position, savedata.EQlines[i].Rotation, false);
            this.activeNames.push("EQ" + savedata.EQlines[i].Id);
          }
        }
      }
    }else{
      if (savedata.Code == 401) {
        window.location.href = "/login";
      }
      openError(savedata.English);
    }
  }.bind(this));
}

function init(hangarId) {
  //initial scene setup
  console.log("in init with hangar id " + hangarId);
  //set up the canvas
  var containerWidth = document.getElementById('canvas').clientWidth;
  var containerHeight = document.getElementById('canvas').clientHeight;
  var container = document.getElementById('canvas');
  var renderer = new THREE.WebGLRenderer();
  //renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(containerWidth, window.innerHeight * 0.7);
  //document.body.appendChild(renderer.domElement);
  container.appendChild(renderer.domElement);
  var onRenderFcts = [];
  var scene = new THREE.Scene();

  //Set up the camera
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.set(50, 150, 100);

  //////////////////////////////////////////////////////////////////////////////////
  //		Init camera controls
  //////////////////////////////////////////////////////////////////////////////////
  var controls = new THREE.OrbitControls(camera, container);
  onRenderFcts.push(function () {
    controls.update();
  });

  //////////////////////////////////////////////////////////////////////////////////
  //		set up collision system							//
  //////////////////////////////////////////////////////////////////////////////////
  var colliderSystem = new THREEx.ColliderSystem();
  onRenderFcts.push(function () {
    // build colliders
    // - here you use your own data structure, threex.colliders.js doesnt care
    var colliders = [];
      scene.traverse(function (object3d) {
      var collider = object3d.userData.collider;
        if (collider === undefined) {
          return;
        }
        colliders.push(collider);
      });

      // update the colliderSystem
      colliderSystem.computeAndNotify(colliders);
    });
    //////////////////////////////////////////////////////////////////////////////////
    //		update all object3d
    //////////////////////////////////////////////////////////////////////////////////
    onRenderFcts.push(function () {
      var objects = [];
      // traverse the scene and update object with colliders
      scene.traverse(function (object3d) {
        if (object3d.userData.collider === undefined) {
          return;
        }
        objects.push(object3d);
      });

      // traverse the scene and update object with colliders
      objects.forEach(function (object3d) {
        updateObject3D(object3d);
      });
    });

    //////////////////////////////////////////////////////////////////////////////////
    //		Update Object 3d								//
    //////////////////////////////////////////////////////////////////////////////////
    function updateObject3D(object3d) {
      // update the collider
      var collider = object3d.userData.collider;
      collider.update();

      // update the helper
      var helper = object3d.userData.helper;
      helper.update();
    }
    //////////////////////////////////////////////////////////////////////////////////
    //		render the scene						//
    //////////////////////////////////////////////////////////////////////////////////
    onRenderFcts.push(function () {
        renderer.render(scene, camera);
    });

    //////////////////////////////////////////////////////////////////////////////////
    //		loop runner							//
    //////////////////////////////////////////////////////////////////////////////////;
    requestAnimationFrame(function animate(nowMsec) {
        // keep looping
        requestAnimationFrame(animate);
        // call each update function
        onRenderFcts.forEach(function (onRenderFct) {
            onRenderFct();
        });
    });
    var toreturn = {
        scene: scene,
        camera: camera,
        renderer: renderer,
        controls: controls
    };
    console.log(toreturn);
    return toreturn;
}

function addFloor(scene, hangardef) {
    //change the background color
    //scene.background = new THREE.Color( 0xFFFFFF );
    //set up the lights
    console.log("in add floor with scene");
    console.log(scene.scene);

    var light = new THREE.PointLight(0xfffff3, 0.8);
    light.position.set(-100, 200, 100);
    light.userData.save = true;
    scene.scene.add(light);
    var sphereSize = 1;
    var pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
    pointLightHelper.userData.save = true;
    scene.scene.add(pointLightHelper);
    var light2 = new THREE.PointLight(0xd7f0ff, 0.2);
    light2.position.set(200, 200, 100);
    light2.userData.save = true;
    scene.scene.add(light2);
    sphereSize = 1;
    var pointLightHelper2 = new THREE.PointLightHelper(light2, sphereSize);
    pointLightHelper.userData.save = true;
    scene.scene.add(pointLightHelper2);
    var light3 = new THREE.PointLight(0xFFFFFF, 0.5);
    light3.position.set(150, 200, -100);
    light3.userData.save = true;
    scene.scene.add(light3);
    sphereSize = 1;
    var pointLightHelper3 = new THREE.PointLightHelper(light3, sphereSize);
    pointLightHelper3.userData.save = true;
    scene.scene.add(pointLightHelper3);
    var spotLight = new THREE.SpotLight(0xffffff, 1);
    //var lightHelper;
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
    //lightHelper = new THREE.SpotLightHelper( spotLight );
    scene.scene.add(spotLight);
    //scene.scene.add(lightHelper);
    console.log(spotLight);
    //set up the floor from the definition
    var hangarDefinition = JSON.parse(hangardef);
    var Texture = new THREE.ImageUtils.loadTexture('/static/img/checkerboard.jpg');
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
    var checkerboard = new THREE.Mesh(geometry, Material);
    checkerboard.position.set(0, 0, 0);
    checkerboard.rotation.x = Math.PI / 2;
    checkerboard.name = "floor";
    checkerboard.userData.save = true;
    scene.checkerboard = checkerboard;
    scene.scene.add(checkerboard);
}

function add3d(scene, daeLocation, regNumber, Id, position, rotation, isAircraft) {
    var loader = new THREE.OBJLoader();
    var object3d;
    this.regNumber = regNumber;
    loader.load(daeLocation, function (dae) {
        //dae.position.set(0, 0, 0); //x,z,y- if you think in blender dimensions ;)
        //dae.scale.set(1, 1, 1);
        console.log(dae);
        var geometry = dae.children[0].geometry;
        var meshMaterial = new THREE.MeshPhongMaterial({
            color: 0xf2f2f2
        });
        object3d = new THREE.Mesh(geometry, meshMaterial);
        console.log(object3d);
        object3d.material.color.setHex(0xf2f2f2);
        console.log(object3d);
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
            console.log(object3d);
        }
        //////////////////////////////////////////////////////////////////////////////////
        //		Create a collider
        //////////////////////////////////////////////////////////////////////////////////

        // init collider

        var collider = THREEx.Collider.createFromObject3d(object3d);
        object3d.userData.collider = collider;

        // init collider helper
        var helper = new THREEx.ColliderHelper(collider);
        object3d.userData.helper = helper;
        helper.material.color.set('green');

        //////////////////////////////////////////////////////////////////////////////////
        //		event binding for colliders
        //////////////////////////////////////////////////////////////////////////////////
        collider.addEventListener('contactEnter', function (otherCollider) {
            helper.material.color.set('red');
            helper.material.wireframeLinewidth = 1;
            object3d.children[0].material.color.setHex(0xFDFF00);
            otherCollider.object3d.children[0].material.color.setHex(0xFDFF00);
        });
        collider.addEventListener('contactExit', function (otherCollider) {
            helper.material.color.set('green');
            helper.material.wireframeLinewidth = 1;
            object3d.children[0].material.color.setHex(0xFFFFFF);
            otherCollider.object3d.children[0].material.color.setHex(0xFFFFFF);

        });
        collider.addEventListener('contactRemoved', function (otherColliderId) {
            helper.material.color.set('blue');
            helper.material.wireframeLinewidth = 1;
            object3d.children[0].material.color.setHex(0xFFFFFF);
            otherCollider.object3d.children[0].material.color.setHex(0xFFFFFF);
        });
        collider.addEventListener('contactStay', function (otherCollider) {
            helper.material.wireframeLinewidth = 3;
            object3d.children[0].material.color.setHex(0xFDFF00);
            otherCollider.object3d.children[0].material.color.setHex(0xFDFF00);
        });

        //add user controll of object
        var EventsControls1 = new EventsControls(scene.camera, scene.renderer.domElement);
        EventsControls1.map = scene.checkerboard;

        EventsControls1.attachEvent('mouseOver', function () {
            this.container.style.cursor = 'pointer';

        });

        EventsControls1.attachEvent('mouseOut', function () {
            this.container.style.cursor = 'auto';

        });
        EventsControls1.attachEvent('dragAndDrop', function () {
            scene.controls.enabled = false;
            this.container.style.cursor = 'move';
        });

        EventsControls1.attachEvent('mouseUp', function () {
            scene.controls.enabled = true;
            this.container.style.cursor = 'auto';

        });
        EventsControls1.attach(object3d);
        object3d.updateMatrix();

        //build up the user controls
        //heading
        var panel = $('<div />', {"class": "panel panel-default" });
        var heading = $('<div />', {"class": "panel-heading" });
        var headtxtholder = $('<h6 />', {"class": "panel-title"});

        console.log("the reg number is " + regNumber);
        var collapseID = "#collapse" + regNumber;
        var headtxt = $('<a />',{
            text: regNumber,
            href: collapseID,
        });
        headtxt.data("toggle","collapse");
        headtxt.data("parent", "#accordion");
        headtxtholder.append(headtxt);
        panel.append(heading);
        //body
        var colapsein = $('<div /', {"class": "panel-collapse collapse in", id: collapseID });
        var body = $('<div />', {"class": "panel-body"});
        var btngroup = $('<div />', {"class": "btn-group", role: "group"});
        //if this object does not have a location give the user the option to add it
        var addButton = $('<button/>', {
          html: "<span class='glyphicon glyphicon-plus'></span>",
          click: function () {
            // add the object to the scene
            scene.scene.add(object3d);
            // add the helper
            var helper = object3d.userData.helper;
            helper.name = "collider";
            scene.scene.add(helper);
            addButton.hide();
            leftButton.show();
            rightButton.show();
            removeButton.show();
          }
        });
        var leftButton = $('<button/>', {
          html: "<span class='glyphicon glyphicon-chevron-left'></span>",
          click: function () {
            //rotate main
            var axis = new THREE.Vector3(0, 1, 0);
            object3d.rotateOnAxis(axis, Math.PI / 12);
            object3d.updateMatrix();
            //rotate collision box
            var bbox = new THREE.Box3().setFromObject(object3d);
            bbox.min.sub(object3d.position);
            bbox.max.sub(object3d.position);
            collider.shape.min = bbox.min;
            collider.shape.max = bbox.max;
            var vector = new THREE.Vector3();
            vector.setFromMatrixPosition(object3d.matrixWorld);
          }
        });
        var rightButton = $('<button/>', {
          html: "<span class='glyphicon glyphicon-chevron-right'></span>",
          click: function () {
            //rotate main
            var axis = new THREE.Vector3(0, 1, 0);
            object3d.rotateOnAxis(axis, -Math.PI / 12);
            object3d.updateMatrix();
            //rotate collision box
            var bbox = new THREE.Box3().setFromObject(object3d);
            bbox.min.sub(object3d.position);
            bbox.max.sub(object3d.position);
            collider.shape.min = bbox.min;
            collider.shape.max = bbox.max;
          }
        });
        var removeButton = $('<button/>', {
          html: "<span class='glyphicon glyphicon-remove'></span>",
          click: function () {
            object3d.remove(collider);
            object3d.remove(helper);
            scene.scene.remove(object3d);
            scene.scene.remove(helper);
            addButton.show();
            leftButton.hide();
            rightButton.hide();
            removeButton.hide();
          }
        });
        //put it all together and add it in
        btngroup.append(leftButton);
        btngroup.append(rightButton);
        btngroup.append(addButton);
        btngroup.append(removeButton);
        body.append(btngroup);
        colapsein.append(body);
        panel.append(colapsein);
        $("#accordion").append(panel);

        if (position === "" && rotation === "") {
            addButton.show();
            leftButton.hide();
            rightButton.hide();
            removeButton.hide();
        } else {
            addButton.click();
        }
    });


}

function clear(scene) {
    for (var i = scene.scene.children.length - 1; i >= 0; i--) {
        if (scene.scene.children[i] !== true) {
            scene.scene.remove(scene.scene.children[i]);
        }
    }
}

function previous() {
  var stringdate = $('body').data("date");
  var initialtime = new Date(stringdate);
  initialtime.setSeconds(0);
  initialtime.setMilliseconds(0);
  var todate = new Date(initialtime.getTime());
  todate.setDate(todate.getDate() - 1);
  todate.setHours(0);
  todate.setMinutes(0);
  todate.setSeconds(0);
  todate.setMilliseconds(0);
  var hangarId = $('body').data("hangarid");
  var location = "/hangarmodel/" + hangarId + "$" + todate.toISOString();
  window.location.href = location;
}

function next() {
  var stringdate = $('body').data("date");
  var initialtime = new Date(stringdate);
  initialtime.setSeconds(0);
  initialtime.setMilliseconds(0);
  var todate = new Date(initialtime.getTime());
  todate.setDate(todate.getDate() + 1);
  todate.setHours(0);
  todate.setMinutes(0);
  todate.setSeconds(0);
  todate.setMilliseconds(0);
  var hangarId = $('body').data("hangarid");
  var location = "/hangarmodel/" + hangarId + "$" + todate.toISOString();
  window.location.href = location;
}

function save() {
    //find all the non-light elements
    var AClines = [];
    var EQlines = [];
    var value = $(".selector").slider("option", "value");

    for (var i = 0; i < scene.scene.children.length; i++) {
        if (scene.scene.children[i].name.startsWith("AC")) {
            var id = parseInt(scene.scene.children[i].name.substring(2));
            var position = JSON.stringify(scene.scene.children[i].position);
            var rotation = JSON.stringify(scene.scene.children[i].rotation);
            AClines.push({
                id: id,
                position: position,
                rotation: rotation
            });
        }
        if (scene.scene.children[i].name.startsWith("EQ")) {
            var id = parseInt(scene.scene.children[i].name.substring(2));
            var position = JSON.stringify(scene.scene.children[i].position);
            var rotation = JSON.stringify(scene.scene.children[i].rotation);
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
        Time: time
    });
    console.log(toSend);
    $.post("/api/updatelines", toSend, function (data, status) {

    });
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

function openError(err){
  $('#errormsg').text(err);
  $('#showerror').modal('toggle');
}
