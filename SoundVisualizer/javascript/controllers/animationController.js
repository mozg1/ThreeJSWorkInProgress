/**
 * Created by PC1 on 22.08.2016.
 */

function animateSphere2() {
    var sphere2 = scope.scene.getObjectByName("sphere2mesh");
    visualize(sphere2);
}

function animateFloor() {
    var floor = scope.scene.getObjectByName("floorMesh");

    //    var time = Date.now() * 0.01;

    var displacement = floor.geometry.attributes.displacement;

    var audioData = getAudioFreqData();
    var freqAverage = getFreqAverage(audioData);

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


function animateParticleSpiral() {
    if(particleArray.particles.length == 0) {
        return;
    }

    if(!levelEightActive) {

        //       if(!shootingIYFParticles) {

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
            //         }

        }

    } else {
        shootIYFParticles(particleArray);
        //           console.log("shoot");
    }
}

function animateOrbit() {

}


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



function animate3DNoise() {
    if (TDNoiseArray.length == 0) {
        return;
    }

    var freqAve = getFreqAverage(getAudioFreqData());

    for(var i = 0; i<TDNoiseArray.length; i++) {
        TDNoiseArray[i].mesh.position.x -= 100 * freqAve;
        TDNoiseArray[i].mesh.rotation.z += freqAve;
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

        var ave = getFreqAverage(getAudioFreqData());

        var x = particleArray.particles[j].spiralParticle.mesh.position.x;
        var y = particleArray.particles[j].spiralParticle.mesh.position.y;
        var z = particleArray.particles[j].spiralParticle.mesh.position.z;

        particleArray.particles[j].spiralParticle.mesh.position.set(x+=ave*getRandomArbitrary(-90,80), y+=ave*getRandomArbitrary(-20,70), z+=ave*90);
    }

}



function animatePlanes() {
    var ave = getFreqAverage(getAudioFreqData());

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
            planeArray[i].mesh.position.x += ave * 10 * Math.random();
        } else {
            // rechte Planes
            planeArray[i].mesh.position.x -= ave * 10 * Math.random();

        }
        planeArray[i].mesh.position.y += ave * 10 * Math.random();
        planeArray[i].mesh.position.z += ave * 10 * Math.random();

        var scaleFactor = getFreqAverage(getAudioFreqData())*2;

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

var t = 0;


/**
 * ANIMATION / VISUALIZATION
 */

function drawFrequencyDomain() {

    var fftLines;
    for(var i = 0; i<objectArray.length;i++) {
        if(objectArray[i].mesh.name == "fftLinesMesh") {
            fftLines = objectArray[i];
        }
    }

    if(!fftLines ) {
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


/**
 * object must be mesh
 * @param mesh
 */

function visualize(mesh) {
    var time = Date.now() * 0.01;

    var displacement = mesh.geometry.attributes.displacement;

    var audioData = getAudioFreqData();
    var freqAverage = getFreqAverage(audioData);

    if(mesh.name == "sphere2mesh") {
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


function animateSphere2() {
    var sphere2 = scope.scene.getObjectByName("sphere2mesh");
    visualize(sphere2);
}

function animateFloor() {
    var floor = scope.scene.getObjectByName("floorMesh");

    //    var time = Date.now() * 0.01;

    var displacement = floor.geometry.attributes.displacement;

    var audioData = getAudioFreqData();
    var freqAverage = getFreqAverage(audioData);

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


function animateParticleSpiral() {
    if(particleArray.particles.length == 0) {
        return;
    }

    if(!levelEightActive) {

        //       if(!shootingIYFParticles) {

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
            //         }

        }

    } else {
        shootIYFParticles(particleArray);
        //           console.log("shoot");
    }
}

function animateOrbit() {

}

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


function animate3DNoise() {
    if (TDNoiseArray.length == 0) {
        return;
    }

    var freqAve = getFreqAverage(getAudioFreqData());

    for(var i = 0; i<TDNoiseArray.length; i++) {
        TDNoiseArray[i].mesh.position.x -= 100 * freqAve;
        TDNoiseArray[i].mesh.rotation.z += freqAve;
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

        var ave = getFreqAverage(getAudioFreqData());

        var x = particleArray.particles[j].spiralParticle.mesh.position.x;
        var y = particleArray.particles[j].spiralParticle.mesh.position.y;
        var z = particleArray.particles[j].spiralParticle.mesh.position.z;

        particleArray.particles[j].spiralParticle.mesh.position.set(x+=ave*getRandomArbitrary(-90,80), y+=ave*getRandomArbitrary(-20,70), z+=ave*90);
    }

}

//         var planeCounter = 0;

function animatePlanes() {
    var ave = getFreqAverage(getAudioFreqData());

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
            planeArray[i].mesh.position.x += ave * 10 * Math.random();
        } else {
            // rechte Planes
            planeArray[i].mesh.position.x -= ave * 10 * Math.random();

        }
        planeArray[i].mesh.position.y += ave * 10 * Math.random();
        planeArray[i].mesh.position.z += ave * 10 * Math.random();

        var scaleFactor = getFreqAverage(getAudioFreqData())*2;

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
    if(levelSevenActive) {
        shootBackgroundNoise();

    }
}

function shootBackgroundNoise() {
    if(backgroundNoiseArray.length == 0) {
        return;
    }

    for (var j = 0; j < backgroundNoiseArray.length; j++) {

        var ave = getFreqAverage(getAudioFreqData());

        var x = backgroundNoiseArray[j].mesh.position.x;
        var y = backgroundNoiseArray[j].mesh.position.y;
        var z = backgroundNoiseArray[j].mesh.position.z;

        backgroundNoiseArray[j].mesh.position.set(x+=ave*getRandomArbitrary(-1,1), y+=ave*getRandomArbitrary(-5,5), z+=ave*500);
    }

}


var circleT = 0;

function animateCircleWaves() {
    if(circleWaveArray.length == 0) {
        return;
    }

    var freqAve = getFreqAverage(getAudioFreqData());

    for(var i= 0, j=0; j<circleWaveArray.length; i++,j++) {
        if(circleWaveArray[j].circleWave != undefined) {
            visualize(circleWaveArray[j].circleWave.mesh);

            if(levelNineActive) {
                circleWaveArray[j].circleWave.mesh.scale.set(freqAve*3, freqAve*3, freqAve*3);
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

                    circleWaveArray[i].circleWave.mesh.position.x += 10*freqAve*Math.cos(circleT);
                    circleWaveArray[i].circleWave.mesh.position.y += 10*freqAve*Math.sin(circleT);

                    circleWaveArray[i+1].circleWave.mesh.position.x -= 10*freqAve*Math.cos(circleT);
                    circleWaveArray[i+1].circleWave.mesh.position.y -= 10*freqAve*Math.sin(circleT);

                }

                i++;

            }
        }
    }
}
