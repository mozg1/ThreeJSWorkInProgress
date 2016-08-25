/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var Line = function () {

            this.geometry = new THREE.PlaneBufferGeometry(4096, 1, 80, 16);
            this.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

            var displacement = new Float32Array(this.geometry.attributes.position.count * 3);

            this.geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));

            var uniforms = {
                time: {type: "f", value: 0.0},
                color: { value: new THREE.Color(0x000000) }
            };

            var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                fragmentShader: Shaders.getFragmentShader('line'),
                vertexShader: Shaders.getVertexShader('line')

                //     wireframe: true
            });

            this.mesh = new THREE.Mesh(this.geometry, shaderMaterial);
       //     this.mesh.name = "lineMesh";

            this.getMesh = function() {
                return this.mesh;
            };
/*
            var material = new THREE.LineBasicMaterial({
                color: 0xffffff
            });

            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(-1000, 0, 0));
            geometry.vertices.push(new THREE.Vector3(-90, 0, 0));
            geometry.vertices.push(new THREE.Vector3(10, 0, 0));

            var line = new THREE.Line(geometry, material);

            this.getMesh = function() {
                return line;
            };
*/

        };

        return Line;

    }));
