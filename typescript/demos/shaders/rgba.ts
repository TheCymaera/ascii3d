import { VertexShader, FragmentShader, ClipspacePosition } from "../../ascii3d.js";
import { mat4, vec4 } from "../gl-matrix/index.js";

export interface Uniforms {
	transform: mat4,
}

export const uniforms: Uniforms = {
	transform: mat4.identity(mat4.create()),
};

export type RGBAVertex = [number, number, number, number, number, number, number];
export type RGBAFragment = [number, number, number, number, number];

export const vertex: VertexShader<RGBAVertex, RGBAFragment> = ([x, y, z, r, g, b, charCode])=> {
	return {
		position: vec4.transformMat4(vec4.create(),[x,y,z,1],uniforms.transform) as ClipspacePosition,
		fragment: [r, g, b, 1, charCode]
	};
}

export const fragment: FragmentShader<RGBAFragment> = (fragment)=> {
	// output directly. ([r, g, b, a, charCode])
	return fragment;
}