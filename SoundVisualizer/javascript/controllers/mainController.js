/**
 * Created by Alexander Zorin on 21.06.2016.
 *
 * GUI-Controller
 */


define(["jquery", "shape", "floor", "sphereMain", "line", "fftLines"],
    (function($, Shape, Floor, SphereMain, Line, fftLines) {
        "use strict";


        var mainController = function (scene) {

            /**
             * Begrüßungsbildschirm FadeIn-FadeOut
             */
            $("#loadingcontent").fadeIn("slow");

            setTimeout(function() {

                $("#loadingcontent").fadeOut("slow", function() {
                    $("#inputChooser").fadeIn("slow");
                    $("#titleText").fadeIn("slow");
                    $("#impressText").fadeIn("slow");

                });

            }, 3000);

            /**
             * Option Sample Track
             */

            $("#playNormlicht").click((function () {
                closeOverlay();
                loadSampleTrack();
            }));

            /**
             * Schließe das Overlay und Zeige die Szene an, sobald der AudioBuffer initialisiert wurde
             */

            function closeOverlay() {

                if(readyToPlay!=true) {
                    for(let i=1;i<4;i++) {

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

                calculateFreqSections()
            }

            /**
             * Option Drag&Drop
             * @type {HTMLElement}
             */

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

                if(fileEnding == "mp3" || fileEnding == "wav" || fileEnding == "ogg" || fileEnding == "flac") {

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

            /**
             * Option Mikrofon
             */

            $("#microphone").click((function () {
                console.log("entered mic");
                if(setMicrophone()) {
                    console.log("should coninue");
                    closeOverlay();
                }
            }));



            var playing = false;

            /**
             * Beginne mit der Visualisierung
             * Initialisiere die Szene mit Hauptobjekten
             * Spiele den AudioBuffer ab
             * Start Button muss verschwinden
             */

            $("#playAudio").click((function () {

                if (readyToPlay && !playing) {
                    scene.createLight();
                    var sphere = new SphereMain();
                    scene.initializeMainObject(sphere);
                    scene.addMesh(sphere, [0,0,-250]);

                    scene.addMesh(new fftLines(), [0,-200,0]);


                    var line1 = new Line();
                    line1.mesh.name = "line1";
                    scene.addMesh(line1, [0,600,0]);

                    var line2 = new Line();
                    line2.mesh.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI ));
                    line2.mesh.name = "line2";
                    scene.addMesh(line2, [0,-600,0]);

                    playAudio();

                    playing = true;
                    scene.activateAnimation();
                    $("#playAudio").attr('disabled', 'disabled').fadeOut("slow");
                } else {
                    stopVisualizer();
                }

            }));

            /**
             * Gehe zurück zum Startbildschirm
             */

            $("#chooseInput").click((function () {
                if(playing || micAllowed) {
                    stopVisualizer();
                }

                $("#playAudio").attr('disabled', 'disabled');

                $("#controls").fadeOut("slow", function () {
                    $("#overlay").fadeIn("slow");
                });
            }));

            /**
             * halteVisualizer an
             */

            function stopVisualizer() {
                stopAudio();
                scene.deactivateAnimation();
                scene.clearCanvas();
                playing = false;
            }

            /**
             * Setze Farbmodus
             */

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

            /**
             * Aktiviere/Deaktiviere Sound
             */

            $("#volumecontrol").click(function() {
                mute();
                if(gainNode.gain.value == -1) {
                    $("#volumecontrol").css( "background-image" , " url(stylesheets/img/volume2.png)");
                } else {
                    $("#volumecontrol").css( "background-image" , " url(stylesheets/img/volume3.png)");

                }

            } );

            /**
             * Aktiviere/Deaktivere Kameraanimation
             */

            $("#cameraanimation").change(function() {
                if($(this).is(":checked")) {
                    scene.activateCameraAnimation()
                } else {
                    scene.deactivateCameraAnimation()
                }
            });

            var floor = new Floor();
            scene.addMesh(floor, [0,-300,-3000]);




    };

        return mainController;

    }));