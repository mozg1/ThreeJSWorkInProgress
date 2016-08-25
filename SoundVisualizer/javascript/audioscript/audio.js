/**
 * Created by Alexander Zorin on 21.06.2016.
 */
var dataArray;
var bufferLength;

function init() {
    // WebKitAudio
    var audioCtx = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
    var analyser = audioCtx.createAnalyser();

    source = audioCtx.createMediaStreamSource(stream);      // Creates a MediaStreamAudioSourceNode associated with a MediaStream representing an audio stream which may come from the local computer microphone or other sources.
    source.connect(analyser);
    analyser.connect(distortion);       // other options include none, reverb and Bass Boost

    analyser.fftSize = 4096;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    analyser.getByteTimeDomainData(dataArray);      // get waveform as array of numbers between 0 and 256 with 128 = silence
}


// https://www.airtightinteractive.com/2013/10/making-audio-reactive-visuals/
// http://www.html5rocks.com/en/tutorials/webaudio/intro/?redirect_from_locale=de
var AudioHandler = function() {

    var dataArray;
    var audioCtx;
    var buf;

    var source;
    var buffer;
    var audioBuffer;
    var dropArea;
    var analyser;

    var freqByteData; //bars - bar data is from 0 - 256 in 512 bins. no sound is 0;
    var timeByteData; //waveform - waveform data is from 0-256 for 512 bins. no sound is 128.
    var levelsCount = 512; //should be factor of 512

    document.onload = function init() {

        events.on("update", update);

        // WebKitAudio
        audioCtx = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
        analyser = audioCtx.createAnalyser();
        loadFile();

        source = audioCtx.createMediaStreamSource(stream);      // Creates a MediaStreamAudioSourceNode associated with a MediaStream representing an audio stream which may come from the local computer microphone or other sources.
        source.connect(analyser);
        //  analyser.connect(distortion);       // other options include none, reverb and Bass Boost
        analyser.connect(audioContext.destination);

        analyser.fftSize = 4096;
        var bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        analyser.getByteTimeDomainData(dataArray);      // get waveform as array of numbers between 0 and 256 with 128 = silence

        play();
    };

    function getDataArray() {
        return dataArray;
    }

// http://joshondesign.com/p/books/canvasdeepdive/chapter12.html

    function loadFile() {
        var req = new XMLHttpRequest();
        req.open("GET", "../music/Dendemann.mp3", true);
        req.responseType = "arraybuffer";
        req.onload = function () {
            //decode the loaded data
            audioCtx.decodeAudioData(req.response, function (buffer) {
                buf = buffer;
                play();
            }, function (e) {
                console.log(e);
            });
        };
        req.send();
    }

//play the loaded file
    function play() {
        //create a source node from the buffer
        var src = audioCtx.createBufferSource();
        src.buffer = buf;
        //connect to the final output node (the speakers)
        src.connect(audioCtx.destination);
        //play immediately
        src.noteOn(0);


        source.buffer = dataArray;
        source.loop = true;
        source.start(0.0);
        readyToPlay = true;
    }

    //load dropped MP3
    function onMP3Drop(evt) {

        //TODO - uncheck mic and sample in CP

        play();

        source = audioContext.createBufferSource();
        source.connect(analyser);

        var droppedFiles = evt.dataTransfer.files;
        var reader = new FileReader();
        reader.onload = function(fileEvent) {
            var data = fileEvent.target.result;
            onDroppedMP3Loaded(data);
        };
        reader.readAsArrayBuffer(droppedFiles[0]);
    }

    //called from dropped MP3
    function onDroppedMP3Loaded(data) {

        if(audioCtx.decodeAudioData) {
            audioCtx.decodeAudioData(data, function(buffer) {
                audioBuffer = buffer;
                play();
            }, function(e) {
                console.log(e);
            });
        } else {
            audioBuffer = audioCtx.createBuffer(data, false );
            play();
        }
    }


//load sample MP3
    function loadSampleAudio() {

        source = audioContext.createBufferSource();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;

        // Connect audio processing graph
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        urlAudioBuffer("mp3/computer_jazz.mp3");
    }

};