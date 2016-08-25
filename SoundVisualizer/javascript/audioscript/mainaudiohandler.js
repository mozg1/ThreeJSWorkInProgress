/**
 * Created by PC1 on 24.06.2016.
 */
var source;
// var buffer;
var audioBuffer;
var dropArea;
var audioContext = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
//var processor;
var analyser;

var fftSize;
var freqRange = 22050;

var freqByteData;
var freqFloatData;
var timeByteData;
var timeFloatData;

var levels;
var readyToPlay = false;
var normLevel = 0;
var gainNode;

var finishedLoading = false;

function createSource() {
    source = audioContext.createBufferSource();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 16384;
}

//load sample MP3
function loadSampleAudio() {

    console.log("will load sample audio");
    createSource();

    console.log(audioContext.sampleRate);
    console.log(audioContext);

    gainNode = audioContext.createGain();

    source.connect(gainNode);
    // Connect audio processing graph
    source.connect(analyser);

    gainNode.connect(audioContext.destination);
    analyser.connect(audioContext.destination);

    console.log(gainNode.gain.value);

    urlAudioBuffer("music/Futureworld.mp3");

}

function urlAudioBuffer(url) {
    // Load asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() {

        audioContext.decodeAudioData(request.response, function(buffer) {
            audioBuffer = buffer;
            console.log(audioBuffer);
            finishLoad(audioBuffer);
        }, function(e) {
            console.log(e);
        });

    };

    request.send();
}

function dataAudioBuffer(data) {
    createSource();

    if(audioContext.decodeAudioData) {
        audioContext.decodeAudioData(data, function(buffer) {
            audioBuffer = buffer;
            finishLoad(audioBuffer)
        }, function(e) {
            console.log(e);
        });
    } else {
        alert("Incompatible file");
    }
}

/**
 * set the buffer of th AudioBufferNode
 * set loop-parameter
 * set gain
 * @param audioBuffer
 */
function finishLoad() {
    source.buffer = audioBuffer;
    source.loop = true;
    finishedLoading = true;

    // GAINNODE VALUES FROM -1 TO 1 !
    gainNode.gain.value = -0.5; //-0.9;

    console.log(gainNode.gain.value);

    startViz();
}

function playAudio() {
    source.start(0.0);
}

function stopAudio() {
    source.stop();
}

function onDocumentDragOver(evt) {

    evt.stopPropagation();
    evt.preventDefault();
    return false;
}

function setMicrophone() {
/*
    //x-browser
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia ) {

        navigator.getUserMedia(

            {audio: true},

            function(stream) {
                //called after user has enabled mic access
                createSource();

                microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
                startViz();
            },

            function(err) {
                alert("An error occured " + err);
            });
    }
    */

    var p = navigator.mediaDevices.getUserMedia({ audio: true, video: false});

    p.then(function(stream) {
        createSource();

        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        startViz();
    });

    p.catch(function(err) { alert("an error occured: "+err.name); });

}

/*
//load dropped MP3
function onDocumentDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    if (source) source.disconnect();

    var droppedFiles = evt.dataTransfer.files;

    var reader = new FileReader();

    reader.onload = function(fileEvent) {
        var data = fileEvent.target.result;
        initAudio(data);
    };

    reader.readAsArrayBuffer(droppedFiles[0]);
    promptPanel.innerHTML = '<h1>loading...</h1>';

}

function initAudio(data) {
    source = audioContext.createBufferSource();

    if(audioContext.decodeAudioData) {
        audioContext.decodeAudioData(data, function(buffer) {
            source.buffer = buffer;
            createAudio();
        }, function(e) {
            console.log(e);
        });
    } else {
        source.buffer = audioContext.createBuffer(data, false );
        createAudio();
    }
}


function createAudio() {
    //processor = audioContext.createJavaScriptNode(2048 , 1 , 1 );

    analyser = audioContext.createAnalyser();
    analyser.smoothingTimeConstant = 0.1;

    source.connect(audioContext.destination);
    source.connect(analyser);

    //analyser.connect(processor);
    //processor.connect(audioContext.destination);

    source.start(0);

    source.loop = true;

    startViz();
}
*/

/**
 * start frequency analysis in Byte-mode and in Float-mode
 */
function startViz(){
    freqByteData = new Uint8Array(analyser.frequencyBinCount);
    freqFloatData = new Float32Array(analyser.frequencyBinCount);

    timeByteData = new Uint8Array(analyser.frequencyBinCount);
    timeFloatData = new Float32Array(analyser.frequencyBinCount);
    levels = [];
    readyToPlay = true;
    console.log(readyToPlay);
}

