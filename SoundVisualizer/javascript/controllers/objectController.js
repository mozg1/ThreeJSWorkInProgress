/**
 * Created by PC1 on 22.08.2016.
 */

var particleArray = {
    particles: []
};


this.createFFTLines = function() {
    this.addBufferGeometry(new fftLines(), [0,-200,0]);
    //              console.log("created FFTLines");
};



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




var rayArray = [];

this.createRays = function() {
    if(rayArray.length < 20) {
        var ray = new Ray();
        ray.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI));

        this.addBufferGeometry(ray, [0,100,1000]);
        rayArray.push(ray);
    }

};



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


var shapeArray = [];

this.createShapes = function() {
    var shape = new Shape();
    if(shapeArray.length < 15) {
        this.addBufferGeometry(shape, [getRandomArbitrary(-2000,2000), getRandomArbitrary(-300, 800), 1000]);
        shapeArray.push(shape);
    }

};



var backgroundNoiseArray = [];

this.createBackgroundNoise = function() {
    var backPart = new backgroundParticle();

    if(backgroundNoiseArray.length<500) {
        scope.addBufferGeometry(backPart, [getRandomArbitrary(-1000,1000), getRandomArbitrary(-300,300), getRandomArbitrary(-1000, -2000)]);
        backgroundNoiseArray.push(backPart);
    }
};



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
