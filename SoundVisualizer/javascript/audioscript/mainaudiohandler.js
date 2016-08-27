/**
 * Created by PC1 on 24.06.2016.
 */
var source;
var audioBuffer;
var dropArea;
var audioContext = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
var analyser;

var fftSize;
var freqRange = 22050;

var freqByteData;
var freqFloatData;
var timeByteData;
var timeFloatData;

var levels;
var normLevel = 0;
var gainNode;

var readyToPlay = 0;
var finishedLoading = false;
var micAllowed = false;

function createSource() {
    source = audioContext.createBufferSource();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 16384;

    gainNode = audioContext.createGain();

    source.connect(gainNode);
    // Connect audio processing graph
    source.connect(analyser);

    gainNode.connect(audioContext.destination);
    analyser.connect(audioContext.destination);

    console.log(gainNode.gain.value);

}

//load sample MP3
function loadSampleTrack() {

    console.log("will load sample audio");
    createSource();

    console.log(audioContext.sampleRate);
    console.log(audioContext);

    urlAudioBuffer("music/WNSHM.mp3");

}

function urlAudioBuffer(url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
            audioBuffer = buffer;
            console.log(audioBuffer);
            finishLoading(audioBuffer);
        }, function(e) {
            console.log(e);
        });

    };

    request.send();
}

function dataAudioBuffer(data) {
    createSource();

    audioContext.decodeAudioData(data, function(buffer) {
        audioBuffer = buffer;
        console.log(audioBuffer);
        finishLoading();
    }, function(e) {
        console.log(e);
    });

}

function finishLoading() {
    source.buffer = audioBuffer;
    source.loop = false;
    finishedLoading = true;

    // GAINNODE VALUES FROM -1 TO 1 !
    gainNode.gain.value = -0.5; //-0.9;

    console.log(gainNode.gain.value);

    setReadyState();
}

function playAudio() {
    source.start(0.0);
}

function stopAudio() {
    source.stop();
}

function setVolume(value) {
    if(value > 50.0) {
        // volume is between 0 and 1
        value = ((value-50.0)*2.0)/100.0;
    } else {
        value = ((value*2.0)/100.0)*(-1.0);
    }
    gainNode.gain.value = value;
}

function mute() {
    if(gainNode.gain.value != -1) {
        gainNode.gain.value = -1;
        console.log("muted");
    } else {
        gainNode.gain.value = 1;
        console.log("unmuted");
    }
}

function setMicrophone() {
    if(!navigator.mediaDevices.getUserMedia) {
        alert("Whoops, your browser doesn't support JavaScript mediaDevices!")
        return false;
    } else {
        micAllowed = true;
        var p = navigator.mediaDevices.getUserMedia({ audio: true, video: false});

        p.then(function(stream) {
            createSource();

            microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);
            setReadyState();
        });

        p.catch(function(err) { alert("an error occured: "+err.name); });

        return true;
    }

}


function setReadyState(){
    freqByteData = new Uint8Array(analyser.frequencyBinCount);
    freqFloatData = new Float32Array(analyser.frequencyBinCount);

    timeByteData = new Uint8Array(analyser.frequencyBinCount);
    timeFloatData = new Float32Array(analyser.frequencyBinCount);
    levels = [];
    readyToPlay = 1;
    console.log(readyToPlay);
}
