
/**
 * SOUND MODULE
 */

var freqData = getAudioFreqData();
var timeData = getAudioTimeData();
var freqAverage = getFreqAverage(freqData);

/**
 * hole die aktuellen Frequenzdaten nach der FFT aus dem freqByteData Array(mainAudioHandler)
 * @returns {freqByteData|*}
 */
function getAudioFreqData() {
    if (!readyToPlay) {

    } else {
        analyser.getByteFrequencyData(freqByteData);

        if(micAllowed || normlicht) {
            for(var i=0;i<freqByteData.length;i++) {
                freqByteData[i] = freqByteData[i]*2;
            }
        }

        return freqByteData;
    }
}


function getAudioTimeData() {
    if (!readyToPlay) {

    } else {
        analyser.getFloatTimeDomainData(timeFloatData);
    //    console.log(timeFloatData);
        return timeFloatData;
    }
}

/**
 * AUDIO - FUNCTIONALITY
 *
 * Berechne den normierten durchschnittlichen Gesamtpegel
 */

function getFreqAverage(freqByteData) {

    if (!readyToPlay)
        return;

    var sum = 0;
    for (var j = 0; j < freqByteData.length; j++) {
        sum += freqByteData[j];
    }

    var average = sum / freqByteData.length;
    normLevel = (average / 256); // 256 = Byte Wertebereich
 //   console.log(normLevel);
    return normLevel;
}

/**
 * CONSTANTLY UPDATE AUDIOBUFFER FOR VISUALIZATION
 * schreibe den FFT-Buffer in globale Variablen, damit sie jederzeit geprüft werden können
 */
function getContinousAudioData() {
    freqData = getAudioFreqData();
    timeData = getAudioTimeData();
    freqAverage = getFreqAverage(freqData);
}

/**
 * Extarhiere die Daten aus einem durch lower und upper festgelegten Frequenzbereich aus dem
 * Haupt-FFT freqData Buffer
 * @param lower
 * @param upper
 * @returns {Array}
 */

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
    return getFreqRange(0,sectionArray[0]);
}

function getBassband() {
    return getFreqRange(sectionArray[0]+1,sectionArray[1]);

}

function getLowmid() {
    return getFreqRange(sectionArray[1]+1,sectionArray[2]);
}

function getMidrange() {
    return getFreqRange(sectionArray[2]+1,sectionArray[3]);
}

function getUppermids() {
    return getFreqRange(sectionArray[3]+1,sectionArray[4]);

}

function getBrightness() {
    return getFreqRange(sectionArray[4]+1,sectionArray[5]);
}

function getHighFreq() {
    return getFreqRange(sectionArray[5]+1,sectionArray[6]);
}

function getUltraHighFreq() {
    return getFreqRange(sectionArray[6]+1,sectionArray[7]);
}

/**
 * experimentelle Kick-Detection
 */

function detectKick() {
    var fullFreqAverage = getFreqAverage(getAudioFreqData());
    var subBassAverage = getFreqAverage(getSubbass());
    var bassBandAverage = getFreqAverage(getBassband());
    var lowMidAverage = getFreqAverage(getLowmid());

    var highFreqAverage = getFreqAverage(getBrightness());

    if(bassBandAverage > highFreqAverage) {
        if(bassBandAverage > 0.65 && fullFreqAverage > 0.2) {
            //            console.log("BEAT!");
        }
        if(bassBandAverage > 0.65 && fullFreqAverage < 0.2) {
            //            console.log("BEAT2!");
        }
    }

}

