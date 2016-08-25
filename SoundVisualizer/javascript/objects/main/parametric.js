/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: ParametricSurface
 *
 */

/* requireJS module definition */


define(["three"],
    (function(THREE) {

        "use strict";
        /**
         *
         * @param posFunc - gets a pair of u,v points, returns a 3-dim coordinate array [x,y,z]
         * @param config - holds value range of posFunc(umin,umx,vmin,vmax), as well as number of segments
         * @constructor - returns an ellipsoid
         */
        var ParametricSurface = function (posFunc, config, rgb) {

            var segments = config.segments || 100;


            this.segments = segments;

            var umin = config.umin;
            var umax = config.umax;
            var vmin = config.vmin;
            var vmax = config.vmax;

            var RGB = rgb;
            var red = RGB.red;
            var green = RGB.green;
            var blue = RGB.blue;

            this.positions = [];// new Float32Array(Math.pow((segments+1),2) * 3);
            this.colors = [];// new Float32Array(Math.pow((segments+1),2) * 3);

            var color = new THREE.Color();

            var du = (umax-umin)/(segments);
            var dv = (vmax-vmin)/(segments);
            console.log(du + " " + dv);

            this.indices = [];//  new Uint32Array(Math.pow((segments+1),2) * 3);

            for(var i= 0; i<=segments; i++) { // u+=(umin+i*du), v+=(vmin+j*dv)
                for(var j = 0; j<=segments; j++) {

			    var u=(umin+i*du);
			    var v=(vmin+j*dv);
                    var xyz = posFunc(u, v);
                    color.setRGB(red, green, blue);
                    Array.prototype.push.apply(this.positions, xyz);
                    Array.prototype.push.apply(this.colors, [color.r, color.g, color.b]);

                    if (i < segments && j < segments) {
                        Array.prototype.push.apply(this.indices, [
                            i     * (segments+1) + j,
                            (i+1) * (segments+1) + j + 1,
                            (i+1) * (segments+1) + j,

                            i     * (segments+1) + j,
                            i     * (segments+1) + j + 1,
                            (i+1) * (segments+1) + j + 1
                        ]);
                    }
                }
            }


            this.positions = new Float32Array(this.positions);
            this.colors = new Float32Array(this.colors);
            this.indices = new Uint32Array(this.indices);

            this.getPositions = function() {
                return this.positions;
            };

            this.getColors = function() {
                return this.colors;
            };

            this.getIndices = function() {
                return this.indices;
            };

            this.getSegments = function() {
                return this.segments;
            }

        };

        return ParametricSurface;
    }));
