/**
 * RGB Shader
 * ======================================================
 * @module shaders/rgb
 * @author Cymaera
 */
import { vec4 } from "../gl-matrix/index.js";

export const uniforms = Object.seal({
	/**
	 * Transformation matrix
	 * @type {mat4}
	 */
	transform: undefined,
});

/**
 * Vertex Shader
 * @type {import("../../../src/ascii-3d-v2").VertexShader}
 */
export function vertex([X,Y,Z,R,G,B,Character]) {
	return {
		pos: vec4.transformMat4(new Array(4),[X,Y,Z,1],uniforms.transform),
		out: [R,G,B,1,Character]
	};
}

/**
 * Fragment Shader
 * @type {import("../../../src/ascii-3d-v2").FragmentShader}
 * @param {[number,number,number,number,number]} input
 */
export function fragment(input) {
	// output the input directly
	return input;
}