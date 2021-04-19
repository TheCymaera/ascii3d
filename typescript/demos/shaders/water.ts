import { ClipspacePosition, FragmentShader, RenderBuffer, VertexShader } from "../../ascii3d.js";
import { mat4, vec4 } from "../gl-matrix/index.js";
import { mixColors } from "../utilities.js";

export interface Uniforms {
	transform: mat4,
	reflectionTexture: RenderBuffer,
	distortionFrame: number,
	distortionMagnitude: number,
	distortionRate: number,
	distortionPeriods: number,
	tint: [number, number, number, number],
	reflectionChar: number,
	waterChar: number,
}


export const uniforms: Uniforms = {
	transform: mat4.identity(mat4.create()),
	reflectionTexture: new RenderBuffer(1, 1),
	distortionFrame: 0,
	distortionMagnitude: 0.03,
	distortionRate: 2,
	distortionPeriods: 100,
	tint: [0.3,0.5,0.7,0.3],
	reflectionChar: "+".charCodeAt(0),
	waterChar: "w".charCodeAt(0)
};

export type WaterVertex = [number, number, number, number, number];
export type WaterFragment = [number, number];


export const vertex: VertexShader<WaterVertex, WaterFragment> = ([x, y, z, u, v])=> {
	return {
		position: vec4.transformMat4(vec4.create(),[x,y,z,1],uniforms.transform) as ClipspacePosition,
		fragment: [u,v]
	};
}

export const fragment: FragmentShader<WaterFragment> = ([u, v]) => {
	// add variation to U for distortion effect
	const uVariation = 
		uniforms.distortionMagnitude * 
		Math.sin(uniforms.distortionRate * uniforms.distortionFrame/1000) * 
		Math.sin(v * uniforms.distortionPeriods);
	
	// sample from reflection texture
	const pixel = uniforms.reflectionTexture!.sample2D(1-(u+uVariation), 1-v);

	// add tint to sample
	const fragColor = mixColors([pixel.r, pixel.g, pixel.b, pixel.a], uniforms.tint);

	// select character
	const char = pixel[4] ? uniforms.reflectionChar : uniforms.waterChar;

	return [ fragColor[0], fragColor[1], fragColor[2], fragColor[3], char ];
}

