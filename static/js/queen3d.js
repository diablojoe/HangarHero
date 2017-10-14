function load3d(time, hangarId) {
    //these variables will need to be changed by key values by the go routine setting up the page
    //var startTime = new Date(2016, 4, 24);
    //var endTime = new Date(2016, 4, 28);
    var hangarName = "my hangar";
    //var saveId = -1;
    //initial scene setup
    var containerWidth = document.getElementById('canvas').clientWidth;
    var containerHeight = document.getElementById('canvas').clientHeight;
    var container = document.getElementById('canvas');
    var renderer = new THREE.WebGLRenderer();
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(containerWidth, window.innerHeight * 0.7);
    //document.body.appendChild(renderer.domElement);
    container.appendChild(renderer.domElement);
    gui = new dat.GUI();
    var onRenderFcts = [];
    var scene = new THREE.Scene();
    var savedata;

    //first get the aircraft in this save if not in error

    $.get("/api/renderinstance/" + hangarId + "$" + time.toISOString(), function (data, status) {
        savedata = JSON.parse(data);
        var hangarDefinition = JSON.parse(savedata.Hangar.Definition);
        //set up the floor from the definition
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
        scene.add(checkerboard);
        // add all of the aircraft that are part of the save
        if (savedata.Lines !== null) {
            for (var i = 0; i < savedata.Lines.length; i++) {
                guifolder = gui.addFolder(savedata.Lines[i].Instance.Registration.Nnumber);
                var obj = {
                    add: function (savedata, j) {

                        var guifolder;
                        var loader = new THREE.ColladaLoader();
                        loader.options.convertUpAxis = true;
                        loader.load(savedata.Lines[j].Instance.ModelInfo.Dae.DaeLocation, function (collada) {
                            var dae = collada.scene;
                            var skin = collada.skins[0];
                            dae.position.set(0, 0, 0); //x,z,y- if you think in blender dimensions ;)
                            dae.scale.set(1, 1, 1);
                            object3d = dae.children[0];
                            object3d.userData.aircraft = true;
                            console.log(savedata);
                            object3d.userData.name = savedata.Lines[j].Instance.Registration.Nnumber;
                            object3d.userData.id = savedata.Lines[j].Id;
                            if (savedata.Lines[j].Position !== null) {
                                object3d.matrixWorld = savedata.Lines[j].Position;
                                object3d.rotation = savedata.Lines[j].Rotation;
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
                            EventsControls1 = new EventsControls(camera, renderer.domElement);
                            EventsControls1.map = checkerboard;

                            EventsControls1.attachEvent('mouseOver', function () {
                                guifolder.open();
                                this.container.style.cursor = 'pointer';

                            });

                            EventsControls1.attachEvent('mouseOut', function () {
                                guifolder.close();
                                this.container.style.cursor = 'auto';

                            });
                            EventsControls1.attachEvent('dragAndDrop', function () {
                                controls.enabled = false;
                                this.container.style.cursor = 'move';
                            });

                            EventsControls1.attachEvent('mouseUp', function () {
                                controls.enabled = true;
                                this.container.style.cursor = 'auto';

                            });
                            EventsControls1.attach(object3d);
                            object3d.updateMatrix();
                            // add the object to the scene
                            scene.add(object3d);

                            // add the helper
                            var helper = object3d.userData.helper;
                            helper.name = "collider";
                            scene.add(helper);

                            // add rotation controlls
                            var left = {
                                left: function () {
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
                                    console.log(object3d.rotation);
                                }
                            };
                            var right = {
                                right: function () {
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
                            };
                            var remove = {
                                remove: function () {
                                    object3d.remove(collider);
                                    object3d.remove(helper);
                                    scene.remove(object3d);
                                    guifolder.remove(left, 'left');
                                    guifolder.remove(right, 'right');
                                    guifolder.remove(remove, 'remove');
                                }
                            };

                            guifolder.add(left, 'left');
                            guifolder.add(right, 'right');
                            guifolder.add(remove, 'remove');
                            guifolder.remove(add, 'add');
                        });
                    }
                };
                if (savedata.Lines[i].Position.x != null) {
                    console.log("i think there is a position");
                    obj.add(savedata, i);
                } else {
                    guifolder.add(obj, 'add');
                }
            }
        }
        if (savedata.EQlines != null) {
            for (var i = 0; i < savedata.EQlines.length; i++) {
                guifolder = gui.addFolder(savedata.EQlines[i].Instance.ModelInfo.Name);
                var obj = {
                    add: function () {
                        var guifolder;
                        var loader = new THREE.ColladaLoader();
                        loader.options.convertUpAxis = true;
                        loader.load(savedata.EQlines[i].Instance.ModelInfo.Dae.DaeLocation, function (collada) {
                            var dae = collada.scene;
                            var skin = collada.skins[0];
                            dae.position.set(0, 0, 0); //x,z,y- if you think in blender dimensions ;)
                            dae.scale.set(1, 1, 1);
                            object3d = dae.children[0];
                            object3d.userData.aircraft = false;
                            object3d.userData.name = savedata.EQlines[i].Instance.ModelInfo.Name;
                            object3d.userData.id = savedata.EQlines[i].Id;
                            if (savedata.EQlines[i].Position != null) {
                                object3d.matrixWorld = savedata.EQlines[i].Position;
                                object3d.rotation = savedata.EQlines[i].Rotation;
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
                            EventsControls1 = new EventsControls(camera, renderer.domElement);
                            EventsControls1.map = checkerboard;

                            EventsControls1.attachEvent('mouseOver', function () {
                                guifolder.open();
                                this.container.style.cursor = 'pointer';

                            });

                            EventsControls1.attachEvent('mouseOut', function () {
                                guifolder.close();
                                this.container.style.cursor = 'auto';

                            });
                            EventsControls1.attachEvent('dragAndDrop', function () {
                                controls.enabled = false;
                                this.container.style.cursor = 'move';
                            });

                            EventsControls1.attachEvent('mouseUp', function () {
                                controls.enabled = true;
                                this.container.style.cursor = 'auto';

                            });
                            EventsControls1.attach(object3d);
                            object3d.updateMatrix();
                            // add the object to the scene
                            scene.add(object3d);

                            // add the helper
                            var helper = object3d.userData.helper;
                            helper.name = "collider";
                            scene.add(helper);

                            // add rotation controlls
                            var left = {
                                left: function () {
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
                                    console.log(object3d.rotation);
                                }
                            };
                            var right = {
                                right: function () {
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
                            };
                            var remove = {
                                remove: function () {
                                    object3d.remove(collider);
                                    object3d.remove(helper);
                                    scene.remove(object3d);
                                    guifolder.remove(left, 'left');
                                    guifolder.remove(right, 'right');
                                    guifolder.remove(remove, 'remove');
                                }
                            };

                            guifolder.add(left, 'left');
                            guifolder.add(right, 'right');
                            guifolder.add(remove, 'remove');
                            guifolder.remove(add, 'add');
                        });
                    }
                };
                if (savedata.EQlines[i].Position.x !== null) {

                    obj.add();
                } else {
                    guifolder.add(add, 'add');
                }
            }
        }
    });


    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(50, 150, 100);

    ///let there be light
    var light = new THREE.PointLight(0xfffff3, 0.8);
    light.position.set(-100, 200, 100);
    scene.add(light);
    var sphereSize = 1;
    var pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
    scene.add(pointLightHelper);
    var light2 = new THREE.PointLight(0xd7f0ff, 0.2);
    light2.position.set(200, 200, 100);
    scene.add(light2);
    sphereSize = 1;
    var pointLightHelper2 = new THREE.PointLightHelper(light2, sphereSize);
    scene.add(pointLightHelper2);
    var light3 = new THREE.PointLight(0xFFFFFF, 0.5);
    light3.position.set(150, 200, -100);
    scene.add(light3);
    sphereSize = 1;
    var pointLightHelper3 = new THREE.PointLightHelper(light3, sphereSize);
    scene.add(pointLightHelper3);
    //////////////////////////////////////////////////////////////////////////////////
    //		Init camera controls
    //////////////////////////////////////////////////////////////////////////////////
    var controls = new THREE.OrbitControls(camera);
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


    var save = {
        save: function () {
            var savedAC = [];
            var savedEQ = [];
            var j = 0;
            var k = 0;
            for (var i = 0; i < scene.children.length; i++) {
                if (scene.children[i] instanceof THREE.Object3D) {
                    if (!(scene.children[i] instanceof THREE.PointLight) && !(scene.children[i] instanceof THREE.PointLightHelper) && scene.children[i].name != "floor" && scene.children[i].name != "collider") {
                        if (scene.children[i].userData.aircraft === true) {
                            console.log(scene.children[i].name);
                            savedAC[j] = {
                                id: scene.children[i].userData.id,
                                position: scene.children[i].matrixWorld,
                                rotation: scene.children[i].rotation
                            };
                            j++;
                        } else {
                            savedEQ[k] = {
                                id: scene.children[i].userData.id,
                                position: scene.children[i].matrixWorld,
                                rotation: scene.children[i].rotation
                            };
                            k++;
                        }
                    }
                }
            }
            var hangarsave;
            hangarsave.startTime = startTime;
            hangarsave.endTime = endTime;
            hangarsave.hangarId = hangarId;
            hangarsave.savedAC = savedAC;
            hangarsave.savedEQ = savedEQ;
            var json = JSON.stringify(hangarsave);
            $.post("/api/rendersave", json, function (data, status) {
                console.log("save done");
            });
        }
    };
    //add gui

    gui.add(save, 'save');
    //////////////////////////////////////////////////////////////////////////////////
    //		update all object3d
    //////////////////////////////////////////////////////////////////////////////////
    onRenderFcts.push(function () {
        var objects = [];
        // traverse the scene and update object with colliders
        scene.traverse(function (object3d) {
            if (object3d.userData.collider === undefined) return;
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
    //////////////////////////////////////////////////////////////////////////////////
    var lastTimeMsec = null;
    requestAnimationFrame(function animate(nowMsec) {
        // keep looping
        requestAnimationFrame(animate);
        // call each update function
        onRenderFcts.forEach(function (onRenderFct) {
            onRenderFct();
        });
    });
    console.log(savedata);
}
