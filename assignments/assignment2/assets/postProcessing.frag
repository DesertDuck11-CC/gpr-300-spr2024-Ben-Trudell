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
    vec3 finalColor = texture(screenTexture, TexCoords).rgb;

    if(useBlur)
    {
        vec2 texelSize = 1.0 / textureSize(screenTexture, 0).xy;
        vec3 totalColor = vec3(0);

        for(int y = -(bluriness / 2); y <= bluriness / 2; y++)
        {
            for(int x = -(bluriness / 2); x <= bluriness / 2; x++)
            {
                vec2 offset = vec2(x,y) * texelSize;
                totalColor += texture(screenTexture, TexCoords + offset).rgb;
            }
        }

        totalColor /= (bluriness * bluriness);
        finalColor = totalColor;
    }    
    if(useGamma)
    {
        finalColor = pow(finalColor, vec3(1.0 / gamma));
    }

    FragColor = vec4(finalColor, 1.0);
}