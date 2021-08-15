/**
 * Ascii3D
 * ======================================================
 * Can be used for commercial or non-commercial purposes.
 * DO NOT RESELL.
 * Attribution is appreciated but not due.
 * ======================================================
 * @module ascii-3d
 * @version 2.0.0
 * @author Cymaera
 */

export type ClipspacePosition = [number, number, number, number];

export type Vertex = ArrayLike<number>;

export interface VertexShaderOutput<F extends Fragment> {
	position: ClipspacePosition, 
	fragment: F
};

export type Fragment = number[];

export type FragmentShaderOutput = [number, number, number, number, number];

export type VertexShader<V extends Vertex, F extends Fragment> = (vertex: V) => VertexShaderOutput<F>;
export type FragmentShader<F extends Fragment> = (input: F) => FragmentShaderOutput;

export type VertexArray<V extends Vertex> = V[];

export interface PixelInfo {
	r: number;
	g: number;
	b: number;
	a: number;
	char: number;
	depth: number;
}

export class RenderBuffer {
	readonly width: number;
	readonly height: number;
	readonly buffer: Float32Array;
	
	constructor(width = 0, height = 0) {
		this.resize(width, height);
	}

	resize(width: number, height: number) {
		(this as any).width = width;
		(this as any).height = height;
		(this as any).buffer = new Float32Array(width*height * 6);
		this.clear();
	}

	clear(): this {
		// set everything to 0
		this.buffer.fill(0);
		// set depth to -1
		for (let i = 5, l = this.buffer.length; i < l; i+= 6) this.buffer[i] = -1;
		return this;
	}

	drawTriangle<V extends Vertex, F extends Fragment>(
		vertex1: V,
		vertex2: V,
		vertex3: V,
		vertexShader: VertexShader<V, F>, 
		fragmentShader: FragmentShader<F>,
		doDepthTesting = true
	): this {
		// Invoke vertex shader
		const {position: pos1, fragment: frag1} = vertexShader(vertex1);
		const {position: pos2, fragment: frag2} = vertexShader(vertex2);
		const {position: pos3, fragment: frag3} = vertexShader(vertex3);
		
		// Input to fragment shader
		const input = new Array(frag1.length) as F;
		
		// Cache & normalize coordinates
		const w1 = Math.abs(1/pos1[3]), w2 = Math.abs(1/pos2[3]), w3 = Math.abs(1/pos3[3]);
		const x1 = pos1[0]*w1, y1 = pos1[1]*w1, z1 = pos1[2]*w1;
		const x2 = pos2[0]*w2, y2 = pos2[1]*w2, z2 = pos2[2]*w2;
		const x3 = pos3[0]*w3, y3 = pos3[1]*w3, z3 = pos3[2]*w3;
		
		// Pre-compute constants for finding barycentric coordinates
		const denom = 1/((y2-y3)*(x1-x3)+(x3-x2)*(y1-y3));
		const l1 = (y2-y3), l2 = (y3-y1), r1 = (x3-x2), r2 = (x1-x3);
		
		// Get delta x & y (clipspace length of 1 "pixel")
		const dx = 2/this.width, dy = 2/this.height;

		// iterate through every pixel
		for (let i = 0, py = 0, y = -1	; py < this.height	; py++, y+=dy) {
			for (let px = 0, x = -1		; px < this.width	; px++, x+=dx, i+=6) {
				// find barycentric coordinates of point
				const b1 = (l1*(x-x3) + r1*(y-y3))*denom;
				const b2 = (l2*(x-x3) + r2*(y-y3))*denom;
				const b3 = 1 - b1 - b2;
				
				// skip if point is not inside triangle
				if (b1<0 || b2<0 || b3<0) continue;
				
				// find fragment inverse-z & inverse-w
				const iz = z1*b1 + z2*b2 + z3*b3;
				const iw = w1*b1 + w2*b2 + w3*b3
				
				// depth testing
				if (doDepthTesting && this.buffer[i+5] > 1/iz) continue;
				
				// clip near & far
				if(iz < -1 || iz > 1) continue;
				
				// find the perspective-corrected barycentric coordinates
				const cb1 = 1/iw * b1 * w1;
				const cb2 = 1/iw * b2 * w2;
				const cb3 = 1/iw * b3 * w3;
				
				// use perspective-corrected b-coords to find interpolated input
				for (let t = 0; t < input.length; t++) input[t] = cb1*frag1[t] +  cb2*frag2[t] +  cb3*frag3[t];
				
				// Invoke fragment shader
				const frag = fragmentShader(input);
				
				this.buffer[i  ] = frag[0];	// R
				this.buffer[i+1] = frag[1];	// G
				this.buffer[i+2] = frag[2];	// B
				this.buffer[i+3] = frag[3];	// A
				this.buffer[i+4] = frag[4];	// Char code
				this.buffer[i+5] = 1/iz;	// Depth
			}
		}

		return this;
	}

	drawTriangles<V extends Vertex, F extends Fragment>(
		vertices: VertexArray<V>,
		vertexShader: VertexShader<V, F>,
		fragmentShader: FragmentShader<F>,
		doDepthTesting = true
	): this {
		for (let i = 0, l = vertices.length; i < l;) {
			const v1 = vertices[i++];
			const v2 = vertices[i++];
			const v3 = vertices[i++];
			this.drawTriangle(v1, v2, v3, vertexShader, fragmentShader, doDepthTesting);
		}
		return this;
	}

	sample2D(u: number, v: number): PixelInfo {
		const uSafe = u > 1 ? 1 : u < 0 ? 0 : u;
		const vSafe = v > 1 ? 1 : v < 0 ? 0 : v;

		const uPixel = (uSafe*this.width) 	| 0;
		const vPixel = (vSafe*this.height) 	| 0;

		const index = (vPixel * this.width + uPixel) * 6;
		return {
			r: 		this.buffer[index],
			g: 		this.buffer[index+1],
			b: 		this.buffer[index+2],
			a: 		this.buffer[index+3],
			char: 	this.buffer[index+4],
			depth: 	this.buffer[index+5],
		};
	}

	renderToCanvas(
		renderingContext: CanvasRenderingContext2D,
		cellSize: number,
		startX = 0,
		startY = 0
	): this {
		let printX = startX;
		let printY = renderingContext.canvas.height - startY;

		// iterate through buffer
		for (let i = 0, x = 0; i < this.buffer.length; i+=6) {
			// get character & rgba
			const a = this.buffer[i+3];
			if (a) {
				const r = this.buffer[i] * 255;
				const g = this.buffer[i+1] * 255;
				const b = this.buffer[i+2] * 255;
				const char = String.fromCharCode(this.buffer[i+4]);

				// set color
				renderingContext.fillStyle = `rgba(${r.toFixed(0)},${g.toFixed(0)},${b.toFixed(0)},${a.toFixed(2)})`;

				// fill text
				renderingContext.fillText(char, printX, printY);
			}
			
			// increment
			printX += cellSize;

			// Break line if end of line is reached.
			if (x === this.width - 1) {
				printX = startX;
				printY -= cellSize;
				x = 0;
			} else {
				x++;
			}
		}

		return this;
	}
}

export function createVertexArray<V extends number[]>(
	vertexBuffer: number[], 
	vertexSpan: number,
	indexBuffer?: number[]
): VertexArray<V> {
	const vertices: VertexArray<V> = [];
	for (let i = 0; i < vertexBuffer.length; i+=vertexSpan) {
		const vertex = vertexBuffer.slice(i,i+vertexSpan) as V;
		vertices.push(vertex);
	}

	if (!indexBuffer) return vertices;

	const out: VertexArray<V> = [];
	for (let i = 0; i < indexBuffer.length; i++) {
		out.push(vertices[indexBuffer[i]]);
	}
	return out;
}