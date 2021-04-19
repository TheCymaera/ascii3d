import { mat4 } from "./gl-matrix/index.js";

export function tickly(callback: (delta: number)=>any) {
	let oldTime = performance.now();
	async function tickly() {
		const newTime = performance.now();
		const delta = newTime - oldTime;
		oldTime = newTime;

		callback(delta);

		requestAnimationFrame(tickly);
	}
	requestAnimationFrame(tickly);
}


export class Camera {
	readonly foxy: number;
	readonly view: mat4;
	readonly projection: mat4;

	constructor(foxy: number) {
		this.view = new Float32Array(16);
		this.projection = new Float32Array(16);
		mat4.perspective(this.projection, foxy, 1, 0.1, 1000.0);
	}

	getTransform(model?: mat4): mat4 {
		const out = new Float32Array(16);
		mat4.mul(out,this.projection,this.view);
		if (model) mat4.mul(out,out,model);
		return out;
	}

	lookAt(position: vec3, target: vec3, up: vec3) {
		mat4.lookAt(this.view,position,target,up);
	}
	
	lookAround(target: vec3, distance: number, angleX: number, angleY: number, up: vec3) {
		const camX = target[0]-distance;
		const camXSafe = camX === 1 ? 1.01 : camX; // x cannot be 1 for some reason
		const cameraPos = [camXSafe,target[1],target[2]];
		mat4.lookAt(this.view,cameraPos,target,up);
		mat4.rotateZ(this.view,this.view,angleY);
		mat4.rotateY(this.view,this.view,angleX);
	}
}

export type Color = [number, number, number, number];

export function mixColors(base: Color, add: Color): Color {
	const A = 1 - (1 - add[3]) * (1 - base[3]);
	const R = add[0] * add[3] / A + base[0] * base[3] * (1 - add[3]) / A;
	const G = add[1] * add[3] / A + base[1] * base[3] * (1 - add[3]) / A;
	const B = add[2] * add[3] / A + base[2] * base[3] * (1 - add[3]) / A;

	return [R,G,B,A];
}
