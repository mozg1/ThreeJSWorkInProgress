/**
 * Created by Alexander Zorin on 21.06.2016.
 */


/* requireJS module definition */
define(["jquery", "simplewave", "shape", "random", "floor", "sphereMain", "line", "torus", "fftLines", "parametric"],
    (function($, Simplewave, Shape, Random, Floor, SphereMain, Line, Torus, fftLines, Parametric) {
        "use strict";


        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var Controller = function (scene) {

            var playing = false;

            var startTime;

            $("#playAudio").click((function () {

                if (readyToPlay && !playing) {
                    scene.planetLight();
                    var sphere = new SphereMain();
                    scene.initializeMainObject(sphere);
                    scene.addBufferGeometry(sphere, [0,0,0]);

                    startTime = Date.now();

                    scene.addBufferGeometry(new fftLines(), [0,-200,0]);


                    var line1 = new Line();
                    line1.mesh.name = "line1";
                    scene.addBufferGeometry(line1, [0,600,0]);

                    var line2 = new Line();
                    line2.mesh.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI ));
                    line2.mesh.name = "line2";
                    scene.addBufferGeometry(line2, [0,-600,0]);

                    playAudio();

                    playing = true;
                    scene.activateAnimation();
                    $("#playAudio").attr('disabled', 'disabled').fadeOut("slow");
                } else {
                    stopVisualizer();
                }

            }));

            $("#chooseInput").click((function () {
                if(playing) {
                    stopVisualizer();
                }
                $("#controls").fadeOut("slow", function () {
                    $("#overlay").fadeIn("slow");
                });
            }));

            function stopVisualizer() {
                stopAudio();
                scene.deactivateAnimation();
                scene.clearCanvas();
                playing = false;
            }
            $('#modeSelector').change(function() {
                var mode;

                switch($(this).val()) {
                    case "mode80s" :
                        mode = 0;
                        break;
                    case "modeDeepBlue" :
                        mode = 1;
                        break;
                    case "modeDarkRed" :
                        mode = 2;
                        break;
                    default:
                        mode = 0;
                }
                scene.setCurrentMode(mode);

            });

            var floor = new Floor();
            scene.addBufferGeometry(floor, [0,-300,-3000]);

            var torus = new Torus();
     //       scene.addBufferGeometry(ring, [0,0,1500]);

    };

        return Controller;

    }));