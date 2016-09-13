/**
 * Created by PC1 on 09.08.2016.
 */

/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var fftLines = function() {

            var freqBuffer = new Uint8Array(8192);

            /* Add lines */

            var material = new THREE.MeshPhongMaterial({
                opacity: 0.5,
                transparent: true,
                vertexColors: THREE.VertexColors
            });

  //          var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });


            var geometry = new THREE.Geometry();

            for(var j= 0,x=-5620; j<8192; j++, x++) {
                if(j < 3715) {
                    geometry.vertices.push(
                        new THREE.Vector3( x, 0, 0 ),
                        new THREE.Vector3( x, 0, 0 ),
                        new THREE.Vector3( x+=1, 0, 0 ),
                        new THREE.Vector3( x, 0, 0 )
                    );
                } else {
                    geometry.vertices.push(
                        new THREE.Vector3( x, 0, 0 ),
                        new THREE.Vector3( x, 0, 0 )
                    );
                }


                if(j < 22) {
                    geometry.colors.push(new THREE.Color(0xffffff),
                        new THREE.Color(0xffffff),
                        new THREE.Color(0xffffff),
                        new THREE.Color(0xffffff)
                    );
                }
                if(j >= 22 && j < 111) {
                    geometry.colors.push(new THREE.Color(0xBBDEFB), // 0xBBDEFB
                        new THREE.Color(0xffffff),
                        new THREE.Color(0xBBDEFB),
                        new THREE.Color(0xffffff)
                    );
                }
                if(j >= 111 && j < 297) {
                    geometry.colors.push(new THREE.Color(0x90CAF9),
                        new THREE.Color(0xffffff),
                        new THREE.Color(0x90CAF9),
                        new THREE.Color(0xffffff)
                    );
                }
                if(j >= 297 && j < 743) {
                    geometry.colors.push(new THREE.Color(0x64B5F6),
                        new THREE.Color(0xffffff),
                        new THREE.Color(0x64B5F6),
                        new THREE.Color(0xffffff)
                    );
                }
                if(j >= 743 && j < 2229) {
                    geometry.colors.push(new THREE.Color(0x42A5F5), // 0x42A5F5
                        new THREE.Color(0xffffff),
                        new THREE.Color(0x42A5F5),
                        new THREE.Color(0xffffff)
                    );
                }
                if(j >= 2229 && j < 3715) {
                    geometry.colors.push(new THREE.Color(0x2196F3), // 0x2196F3
                        new THREE.Color(0xffffff),
                        new THREE.Color(0x2196F3),
                        new THREE.Color(0xffffff)
                    );
                }
                if(j >= 3715 && j < 5944) {
                    geometry.colors.push(new THREE.Color(0x1E88E5), // 0x1E88E5
                        new THREE.Color(0xffffff)
                    );
                }
                if(j >= 5944 && j < 8192) {
                    geometry.colors.push(new THREE.Color(0x1565C0), // 0x1565C0
                        new THREE.Color(0xffffff)
                    );
                }
            }

            console.log(geometry.colors.length + "   vertices: " + geometry.vertices.length);
            this.line = new THREE.LineSegments( geometry, material );

            this.updateVertices = function() {
                var geometry = this.line.geometry;

                for(var i= 0, j= 0,x=-5620; j<8192; i++, j++, x++) {

                    /*
                                        if(j < 22) {
                                            geometry.colors[i] = new THREE.Color(0xb71c1c1);
                                            geometry.colors[i+1] = new THREE.Color(0xb71c1c1);
                                        }
                                        if(j > 22 && j < 111) {
                                            geometry.colors[i] = new THREE.Color(0x880e4f);
                                            geometry.colors[i+1] = new THREE.Color(0x880e4f);
                                        }
                                        if(j > 111 && j < 297) {
                                            geometry.colors[i] = new THREE.Color(0x4a148c);
                                            geometry.colors[i+1] = new THREE.Color(0x4a148c);
                                        }
                                        if(j > 297 && j < 743) {
                                            geometry.colors[i] = new THREE.Color(0x311b92);
                                            geometry.colors[i+1] = new THREE.Color(0x311b92);
                                        }
                                        if(j > 743 && j < 2229) {
                                            geometry.colors[i] = new THREE.Color(0x1a237e);
                                            geometry.colors[i+1] = new THREE.Color(0x1a237e);
                                        }
                                        if(j > 2229 && j < 3715) {
                                            geometry.colors[i] = new THREE.Color(0x0d47a1);
                                            geometry.colors[i+1] = new THREE.Color(0x0d47a1);
                                        }
                                        if(j > 3715 && j < 5944) {
                                            geometry.colors[i] = new THREE.Color(0x01579b);
                                            geometry.colors[i+1] = new THREE.Color(0x01579b);
                                        }
                                        if(j > 5944 && j < 8192) {
                                            geometry.colors[i] = new THREE.Color(0x006064);
                                            geometry.colors[i+1] = new THREE.Color(0x006064);
                                        }
                    */
                    if(j < 3715) {
                        geometry.vertices[i] = new THREE.Vector3(x, 0, -4500);
                        geometry.vertices[i += 1] = new THREE.Vector3(x, freqBuffer[j] * 5, -4500);
                        geometry.vertices[i += 1] = new THREE.Vector3(x += 1, 0, -4500);
                        geometry.vertices[i += 1] = new THREE.Vector3(x, freqBuffer[j] * 5, -4500);
                    } else {
                        geometry.vertices[i] = new THREE.Vector3(x, 0, -4500);
                        geometry.vertices[i += 1] = new THREE.Vector3(x, freqBuffer[j] * 5, -4500);
                    }
                }
            };

            this.setFrequencyPosition = function(freqByteData) {
                for(var i = 0; i<freqByteData.length; i++) {
                    freqBuffer[i] = freqByteData[i];
                }

                this.updateVertices();
            };

            this.colorVertices = function() {
                var geometry = this.line.geometry;
                geometry.vertexColors = new THREE.Color( 0xff0000 );
            };

            this.mesh = new THREE.Mesh(this.line.geometry, new THREE.MeshPhongMaterial({
           /*
                color: 0xffffff,
                emissive: 0xd3d3d3,
                specular: 0x000000,
                shininess: 50,
                shading: THREE.SmoothShading,
                opacity: 0.1,
                transparent: true
           */
            }));

            this.mesh.name = "fftLinesMesh";

            this.getMesh = function() {
                return this.line;
            };

        };

        return fftLines;

    }));