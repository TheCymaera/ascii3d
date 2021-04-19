import { FragmentShader, FragmentShaderOutput, VertexShader } from "../../ascii3d.js";

export type RGBAVertex = [number, number, number, number, number, number];
export type RGBAFragment = FragmentShaderOutput;
export const vertex: VertexShader<RGBAVertex, RGBAFragment>  = ([x, y, r, g, b, charCode])=>{
	return {
		position: [x, y, 0, 1],
		fragment: [r, g, b, 1, charCode]
	}
}

export const fragment: FragmentShader<RGBAFragment> = (fragment)=>{
	// output directly. ([r, g, b, a, charCode])
	return fragment;
}