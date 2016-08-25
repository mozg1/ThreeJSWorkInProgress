/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var backgroundParticle = function() {

            this.geometry = new THREE.CircleBufferGeometry( 5, 32 );
            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true, opacity: 0.65 } );
            this.mesh = new THREE.Mesh( this.geometry, material );
            this.mesh.name = "backgroundParticleMesh";

            this.getMesh = function() {
                return this.mesh;
            };


        };

        return backgroundParticle;

    }));

