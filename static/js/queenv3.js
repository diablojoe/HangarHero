$(document).ready(function () {
  var animation = new threeWindow();
  animation.init();
  animation.animate();
});

//prototype for render window
function threeWindow(){

  this.init = function(){
    //set scene
    this.scene = new THREE.Scene();
    //set camera
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
    this.camera.position.set(50, 150, 100);

    this.container = document.getElementById('canvas');
    this.renderer = new THREE.WebGLRenderer();
    //set lights
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
    this.scene.add(spotLight);

    //add orbit controls
    this.controls = new THREE.OrbitControls(this.camera, this.container);
    //check if the user has resized the window
    window.addEventListener( 'resize', this.onWindowResize, false );
  };
  this.onWindowResize = function() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  };

  this.animate =  function() {
    requestAnimationFrame( this.animate );
    this.controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
    this.render();
  };

  this.render = function() {
    this.renderer.render( scene, camera );
  };

  // add a floor based on the hangar definition
  this.SetFloor = function(hangarDefinition){
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
  };

  //add an object3d from a source
  this.addObject = function(src, position, rotation, isaircraft, regnumber){
    var loader = new THREE.OBJLoader();
    loader.load(src, function (obj) {
      //load the geometry and wrap it in a skin
      var geometry = obj.children[0].geometry;
      var meshMaterial = new THREE.MeshPhongMaterial({
          color: 0xf2f2f2
      });
      var object3d = new THREE.Mesh(geometry, meshMaterial);
      object3d.material.color.setHex(0xf2f2f2);
      //store information about this object into the object itself
      object3d.userData.aircraft = isAircraft;
      if (isAircraft) {
          object3d.name = "AC" + Id;
      } else {
          object3d.name = "EQ" + Id;
      }
      object3d.userData.id = Id;
      //set a position for the object if one is saved
      if (posx !== "" && posy !== "" && rotation !== "") {
          object3d.position.set(position.x, position.y, position.z);
          object3d.rotation.set(rotation._x, rotation._y, rotation._z);
      }
      //add user controll of object
      var EventsControls1 = new EventsControls(this.scene.camera, this.scene.renderer.domElement);
      EventsControls1.map = scene.checkerboard;

      EventsControls1.attachEvent('mouseOver', function () {
          this.container.style.cursor = 'pointer';
      });

      EventsControls1.attachEvent('mouseOut', function () {
          this.container.style.cursor = 'auto';
      });

      EventsControls1.attachEvent('dragAndDrop', function () {
          this.scene.controls.enabled = false;
          this.container.style.cursor = 'move';
      });
      EventsControls1.attachEvent('mouseUp', function () {
          this.scene.controls.enabled = true;
          this.container.style.cursor = 'auto';

      });
      EventsControls1.attach(object3d);
      object3d.updateMatrix();

      //build the controls for this object3d
      //build up the user controls
      //heading
      var panel = $('<div />', {"class": "panel panel-default" });
      var heading = $('<div />', {"class": "panel-heading" });
      var headtxtholder = $('<h6 />', {"class": "panel-title"});

      var collapseID = "#collapse" + regnumber;
      var headtxt = $('<a />',{
          text: regnumber,
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
          this.scene.scene.add(object3d);
          // add the helper
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
      var removeButton = $('<button/>', {
        html: "<span class='glyphicon glyphicon-remove'></span>",
        click: function () {
          scene.scene.remove(object3d);
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
  };
}
