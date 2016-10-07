/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var Pyramid = function () {

            var side = 50;

            this.geometry = new THREE.CylinderBufferGeometry( 1, side*3,side*3, 4 );

            var displacement = new Float32Array(this.geometry.attributes.position.count * 3);

            this.geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));

            var uniforms = {
                amplitude: { value: 1.0 },
                time: {type: "f", value: 0.0},
                color: { value: new THREE.Color(0x000000) }
            };

            var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                fragmentShader: Shaders.getFragmentShader('central'),
                vertexShader: Shaders.getVertexShader('central'),
                wireframe: true
            });

            this.mesh = new THREE.Mesh( this.geometry, shaderMaterial );

            this.mesh.name = "mainPyramidMesh";

            this.getMesh = function() {
                return this.mesh;
            };

        };

        return Pyramid;

    }));