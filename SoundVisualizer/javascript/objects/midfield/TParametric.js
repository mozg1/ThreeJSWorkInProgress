/* requireJS module definition */
define(["three"],
    (function(THREE) {

        "use strict";

        var TParametric = function(func, segments) {
            this.geometry = new THREE.ParametricGeometry( func, segments, segments);

            var material = new THREE.MeshLambertMaterial( { color: 0xffffff, emissive: 0x0000ff, reflectivity:100, wireframe: true, transparent: true, opacity: 0.5 } );
            this.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/Math.random()));
            this.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI/Math.random()));

            this.mesh = new THREE.Mesh( this.geometry, material );

            this.mesh.name = "paramMesh";

            this.getMesh = function() {
                return this.mesh;
            };
        };

        return TParametric;
}));