/**
 * Created by Alexander Zorin on 21.06.2016.
 */

/*
 *  RequireJS alias/path configuration (http://requirejs.org/)
 */

requirejs.config({
    paths: {

        // jquery library
        "jquery": [
            // try content delivery network location first
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            //If the load via CDN fails, load locally
            '../lib/jquery-1.7.2.min'],

        "three" : "../lib/three.min",

        "scene" : "./javascript/scene/scene",
        "controller": "./javascript/controllers/mainController",

        "orbitcontrols": "./javascript/utils/orbitcontrols",

        "bufferGeometry": "./javascript/objects/bufferGeometry",

        "simplewave": "./javascript/objects/background/simplewave",
        "floor": "./javascript/objects/background/floor",
        "backgroundParticle": "./javascript/objects/background/backgroundParticle",
        "fftLines": "./javascript/objects/background/fftLines",


        "plane": "./javascript/objects/midfield/plane",
        "connectingline": "./javascript/objects/midfield/connectingline",
        "octahedron": "./javascript/objects/midfield/octahedron",
        "curve": "./javascript/objects/midfield/curve",

        "frontalPlane": "./javascript/objects/front/frontalPlane",
        "frontRay": "./javascript/objects/front/frontRay",
        "ray": "./javascript/objects/front/ray",
        "line": "./javascript/objects/front/line",
        "circleWave": "./javascript/objects/front/circleWave",
        "torus": "./javascript/objects/front/torus",


        "shape": "./javascript/objects/main/shape",
        "sphereMain": "./javascript/objects/main/sphereMain",
        "pyramid": "./javascript/objects/main/pyramid",
        "torusKnot": "./javascript/objects/main/torusKnot",
        "parametric": "./javascript/objects/main/parametric",

        "random": "./javascript/objects/random",

        "shaders": "shaders"

    },
    shim: {
        three: {
            exports: 'THREE'
        }
    }

});


/*
 * The function defined below is the "main" function,
 * it will be called once all prerequisites listed in the
 * define() statement are loaded.
 *
 */

/* requireJS module definition */
define(["jquery", "three", "scene", "controller"],

    (function($, THREE, Scene, Controller) {

        "use strict";


        /*
         * main program, to be called once the document has loaded
         * and the DOM has been constructed
         *
         */

        $(document).ready( (function() {

            console.log("document ready - starting!");

            var body = $("body");
            var container = $("#drawing_container");
            var canvasWidth = body.attr("width"); //css("width");//.attr("width");
            var canvasHeight = body.attr("height"); //css("height");//attr("height");


            // this creates a 3d rendering context and
            // a canvas
            var renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setSize(canvasWidth, canvasHeight);
            renderer.setClearColor(0xEEEEEE, 1);

//            body.css("margin", 0);

            // the canvas is part of the renderer as a HTML DOM
            // element and needs to be appended in the DOM
            container.get(0).appendChild(renderer.domElement);

            var canvas = renderer.domElement;

            console.log(canvas);

            $("canvas").css({"z-index": "9"});

            //
            var scene = new Scene(renderer, canvasWidth, canvasHeight);
            scene.draw();

            var mainController = new Controller(scene);

            $("#loadingcontent").fadeIn("slow");

            setTimeout(function() {

                $("#loadingcontent").fadeOut("slow", function() {
                    $("#inputChooser").fadeIn("slow");
                    $("#titleText").fadeIn("slow");
                    $("#impressText").fadeIn("slow");

                });

            }, 3000);

            $("#playNormlicht").click((function () {
                closeOverlay();
                loadSampleTrack();
            }));

            function closeOverlay() {

                if(readyToPlay!==1) {
                    for(let i=1;i<4;i++) {

                        // http://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop 13

                        setTimeout(function() {
                            if($("#spinnerDot"+i).css('display', 'none')) {
                                $("#spinnerDot"+i).fadeIn("slow");
                            } else {
                                $("#spinnerDot"+i).fadeOut("slow");
                            }
                        }, 333*i);

                    }

                    setTimeout(closeOverlay, 1000);
                    return;
                }

                $(".spinnerDot").fadeOut("slow");

                $("#overlay").fadeOut("slow", function () {
                    if($("#playAudio").css('display') == 'none') {

                        $("#controls").fadeIn("slow");
                        $("#playAudio").attr('disabled', false).fadeIn("slow");

                    } else {
                        $("#controls").fadeIn("slow");
                    }
                });
            }

            var dropDiv = document.getElementById("dropTrack");
            dropDiv.addEventListener("drop", dropTrack, false);

            function dropTrack (event) {

                event.stopPropagation();
                event.preventDefault();

                var dT = event.dataTransfer;
                console.log(dT);

                var droppedFiles = dT.files;

                // prevent user misuse
                if(droppedFiles.length > 1) {
                    droppedFiles = droppedFiles.slice(0,1);
                }

                var fileEnding = droppedFiles[0].name.substr(droppedFiles[0].name.lastIndexOf('.')+1);
                console.log(fileEnding);

                if(fileEnding == "mp3" || fileEnding == "wav" || fileEnding == "ogg") {

                    console.log(droppedFiles[0]);

                    var reader = new FileReader();

                    reader.onload = function(fileEvent) {
                        var data = fileEvent.target.result;
                        dataAudioBuffer(data);
                    };

                    reader.readAsArrayBuffer(droppedFiles[0]);

                    closeOverlay();
                } else {
                    alert("Sorry, this file-type is unsupported");
                    droppedFiles = [];

                }

            }

            $("#microphone").click((function () {
                if(setMicrophone()) {
                    closeOverlay();
                }
            }));

            $("#volumecontrol").click(function() {
                mute();
            } );

        })); // $(document).ready()

    })); // define module
