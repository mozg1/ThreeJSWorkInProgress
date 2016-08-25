// BlinnPhong Shading
            /*
            varying vec3 vNormal;
 			varying vec2 vUv;

 			uniform vec3 color;

 			void main() {

 				gl_FragColor =  vec4( vec3( color ) * vec3( color ), 1.0 );

 			}
 			*/

 			precision mediump float;

            varying vec3 vNormal;
            varying vec3 vertPos;

            const vec3 lightPos = vec3(0.0,1.0,0.5);
            const vec3 ambientColor = vec3(0.1, 0.0, 0.0);
            const vec3 diffuseColor = vec3(0.5, 0.5, 0.5);
            const vec3 specColor = vec3(1.0, 1.0, 1.0);

            uniform vec3 color;

            void main() {

              vec3 normal = normalize(vNormal);
              vec3 lightDir = normalize(lightPos - vertPos);

              float lambertian = max(dot(lightDir,normal), 0.0);
              float specular = 0.0;

              if(lambertian > 0.0) {

                vec3 viewDir = normalize(-vertPos);

                // this is blinn phong
                vec3 halfDir = normalize(lightDir + viewDir);
                float specAngle = max(dot(halfDir, normal), 0.0);
                specular = pow(specAngle, 16.0);

              }

              gl_FragColor = vec4(ambientColor +
                                  lambertian * diffuseColor +
                                  specular * specColor +  vec3( color ) * vec3( color ), 1.0);
            }
