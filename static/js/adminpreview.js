/*global $, vis, document, jQuery, window, location, THREE, THREEx, requestAnimationFrame, EventsControls, time */
/*jslint plusplus: true */
function init(hangardef) {
    //initial scene setup
    var containerWidth = document.getElementById('canvas').clientWidth;
    var container = document.getElementById('canvas');
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(containerWidth, window.innerHeight * 0.7);
    container.appendChild(renderer.domElement);
    var onRenderFcts = [];
    var scene = new THREE.Scene();





    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(50, 150, 100);

    ///let there be light
    var light = new THREE.PointLight(0xfffff3, 0.8);
    light.position.set(-100, 200, 100);
    light.userData.save = true;
    scene.add(light);
    var sphereSize = 1;
    var pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
    pointLightHelper.userData.save = true;
    scene.add(pointLightHelper);
    var light2 = new THREE.PointLight(0xd7f0ff, 0.2);
    light2.position.set(200, 200, 100);
    light2.userData.save = true;
    scene.add(light2);
    sphereSize = 1;
    var pointLightHelper2 = new THREE.PointLightHelper(light2, sphereSize);
    pointLightHelper.userData.save = true;
    scene.add(pointLightHelper2);
    var light3 = new THREE.PointLight(0xFFFFFF, 0.5);
    light3.position.set(150, 200, -100);
    light3.userData.save = true;
    scene.add(light3);
    sphereSize = 1;
    var pointLightHelper3 = new THREE.PointLightHelper(light3, sphereSize);
    pointLightHelper3.userData.save = true;
    scene.add(pointLightHelper3);
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
    //		Comment								//
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
    return {
        scene: scene,
        camera: camera,
        renderer: renderer,
        controls: controls
    };
}

function addFloor(scene, hangardef) {
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
    for (var i = 0; i < hangarDefinition.point.length; i++) {
        HangarPts.push(new THREE.Vector2(hangarDefinition.point[i].x, hangarDefinition.point[i].y));
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

function add3d(scene, objLocation) {
    var loader = new THREE.OBJLoader();
    var object3d;
    loader.options.convertUpAxis = true;
    loader.load(objLocation, function (objload) {
        var dae = objload.scene;
        var skin = objload.skins[0];
        dae.position.set(0, 0, 0); //x,z,y- if you think in blender dimensions ;)
        dae.scale.set(1, 1, 1);

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
        scene.add(object3d);
    });
}

