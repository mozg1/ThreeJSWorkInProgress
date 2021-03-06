/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var torusKnot = function () {
            // radius, tube, tubularSegments, radialSegments, p, q
            this.geometry = new THREE.TorusKnotBufferGeometry( 30, 2, 52, 52, 1, 1 );

            console.log("TorusKnot"+ this.geometry.attributes.position.count);

            var displacement = new Float32Array(this.geometry.attributes.position.count * 3);

            this.geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));

            var uniforms = {
                amplitude: { value: 1.0 },
                time: {type: "f", value: 0.0},
                color: { value: new THREE.Color(0x000000) }
            };

            var attributes = this.geometry.attributes;
            console.log(attributes);

            var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                fragmentShader: Shaders.getFragmentShader('central'),
                vertexShader: Shaders.getVertexShader('central'),
                wireframe: true
            });

            this.mesh = new THREE.Mesh( this.geometry, shaderMaterial );

            this.mesh.name = "mainTorusKnotMesh";

            this.getMesh = function() {
                return this.mesh;
            };


        };

        return torusKnot;

    }));