/**
 * Utilities
 * ======================================================
 * @module utilities
 * @author Cymaera
 */
import { mat4 } from "./gl-matrix/index.js";

/**
 * Call a function every tick.
 * @param {(delta: number)=>void} callback 
 */
export function tickly(callback) {
	let oldTime = performance.now();
	function tickly() {
		const newTime = performance.now();
		const delta = newTime - oldTime;
		oldTime = newTime;

		callback(delta);

		requestAnimationFrame(tickly);
	}
	requestAnimationFrame(tickly);
}


/**
 * Represents a camera.
 * Controls view and projection matrices.
 */
export class Camera {
	/**
	 * @param {number} foxy Foxy 
	 */
	constructor(foxy) {
		/**
		 * View matrix
		 * @type {Array<number>}
		 */
		this.view = new Array(16);
		
		/**
		 * Projection matrix
		 * @type {Array<number>}
		 */
		this.projection = new Array(16);
		mat4.perspective(this.projection, foxy, 1, 0.1, 1000.0);
	}

	/**
	 * Get transformation matrix
	 * @param {mat4} [model]
	 * @returns {Array<number>}
	 */
	getTransform(model = undefined) {
		const out = new Array(16);
		mat4.mul(out,this.projection,this.view);
		if (model) mat4.mul(out,out,model);
		return out;
	}

	/**
	 * Look at
	 * @param {[number,number,number]} position 
	 * @param {[number,number,number]} target 
	 * @param {[number,number,number]} up 
	 */
	lookAt(position,target,up) {
		mat4.lookAt(this.view,position,target,up);
	}
	
	/**
	 * Look around
	 * @param {[number,number,number]} target 
	 * @param {number} distance
	 * @param {number} angleX
	 * @param {number} angleY
	 * @param {[number,number,number]} up 
	 */
	lookAround(target,distance,angleX,angleY,up) {
		const camX = target[0]-distance;
		const camXSafe = camX === 1 ? 1.01 : camX; // x cannot be 1 for some reason
		const cameraPos = [camXSafe,target[1],target[2]];
		mat4.lookAt(this.view,cameraPos,target,up);
		mat4.rotateZ(this.view,this.view,angleY);
		mat4.rotateY(this.view,this.view,angleX);
	}
}

/**
 * Mix RGBA colors
 * @param {ArrayLike<number>} base 
 * @param {ArrayLike<number>} add 
 */
export function mixColors(base,add) {
	const A = 1 - (1 - add[3]) * (1 - base[3]);
	const R = add[0] * add[3] / A + base[0] * base[3] * (1 - add[3]) / A;
	const G = add[1] * add[3] / A + base[1] * base[3] * (1 - add[3]) / A;
	const B = add[2] * add[3] / A + base[2] * base[3] * (1 - add[3]) / A;

	return [R,G,B,A];
}