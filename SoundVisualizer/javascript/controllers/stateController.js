/**
 * Created by PC1 on 22.08.2016.
 */

function getActiveLevels() {

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
    }
    if(levelOne) { // hellblau
        levelOneActive = true;
        //              scope.createCurves();
    }
    if(levelTwo) { // grünblau
        levelTwoActive = true;
        scope.create3DNoise();
    }
    if(levelThree) { // hellgrün
        scope.createBackgroundNoise();
        levelThreeActive = true;
    }
    if(levelFour) { // grün
        deleteCircleWaves();
        scope.createDots();
        //              scope.createFastRays();
        levelFourActive = true;
    }
    if(levelFive) { // grüngelb
        scope.createPlanes();
        levelFiveActive = true;
    }
    if(levelSix) { // gelb
        scope.createShapes();
        moveBackground();
        // flacker background
        // disconnect shapes
        // change background particle movement
        levelSixActive = true;
    }
    if(levelSeven) { // orange
        scope.createCircleWaves();

        // connect shapes
        levelSevenActive = true;
    }
    if(levelEight) { // rot
        // Spiralenwechsel
        drawTimeDomain();
        console.log("LevelEightActive");
        levelEightActive = true;
    }
    if(levelNine) { // lila
        // Hauptfigur-wechsel
        console.log("levelNineActive");
        levelNineActive = true;
    }
    if(levelTen) { // öhhhhhhhh
        console.log("levelTenActive");
        levelTenActive = true;
    }
    if(levelEleven) { // white
        console.log("whatheactualfuck");
    }

}


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


function setLevel() {

    var audioData = getAudioFreqData();
    var freqAverage = getFreqAverage(audioData);


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

    } else if (freqAverage >= 0.20 && freqAverage < 0.25) {

        levelThree = true;
        levelTwo = false;
        levelFour = false;

    } else if(freqAverage >= 0.25 && freqAverage < 0.30) {

        levelFour = true;
        levelThree = false;
        levelFive = false;

    } else if (freqAverage >= 0.30 && freqAverage < 0.33) {

        //    if(!levelFiveActive) {
        levelFive = true;
        //    }
        levelFour = false;
        levelSix = false;
    } else if(freqAverage >= 0.33 && freqAverage < 0.35) {

        levelSix = true;
        levelFive = false;
        levelSeven = false;

    } else if(freqAverage >= 0.35 && freqAverage < 0.37) {

        levelSeven = true;
        levelSix = false;
        levelEight = false;

    } else if(freqAverage >= 0.37 && freqAverage < 0.42) {
        levelEight = true;
        levelSeven = false;
        levelNine = false;

    } else if(freqAverage >= 0.42 && freqAverage < 0.47) {
        levelNine = true;
        levelEight = false;
        levelTen = false;

    } else if(freqAverage >= 0.47 && freqAverage < 0.52) {
        levelTen = true;
        levelNine = false;

    } else if(freqAverage >= 0.52 && freqAverage < 0.60) {
        levelTen = false;
        levelEleven = true;
    }
}