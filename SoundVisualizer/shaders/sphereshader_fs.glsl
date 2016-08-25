
//    VERSION 1
            /*
            varying vec3 vNormal;
 			varying vec2 vUv;

 			uniform vec3 color;
 			uniform sampler2D texture;

 			void main() {

 				gl_FragColor =  vec4( vec3( color ) * vec3( color ), 1.0 );

 			}
 			*/

// http://www.mathematik.uni-marburg.de/~thormae/lectures/graphics1/code/WebGLShaderLightMat/ShaderLightMat.html
// Phong BRDF per Fragment Version

 			precision mediump float;

            varying vec3 vNormal;
            varying vec3 vertPos;

 //           uniform int mode;

            const vec3 lightPos = vec3(1.0,1.0,1.0);
            const vec3 diffuseColor = vec3(0.5, 0.5, 0.5);
            const vec3 specColor = vec3(0.6, 0.6, 0.6);

   			uniform vec3 color;

            void main() {

              vec3 normal = normalize(vNormal);
              vec3 lightDir = normalize(lightPos - vertPos);

              float lambertian = max(dot(lightDir,normal), 0.0);
              float specular = 0.0;

              if(lambertian > 0.0) {

                vec3 reflectDir = reflect(-lightDir, normal);
                vec3 viewDir = normalize(-vertPos);

                float specAngle = max(dot(reflectDir, viewDir), 0.0);
                specular = pow(specAngle, 4.0);

/*
                // the exponent controls the shininess (try mode 2)
                if(mode == 2)  specular = pow(specAngle, 16.0);

                // according to the rendering equation we would need to multiply
                // with the the "lambertian", but this has little visual effect
                if(mode == 3) specular *= lambertian;

                // switch to mode 4 to turn off the specular component
                if(mode == 4) specular *= 0.0;
*/
              }

              gl_FragColor = vec4( lambertian*diffuseColor +
                                    specular*specColor +  vec3( color ) * vec3( color ), 1.0);
            }



/*

/*            varying vec3 vNormal;
 			varying vec2 vUv;

 			uniform vec3 color;
 			uniform sampler2D texture;

 			uniform vec3 diffuseMaterial;
            uniform vec3 specularMaterial;
            uniform vec3 ambientMaterial;
            uniform float shininessMaterial;

    //        uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];
    //        uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];


            vec3 phong(vec3 p,  vec3 v, vec3 n, vec3 lightPos, vec3 lightColor){
                if(dot(v,n) < 0.0)
                    return vec3(0, 0, 0); // back-face

                vec3 toLight = normalize(-lightPos);
                vec3 reflectLight = reflect(-toLight, n);
                float ndots = max( dot(toLight,n), 0.0);
                float rdotv = max( dot(reflectLight, v), 0.0);

                vec3 ambi = ambientMaterial;
                vec3 diff =  ndots * lightColor;
                vec3 spec = specularMaterial * pow(rdotv, shininessMaterial ) * lightColor ;

                return pow(1.0 - ndots,6.0)* ambi + diff + spec;
            }


 			void main() {

            normal = vNormal;
            uv = vUV;

 			vec3 colorSphere = phong(position.xyz, viewDir, normal, vec3(0,0,0), vec3(1,1,1));

            gl_FragColor = vec4(colorSphere, 1.0);
 			//	gl_FragColor =  vec4( vec3( color ) * vec3( color ), 1.0 );

 			}
*/