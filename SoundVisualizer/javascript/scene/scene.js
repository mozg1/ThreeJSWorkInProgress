/**
 * Created by Alexander Zorin on 21.06.2016.
 *
 * Wichtigstens Animationsmodul
 * verwaltet Objekterstellungs, Animations- und Löschmethoden
 *
 */


/* requireJS module definition */
define(["three",
        "sphereMain",
        "shape",
        "fftLines",
        "plane",
        "backgroundParticle",
        "curve",
        "orbitalSphere",
        "star",
        "octahedron",
        "pyramid",
        "TParametric",
        "frontalPlane",
        "frontRay",
        "ray",
        "torus",
        "torusKnot",
        "circleWave",
        "connectingline",
        "floor",
        "orbitcontrols"],
    (function(THREE,

              SphereMain, Shape, fftLines, Plane, backgroundParticle, Curve, OrbitalSphere, Star, Octahedron, Pyramid, TParametric, FrontalPlane, FrontRay, Ray, Torus, TorusKnot, CircleWave, Connectingline, Floor, Orbitcontrols) {

        "use strict";

        /*
         * Scene constructor
         */
        var Scene = function(renderer, width, height) {

            // the scope of the object instance basically means the viewport
            var scope = this;

            /**
             * Initialisiere den WebGL Rendererer
             */
            scope.renderer = renderer;
            scope.t = 0.0;

            /**
             * Initialisiere neue Perspektivische Kamera, mit Sichtfeld von 45 Grad, Seitenverhältnis 1920/1080 und Sichtweite 0.1-40000
             * @type {THREE.PerspectiveCamera}
             */

            scope.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 40000);
            scope.camera.position.x = 0;
            scope.camera.position.y = 0;
            scope.camera.position.z = 2000;
            scope.camera.lookAt(new THREE.Vector3(0,0,0));

            /**
             * Erstelle neues Scene Objekt zum Verwalten
             * @type {THREE.Scene}
             */
            scope.scene = new THREE.Scene();

            renderer.setClearColor(new THREE.Color(0x000000));

            /**
             * Erstelle Lichter
             */
            this.createLight = function(){
                var aLight = new THREE.AmbientLight(0xFFFFFF);
                var dLight = new THREE.DirectionalLight(0xFFFFFF, 1, 1000);
                dLight.position.set(-1,0,-1);
                scope.scene.add(aLight);
                scope.scene.add(dLight);
            };

            /**
             * Erstelle Stats.js Panel
             * @type {Stats}
             */
            // 0: fps, 1: ms, 2: mb, 3+: custom
            var stats = new Stats();
            stats.showPanel( 0 );

            document.body.appendChild( stats.dom );

            /**
             * MAIN CONTROL FUNCTIONS
             */

            /**
             * Zeichne die Szene mithilfe der Methoden renderer.render() und requestAnimationFrame()
             * Zeige außerdem
             */
            this.draw = function () {
                stats.begin();
/*
                setTimeout( function() {

                    requestAnimationFrame(scope.draw);

                }, 1000 / 30 );
*/
                scope.renderer.render(scope.scene, scope.camera);
         //       controls.update();
                if(scope.shouldAnimate == true) {
                    animate()
                }

                requestAnimationFrame(scope.draw);

                stats.end();

            };

            var fftLinesArray = [];

            /**
             * Füge ein Objekt zur Szene hinzu
             * @param object dessen Mesh hinzugefügt wird
             * @param position aus einem 3-stelligen Positionsarray
             */

            this.addMesh = function (object, position) {

                var mesh = object.getMesh();
                mesh.position.set(position[0], position[1], position[2]);
                scope.scene.add(mesh);

                if(mesh.name == "fftLinesMesh") {
                    console.log("added freqDomain");
                    fftLinesArray.push(object);
                }

            };


            var levelHistory = [];
            /**
             * wird durch die Betätigung der Start oder Select Input Tasten verändert
             * @type {boolean}
             */
            scope.shouldAnimate = false;

            var startTime;
            var duration;
            var mainObjectDuration;
            var currentMainObject = [];

            var mainObjectTimer;
            var shootDirection;

            /**
             * Setze ein Startobjekt als zentrales Hauptobjekt
             * @param obj
             */
            this.initializeMainObject = function(obj) {
                currentMainObject.push(obj);
            };

            /**
             * Setzt den Animationsflag auf true
             * Im Falle einer Musikdatei, berechne aus der Dateilänge die Länge der Lebdauer eines Zyklus von einem
             * zentralen Hauptobjekt, und tausche die Objekte nach ABlauf dieser Zeit hintereinander aus, indem
             * immer auf das aktuelle Objekt geprüft wird
             */
            this.activateAnimation = function() {
                if(micAllowed) {
                    scope.shouldAnimate = true;

                    return;
                }
                // set startTime in seconds
                startTime = Math.round(window.performance.now()/1000);
                // round duration to whole seconds
                duration = Math.round(getSongLength());
                // set duration of each main object in scene
                mainObjectDuration = Math.round(duration/20);
                scope.shouldAnimate = true;


                mainObjectTimer = setInterval(function() {
                        console.log("mainchanger " + duration + " " + mainObjectDuration + " current: " + (Math.round(window.performance.now()/1000) - startTime));

                    if(currentLevel != 0) {


                        switch (currentMainObject[0].mesh.name) {
                            case "mainSphereMesh" :
                                scope.scene.remove(currentMainObject[0].mesh);
                                currentMainObject.splice(0, 1);
                                currentMainObject.push(new TorusKnot());
                                scope.addMesh(currentMainObject[0], [0, 0, -250]);

                                console.log(currentMainObject);

                                break;

                            case "mainTorusKnotMesh" :
                                scope.scene.remove(currentMainObject[0].mesh);
                                currentMainObject.splice(0, 1);
                                currentMainObject.push(new Pyramid());
                                currentMainObject.push(new Pyramid());
                                currentMainObject.push(new Pyramid());

                                scope.addMesh(currentMainObject[0], [-300, 0, -250]);
                                scope.addMesh(currentMainObject[1], [0, 0, -250]);
                                scope.addMesh(currentMainObject[2], [300, 0, -250]);

                                console.log(currentMainObject);

                                break;

                            case "mainPyramidMesh" :
                                scope.scene.remove(currentMainObject[0].mesh);
                                scope.scene.remove(currentMainObject[1].mesh);
                                scope.scene.remove(currentMainObject[2].mesh);
                                currentMainObject.splice(0, 1);
                                currentMainObject.splice(1, 1);
                                currentMainObject.splice(2, 1);
                                currentMainObject = [];

                                currentMainObject.push(new Torus());
                                scope.addMesh(currentMainObject[0], [0,0,-250]);

                                console.log(currentMainObject);

                                break;

                            case "mainTorusMesh" :
                                scope.scene.remove(currentMainObject[0].mesh);
                                currentMainObject.splice(0, 1);
                                currentMainObject.push(new SphereMain());
                                scope.addMesh(currentMainObject[0], [0, 0,-250]);

                                break;
                        }
                    }
                }, mainObjectDuration*1000);

            };

            this.deactivateAnimation = function() {
                scope.shouldAnimate = false;
                clearInterval(mainObjectTimer);
            };

            /**
             * Kameraanimationsmethoden. Bei aktivierter Kameraanimation, wird die Kamera weg von den FFT-Lines gedreht
             * @type {boolean}
             */

            scope.animateCamera = false;

            this.activateCameraAnimation = function() {
                scope.camera.position.z = scope.camera.position.z*(-1);
                scope.animateCamera = true;
                scope.camera.lookAt(new THREE.Vector3(0,0,0));
            };

            this.deactivateCameraAnimation = function() {
                scope.camera.position.z = scope.camera.position.z*(-1);
                scope.animateCamera = false;
                scope.camera.lookAt(new THREE.Vector3(0,0,0));
            };

            /**
             * Haupt-Animationsmethode
             */

            function animate() {

                if(!readyToPlay) {
                    return;
                }

                // Audio functionality
                getContinousAudioData();
                setLevel();
                checkLevel();
                detectKick();

                // camera animation
                animateCamera();
                checkCameraPosition();

                // main objects
                animateMainObject();
                visualizeLine();

                // environment objects
                animateFloor();
                drawFrequencyDomain();
                animateBackground();

                // particles
                animateSpiralParticles();
                animateBackgroundParticles();
                createAndShootContinousParticles();
                animateOrbit();
                eraseOrbit();

                // 3D-Objects
                animatePlanes();
        //        animateCurves();
                animate3DNoise();
                animatePoints();
                animateCircleWaves();
                animateParametric();

                // Rays
                moveSkyRays();
                shootFastRays();
                animateFrontalRays();
                flickerLight();

                // Garbage-Collector
                removeChecker();

            }

            var raysActive = true;
            var threeDObjects = true;
            var particlesActive = true;
            var envObjectsActive = true;
            var mainObjectsActive = true;

            /**
             *
             * LEVEL MEMORY LOOP
             *
             */

            var currentLevel;

            /**
             * Lies freqAverage aus und setze eine Pegelstufe
             */
            function setLevel() {

                if(freqAverage < 0.1) {
                    currentLevel = 0;
                } else if (freqAverage >= 0.1 && freqAverage < 0.16) {

                    currentLevel = 1;

                } else if (freqAverage >= 0.16 && freqAverage < 0.20) {

                    currentLevel = 2;

                } else if (freqAverage >= 0.20 && freqAverage < 0.24) {

                    currentLevel =3;

                } else if(freqAverage >= 0.24 && freqAverage < 0.28) {

                    currentLevel = 4;

                } else if (freqAverage >= 0.28 && freqAverage < 0.31) {

                    currentLevel = 5;

                } else if(freqAverage >= 0.31 && freqAverage < 0.33) {

                    currentLevel = 6;

                } else if(freqAverage >= 0.33 && freqAverage < 0.35) {

                    currentLevel = 7;

                } else if(freqAverage >= 0.35 && freqAverage < 0.40) {

                    currentLevel = 8;

                } else if(freqAverage >= 0.40 && freqAverage < 0.45) {

                    currentLevel = 9;

                } else if(freqAverage >= 0.45 && freqAverage < 0.52) {

                    currentLevel = 10;

                } else if(freqAverage >= 0.52 && freqAverage < 0.60) {

                    currentLevel = 11;
                }
            }

            /**
             * Pegelstufen als abstrahierter durchschnittlicher Gesamtpegel
             * @type {number}
             */

            var L0 = 0;
            var L1 = 1;
            var L2 = 2;
            var L3 = 3;
            var L4 = 4;
            var L5 = 5;
            var L6 = 6;
            var L7 = 7;
            var L8 = 8;
            var L9 = 9;

            /**
             * Switches
             * @type {boolean}
             */
            var levelZeroActive = false;
            var levelOneActive = false;
            var levelTwoActive = false;
            var levelThreeActive = false;
            var levelFourActive = false;
            var levelFiveActive = false;
            var levelSixActive = false;
            var levelSevenActive = false;
            var levelEightActive = false;
            var levelNineActive = false;
            var levelTenActive = false;
            var levelElevenActive = false;


            /**
             * Haupt LML-Methode
             * Verwaltet Animation, Objekterstellung, Switches, Flags
             */
            function checkLevel() {

                switch(currentLevel) {
                    case 0 :
                        levelZeroActive = true;
                        stopRayAnimation("sky");
                        scope.createOrbitSpheres();
                        scope.createBackground();

                //        console.log("level 0 ");
                        levelHistory.push(L0);
                        break;
                    case 1 :
                        levelOneActive = true;
                        levelFourActive = false;
                        levelThreeActive = false;

                //        console.log("level 1");
                        levelHistory.push(L1);
                        break;

                    case 2 :
                        levelTwoActive = true;
                        levelFiveActive = false;

                        scope.create3DNoise();

                //        console.log("level 2");
                        levelHistory.push(L2);
                        break;

                    case 3 :
                        levelThreeActive = true;
                        levelSixActive = false;
                        levelSevenActive = false;

                        skyRays = true;
                        stroboActive = false;

                        scope.createBackgroundParticles();
                        scope.createSkyRays();

                        createParametric();

                //        console.log("level 3");
                        levelHistory.push(L3);
                        break;

                    case 4 :
                        levelFourActive = true;
                        levelTwoActive = false;
                        levelEightActive = false;


                        stopRayAnimation("fast");
                        deleteCircleWaves();

                        scope.createSpiral();
                        scope.createPoints();

                //        console.log("level 4");
                        levelHistory.push(L4);
                        break;

                    case 5 :
                        levelFiveActive = true;
                        levelNineActive = false;

                        stopRayAnimation("sky");

                        scope.createPlanes();
                        createParametric();

                //        console.log("level 5");
                        levelHistory.push(L5);
                        break;

                    case 6 :
                        levelSixActive = true;
                        levelFourActive = false;
                        levelFiveActive = false;

                //        console.log("level 6");
                        levelHistory.push(L6);
                        break;

                    case 7 :
                        levelSevenActive = true;
                        levelFiveActive = false;

                        stroboActive = false;
                        shootContinousParticles = false;

                        scope.createCircleWaves();
                        createFrontalRays();

                //        console.log("level 7");
                        levelHistory.push(L7);
                        break;

                    case 8 :
                        levelEightActive = true;
                        levelSixActive = false;
                        levelTenActive = false;
                        fastRays = true;
                        shootContinousParticles = true;

                        scope.createFastRays();

                //        console.log("Level 8");
                        levelHistory.push(L8);
                        break;

                    case 9 :
                        levelNineActive = true;
                        stroboActive = true;

                //        console.log("level 9");
                        levelHistory.push(L9);
                        break;

                    case 10 :
                        levelTenActive = true;

                //        console.log("level 10");
                        break;

                    case 11 :
                //        console.log("wow"); // kam bisher noch nie Zustande!
                        levelElevenActive = true;
                        break;

                }

            }

            /**
             * Untersucht die levelHistory auf die angegebene Anzahl an Stellen, minimal so viele wie bereits geschrieben
             * wurden, maximal 1000
             * @param peak Pegelstufe
             * @param historySize Memory-Größe
             * @returns {number} Das quantitative Vorkommen einer Pegelstufe
             */
            function checkForPeaks(peak, historySize) {
                // if no historySize specified, make sure either only last 1000 states are checked, or as many as have
                // yet been present
                if(historySize > 1000 || historySize < 0 || historySize == undefined) {
                    historySize = levelHistory.length;
                }
                // make sure only the last 1000 levels are present
                if(levelHistory.length > 1000) {
                    levelHistory.splice(0,1);
                }

                var peakcontained = 0;

                for(var i= levelHistory.length-historySize; i<levelHistory.length; i++) {
                    if(levelHistory[i] == peak) {
                        peakcontained++;
                    }
                }

                return peakcontained;
            }

            /**
             * ANIMATION / VISUALIZATION
             */

            var currentColorMode = 0;

            /**
             * Farbmodi mit RGB-Farbexponenten
             * @type {*[]}
             */
            var colorArray = [ [ [5, 6, 8],
                [4, 5, 8],
                [3, 6, 4.5],
                [1.2, 4.5, 2.2],
                [2.5, 5, 1],
                [2, 4, 2],
                [3, 3, 1.7],
                [3, 1.5, 0.5],
                [3, 1, 1.5],
                [2, 1.5, 2.5],
                [1.5, 1, 2] ],

                [ [5, 6, 8],
                    [4, 5, 8],
                    [3, 4, 4.5],
                    [2, 3, 4],
                    [1.5, 2.5, 4],
                    [1.5, 3, 3.5],
                    [2, 2, 3],
                    [2, 2.5, 3],
                    [2.5, 2.5, 2],
                    [2, 2, 1],
                    [1.5, 1, 2] ],

                [ [8, 6, 5],
                    [8, 5, 4],
                    [5, 4, 3],
                    [4, 3, 2],
                    [5, 2.5, 2.5],
                    [4, 2, 4],
                    [3, 1.5, 2.5],
                    [2.5, 1, 2],
                    [2, 1.5, 2],
                    [2, 2, 1.5],
                    [1.5, 1, 2] ] ];


            /**
             * Setze Farbmodus
             * @param mode - value between 0 and 2
             */
            this.setCurrentMode = function(mode) {
                currentColorMode = mode;
                console.log(currentColorMode);
            };

            /**
             * Lies entsprechende Farbe zum Modus aus
             * @param mode
             * @param level
             * @returns {THREE.Color}
             */
            function setCurrentColor(mode, level) {
                var r = colorArray[mode][level][0];
                var g = colorArray[mode][level][1];
                var b = colorArray[mode][level][2];
                return new THREE.Color(freqAverage*r, freqAverage*g, freqAverage*b);
            }


            // call this.function with scope.function from normal functions

            /**
             * Zeichne das lineare Frequenzspektrum
             */
            function drawFrequencyDomain() {

                // TODO: Super Bug mit unauffindbarem getObjectById fftLinesMesh

                var fftLines;

                for(var i = 0; i<fftLinesArray.length;i++) {
                    if(fftLinesArray[i].mesh.name == "fftLinesMesh") {
                        fftLines = fftLinesArray[i];
                    }
                }

                if(!fftLines ) {
                    scope.addMesh(new fftLines(), [0,-200,0]);
                    console.log("created FFT")
                } else if(readyToPlay) {
                    var freqBytes = getAudioFreqData();
                    fftLines.setFrequencyPosition(freqBytes);
                    fftLines.line.geometry.verticesNeedUpdate = true;
                }

            }

            /**
             * Führe Audiovisualisierung auf der Oberfläche der Lines durch
             */
            function visualizeLine() {
                visualize(scope.scene.getObjectByName("line1"));
                visualize(scope.scene.getObjectByName("line2"));
            }


            /**
             * Führe Audiovisualisierung auf der Oberfläche eines angegebenen Hauptobjekts durch
             * Dreh das Objekt, sofern es sich nicht um eine Line handelt
             * Skaliere zusätzlich, wenn es sich um ein zentrales Hauptobjekt handelt
             * @param mesh
             */

            function visualize(mesh) {
                var displacement = mesh.geometry.attributes.displacement;

                if(mesh.name != "line1" && mesh.name != "line2")  {
                    if(freqAverage < 0.2) {
                        mesh.rotation.z += freqAverage*0.03;
                    } else if(freqAverage > 0.2 || freqAverage < 0.5) {
                        mesh.rotation.y += freqAverage*0.03;
                        mesh.rotation.z -= freqAverage*0.03;
                    } else {
                        mesh.rotation.x += freqAverage*0.04;
                        mesh.rotation.z += freqAverage*0.04;
                    }
                    mesh.material.uniforms.amplitude.value = freqAverage*3;
                }

                if (readyToPlay) {
                    var trueColor = setCurrentColor(currentColorMode, currentLevel);

        //            console.log(freqData.length)
        //            console.log(displacement.count)

                    for (var i = 0; i < displacement.count; i++) {
                        mesh.geometry.attributes.displacement.array[i] = (freqData[i]);
                        mesh.material.uniforms.color.value = trueColor;
                    }

                    if(mesh.name.indexOf("main") !== -1 && (levelFourActive || levelFiveActive || levelSixActive || levelSevenActive)) {
                        mesh.scale.set(freqAverage*5, freqAverage*5, freqAverage*5);
                    }


                    mesh.geometry.attributes.displacement.needsUpdate = true;
                }

                if (micAllowed) {
                    trueColor = setCurrentColor(currentColorMode, currentLevel);

                    for (i = 0; i < displacement.count; i++) {
                        mesh.geometry.attributes.displacement.array[i] = (freqData[i]);
                        mesh.material.uniforms.color.value = trueColor;
                    }

                    mesh.geometry.attributes.displacement.needsUpdate = true;
                }
            }

            /**
             * Animiere und führe Audiovisualisierung auf dem zentralen HAuptobjekt durch
             */

            function animateMainObject() {
                var obj;
                for(var i=0;i<currentMainObject.length;i++) {
                    obj = currentMainObject[i].mesh;
                    visualize(obj);
                }
            }

            /**
             * Visualisiere und animiere den Boden
             */

            function animateFloor() {
                var floor = scope.scene.getObjectByName("floorMesh");

                moveFloor();

                if(floor) {
                    var displacement = floor.geometry.attributes.displacement;

                    if (readyToPlay) {
                        for (var i = 0; i < displacement.count; i++) {
                            floor.geometry.attributes.displacement.array[i] = (freqData[i]*0.5);
                            floor.material.uniforms.color.value = new THREE.Color( freqAverage*2, freqAverage*2, freqAverage*8 );
                        }
                        floor.geometry.attributes.displacement.needsUpdate = true;
                    }
                }
            }

            function moveFloor() {
                var floor = scope.scene.getObjectByName("floorMesh");
                if(levelZeroActive || levelOneActive || levelTwoActive) {
                    floor.rotation.y += 0.001 * freqAverage;
                }
                if(levelThreeActive || levelFourActive || levelFiveActive) {
                    floor.rotation.y -= 0.002 * freqAverage;
                }
                if(levelSixActive || levelSevenActive || levelEightActive) {
                    floor.rotation.y -= 0.001 * freqAverage;
                }
                if(levelNineActive) {
                    floor.rotation.y += 0.001 * freqAverage;
                }
            }


            /**
             * Spiralenobjekt
             * @type {number}
             */

            var r = 10;
            var uSpiral = 257;
            var vSpiral = -50;

            var spiralParticleArray = [];

            this.createSpiral = function() {


                if(spiralParticleArray.length < 200) {
                    var particle = new Shape();

                    /**
                     * 200 archimedical spiral particles
                     */
                        this.addMesh(particle, [(uSpiral) * Math.cos(uSpiral), r * vSpiral, (uSpiral) * Math.sin(uSpiral)]);
                        var particleObject = {
                            object: particle,
                            uvangles: [uSpiral, vSpiral],
                            direction: 1
                        };

                        spiralParticleArray.push(particleObject);

                }
            };

            function animateSpiralParticles() {
                if(spiralParticleArray.length == 0) {
                    return;
                }


                if(!levelEightActive) {

                        for (var j = 0; j < spiralParticleArray.length; j++) {
                            if (spiralParticleArray[j].object.mesh.position.y > 500) {
                                console.log("spiralParticleArray[j]: " + spiralParticleArray[j].uvangles[0]);
                                spiralParticleArray[j].direction = 0;
                            } else if (spiralParticleArray[j].object.mesh.position.y < -500) {
                                spiralParticleArray[j].direction = 1;
                            }

                            if (spiralParticleArray[j].direction == 0) {
                                spiralParticleArray[j].uvangles[0] -= 0.1;
                                spiralParticleArray[j].uvangles[1] -= 0.1;

                            } else {
                                spiralParticleArray[j].uvangles[0] += 0.1;
                                spiralParticleArray[j].uvangles[1] += 0.1;
                            }

                            var u = spiralParticleArray[j].uvangles[0];
                            var v = spiralParticleArray[j].uvangles[1];

                        //    u += freqAverage*10;

                            spiralParticleArray[j].object.mesh.position.set((u) * Math.cos(u), r * v, (u) * Math.sin(u));

                            spiralParticleArray[j].object.mesh.material.color.r = freqAverage*2;
                            spiralParticleArray[j].object.mesh.material.color.g = freqAverage*2;

                        }

                } else {
                        shootSpiralParticles(spiralParticleArray);
                }

            }

            function checkCameraPosition() {
                if(scope.camera.position.z < 0) {
                    shootDirection = -1;
                } else {
                    shootDirection = 1;
                }
            }

            function shootSpiralParticles() {
                if(spiralParticleArray.length == 0) {
                    return;
                }

                for (var j = 0; j < spiralParticleArray.length; j++) {

                    var x = spiralParticleArray[j].object.mesh.position.x;
                    var y = spiralParticleArray[j].object.mesh.position.y;
                    var z = spiralParticleArray[j].object.mesh.position.z;
                    var redPart = spiralParticleArray[j].object.mesh.material.color.r;
                    if(redPart < 0.5) {
                        spiralParticleArray[j].object.mesh.material.color.r += 0.01;
                        spiralParticleArray[j].object.mesh.material.color.g = 0;
                    } else {
                        spiralParticleArray[j].object.mesh.material.color.r = 0;
                        spiralParticleArray[j].object.mesh.material.color.g += 0.01;
                    }


                    spiralParticleArray[j].object.mesh.position.set(x+=freqAverage*getRandomArbitrary(-90,80), y+=freqAverage*getRandomArbitrary(-20,70), z+=freqAverage*90*shootDirection);
                }
            }

            /**
             * Planetenobjekte
             * @type {Array}
             */

            var orbitalSphereArray = [];
            var orbitRadius = 25;

            this.createOrbitSpheres = function() {

                if(orbitalSphereArray.length < 9 && checkForPeaks(0) % 100 == 0) {
                    var radius = getRandomArbitrary(5,15);
                    var speed = getRandomArbitrary(0.01, 0.05);
                    var color =  new THREE.Color(getRandomArbitrary(0,0.4), getRandomArbitrary(0,0.6), getRandomArbitrary(0.3,0.8));
                    var orbSphere = new OrbitalSphere(radius, color, 0.5);
                    orbitRadius += orbitRadius + getRandomArbitrary(25,80);
                    var x=0; var y=0; var z = 0;
                    var planet = {
                        object: orbSphere,
                        orbitRadius: orbitRadius,
                        position: [x,y,z],
                        speed: speed
                    };
                    if(orbitRadius > 300) {
                        orbitRadius = 50;
                    }
                    scope.addMesh(planet.object, [planet.orbitRadius*Math.cos(planet.position[0]), planet.position[1], planet.orbitRadius*Math.sin(planet.position[2])-250]);
                    orbitalSphereArray.push(planet);
                }
            };

            function animateOrbit() {
                if((levelZeroActive || levelOneActive || levelTwoActive) && orbitalSphereArray.length != 0) {
                    for(var i=0; i<orbitalSphereArray.length; i++) {

                        orbitalSphereArray[i].position[0] += orbitalSphereArray[i].speed;
                        var x = orbitalSphereArray[i].position[0];
                        var y = orbitalSphereArray[i].position[1];
                        orbitalSphereArray[i].position[2] += orbitalSphereArray[i].speed;
                        var z = orbitalSphereArray[i].position[2];

                        orbitalSphereArray[i].object.mesh.position.set(orbitalSphereArray[i].orbitRadius*Math.cos( x ), y, orbitalSphereArray[i].orbitRadius*Math.sin( z )-250);
                    }
                }
            }

            function eraseOrbit() {
                if(orbitalSphereArray.length == 0) {
                    return;
                }
                if(levelThreeActive || levelFourActive) {
                    for(var i=0; i<orbitalSphereArray.length; i++) {
                        orbitalSphereArray[i].object.mesh.material.opacity -= 0.01;
                    }
                }
                if(levelFiveActive || orbitalSphereArray[0].object.mesh.material.opacity < 0.1) {
                    for(i=0; i<orbitalSphereArray.length; i++) {
                        scope.scene.remove(orbitalSphereArray[i].object.mesh);
                        orbitalSphereArray.splice(i, 1);
                    }
                }
            }
/*
            var curveArray = [];

            var cx1 = -20;
            var cx2 = -10;
            var cx3 = 10;
            var cx4 = -10;
            var cy1 = -5;
            var cy2 = 20;
            var cy3 = 20;
            var cy4 = -5;

            this.createCurves = function() {
                var curve = new Curve();
                this.addMesh(curve, [0,0,1500]);
                curveArray.push(curve);
            };

      //      Kreis: x = 20*Math.cos(x) + factor, y+=1 z = 20*Math.sin(z) + factor


            function animateCurves() {
                if(curveArray.length == 0) {
                    return;
                }
                    var i = 0;
                    cx1 += 0.1;
                    cx2 += 0.1;
                    cx3 += 0.1;
                    cx4 += 0.1;
                    cy1 += 0.1;
                    cy2 += 0.1;
                    cy3 += 0.1;
                    cy4 += 0.1;

                    curveArray[i].curve = new THREE.CubicBezierCurve3(
                        new THREE.Vector3(  -5, 20*Math.cos(cx1),20*Math.cos(cy1) ),
                        new THREE.Vector3(20,  20*Math.cos(cx2), 20*Math.cos(cy1) ),
                        new THREE.Vector3(  20,20*Math.cos(cx3), 20*Math.cos(cy1) ),
                        new THREE.Vector3(  -5 ,20*Math.cos(cx4)), 20*Math.cos(cy1));
                    curveArray[i].curve.needsUpdate = true;
                    curveArray[i].geometry.verticesNeedUpdate = true;
                    curveArray[i].geometry.vertices = curveArray[i].curve.getPoints( 100 );
            }
*/
            /**
             * Strahlenobjekte
             * @type {Array}
             */

            var skyRayArray = [];
            var fastRayArray = [];

            var skyRayX = -100;
            var skyRayY = 200;
            var skyRayZ = -1000;

            this.createSkyRays = function() {
                //       20*Math.cos(x) + factor, y+=1 z = 20*Math.cos(skyRayZ) + factor
                if(skyRayArray.length < 20) {
                    var rayL = new Ray();
                    rayL.geometry.applyMatrix(new THREE.Matrix4().makeRotationY((-5)));
                    var rayR = new Ray();
                    rayR.geometry.applyMatrix(new THREE.Matrix4().makeRotationY((-7)));

                    var x = 20*Math.cos(skyRayX);
                    var y = 20*Math.sin(skyRayZ);

                    this.addMesh(rayL, [x+=100,y+=100,skyRayZ+=100]);
                    skyRayArray.push(rayL);

                    this.addMesh(rayR, [x,y,skyRayZ]);
                    skyRayArray.push(rayR);

                }

            };

            var rayPos = 0;
            var fastRays = false;
            var skyRays = false;

            function moveSkyRays() {
                if (skyRays) {
                    if (skyRayArray.length == 0) {
                        return;
                    }
                    fastRays = false;
                    for (var i = 0; i < skyRayArray.length; i++) {
                        skyRayArray[i].mesh.position.x += 200*Math.cos(skyRayArray[i].mesh.position.x);
                        skyRayArray[i].mesh.position.y += 1;
                        skyRayArray[i].mesh.position.z += 200*Math.sin(skyRayArray[i].mesh.position.z);

                        skyRayArray[i].mesh.material.opacity = freqAverage*2;
                        skyRayArray[i].mesh.material.color.setRGB(freqAverage*2, freqAverage*2, freqAverage*4);
                    }
                }
            }

            this.createFastRays = function() {
                if(fastRayArray.length < 20) {
                    var ray = new Ray();
                    var fastRay = {
                        object: ray,
                        direction: 0
                    };
                    ray.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI));

                    this.addMesh(ray, [0,100,500]);
                    fastRayArray.push(fastRay);
                }
            };


            function shootFastRays() {
                if (fastRays == true) {
                    if (fastRayArray.length == 0) {
                        return;
                    }
                    skyRays = false;
                    for (var i = 0; i < fastRayArray.length; i++) {

                        fastRayArray[i].object.mesh.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(rayPos += 0.1));

                        if(fastRayArray[i].direction == 1) {
                            fastRayArray[i].object.mesh.position.set(fastRayArray[i].object.mesh.position.x, fastRayArray[i].object.mesh.position.y+=1, fastRayArray[i].object.mesh.position.z);
                        }
                        if(fastRayArray[i].direction == 0) {
                            fastRayArray[i].object.mesh.position.set(fastRayArray[i].object.mesh.position.x, fastRayArray[i].object.mesh.position.y-=1, fastRayArray[i].object.mesh.position.z);
                        }

                        if(fastRayArray[i].object.mesh.position.y == 0) {
                            fastRayArray[i].direction = 1;
                        }
                        if(fastRayArray[i].object.mesh.position.y == 100) {
                            fastRayArray[i].direction = 0;
                        }

                        fastRayArray[i].object.mesh.material.opacity = freqAverage*1.5;
                    }
                }
            }

            function stopRayAnimation(form) {
                if(form == "fast") {
                    fastRays = false;
                    for(var i=0;i<fastRayArray.length;i++) {
                        scope.scene.remove(fastRayArray[i].object.mesh);
                    }
                    fastRayArray = [];
                }
                if(form == "sky") {
                    skyRays = false;
                    for(i=0;i<skyRayArray.length;i++) {
                        scope.scene.remove(skyRayArray[i].mesh);
                    }
                    skyRayArray = [];

                    skyRayX = -100;
                    skyRayY = 100;
                    skyRayZ = -1000;
                }
            }

            /**
             * Oktaeder
             * @type {Array}
             */

            var TDNoiseArray = [];
            var TDposY = 1000;

            this.create3DNoise = function() {
                if(TDNoiseArray.length < 35 && checkForPeaks(2) % 3 == 0) {
                    var octahedron = new Octahedron();
                    octahedron.mesh.material.opacity = freqAverage*1.5;

                    if(TDposY < -1000) {
                        TDposY = 1200;
                    }
                    this.addMesh(octahedron, [10000, TDposY-=200, getRandomArbitrary(-10000, -1000)]);

                    TDNoiseArray.push(octahedron);
                }
            };

            function animate3DNoise() {
                if (TDNoiseArray.length == 0) {
                    return;
                }

                for(var i = 0; i<TDNoiseArray.length; i++) {
                    TDNoiseArray[i].mesh.position.x -= 100 * freqAverage;
                    TDNoiseArray[i].mesh.rotation.z += freqAverage;
                    TDNoiseArray[i].mesh.rotation.y += 0.1
                }
            }

            /**
             * Planes
             * @type {Array}
             */

            var planeArray = [];

            this.createPlanes = function() {
                /**
                 * 50 planes, 25 right, 25 left
                 */
                if(planeArray.length < 50) {

                    var x = -1300;
                    var y = -250;
                    var z = 0;
                    var plane = new Plane();
                    plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / Math.random()*10));
                    plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI / Math.random()*10));
                    plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(-Math.PI / Math.random()*10));

                    if(planeArray.length%2 == 0) {
                        // Stellen 0,2,4 etc. beinhalten linke Planes
                        this.addMesh(plane, [getRandomArbitrary(x,-600),getRandomArbitrary(y, 450), getRandomArbitrary(z, 700)]);
                    } else {
                        // Stellen 1,3,5 etc. beinhalten rechte Planes
                        this.addMesh(plane, [getRandomArbitrary(x*(-1),600),getRandomArbitrary(y, 450), getRandomArbitrary(z, 700)]);
                    }

                    planeArray.push(plane);

                }
            };


            function animatePlanes() {
                if(planeArray != 0) {
                    for(var i=0; i<planeArray.length; i++) {

                        var color = getRandomArbitrary(70,160);

                        if(levelSixActive || levelFiveActive) {
                            color = rgbToHex(color/3,color/2,color);
                            planeArray[i].mesh.material.color.setHex(color);
                        }
                        if(levelEightActive || levelSevenActive) {
                            color = rgbToHex(0,20,color);
                            planeArray[i].mesh.material.color.setHex(color);
                        }

                        var position = freqAverage * 10 * Math.random();

                        if(i%2 == 0) {
                            // linke Planes
                            planeArray[i].mesh.position.x += position;
                        } else {
                            // rechte Planes
                            planeArray[i].mesh.position.x -= position;
                        }
                        planeArray[i].mesh.position.y += position;
                        planeArray[i].mesh.position.z += position;

                        var scaleFactor = freqAverage*2;

                        planeArray[i].mesh.scale.set(scaleFactor,scaleFactor,scaleFactor);
                        planeArray[i].mesh.material.opacity = freqAverage*2;
                    }
                }
            }

            /**
             * Connecting Points / Connecting Lines
             * @type {Array}
             */

            var pointArray = [];
            var pointCounter = 0;

            this.createPoints = function() {
                if(pointArray.length < 15) {

                    var shape = new Shape();
                    if(pointCounter == 45) {
                        pointCounter = 0;
                    }
                    var connectObject = {
                        object : shape,
                        id: pointCounter++,
                        direction : Math.round(getRandomArbitrary(0,3))
                    };

                    if(scope.camera.position.z < 0) {
                        var shape2 = new Shape();

                        var connectObject2 = {
                            object : shape2,
                            id: pointCounter++,
                            direction : Math.round(getRandomArbitrary(0,3))
                        };

                        this.addMesh(shape, [getRandomArbitrary(-800,800), getRandomArbitrary(-350, 350), -1000]);
                        this.addMesh(shape2, [getRandomArbitrary(-800,800), getRandomArbitrary(-350, 350), 1000]);
                        pointArray.push(connectObject);
                        pointArray.push(connectObject2);


                    } else {
                        this.addMesh(shape, [getRandomArbitrary(-800,800), getRandomArbitrary(-350, 350), 1000]);
                        pointArray.push(connectObject);

                    }
                }
            };

            function animatePoints() {

                if((levelFourActive || levelThreeActive)) {
                        for(var i=0; i<pointArray.length; i++) {
                            var shapeSpeed = getRandomArbitrary(1,4) * freqAverage;
                            if(pointArray[i].direction == 0) {
                                pointArray[i].object.mesh.position.x -= shapeSpeed;
                                pointArray[i].object.mesh.position.y -= shapeSpeed;
                            } else if(pointArray[i].direction == 1) {
                                pointArray[i].object.mesh.position.x += shapeSpeed;
                                pointArray[i].object.mesh.position.y += shapeSpeed;
                            } else if(pointArray[i].direction == 2) {
                                pointArray[i].object.mesh.position.x -= shapeSpeed;
                                pointArray[i].object.mesh.position.y += shapeSpeed;
                            } else if(pointArray[i].direction == 3) {
                                pointArray[i].object.mesh.position.x += shapeSpeed;
                                pointArray[i].object.mesh.position.y -= shapeSpeed;
                            }
                            if(pointArray[i].object.mesh.position.x >1150 || pointArray[i].object.mesh.position.x < -1150 || pointArray[i].object.mesh.position.y < -550 || pointArray[i].object.mesh.position.y > 550 ) {
                                scope.scene.remove(pointArray[i].object.mesh);
                                pointArray.splice(i,1);
                            }
                        }
                        calculatePointPosition();
                } else {
                    for(i=0;i<pointArray.length;i++) {
                        scope.scene.remove(pointArray[i].object.mesh);
                        pointArray.splice(i,1);
                    }

                    for(i=0;i<connectingLinesArray.length;i++) {
                        scope.scene.remove(connectingLinesArray[i].object.line);
                        connectingLinesArray.splice(i,1);
                    }
                }
            }

            function calculatePointPosition() {
                for(var i=0; i<pointArray.length; i++) {

                    for(var j=0;j<pointArray.length; j++) {
                        var xDiff;
                        var yDiff;
                        var point1; // von dem wir aus zeichnen
                        var point2; // zu dem wir hin zeichnen

                        if(pointArray[i].object.mesh.position.z == pointArray[j].object.mesh.position.z) {

                            if (pointArray[i].object.mesh.position.x > pointArray[j].object.mesh.position.x) {
                                xDiff = Math.round(pointArray[i].object.mesh.position.x - pointArray[j].object.mesh.position.x);
                                point1 = pointArray[j];
                                point2 = pointArray[i];
                            } else {
                                xDiff = Math.round(pointArray[j].object.mesh.position.x - pointArray[i].object.mesh.position.x);
                                point1 = pointArray[i];
                                point2 = pointArray[j];
                            }

                            yDiff = Math.round(point2.object.mesh.position.y - point1.object.mesh.position.y);

                            if ((xDiff > 5 && xDiff <= 200 && Math.abs(yDiff) <= 200)
                                && pointArray[j].object.geometry.uuid != pointArray[i].object.geometry.uuid /* && pointArray[j].connected == false && pointArray[i].connected == false */) {
                                var color = freqAverage * Math.random();
                                pointArray[i].object.mesh.material.color.setRGB(color * 2, color * 2, color * 8);
                                pointArray[j].object.mesh.material.color.setRGB(color * 2, color * 2, color * 8);

                                connectPoints(point1, point2, xDiff, yDiff);
                            } else {
                                disconnectPoints(point1, point2);
                            }

                        }
                    }
                }
            }

            var connectingLinesArray = [];

            function connectPoints(point1, point2, xDiff, yDiff) {
                if(connectingLinesArray.length != 0) {
                    for(var i=0; i<connectingLinesArray.length; i++) {
                        var color = freqAverage*Math.random();
                        connectingLinesArray[i].object.mesh.material.color.setRGB( color*4, color*4, color*8 );

                        if(connectingLinesArray[i].id == (point1.id +""+point2.id)) {
                            scope.scene.remove(connectingLinesArray[i].object.line);
                            connectingLinesArray.splice(i,1);
                        }

                    }
                }

                point1.object.mesh.material.color.setHex(0xffffff);
                point2.object.mesh.material.color.setHex(0xffffff);

                color = freqAverage*getRandomArbitrary(0.5,1);
                point1.object.mesh.material.color.setRGB( color*4, color*4, color*8 );
                point2.object.mesh.material.color.setRGB( color*4, color*4, color*8 );

                var connectingLine = new Connectingline(xDiff, yDiff);
                var clObject = {
                    object: connectingLine,
                    id: point1.id + "" + point2.id
                };

                connectingLine.mesh.material.color.setRGB( color*4, color*4, color*8 );

                connectingLinesArray.push(clObject);

                scope.addMesh(connectingLine, [point1.object.mesh.position.x, point1.object.mesh.position.y, point1.object.mesh.position.z]);

            }


            function disconnectPoints(particle1, particle2) {
                for(var i=0; i<connectingLinesArray.length;i++) {
                    if(connectingLinesArray[i].id == particle1.id + "" + particle2.id) {
                        scope.scene.remove(connectingLinesArray[i].object.line);
                        connectingLinesArray.splice(i,1);
                    }
                }
            }

            /**
             * Sternenhimmel
             */

            var starArray = [];

            this.createBackground = function() {
                if(checkForPeaks(0) % 100 == 0 && starArray.length < 2000) {
                    var radius = getRandomArbitrary(20,50);
                    var icosahedron = new Star(radius);
                    var star = {
                        object: icosahedron,
                        glow: true
                    };
                    scope.addMesh(star.object, [getRandomArbitrary(-40000,40000), getRandomArbitrary(0,15000), -20000]);
                    starArray.push(star);
                }
            };

            function animateBackground() {
                if(levelZeroActive || levelOneActive || levelTwoActive) {
                    for(var i=0; i<starArray.length; i++) {
                        if(starArray[i].glow == false) {
                            starArray[i].object.mesh.material.opacity -= 0.01
                        } else {
                            starArray[i].object.mesh.material.opacity += 0.01
                        }
                        if(starArray[i].object.mesh.material.opacity < 0.01) {
                            starArray[i].glow = true
                        }
                        if(starArray[i].object.mesh.material.opacity > 0.5) {
                            starArray[i].glow = false
                        }
                    }
                } else {
                    for(i=0;i<starArray.length; i++) {
                        scope.scene.remove(starArray[i].object.mesh);
                        starArray.splice(i,1);
                    }
                }

            }

            /**
             * langsame Partikel
             * @type {Array}
             */

            var backgroundNoiseArray = [];

            this.createBackgroundParticles = function() {
                var backPart = new backgroundParticle();
                backPart.mesh.material.color.setHex(0x00ff00);

                if(backgroundNoiseArray.length<500) {
                    scope.addMesh(backPart, [getRandomArbitrary(-1000,1000), getRandomArbitrary(-300,300), getRandomArbitrary(-1000, -2000)]);
                    backgroundNoiseArray.push(backPart);
                }
            };


            function animateBackgroundParticles() {
                if(backgroundNoiseArray.length == 0) {
                    return;
                }

                for(var i=0; i<backgroundNoiseArray.length; i++) {
                    backgroundNoiseArray[i].mesh.position.x += getRandomArbitrary(-5,5);
                    backgroundNoiseArray[i].mesh.position.y += getRandomArbitrary(-5,5);
                    backgroundNoiseArray[i].mesh.position.z += getRandomArbitrary(-5,5);
                }


                if(levelTwoActive) {
                    for (var j = 0; j < backgroundNoiseArray.length/3; j++) {

                        var x = backgroundNoiseArray[j].mesh.position.x;
                        var y = backgroundNoiseArray[j].mesh.position.y;
                        var z = backgroundNoiseArray[j].mesh.position.z;

                        backgroundNoiseArray[j].mesh.position.set(x += freqAverage * getRandomArbitrary(-1, 1), y += freqAverage * getRandomArbitrary(-5, 5), z += freqAverage * 500 * shootDirection);
                    }
                }

                if(levelSixActive) {
                    shootBackgroundNoise();
                }

                if(levelSevenActive) {
                    for(i=0; i<backgroundNoiseArray.length; i++) {
                        scope.scene.remove(backgroundNoiseArray[i].mesh);
                        backgroundNoiseArray.splice(i,1);
                    }
                }

            }

            function shootBackgroundNoise() {
                if(backgroundNoiseArray.length == 0) {
                    return;
                }

                for (var j = 0; j < backgroundNoiseArray.length; j++) {

                    var x = backgroundNoiseArray[j].mesh.position.x;
                    var y = backgroundNoiseArray[j].mesh.position.y;
                    var z = backgroundNoiseArray[j].mesh.position.z;

                    backgroundNoiseArray[j].mesh.position.set(x+=freqAverage*getRandomArbitrary(-1,1), y+=freqAverage*getRandomArbitrary(-3,3), z+=freqAverage*500*shootDirection);
                }

            }

            /**
             * Stroboskop
             * @type {boolean}
             */

            var stroboActive = false;
            scope.addMesh(new FrontalPlane(), [0,0,3005]);
            var frontalPlane = scope.scene.getObjectByName("frontalPlaneMesh");

            function flickerLight() {
                if(stroboActive) {
                    frontalPlane.position.z = 1500;
                    frontalPlane.material.opacity = 0.8;
                    frontalPlane.rotation.x += 3000 * freqAverage;
                } else {
                    frontalPlane.material.opacity = 0.0;
                    frontalPlane.position.z = 3005;
                }
            }

            /**
             * Vordergrundsstrahlen
             */

            var frontalRayArray = [];
            var frontalRayXRight = getRandomArbitrary(600,800);
            var frontalRayXLeft = frontalRayXRight*(-1);
            var frontalRayZ = 2500;
            var rotationDirection = 1;

            function createFrontalRays() {
                if(frontalRayArray.length < 6) {
                    var frontalRay1 = new FrontRay();
                    frontalRay1.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / 2 -10));
                    scope.addMesh(frontalRay1, [frontalRayXRight-= frontalRayXRight /2.5, 0, frontalRayZ-= frontalRayZ/3]);

                    frontalRayArray.push(frontalRay1);

                    var frontalRay2 = new FrontRay();
                    frontalRay2.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(-Math.PI / 2 + 10));
                    scope.addMesh(frontalRay2, [frontalRayXLeft-=frontalRayXLeft/2.5, 0, frontalRayZ]);

                    frontalRayArray.push(frontalRay2);

                }
            }

            function animateFrontalRays() {
                if(levelSevenActive && frontalRayArray.length != 0 && checkForPeaks(7, 500) > 30) {
                    var color = freqAverage*Math.random();

                    var RGcolor = getRandomArbitrary(2,4);
                    for(var i=0;i<frontalRayArray.length;i++) {
                        frontalRayArray[i].mesh.material.color.setRGB( color*RGcolor, color*RGcolor, color*8 );
                        frontalRayArray[i].mesh.material.opacity = freqAverage*1.5;
                        frontalRayArray[i].mesh.rotation.z += 0.1 * rotationDirection;

                        if(i+1 != frontalRayArray.length) {
                            frontalRayArray[i+=1].mesh.rotation.z -= 0.1 * rotationDirection;
                            frontalRayArray[i].mesh.material.color.setRGB( color*RGcolor, color*RGcolor, color*7 );
                            frontalRayArray[i].mesh.material.opacity = freqAverage*1.5;

                        }
                    }
                } else if(!levelSevenActive) {
                    for(i=0;i<frontalRayArray.length;i++) {
                        scope.scene.remove(frontalRayArray[i].mesh);
                        frontalRayArray.splice(i,1);
                        frontalRayXRight = 400;
                        frontalRayXLeft = -400;
                        frontalRayZ = 2500;
                    }

                }
            }

            /**
             * schnelle Partikel
             * @type {Array}
             */

            var continousParticlesArray = [];

            var shootContinousParticles = false;

            function createAndShootContinousParticles() {
                if (continousParticlesArray.length < 300 && shootContinousParticles && checkForPeaks(8) > 40) {
                    while (continousParticlesArray .length < 100) {
                        var continousParticle = new backgroundParticle();
                        if(checkForPeaks(8, 500) > 100) {
                            continousParticle.mesh.material.color.setHex(0xffffff);
                        } else {
                            continousParticle.mesh.material.color.setHex(0xffff99);
                        }

                        scope.addMesh(continousParticle, [getRandomArbitrary(-1000, 1000), getRandomArbitrary(-300, 300), getRandomArbitrary(-1000, -2000)]);
                        continousParticlesArray.push(continousParticle);
                    }
                }


                if(levelEightActive || levelSevenActive) {
                    for (var j = 0; j < continousParticlesArray.length; j++) {

                        var x = continousParticlesArray[j].mesh.position.x;
                        var y = continousParticlesArray[j].mesh.position.y;
                        var z = continousParticlesArray[j].mesh.position.z;

                        continousParticlesArray[j].mesh.position.set(x += freqAverage * getRandomArbitrary(-1, 1), y += freqAverage * getRandomArbitrary(-5, 5), z += freqAverage * 800);
                    }
                }

                if(levelSixActive) {
                    for(var i=0; i<continousParticlesArray.length; i++) {
                        scope.scene.remove(continousParticlesArray[i].mesh);
                        continousParticlesArray.splice(i,1);
                    }
                }
            }

            /**
             * Parametrische Fläche
             *
             */

            var parametricArray = [];

            function createParametric() {
                if(checkForPeaks(5)%20 == 0) {
                    if(parametricArray < 8) {
                        addParametric([getRandomArbitrary(-2000,-1000), getRandomArbitrary(-200, 200), getRandomArbitrary(-1000, -500)]);
                        addParametric([getRandomArbitrary(1000,2000), getRandomArbitrary(-200, 200), getRandomArbitrary(-1000, -500)]);
                    }
                }
            }

            function animateParametric() {
                if(parametricArray.length == 0) {
                    return;
                }
                for(var i=0;i<parametricArray.length;i++) {
                    parametricArray[i].mesh.scale.x += freqAverage * 0.1;
                    parametricArray[i].mesh.scale.y += freqAverage * 0.1;
                    parametricArray[i].mesh.scale.z += freqAverage * 0.1;

                    parametricArray[i].mesh.rotation.x += 0.1 * freqAverage;
                    parametricArray[i].mesh.rotation.y += 0.1 * freqAverage;
                    parametricArray[i].mesh.position.y += 0.1 * freqAverage;

                    var color = freqAverage*Math.random();
                    parametricArray[i].mesh.material.color.setRGB( color*3, color*3, color*8 );

                    if(parametricArray[i].mesh.material.opacity > 0.01) {
                        parametricArray[i].mesh.material.opacity -= 0.01;
                    } else {
                        scope.scene.remove(parametricArray[i].mesh);
                        parametricArray.splice(i,1);
                    }
                }

            }

            function addParametric(position) {
                var config = {
                    segments : 50,
                    umin : -8,
                    umax : 8,
                    vmin : -8,
                    vmax : 8
                };

                var a = 7;

                var posFunc = function(u0,v0) {
                    var u = config.umax * u0 + config.umin;
                    var v = config.vmax * v0 + config.vmin;
                    var x = Math.sinh(v) * Math.cos(a * u)/(1+Math.cosh(u) * Math.cosh(v));
                    var y = Math.sinh(v) * Math.sin(a * u)/(1+Math.cosh(u) * Math.cosh(v));
                    var z = Math.cosh(v) * Math.sinh(u)/(1+Math.cosh(u) * Math.cosh(v));

                    return new THREE.Vector3(x*30, y*30, z*30); // [x*300,y*300,z*300];
                };

                var obj = new TParametric(posFunc, 50);
                parametricArray.push(obj);
                scope.addMesh(obj, position);
            }

            /**
             * CircleWaves
             * @type {Array}
             */

            var circleWaveArray = [];

            var circleX = 899;
            var circleY = 399;

            this.createCircleWaves = function() {
                var positionFactor = getRandomArbitrary(0.5,1.5);

                circleX = circleX*positionFactor;
                circleY = circleX*positionFactor;

                if(circleWaveArray.length < 8) {
                    var circleWave = new CircleWave();
                    if(circleY < 400) {
                        circleY -= 100*positionFactor;
                    }
                    if(circleY < 0) {
                        circleY = 399;
                    }
                    if(circleX < -700) {
                        circleX = 899;
                    }

                    if(circleWaveArray.length == 0) {
                        scope.addMesh(circleWave, [circleX-=200,circleY,getRandomArbitrary(0,500)]);
                    } else {
                        scope.addMesh(circleWave, [circleX-=200,circleY,circleWaveArray[0].object.mesh.position.z]);
                    }

                    var circleWaveObject = {
                        object: circleWave,
                        checkCircleHeights: true,
                        changeCircleHeights: false
                    };

                    circleWaveArray.push(circleWaveObject);
                }

            };

            var circleT = 0;

            function animateCircleWaves() {
                if(circleWaveArray.length == 0) {
                    return;
                }

                    for(var i= 0, j=0; j<circleWaveArray.length; i++,j++) {
                        if(circleWaveArray[j].object != undefined) {
                            visualize(circleWaveArray[j].object.mesh);

                            if(levelNineActive) {
                                circleWaveArray[j].object.mesh.scale.set(freqAverage*4, freqAverage*4, freqAverage*4);
                            }
                        }

                        if(circleWaveArray[i+1] != undefined) {
                            if(circleWaveArray[i+1].object != undefined) {

                                if (circleWaveArray[i].checkCircleHeights) {
                                    if (circleWaveArray[i].object.mesh.position.y > circleWaveArray[i + 1].object.mesh.position.y) {
                                        circleWaveArray[i + 1].object.mesh.position.y += 2;
                                        circleWaveArray[i].object.mesh.position.y -= 2;
                                    } else {
                                        circleWaveArray[i + 1].object.mesh.position.y -= 2;
                                        circleWaveArray[i].object.mesh.position.y += 2;
                                    }
                                }

                                if (circleWaveArray[i].object.mesh.position.y == circleWaveArray[i + 1].object.mesh.position.y) {
                                    circleWaveArray[i].changeCircleHeights = true;
                                    circleWaveArray[i+1].changeCircleHeights = true;

                                    circleWaveArray[i].checkCircleHeights = false;
                                    circleWaveArray[i+1].checkCircleHeights = false;
                                }

                                if (circleWaveArray[i].changeCircleHeights) {
                                    circleWaveArray[i].object.mesh.rotation.y += 0.02;
                                    circleWaveArray[i + 1].object.mesh.rotation.y -= 0.02;

                                    circleWaveArray[i].object.mesh.position.y +=2;
                                    circleWaveArray[i + 1].object.mesh.position.y -=2;

                                    circleT += 0.01;

                                    circleWaveArray[i].object.mesh.position.x += 10*freqAverage*Math.cos(circleT);
                                    circleWaveArray[i].object.mesh.position.y += 10*freqAverage*Math.sin(circleT);

                                    circleWaveArray[i+1].object.mesh.position.x -= 10*freqAverage*Math.cos(circleT);
                                    circleWaveArray[i+1].object.mesh.position.y -= 10*freqAverage*Math.sin(circleT);

                                }
                                i++;
                            }
                        }
                    }
            }

            function deleteCircleWaves() {
                if(circleWaveArray.length == 0) {
                    return;
                }

                for(var i=0; i<circleWaveArray.length; i++) {
                    var circleWave = circleWaveArray[i].object.mesh;
                    circleWaveArray.splice(i,1);
                    scope.scene.remove(circleWave);
                }

                circleT = 0;
                levelNineActive = false;
            }

            /**
             * Kameraanimation
             * Fahre Kamera nach vorne und dreh sie dann um
             */

            function animateCamera() {

                if(scope.animateCamera) {
                    if(levelThreeActive) {
                        levelFourActive = false;
                        rotateCameraZ();
                    }

                    if(levelFourActive) {

                        if (scope.camera.position.x < 500) {
                      //                 scope.camera.position.x += rotationDirection*(0.05)*freqAverage;
                        }
                    }
                    if(levelFiveActive) {

                        if (scope.camera.position.z > 1000) {
                            scope.camera.position.z -= rotationDirection*(0.9)*freqAverage;
                        }
                    }
                    if(levelSixActive) {

                        if (scope.camera.position.z < 2000) {
                            scope.camera.position.z += rotationDirection*(0.9)*freqAverage;
                        }
                    }
                    if(levelSevenActive) {
                        if (scope.camera.position.y > 0) {
                            scope.camera.position.y -= 2;
                        }
                    }
                    if(levelEightActive) {

                        // check positions
                        var x = scope.camera.position.x;
                        var y = scope.camera.position.y;
                        var z = scope.camera.position.z;

                        if(x > 0) {
                            scope.camera.position.x -=5;
                        } else if(x < 0) {
                            scope.camera.position.x +=5;
                        }
                        if(y > 0) {
                            scope.camera.position.y -=5;
                        }
                        if(z < 2000) {
                            scope.camera.position.z +=8*freqAverage;
                        }
                    }


                    if(levelSixActive && levelFiveActive && scope.camera.position.z < 1000) {
                        scope.camera.position.z -= 2*freqAverage;
                    }


                    scope.camera.lookAt(new THREE.Vector3(0,0,0));
                }


            }

            var rotatingLeft = true;
            var rotatingRight = false;

            function rotateCameraZ() {
                if (rotatingLeft) {
                    if (scope.camera.rotation.z < 0.40) {
                        scope.camera.rotation.z += 0.001;

                    } else {
                        rotatingLeft = false;
                        rotatingRight = true;
                    }
                } else if(rotatingRight) {
                    if (scope.camera.rotation.z > -0.40) {
                        scope.camera.rotation.z -= 0.001;
                    } else {
                        rotatingRight = false;
                        rotatingLeft = true;
                    }
                }
            }

            /**
             * Automatisierter Objekt Garbage Collector
             */

            function removeChecker() {
                for(var i=0; i<spiralParticleArray.length; i++) {
                    if(spiralParticleArray[i].object.mesh.position.z > 2000) {
                        var particle = spiralParticleArray[i].object.mesh; //scope.scene.getObjectById(spiralParticleArray.particles[i].object.geometry.id);
                        spiralParticleArray.splice(i,1);
                        scope.scene.remove(particle);
                    }
                    if(spiralParticleArray.length < 30) {
                        levelEightActive = false;
                    }
                }

                for(i=0; i<planeArray.length; i++) {
                    if(planeArray[i].mesh.position.y > 700) {
                        var plane = planeArray[i].mesh;
                        planeArray.splice(i,1);
                        scope.scene.remove(plane);
                    }
                }

                for(i=0; i<backgroundNoiseArray.length; i++) {
                    if(backgroundNoiseArray[i].mesh.position.z > 2000) {
                        var noise = backgroundNoiseArray[i].mesh;
                        backgroundNoiseArray.splice(i,1);
                        scope.scene.remove(noise);
                    }
                }

                for(i=0; i<continousParticlesArray.length; i++) {
                    if(continousParticlesArray[i].mesh.position.z > 2000) {
                        var Cparticle = continousParticlesArray[i].mesh;
                        continousParticlesArray.splice(i,1);
                        scope.scene.remove(Cparticle);
                    }
                }

                for(i=0; i<TDNoiseArray.length; i++) {
                    if(TDNoiseArray[i].mesh.position.x < -10000) {
                        var octahedron = TDNoiseArray[i].mesh;
                        TDNoiseArray.splice(i,1);
                        scope.scene.remove(octahedron);
                    }
                }
            }



            /**
             * Returns a random number between min (inclusive) and max (exclusive)
             */
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }

            /**
             * converts an RGB value of 0-255 to a HEX value
             * @param c
             * @returns {string}
             */
            var componentToHex = function (c) {
                var hex = Math.round(c).toString(16);
                return hex.count == 1 ? "0" + hex : hex;
            };

            var rgbToHex = function(r, g, b) {
                return "0x" + componentToHex(r) + componentToHex(g) + componentToHex(b);
            };

            /**
             * Sobald Select Input geklickt wird, lösche alle Objekte aus der Szene,
             * entleere alle Objektarrays und geh sicher, dass sie tatsächlich leer sind
             * -schalte alle Switches aus, und entferne die Hauptobjekte, sofern sie nicht
             * vom children[]-Array gefunden wurden, was vorkommt
             * -Erstelle ein neues Boden-Objekt und richte die Kamera wieder auf ihre
             * Ursprungsposition aus
             */

            this.clearCanvas = function() {
                for (var i = scope.scene.children.length - 1; i >= 0 ; i -- ) {
                    scope.scene.remove(scope.scene.children[ i ]);
                }

                clearArray(continousParticlesArray);
                clearArray(backgroundNoiseArray);
                clearArray(planeArray);
                clearArray(TDNoiseArray);
                clearArray(circleWaveArray);
                clearArray(pointArray);
         //       clearArray(curveArray);
                clearArray(fastRayArray);
                clearArray(skyRayArray);
                clearArray(connectingLinesArray);
                clearArray(orbitalSphereArray);
                clearArray(currentMainObject);

                for(i=0;i<levelHistory.length; i++) {
                    levelHistory.splice(i,1);
                }

                levelHistory = [];
                backgroundNoiseArray = [];
                pointArray = [];
                planeArray = [];
                TDNoiseArray = [];
                circleWaveArray = [];
            //    curveArray = [];
                currentMainObject = [];
                fastRayArray = [];
                skyRayArray = [];
                connectingLinesArray = [];
                orbitalSphereArray = [];

                levelZeroActive = false;
                levelOneActive = false;
                levelTwoActive = false;
                levelThreeActive = false;
                levelFourActive = false;
                levelFiveActive = false;
                levelSixActive = false;
                levelSevenActive = false;
                levelEightActive = false;
                levelNineActive = false;
                levelTenActive = false;
                levelElevenActive = false;

                pointCounter = 0;

                scope.scene.remove(scope.scene.getObjectByName("fftLinesMesh"));
                scope.scene.remove(scope.scene.getObjectByName("line1"));
                scope.scene.remove(scope.scene.getObjectByName("line2"));
                scope.scene.remove(scope.scene.getObjectByName("sphereMesh"));

                var floor = new Floor();
                this.addMesh(floor, [0,-300,0]);

                scope.camera.position.set(0,0,2000);
                scope.camera.lookAt(new THREE.Vector3(0,0,0));
            };

            /**
             * Hilfsmethode zum Entleeren von Objektarrays
             * @param array
             */
            function clearArray(array) {
                for(var i=0; i<array.length; i++) {
                    if(array[i]) {
                        if(array[i].mesh) {
                            scope.scene.remove(scope.scene.getObjectByName(array[i].mesh.name));
                        } else if (array[i].object.mesh) {
                            scope.scene.remove(scope.scene.getObjectByName(array[i].object.mesh.name));
                        }
                    }

                    array.splice(i,1);
                }
            }

        };

        return Scene;

    }));
