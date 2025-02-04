#version 450
out vec4 FragColor;

in vec2 TexCoords;

uniform sampler2D screenTexture;
uniform bool useBlur;
uniform int bluriness;
uniform bool useGamma;
uniform float gamma;

void main()
{
    // Sample original color
    vec3 finalColor = texture(screenTexture, TexCoords).rgb;

    if(useBlur)
    {
        // Grabs the size of one pixel in UV space by getting the screen resolution
        vec2 texelSize = 1.0 / textureSize(screenTexture, 0).xy;
        vec3 totalColor = vec3(0);

        // Loops through a kernel, sampling pixels and shifts neighbouring pixels throughout offset
        // to create the bluriness effect
        for(int y = -(bluriness / 2); y <= bluriness / 2; y++)
        {
            for(int x = -(bluriness / 2); x <= bluriness / 2; x++)
            {
                vec2 offset = vec2(x,y) * texelSize;
                totalColor += texture(screenTexture, TexCoords + offset).rgb;
            }
        }

        // Add bluriness effect to the final color
        totalColor /= (bluriness * bluriness);
        finalColor = totalColor;
    }    
    if(useGamma)
    {
        // Uses pow to darken the image the lower gamma is and vice versa
        finalColor = pow(finalColor, vec3(1.0 / gamma));
    }

    FragColor = vec4(finalColor, 1.0);
}