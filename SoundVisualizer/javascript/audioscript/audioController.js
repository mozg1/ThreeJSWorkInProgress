/**
 * Created by PC1 on 22.08.2016.
 */


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


    } else {
        analyser.getByteFrequencyData(freqByteData);

        //    console.log(freqByteData);
        return freqByteData;
    }
}

function getAudioTimeData() {
    if (!readyToPlay) {


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
