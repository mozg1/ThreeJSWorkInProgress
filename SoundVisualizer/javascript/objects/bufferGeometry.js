/**
 * Created by PC1 on 04.09.2016.
 */
/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: BufferGeometry
 *
 * BufferGeometry Vertex-Arrays and Vertex-Attributes
 * stored in float32 arrays for the given attributes.
 * In our cases we assume all attributes have
 * numItems*3 size e.g. position (x, y, z), color (r, g, b)
 *
 * BufferGeometry is (at least for now) used to render Points with
 * vertexcolors.
 * Therefore we add a point material (THREE.PointsMaterial) and point container (THREE.Points).
 *
 */

/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var BufferGeometry = function () {
            /*
             * constituted of - mesh, geometry, material
             */

            this.geometry = new THREE.BufferGeometry();

            /**
             * Adds a vertex attribute, we assume each element has three components, e.g.
             * [position_x0, position_y0, position_z0, position_x1, position_y1, position_z1,...]
             * AddAttribute updates the mesh.
             *
             * @param name vertex attributes name, e.g. position, color, normal
             * @param buffer
             */
            this.addAttribute = function(name, buffer) {


                var uniforms = {
                    amplitude: { value: 1.0 },
                    time: {type: "f", value: 0.0},
                    color: { value: new THREE.Color(0xffffff) }
                };

                var shaderMaterial = new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    fragmentShader: Shaders.getFragmentShader('sphere'),
                    vertexShader: Shaders.getVertexShader('sphere'),
                    wireframe: true,
                    opacity: 1.0,
                    transparent: true
                });

                this.geometry.addAttribute(name, new THREE.BufferAttribute(buffer, 3));
                this.geometry.computeBoundingSphere();

                this.mesh = new THREE.Mesh(this.geometry, shaderMaterial);
                this.mesh.name = "mainParametricMesh";

                this.geometry.computeFaceNormals();
                this.geometry.computeVertexNormals();


                var uv = new Float32Array(this.geometry.attributes.position.count * 3);
                this.geometry.addAttribute('uv', new THREE.BufferAttribute(uv, 2));

                var displacement = new Float32Array(this.geometry.attributes.position.count * 3);
                this.geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));


                this.setIndex = function (buffer) {
                    this.geometry.setIndex(new THREE.BufferAttribute(buffer, 1));
                };

                this.setSegments = function ( buffer) {
                    this.geometry.segments = buffer;
                };

            };

            console.log(this.geometry.attributes);

            this.getMesh = function() {
                return this.mesh;
            };

        };

        return BufferGeometry;
    }));