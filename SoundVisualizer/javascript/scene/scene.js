/**
 * Created by Alexander Zorin on 21.06.2016.
 */



/* requireJS module definition */
define(["three",
        "shape",
        "fftLines",
        "plane",
        "backgroundParticle",
        "curve",
        "octahedron",
        "pyramid",
        "ray",
        "torus",
        "torusKnot",
        "circleWave",
        "connectingline",
        "floor",
        "orbitcontrols"],
    (function(THREE,
          //    Util,
              Shape, fftLines, Plane, backgroundParticle, Curve, Octahedron, Pyramid, Ray, Torus, TorusKnot, CircleWave, Connectingline, Floor, Orbitcontrols) {

        "use strict";

        /*
         * Scene constructor
         */
        var Scene =  function(renderer, width, height) {

            // the scope of the object instance basically means the viewport
            var scope = this;

            scope.renderer = renderer;
            scope.t = 0.0;

            scope.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 40000);
            scope.camera.position.x = 0;
            scope.camera.position.y = 0;
            scope.camera.position.z = 2000;

            scope.scene = new THREE.Scene();

            var spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(0, 0, -10);

            spotLight.castShadow = true;

            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;

            spotLight.shadow.camera.near = 0.1;
            spotLight.shadow.camera.far = 20000;
            spotLight.shadow.camera.fov = 66;

            scope.scene.add(spotLight);

            //LIGHTS

            renderer.setClearColor(new THREE.Color(0x000000));

            //orig light
            var light1 = new THREE.PointLight(0xFFFFFF, 1, 100);
            scope.scene.add(light1);

            //front light
            var light2 = new THREE.PointLight(0xFFFFFF, 1, 100);
            scope.scene.add(light2);

            // -900, 100, 350
            var light3 = new THREE.PointLight(0xFFFFFF, 1, 1000);
            light3.position.set(0,100,-1500);

            var light4 = new THREE.PointLight(0xffffff,1,100);
            light4.position.set(0,0,-1500);
            scope.scene.add(light4);

            this.planetLight = function(){

                var color = new THREE.Color(1,1,1);
                var intensity = 1;

                var aLight = new THREE.AmbientLight(color);
                var dLight = new THREE.DirectionalLight(color, intensity);
                dLight.name = "dLight";
                dLight.position.set(-1,0,-0.3).normalize();
                scope.scene.add(aLight);
                scope.scene.add(dLight);

            };


            scope.shouldAnimate = false;

            this.activateAnimation = function() {
                scope.shouldAnimate = true;
            };

            this.deactivateAnimation = function() {
                scope.shouldAnimate = false;
            };

            /**
             * MAIN CONTROL FUNCTIONS
             */

            /*
             * drawing the scene
             */
            this.draw = function () {

                requestAnimationFrame(scope.draw);

                scope.renderer.render(scope.scene, scope.camera);

         //       controls.update();

                if(scope.shouldAnimate == true) {
                    scope.animate()
                }

            };

            var objectArray = [];
            var objectCount = 0;

            this.addBufferGeometry = function (bufferGeometry, position) {

                scope.currentMesh = bufferGeometry.getMesh();
                scope.currentMesh.position.set(position[0], position[1], position[2]);
                scope.scene.add(scope.currentMesh);

                //         console.log(position);
                //         console.log(bufferGeometry);

                objectArray[objectCount++] = bufferGeometry;
            };


            var t = 0;

            var particleArray = {
                particles: []
            };

            var levelHistory = [];


            this.animate = function () {

                if(!readyToPlay) {
                    return;
                }

                getContinuousAudioData();
                setLevel();

                animateSphere();
                visualizeLine();
                animateFloor();
                animateParticleSpiral();
                animateBackgroundNoise();
                animateCamera();
                animatePlanes();
                drawFrequencyDomain();
                animateCurves();
                animate3DNoise();
                shootRays();
                animateShapes();
                animateCircleWaves();
                removeObjects();
                detectKick();
                checkForLevels();


            };

            function getActiveLevels() {

            }

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

            function checkforPeaks() {
                // make sure only the last 5 levels are present
                if(levelHistory.length > 5) {
                    levelHistory.splice(0,1);
                }
                if(levelHistory[4] > levelHistory[3] && levelHistory[3] > levelHistory[2] && levelHistory[2] > levelHistory[1]) {

                }
            }


            function checkForLevels() {
                /*
                if(levelFive) {
                    console.log("oh oh");

                    setTimeout(function(){
                        // http://stackoverflow.com/questions/5875402/how-to-call-this-function-within-settimeout-in-js
                        scope.createDots();
                        console.log("jaawohl");
                        animateParticleSpiral();
                    }, 10);
                    levelFiveActive = true;
                }
*/
                if(levelZero) { // dunkelblau
                    levelZeroActive = true;
                    console.log("level 0 ");
                    levelHistory.push(L0);

                }
                if(levelOne) { // hellblau
                    levelOneActive = true;
                    console.log("level 1");
                    //              scope.createCurves();
                    levelHistory.push(L1);

                }
                if(levelTwo) { // grünblau
                    levelTwoActive = true;
                    scope.create3DNoise();

                    console.log("level 2");
                    levelHistory.push(L2);

                }
                if(levelThree) { // hellgrün
                    scope.createBackgroundNoise();
                    levelThreeActive = true;

                    console.log("level 3");
                    levelHistory.push(L3);

                }
                if(levelFour) { // grün
                    deleteCircleWaves();
                    scope.createDots();
                    //              scope.createRays();
                    levelFourActive = true;

                    console.log("level 4");
                    levelHistory.push(L4);

                }
                if(levelFive) { // grüngelb
                    scope.createPlanes();
                    levelFiveActive = true;

                    console.log("level 5");
                    levelHistory.push(L5);

                }
                if(levelSix) { // gelb
                    scope.createShapes();
                    moveBackground();
                    // flacker background
                    // disconnect shapes
                    // change background particle movement
                    levelSixActive = true;

                    console.log("level 6");
                    levelHistory.push(L6);

                }
                if(levelSeven) { // orange
                    scope.createCircleWaves();

                    // connect shapes
                    levelSevenActive = true;

                    console.log("level 7");
                    levelHistory.push(L7);

                }
                if(levelEight) { // rot
                    // Spiralenwechsel
                    drawTimeDomain();
                    console.log("Level 8");
                    levelEightActive = true;
                    levelHistory.push(L8);

                }
                if(levelNine) { // lila
                    // Hauptfigur-wechsel
                    console.log("level 9");
                    levelNineActive = true;
                    levelHistory.push(L9);

                }
                if(levelTen) { // öhhhhhhhh
                    console.log("level 10");
                    levelTenActive = true;
                }
                if(levelEleven) { // white
                    console.log("whatheactualfuck");
                }

            }

            /**
             * SOUND MODULE
             */

            var audioContext;
            //Get an Audio Context
            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                audioContext = new window.AudioContext();
            } catch (e) {
                //Web Audio API is not supported in this browser
                alert("Sorry! This browser does not support the Web Audio API. Please use Chrome, Safari or Firefox.");
            }

            // freqByteData.length = fftSize/2
            function getAudioFreqData() {
                if (!readyToPlay) {
                    return;

                } else {
                    analyser.getByteFrequencyData(freqByteData);

                //    console.log(freqByteData);
                    return freqByteData;
                }
            }

            function getAudioTimeData() {
                if (!readyToPlay) {
                    return;

                } else {
                    analyser.getByteTimeDomainData(freqByteData);
          //          console.log(analyser.getByteTimeDomainData(freqByteData));
                    return freqByteData;
                }
            }

            /**
             * AUDIO - FUNCTIONALITY
             *
             *
             */

            function getFreqAverage(freqByteData) {

                if (!readyToPlay)
                    return;
            //    analyser.getByteFrequencyData(freqByteData);

                //          console.log("fBD"+freqByteData);

                var length = freqByteData.length;

                //GET AVG LEVEL
                var sum = 0;
                //         console.log(length);
                for (var j = 0; j < length; ++j) {
                    // hier kann man Verhältnisse von Frequenzgängen berechnen, innerhalb einer Samplelänge
                    sum += freqByteData[j];
                }

                // Calculate the average frequency of the samples in the bin
                var aveLevel = sum / length;

                normLevel = (aveLevel / 256); //256 is the highest a freq data can be

                //      console.log(normLevel);

                return normLevel;
            }

            function getFreqRange(lower, upper) {
                if(!readyToPlay) {
                    return;
                }
                var fftData = getAudioFreqData();

                var rangeData =[];
                for(var i=lower, j=0; i<upper; i++,j++) {
                    rangeData[j] = fftData[i];
                }
                return rangeData;
            }

            function getSubbass() {
                return getFreqRange(0,22);
            }

            function getBassband() {
                return getFreqRange(23,111);

            }

            function getLowmid() {
                return getFreqRange(112,297);
            }

            function getMidrange() {
                return getFreqRange(298,927);
            }

            function getUppermids() {
                return getFreqRange(928,1857);

            }

            function getHighfreq() {
                return getFreqRange(1858,3715);

            }

            function detectKick() {
                var fullFreqAverage = getFreqAverage(getAudioFreqData());
                var subBassAverage = getFreqAverage(getSubbass());
                var bassBandAverage = getFreqAverage(getBassband());
                var lowMidAverage = getFreqAverage(getLowmid());

                var highFreqAverage = getFreqAverage(getHighfreq());

                // (band - sub) / gesamt > 3,5

    //            console.log(bassBandAverage +" " + fullFreqAverage);

          //      console.log("band: " + bassBandAverage + " high: " + highFreqAverage + " full: " + fullFreqAverage);


                if(bassBandAverage > highFreqAverage) {
                    if(bassBandAverage > 0.65 && fullFreqAverage > 0.2) {
           //             console.log("BEAT!");
                    }
                    if(bassBandAverage > 0.65 && fullFreqAverage < 0.2) {
           //             console.log("BEAT2!");
/*
                        var fftLines;

                        for(var i = 0; i<objectArray.length;i++) {
                            if(objectArray[i].mesh.name == "fftLinesMesh") {
                                fftLines = objectArray[i];
                            }
                        }
                            fftLines.colorVertices();
                            */
                    }
                }

            }


            /**
             * ANIMATION / VISUALIZATION
             */

            var levelZero = false;
            var levelOne = false;
            var levelTwo = false;
            var levelThree = false;
            var levelFour = false;
            var levelFive = false;
            var levelSix = false;
            var levelSeven = false;
            var levelEight = false;
            var levelNine = false;
            var levelTen = false;
            var levelEleven = false;

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


            this.createFFTLines = function() {
                this.addBufferGeometry(new fftLines(), [0,-200,0]);
  //              console.log("created FFTLines");
            };

            // call this.function with scope.function from normal functions

            function drawFrequencyDomain() {

                var fftLines;
                for(var i = 0; i<objectArray.length;i++) {
                    if(objectArray[i].mesh.name == "fftLinesMesh") {
                        fftLines = objectArray[i];
                    }
                }


                if(!fftLines ) {
                    console.log("entered");
                    scope.createFFTLines();
                } else if(readyToPlay) {

                    var freqByteData = getAudioFreqData();
                    fftLines.setFrequencyPosition(freqByteData);
                    fftLines.line.geometry.verticesNeedUpdate = true;
                }

            }

            function visualizeLine() {
                for(var h=0;h<objectCount;h++) {
                    if(objectArray[h].mesh.name.indexOf("line") !== -1) {
                       var line = objectArray[h].mesh;
                       visualize(line);
                    }
                }
            }

            var audioData = getAudioFreqData();
            var freqAverage = getFreqAverage(audioData);


            function getContinuousAudioData() {
                audioData = getAudioFreqData();
                freqAverage = getFreqAverage(audioData);
            }

            /**
             * object must be mesh
             * @param mesh
             */

            function visualize(mesh) {
                var time = Date.now() * 0.01;

                var displacement = mesh.geometry.attributes.displacement;



                if(mesh.name == "sphereMesh") {
                    if(freqAverage < 0.2) {
                        mesh.rotation.z = freqAverage*0.1+time/100;
                    } else if(freqAverage > 0.2) {
                        mesh.rotation.y = freqAverage*0.1+time/100;
                        mesh.rotation.z = freqAverage*0.1+time/100;
                    }

                    mesh.material.uniforms.amplitude.value = freqAverage*3;

                }

                if (audioBuffer) {

                    var color;

                    for (var i = 0; i < displacement.count; i++) {
                        mesh.geometry.attributes.displacement.array[i] = (audioData[i]);

                        if( levelZero) {
                            // dunkelblau
                            color = new THREE.Color(freqAverage*5, freqAverage*6, freqAverage*8);

                        } else if (levelOne) {
                            // helleres blau
                            color = new THREE.Color(freqAverage * 4, freqAverage * 5, freqAverage * 8);

                        } else if (levelTwo) {
                            // grünblau
                            color = new THREE.Color(freqAverage*3, freqAverage*6, freqAverage*4.5);

                        } else if (levelThree) {
                            // hellgrün
                            color = new THREE.Color(freqAverage*1.2, freqAverage*4.5, freqAverage*2.2);

                            levelThree = true

                        } else if(levelFour) {
                            // grün
                            color = new THREE.Color(freqAverage*2.5, freqAverage*4, freqAverage*1);

                        } else if (levelFive) {
                            // grüngelb
                            color = new THREE.Color(freqAverage*2, freqAverage*4, freqAverage*2);

                        } else if(levelSix) {
                            // gelb
                            color = new THREE.Color(freqAverage*3, freqAverage*3, freqAverage*1.7);

                        } else if(levelSeven) {
                            // orange
                            color = new THREE.Color(freqAverage*3, freqAverage*1.5, freqAverage*0.5);

                        } else if(levelEight) {
                            // rot
                            color = new THREE.Color(freqAverage*3, freqAverage*1, freqAverage*1.5);

                        } else if(levelNine) {
                            // hellrot
                            color = new THREE.Color(freqAverage*2, freqAverage*1.5, freqAverage*2.5);

                        } else if(levelTen) {
                            // lila + white glow
                            color = new THREE.Color(freqAverage*1.5, freqAverage*1, freqAverage*2);

                        } else if(levelEleven) {
                            // white
                            color = new THREE.Color(freqAverage*2, freqAverage*2, freqAverage*2);
                        }

                        mesh.material.uniforms.color.value = color;

                    }
                    mesh.geometry.attributes.displacement.needsUpdate = true;
                }
            }

            function setLevel() {


                if(freqAverage < 0.1) {
                        levelZero = true;
                        levelOne = false;
                    } else if (freqAverage >= 0.1 && freqAverage < 0.16) {

                        levelOne = true;
                        levelZero = false;
                        levelTwo = false;

                    } else if (freqAverage >= 0.16 && freqAverage < 0.20) {

                        levelTwo = true;
                        levelOne = false;
                        levelThree = false;

                    } else if (freqAverage >= 0.20 && freqAverage < 0.24) {

                        levelThree = true;
                        levelTwo = false;
                        levelFour = false;

                    } else if(freqAverage >= 0.24 && freqAverage < 0.28) {

                        levelFour = true;
                        levelThree = false;
                        levelFive = false;

                    } else if (freqAverage >= 0.28 && freqAverage < 0.31) {

                        levelFive = true;
                        levelFour = false;
                        levelSix = false;
                    } else if(freqAverage >= 0.31 && freqAverage < 0.33) {

                        levelSix = true;
                        levelFive = false;
                        levelSeven = false;

                    } else if(freqAverage >= 0.33 && freqAverage < 0.35) {

                        levelSeven = true;
                        levelSix = false;
                        levelEight = false;

                    } else if(freqAverage >= 0.35 && freqAverage < 0.40) {
                        levelEight = true;
                        levelSeven = false;
                        levelNine = false;

                    } else if(freqAverage >= 0.40 && freqAverage < 0.45) {
                        levelNine = true;
                        levelEight = false;
                        levelTen = false;

                    } else if(freqAverage >= 0.45 && freqAverage < 0.52) {
                        levelTen = true;
                        levelNine = false;

                    } else if(freqAverage >= 0.52 && freqAverage < 0.60) {
                        levelTen = false;
                        levelEleven = true;
                    }
            }

            function animateSphere() {
                var sphere = scope.scene.getObjectByName("sphereMesh");
                visualize(sphere);
            }

            function animateFloor() {
                var floor = scope.scene.getObjectByName("floorMesh");

            //    var time = Date.now() * 0.01;

                var displacement = floor.geometry.attributes.displacement;


                if (audioBuffer) {
                    for (var i = 0; i < displacement.count; i++) {
                        floor.geometry.attributes.displacement.array[i] = (audioData[i]*0.5);
                        floor.material.uniforms.color.value = new THREE.Color("rgb("+180*Math.floor(freqAverage*9) +","+ 25*Math.floor(freqAverage*15) +","+ 220+")");
                    }
                    floor.geometry.attributes.displacement.needsUpdate = true;

                }
            }

            function animateTorus() {

                var torus = scope.scene.getObjectByName("torusMesh");
                t += 0.01;
                var p=0;
                torus.position.x = 1000*Math.cos(t) + p;
                torus.position.z = 1000*Math.sin(t) + p;
                torus.rotation.y = t*0.1;
            }

            var h = 10;
            var uSpiral = 200;
            var vSpiral = -50;

            var xCyl = 0;
            var yCyl = -50;
            var zCyl = 0;

            var xOrb = 0;
            var yOrb = 0;
            var zOrb = -100;

            this.createDots = function() {
                /*
                 Kreis: x = 20*Math.cos(x) + factor, y+=1 z = 20*Math.cos(z) + factor

                 Spirale: x = (1+angle)*Math.cos(angle), z = (1+angle)*Math.sin(angle)
                 */

                if(particleArray.particles.length < 200) {
                    var particle = new Shape();

                    /**
                     * 200 archimedical spiral particles
                     */
                        this.addBufferGeometry(particle, [(uSpiral) * Math.cos(uSpiral), h * vSpiral, (uSpiral) * Math.sin(uSpiral)]);
                        var particleObject = {
                            spiralParticle: particle,
                            uvposition: [uSpiral, vSpiral],
                            direction: 1
                        };

                        particleArray.particles.push(particleObject);

                }
            };



            function animateParticleSpiral() {
                if(particleArray.particles.length == 0) {
                    return;
                }

                if(!levelEightActive) {

                        for (var j = 0; j < particleArray.particles.length; j++) {

                            //       console.log(particleArray.particles[j]);
                            if (particleArray.particles[j].spiralParticle.mesh.position.y > 500) {
                                particleArray.particles[j].direction = 0;
                            } else if (particleArray.particles[j].spiralParticle.mesh.position.y < -500) {
                                particleArray.particles[j].direction = 1;
                            }


                            if (particleArray.particles[j].direction == 0) {
                                //        console.log("down");
                                particleArray.particles[j].uvposition[0] -= 0.1;
                                particleArray.particles[j].uvposition[1] -= 0.1;

                            } else {
                                //        console.log("up");
                                particleArray.particles[j].uvposition[0] += 0.1;
                                particleArray.particles[j].uvposition[1] += 0.1;
                            }

                            var u = particleArray.particles[j].uvposition[0];
                            var v = particleArray.particles[j].uvposition[1];

                            particleArray.particles[j].spiralParticle.mesh.position.set((u) * Math.cos(u), h * v, (u) * Math.sin(u));

                    }

                } else {
                        shootIYFParticles(particleArray);
                }
            }

            function animateOrbit() {

            }

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
                this.addBufferGeometry(curve, [0,0,1500]);
                curveArray.push(curve);
            };

      //      Kreis: x = 20*Math.cos(x) + factor, y+=1 z = 20*Math.cos(z) + factor


            function animateCurves() {
                if(curveArray.length == 0) {
                    return;
                }
                    var i = 0;
        //        for(var i=0;i<curveArray.length; i++) {
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
         //           console.log(curveArray[i].curve);
                    curveArray[i].curve.needsUpdate = true;
                    curveArray[i].geometry.verticesNeedUpdate = true;
                    curveArray[i].geometry.vertices = curveArray[i].curve.getPoints( 100 );

          //      }
            }

            var rayArray = [];

            this.createRays = function() {
                if(rayArray.length < 20) {
                    var ray = new Ray();
                    ray.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI));

                    this.addBufferGeometry(ray, [0,100,1000]);
                    rayArray.push(ray);
                }

            };

            var rayFactor = 0.1;
            var rayPos = 0;

            function shootRays() {
                if(rayArray.length == 0) {
                    return;
                }
                for(var i=0;i<rayArray.length;i++) {

                    rayArray[i].mesh.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(rayPos+=rayFactor));

                }
            }

            var TDNoiseArray = [];
            var TDposY = 1000;

            this.create3DNoise = function() {
                if(TDNoiseArray.length < 10) {
                    var octahedron = new Octahedron();

                    if(TDposY < -1000) {
                        TDposY = 1200;
                    }
                    this.addBufferGeometry(octahedron, [10000, TDposY-=200, getRandomArbitrary(-10000, -1500)]);

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


            function drawTimeDomain() {

            }

            function moveBackground() {

            }

            function moveFloor() {
                var floor = scope.scene.getObjectByName("floorMesh");
                floor.position.z += 10;
            }



            function shootIYFParticles() {
                if(particleArray.particles.length == 0) {
                    return;
                }

                for (var j = 0; j < particleArray.particles.length; j++) {

                    var x = particleArray.particles[j].spiralParticle.mesh.position.x;
                    var y = particleArray.particles[j].spiralParticle.mesh.position.y;
                    var z = particleArray.particles[j].spiralParticle.mesh.position.z;

                    particleArray.particles[j].spiralParticle.mesh.position.set(x+=freqAverage*getRandomArbitrary(-90,80), y+=freqAverage*getRandomArbitrary(-20,70), z+=freqAverage*90);
                }

            }

            var planeArray = [];

            this.createPlanes = function() {
                /**
                 * 50 planes, 25 right, 25 left
                 */

                var x = -1300;
                var y = -250;
                var z = 0;
                var plane = new Plane();
                plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / Math.random()*10));
                plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI / Math.random()*10));
                plane.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(-Math.PI / Math.random()*10));

                if(planeArray.length < 50) {
                    if(planeArray.length%2 == 0) {
                        // Stellen 0,2,4 etc. beinhalten linke Planes
                        this.addBufferGeometry(plane, [getRandomArbitrary(x,-600),getRandomArbitrary(y, 450), getRandomArbitrary(z, 700)]);
                    } else {
                        // Stellen 1,3,5 etc. beinhalten rechte Planes
                        this.addBufferGeometry(plane, [getRandomArbitrary(x*(-1),600),getRandomArbitrary(y, 450), getRandomArbitrary(z, 700)]);
                    }
                }

                planeArray.push(plane);
            };

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

   //         var planeCounter = 0;

            function animatePlanes() {

                for(var i=0; i<planeArray.length; i++) {
          //      if(planeCounter<planeArray.length) {
                //    var i = planeCounter;
                    var color = getRandomArbitrary(20,160);

                    if(levelSixActive) {
                        color = rgbToHex(color,color,color);
                        //      console.log(planeArray[i] + "    " + color);
                        planeArray[i].mesh.material.color.setHex(color);
                    }
                    if(levelEightActive) {
                        color = rgbToHex(0,20,color);
                        planeArray[i].mesh.material.color.setHex(color);
                    }

                    if(i%2 == 0) {
                        // linke Planes
                        planeArray[i].mesh.position.x += freqAverage * 10 * Math.random();
                    } else {
                        // rechte Planes
                        planeArray[i].mesh.position.x -= freqAverage * 10 * Math.random();

                    }
                    planeArray[i].mesh.position.y += freqAverage * 10 * Math.random();
                    planeArray[i].mesh.position.z += freqAverage * 10 * Math.random();

                    var scaleFactor = freqAverage*2;

                    planeArray[i].mesh.scale.set(scaleFactor,scaleFactor,scaleFactor);

     //               planeCounter++;
/*
                }    else {
                    planeCounter = 0;
                }
*/
               }
                levelSixActive = false;

            }

            var shapeArray = [];

            this.createShapes = function() {
                var shape = new Shape();
                if(shapeArray.length < 15) {
                    this.addBufferGeometry(shape, [getRandomArbitrary(-2000,2000), getRandomArbitrary(-300, 800), 1000]);
                    shapeArray.push(shape);
                }

            };

            function animateShapes() {
                for(var i=0; i<shapeArray.length; i++) {
                    var x = shapeArray[i].mesh.position.x;
                    var y = shapeArray[i].mesh.position.y;
                }
            }

            function calculateShapePosition() {
                for(var i=0; i<shapeArray.length; i++) {
                    var x = shapeArray[i].mesh.position.x;
                    var y = shapeArray[i].mesh.position.y;

                    for(var j=0; j<shapeArray.length; i++) {
                        if((shapeArray[j].mesh.position.x - x) < 100) {
                            shapeArray[j].mesh.position.x += 5;
                        }
                        if((shapeArray[j].mesh.position.y - y) < 100) {
                            shapeArray[j].mesh.position.y += 5;
                        }
                    }
                }
            }

            function connectParticles() {

            }


            function disconnectParticles() {

            }

            function makeGlow() {

            }

            function createBackground() {

            }

            function animateBackground() {

            }

            var backgroundNoiseArray = [];

            this.createBackgroundNoise = function() {
                var backPart = new backgroundParticle();

                if(backgroundNoiseArray.length<500) {
                    scope.addBufferGeometry(backPart, [getRandomArbitrary(-1000,1000), getRandomArbitrary(-300,300), getRandomArbitrary(-1000, -2000)]);
                    backgroundNoiseArray.push(backPart);
                }
            };


            function animateBackgroundNoise() {
                if(backgroundNoiseArray.length == 0) {
                    return;
                }

                for(var i=0; i<backgroundNoiseArray.length; i++) {
                    backgroundNoiseArray[i].mesh.position.x += getRandomArbitrary(-5,5);
                    backgroundNoiseArray[i].mesh.position.y += getRandomArbitrary(-5,5);
                    backgroundNoiseArray[i].mesh.position.z += getRandomArbitrary(-5,5);
                }

                /*
                var lorenzPositions = lorenzAttractor();

                for(var i=0; i<backgroundNoiseArray.length; i++) {
                    backgroundNoiseArray[i].mesh.position.x += lorenzPositions[0]*10;
                    backgroundNoiseArray[i].mesh.position.y += lorenzPositions[1]*10;
                    backgroundNoiseArray[i].mesh.position.z += lorenzPositions[2]*10;
                }
                */
                if(levelSixActive) {
                    shootBackgroundNoise();

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

                    backgroundNoiseArray[j].mesh.position.set(x+=freqAverage*getRandomArbitrary(-1,1), y+=freqAverage*getRandomArbitrary(-5,5), z+=freqAverage*500);
                }

            }

            var xLor = 0.1;
            var yLor = 0;
            var zLor = 0;
            var a = 10.0;
            var b = 28.0;
            var c = 8.0 / 3.0;
            var tLor = 0.01;
            var lorenzIterationCount = 10000;
            var iLor;
            function lorenzAttractor() {

                //Iterate and update x,y and z locations
                //based upon the Lorenz equations

                if (iLor < lorenzIterationCount) {
                    var xt = xLor + tLor * a * (yLor - xLor);
                    var yt = yLor + tLor * (xLor * (b - zLor) - yLor);
                    var zt = zLor + tLor * (xLor * yLor - c * zLor);

                    xLor = xt;
                    yLor = yt;
                    zLor = zt;
                    iLor++
                }
                return [xLor,yLor,zLor]
            }

            function animateCamera() {

                    if(levelThreeActive) {
                        rotateCameraZ();
                    }

                    if(levelFourActive) {

                        if (scope.camera.position.x < 500) {
                            scope.camera.position.x += 0.1;
                        } else {
                            levelFourActive = false;
                        }

            //            console.log(scope.camera.position.x);
                    }
                    if(levelFiveActive) {
                        levelFourActive = false;

                        if (scope.camera.position.z > 1000) {
                            scope.camera.position.z -= 0.9;
                        } else {
                            levelFiveActive = false;
                        }
            //            console.log(scope.camera.position.z);


                        if (scope.camera.position.x > -500) {
                            scope.camera.position.x -= 0.2;
                        } else {
                            levelSixActive = false;
                        }
            //            console.log(scope.camera.position.x);
                    }
                    if(levelSixActive) {
                        levelThreeActive = false;

                        if (scope.camera.position.y < 500) {
                            scope.camera.position.y += 2;
                        } else {
                            levelSixActive = false;
                        }
            //            console.log(scope.camera.position.y);
                    }
                    if(levelSevenActive) {
                        levelFiveActive = false;

                        if (scope.camera.position.z < 2000) {
                            scope.camera.position.z += 0.9
                        } else {
                            levelSevenActive = false;
                        }
            //            console.log(scope.camera.position.z);

                        if (scope.camera.position.y > 0) {
                            scope.camera.position.y -= 2;
                        } else {
                        //    levelEightActive = false;
                        }
            //            console.log(scope.camera.position.y);
                    }
                    if(levelEightActive) {
                        levelSevenActive = false;

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
                            scope.camera.position.z +=5;
                        }
                    }

                scope.camera.lookAt(new THREE.Vector3(0,0,0));

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

            function moveLight() {

            }

            function flickerLight() {

            }


            function animateMandelbrot() {

            }

            var circleWaveArray = [];

            var circleX = 899;
            var circleY = 399;

            this.createCircleWaves = function() {
                if(circleWaveArray.length < 8) {
                    var circleWave = new CircleWave();
                    if(circleY < 400) {
                        circleY -= 100;
                    }
                    if(circleY < 0) {
                        circleY = 399;
                    }
                    if(circleX < -700) {
                        circleX = 899;
                    }
                    scope.addBufferGeometry(circleWave, [circleX-=200,circleY,0]);

                    var circleWaveObject = {
                        circleWave: circleWave,
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
                        if(circleWaveArray[j].circleWave != undefined) {
                            visualize(circleWaveArray[j].circleWave.mesh);

                            if(levelNineActive) {
                                circleWaveArray[j].circleWave.mesh.scale.set(freqAverage*3, freqAverage*3, freqAverage*3);
                            }
                        }

                        if(circleWaveArray[i+1] != undefined) {
                            if(circleWaveArray[i+1].circleWave != undefined) {

                                if (circleWaveArray[i].checkCircleHeights) {
                                    if (circleWaveArray[i].circleWave.mesh.position.y > circleWaveArray[i + 1].circleWave.mesh.position.y) {
                                        circleWaveArray[i + 1].circleWave.mesh.position.y += 2;
                                        circleWaveArray[i].circleWave.mesh.position.y -= 2;
                                    } else {
                                        circleWaveArray[i + 1].circleWave.mesh.position.y -= 2;
                                        circleWaveArray[i].circleWave.mesh.position.y += 2;
                                    }
                                }


                                if (circleWaveArray[i].circleWave.mesh.position.y == circleWaveArray[i + 1].circleWave.mesh.position.y) {
                                    circleWaveArray[i].changeCircleHeights = true;
                                    circleWaveArray[i+1].changeCircleHeights = true;

                                    circleWaveArray[i+1].checkCircleHeights = false;
                                    circleWaveArray[i].checkCircleHeights = false;
                                }

                                if (circleWaveArray[i].changeCircleHeights) {
                                    circleWaveArray[i].circleWave.mesh.rotation.y += 0.02;
                                    circleWaveArray[i + 1].circleWave.mesh.rotation.y -= 0.02;

                                    circleWaveArray[i].circleWave.mesh.position.y +=2;
                                    circleWaveArray[i + 1].circleWave.mesh.position.y -=2;

                                    var xi = circleWaveArray[i].circleWave.mesh.position.x;
                                    var yi = circleWaveArray[i].circleWave.mesh.position.y;

                                    var xi1 = circleWaveArray[i+1].circleWave.mesh.position.x;
                                    var yi1 = circleWaveArray[i+1].circleWave.mesh.position.y;


                                    circleT += 0.01;

                                    circleWaveArray[i].circleWave.mesh.position.x += 10*freqAverage*Math.cos(circleT);
                                    circleWaveArray[i].circleWave.mesh.position.y += 10*freqAverage*Math.sin(circleT);

                                    circleWaveArray[i+1].circleWave.mesh.position.x -= 10*freqAverage*Math.cos(circleT);
                                    circleWaveArray[i+1].circleWave.mesh.position.y -= 10*freqAverage*Math.sin(circleT);

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

                console.log(circleWaveArray.length);

                for(var i=0; i<circleWaveArray.length; i++) {
                    var circleWave = circleWaveArray[i].circleWave.mesh;
                    circleWaveArray.splice(i,1);
                    scope.scene.remove(circleWave);
                }
                circleT = 0;
                levelNineActive = false;
            }


            /**
             * MODES(nice to have)
             */


            function bounceSpheres() {

            }

            function createKaleidoscope() {

            }

            function animateKaleidoscope() {

            }

            function flowerOfLife() {

            }


            function harmonograph() {

            }

            function knickBackground() {

            }


            function createLineNoise() {

            }

            function spirograph() {

            }

            function lissajous() {

            }

            function morphObject() {

            }

            function eulerFluid() {

            }

            function explode() {

            }


            function createFloor() {
                var floor = new THREE.PlaneGeometry(20000, 20000, 50, 50);
                floor.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
                var material = new THREE.MeshBasicMaterial({color: new THREE.Color(0.22 * 3, 0.22 * 6, 0.22 * 3)});   //({color: 0x551A8B});
                return new THREE.Mesh(floor, material);
            }

            // http://mrdoob.com/projects/voxels/#A/ahhadcajiaeeUhWffUhYhcfhSfWhhSfUhYhcfhYhWdhWkfUhUhUhUhUhUhUhUhUhUhUhUhSfWhhSfUhUhUhUhUhUhUhUhUhUhUhWbf

            function showChildren() {
                for(var i = 0;i<scope.scene.children.length;i++) {
                    console.log(scope.scene.children[i]);
                }
            }

            function removeObjects() {
                for(var i=0; i<particleArray.particles.length; i++) {
                    if(particleArray.particles[i].spiralParticle.mesh.position.z > 2000) {
                        var particle = particleArray.particles[i].spiralParticle.mesh; //scope.scene.getObjectById(particleArray.particles[i].spiralParticle.geometry.id);
                        particleArray.particles.splice(i,1);
                        scope.scene.remove(particle);
                 //       console.log("removed particle");
                    }
                    if(particleArray.particles.length < 30) {
                        levelEightActive = false;
                 //       console.log("LevelEightINACTIVE");

                    }
                }

                for(i=0; i<planeArray.length; i++) {
                    if(planeArray[i].mesh.position.y > 700) {
                        var plane = planeArray[i].mesh; //scope.scene.getObjectById(planeArray[i].geometry.id);
            //            console.log(plane);
                        planeArray.splice(i,1);
                        scope.scene.remove(plane);
            //            console.log("removed plane");

                    }
                }

                for(i=0; i<backgroundNoiseArray.length; i++) {
                    if(backgroundNoiseArray[i].mesh.position.z > 2000) {
                        var noise = backgroundNoiseArray[i].mesh; //scope.scene.getObjectById(planeArray[i].geometry.id);
                        //            console.log(plane);
                        backgroundNoiseArray.splice(i,1);
                        scope.scene.remove(noise);
                        //            console.log("removed plane");

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

            this.clearCanvas = function() {
                for (var i = scope.scene.children.length - 1; i >= 0 ; i -- ) {
                    scope.scene.remove(scope.scene.children[ i ]);
                }
                objectArray = [];
                objectCount = 0;


                backgroundNoiseArray = [];
                shapeArray = [];
                planeArray = [];
                TDNoiseArray = [];
                circleWaveArray = [];
                rayArray = [];
                curveArray = [];

                scope.scene.remove(scope.scene.getObjectByName("fftLinesMesh"));
                scope.scene.remove(scope.scene.getObjectByName("line1"));
                scope.scene.remove(scope.scene.getObjectByName("line2"));
                scope.scene.remove(scope.scene.getObjectByName("sphereMesh"));

                var floor = new Floor();
                this.addBufferGeometry(floor, [0,-300,0]);
            };



            /**
             * RAYCASTER
             */

            var raycaster = new THREE.Raycaster();

            var intersectionArray = [];

            function findIntersections() {
                // find intersections

                var vector = new THREE.Vector3(mouse.x, mouse.y, 1).unproject(scope.camera);

                raycaster.set(scope.camera.position, vector.sub(scope.camera.position).normalize());

                var intersects = raycaster.intersectObjects(scope.scene.children);

                if (intersects.count > 0) {

                    for(var i= 0, j=0;i<intersects.length;i++) {
                        if(intersects[i].mesh.name == "planeMesh") {
                            intersectionArray[j] = intersects[i];
                        }
                    }

                }

            }

        };

        return Scene;

    })); // define
