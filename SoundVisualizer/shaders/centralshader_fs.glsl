
 precision mediump float;

    varying vec3 vNormal;
    varying vec3 vertPos;

    const vec3 lightPos = vec3(1.0,1.0,1.0);
    const vec3 diffuseColor = vec3(0.3, 0.3, 0.3);
    const vec3 specularColor = vec3(0.3, 0.3, 0.3);

   	uniform vec3 color;

    void main() {

        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(lightPos - vertPos);

        float ndots = max(dot(lightDir,normal), 0.0); // diffuse share

        float specShare = 0.0;

        if(ndots > 0.0) {

            vec3 reflectDir = reflect(-lightDir, normal);
            vec3 viewDir = normalize(-vertPos);

            specShare = pow(max(dot(reflectDir, viewDir), 0.0), 2.0); // specular angle

        }

        gl_FragColor = vec4( ndots*diffuseColor + specShare*specularColor +  vec3( color ) * vec3( color ), 1.0);
    }
