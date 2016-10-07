/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var SphereMain = function() {

            var radius = 50, segments = 77, rings = 77;

            this.geometry = new THREE.SphereBufferGeometry(radius, segments, rings);

            var displacement = new Float32Array(this.geometry.attributes.position.count);

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
                wireframe: true,
                opacity: 1.0,
                transparent: true
            });


            this.mesh = new THREE.Mesh(this.geometry, shaderMaterial );
            this.mesh.name = "mainSphereMesh";

        //    console.log(this.geometry.attributes.position);

            this.getMesh = function() {
                return this.mesh;
            };

        };

        return SphereMain;

    }));