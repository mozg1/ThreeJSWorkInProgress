/* requireJS module definition */
define(["three"],
    (function(THREE) {

        "use strict";

        var backgroundParticle = function() {

            this.geometry = new THREE.CircleBufferGeometry( 5, 32 );
            var material = new THREE.MeshBasicMaterial( { color: 0x0000ff,
                transparent: true,
           //     side: THREE.DoubleSide,
                opacity: 0.65 } );
            this.mesh = new THREE.Mesh( this.geometry, material );
            this.mesh.name = "backgroundParticleMesh";

            this.getMesh = function() {
                return this.mesh;
            };


        };

        return backgroundParticle;

    }));

