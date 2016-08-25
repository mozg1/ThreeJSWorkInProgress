/*
 * WebGL core teaching framework
 * (C)opyright Kristian Hildebrand
 *
 * Module: shaders
 *
 * This module loads required shaders using the require.js text plugin,
 * see https://github.com/requirejs/text
 *
 */

define([
        "text!shaders/sphereshader_vs.glsl",          "text!shaders/sphereshader_fs.glsl",
        "text!shaders/lineshader_vs.glsl",          "text!shaders/lineshader_fs.glsl",
        "text!shaders/floorshader_vs.glsl",         "text!shaders/floorshader_fs.glsl"
    ],
    (function(
               vs_sphereshader,       fs_sphereshader,
               vs_lineshader,       fs_lineshader,
               vs_floorshader,       fs_floorshader

    ) {

        "use strict";

        // store all shaders in an associative array
        var shaders = {};
        shaders["sphere"] = {vertex: vs_sphereshader, fragment: fs_sphereshader};
        shaders["line"] = {vertex: vs_lineshader, fragment: fs_lineshader};
        shaders["floor"] = {vertex: vs_floorshader, fragment: fs_floorshader};

        // return source code of a vertex shader
        shaders.getVertexShader = function(shadername) {
            if(!shaders[shadername]) {
                throw "module shaders: unknown shader " + shadername;
            }
            if(!shaders[shadername].vertex) {
                throw "module shaders: no vertex shader for " + shadername;
            }
            return shaders[shadername].vertex;
        };

        // return source code of a shader
        shaders.getFragmentShader = function(shadername) {
            if(!shaders[shadername]) {
                throw "module shaders: unknown shader " + shadername;
            }
            if(!shaders[shadername].fragment) {
                throw "module shaders: no fragment shader for " + shadername;
            }
            return shaders[shadername].fragment;
        };

        // module returns getter functions
        return shaders;
    }
    )); // define module
