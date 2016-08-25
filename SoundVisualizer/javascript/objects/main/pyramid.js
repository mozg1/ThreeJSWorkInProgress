/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        // http://stackoverflow.com/questions/26418591/how-to-make-a-rectangular-pyramid-in-three-js-r68

        var Pyramid = function () {

            var TILE_SIZE = 10;

            this.geometry = new THREE.CylinderBufferGeometry( 1, TILE_SIZE*3, TILE_SIZE*3, 4 );

            var displacement = new Float32Array(this.geometry.attributes.position.count * 3);

            this.geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));

            var uniforms = {
                amplitude: { value: 1.0 },
                time: {type: "f", value: 0.0},
                color: { value: new THREE.Color(0x000000) },
                texture: {value: new THREE.TextureLoader().load("./textures/arthur.jpg")}

            };

            var attributes = this.geometry.attributes;
            console.log(attributes);

            var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                fragmentShader: Shaders.getFragmentShader('sphere'),
                vertexShader: Shaders.getVertexShader('sphere'),
                wireframe: true
            });

            this.mesh = new THREE.Mesh( this.geometry, shaderMaterial );

            this.mesh.name = "pyramidMesh";

            this.getMesh = function() {
                return this.mesh;
            };

        };

        return Pyramid;

    }));