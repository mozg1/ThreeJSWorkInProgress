/**
 * Created by Alexander Zorin on 21.06.2016.
 * Ankerpunkt des Programms
 */

/*
 *  RequireJS alias/path configuration (http://requirejs.org/)
 */

requirejs.config({
    paths: {

        // libs
        "jquery": ['../lib/jquery-3.1.1.min'],
        "three" : "../lib/three.min",

        // main components
        "scene" : "./javascript/scene/scene",
        "mainController": "./javascript/controllers/mainController",
        "orbitcontrols": "./javascript/utils/orbitcontrols",

        // background
        "backgroundParticle": "./javascript/objects/background/backgroundParticle",
        "fftLines": "./javascript/objects/background/fftLines",
        "star": "./javascript/objects/background/star",
        "octahedron": "./javascript/objects/background/octahedron",

        // midfield
        "plane": "./javascript/objects/midfield/plane",
        "curve": "./javascript/objects/midfield/curve",
        "TParametric": "./javascript/objects/midfield/TParametric",
        "shape": "./javascript/objects/midfield/shape",
        "orbitalSphere": "./javascript/objects/midfield/orbitalSphere",

        // front
        "frontalPlane": "./javascript/objects/front/frontalPlane",
        "frontRay": "./javascript/objects/front/frontRay",
        "ray": "./javascript/objects/front/ray",
        "connectingline": "./javascript/objects/front/connectingline",

        // main & main particles
        "circleWave": "./javascript/objects/main/circleWave",
        "line": "./javascript/objects/main/line",
        "sphereMain": "./javascript/objects/main/sphereMain",
        "pyramid": "./javascript/objects/main/pyramid",
        "torusKnot": "./javascript/objects/main/torusKnot",
        "torus": "./javascript/objects/main/torus",
        "floor": "./javascript/objects/main/floor",

        // shaders
        "shaders": "shaders"

    },
    shim: {
        three: {
            exports: 'THREE'
        }
    }

});


/* requireJS module definition */
define(["jquery", "three", "scene", "mainController"],

    // Vorgehensweise ist dem Computergrafik 2 Modul WS 2015/16 bei Christian Hildebrand nachgeahmt

    (function($, THREE, Scene, mainController) {

        "use strict";

        $(document).ready( (function() {

            console.log("document ready - starting!");

            var body = $("body");
            var container = $("#drawing_container");
            var canvasWidth = body.attr("width");
            var canvasHeight = body.attr("height");

            // Erstelle neues WebGLRenderer Canvas, mit Atnialiasing/Kantenglättung Option
            // Setze eine Farbe und Maße für das Canas
            var renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setSize(canvasWidth, canvasHeight);
            renderer.setClearColor(0x000000, 1);

            // Füge das Canvas dem drawing-Container div hinzu
            container.get(0).appendChild(renderer.domElement);

            var canvas = renderer.domElement;

            $("canvas").css({"z-index": "9"});

            // erstelle neues Szenenobjekt, übergebe ihm den WenGL Renderer Context
            // und beginne mit dem rendern
            var scene = new Scene(renderer, canvasWidth, canvasHeight);
            scene.draw();

            // erstelle neues Controller Objekt
            var controller = new mainController(scene);

        }));

    }));
