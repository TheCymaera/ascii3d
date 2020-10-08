/**
 * Water Shader
 * ======================================================
 * @module shaders/water
 * @author Cymaera
 */
import { vec4 } from "../gl-matrix/index.js";
import { mixColors } from "../utilities.js";

export const uniforms = Object.seal({
	/**
	 * Transformation matrix
	 * @type {mat4}
	 */
	transform: undefined,

	/**
	 * Reflection Texture
	 * @type {import("../../../src/ascii-3d-v2").RenderBuffer}
	 */
	reflectionTexture: undefined,

	/**
	 * Distortion frame
	 * @type {number}
	 */
	distortionFrame: 0,

	/**
	 * Distortion magnitude
	 * @type {number}
	 */
	distortionMagnitude: 0.03,

	/**
	 * Distortion rate (cycles per second)
	 */
	distortionRate: 2,

	/**
	 * Distortion periods
	 * @type {number}
	 */
	distortionPeriods: 100,

	/**
	 * Tint {R,B,G,A}
	 * @type {number[]}
	 */
	tint: [0.3,0.5,0.7,0.3],

	/**
	 * Reflection Character
	 * @type {number}
	 */
	reflectionChar: "+".charCodeAt(0),

	/**
	 * Water Character
	 * @type {number}
	 */
	waterChar: "w".charCodeAt(0)
});

/**
 * Vertex Shader
 * @type {import("../../../src/ascii-3d-v2").VertexShader}
 */
export function vertex([X,Y,Z,U,V]) {
	return {
		pos: vec4.transformMat4(new Array(4),[X,Y,Z,1],uniforms.transform),
		out: [U,V]
	};
}

/**
 * Fragment Shader
 * @type {import("../../../src/ascii-3d-v2").FragmentShader}
 * @param {[number,number,number,number,number]} input
 */
export function fragment([U,V]) {
	// add variation to U for distortion effect
	const uVariation = 
		uniforms.distortionMagnitude * 
		Math.sin(uniforms.distortionRate * uniforms.distortionFrame/1000) * 
		Math.sin(V * uniforms.distortionPeriods);
	
	// sample from reflection texture
	const rTexture = uniforms.reflectionTexture;
	const rColor = rTexture.sample2D(1-(U+uVariation), 1-V);

	// add tint to sample
	const fragColor = mixColors(rColor,uniforms.tint);

	// select character
	const char = rColor[4] ? uniforms.reflectionChar : uniforms.waterChar;

	return [ fragColor[0], fragColor[1], fragColor[2], fragColor[3], char ];
}