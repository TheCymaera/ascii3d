/**
 * Ascii 3D
 * ======================================================
 * Can be used for commerical or non-commerical purposes.
 * DO NOT RESELL.
 * Attribution is appreciated but not due.
 * ======================================================
 * @module ascii-3d
 * @version 2.0.0
 * @author Cymaera
 */

/**
 * A vertex shader outputs the clip-space positons for a vertex (-1 to 1 in all axes).
 * Optionally, it can output data for the fragment shader in the form of an number array.
 * 
 * Input: Arbitrary vertex data
 * Output: Vertex positions and optional data for fragment shader
 * @typedef {(vertex: number[]) => {pos: ArrayLike<number>, out?: ArrayLike<number>}} VertexShader
 */

/**
 * A fragment shader outputs the colour and character code for each "pixel".
 * 
 * Input: Interpolated output of vertex shader
 * Output: {R,G,B,A,CharCode}
 * @typedef {(input: number[]) => [number,number,number,number,number]} FragmentShader
 */

/**
 * A vertex buffer stores a list of vertices.
 * @typedef {ArrayLike<number>} VertexBuffer
 */

/**
 * An index buffer stores a list of indices for a vertex array.
 * @typedef {ArrayLike<number>} IndexBuffer
 */

export class RenderBuffer {
	/**
	 * @param {number} width 
	 * @param {number} height 
	 */
	constructor(width,height) {
		/**
		 * Buffer width
		 * @type {number}
		 */
		this.width = width;
		
		/**
		 * Buffer height
		 * @type {number}
		 */
		this.height = height;
		
		/**
		 * Buffer
		 * ...(R,G,B,A,CharCode,Depth)[width * height]
		 * @type {Float32Array}
		 */
		this.buffer = new Float32Array(width*height * 6);

		this.clear();
	}
	

	/**
	 * Clear buffer
	 */
	clear() {
		// set everything to 0
		this.buffer.fill(0);
		// set depth to -1
		for (let i = 5, l = this.buffer.length; i < l; i+= 6) this.buffer[i] = -1;
	}

	/**
	 * Draw a triangle using a vertex buffer
	 * @param {VertexShader} vertexShader - Vertex shader
	 * @param {FragmentShader} fragmentShader - Fragment shader
	 * @param {VertexBuffer} vertexBuffer - Vertex Buffer
	 * @param {number} vertexSpan - Vertex span
	 * @param {number} index1 - Index of vertex 1
	 * @param {number} index2 - Index of vertex 2
	 * @param {number} index3 - Index of vertex 3
	 * @param {boolean} [doDepthTesting=true]
	 */
	drawTriangle(vertexShader,fragmentShader,vertexBuffer,vertexSpan,index1,index2,index3,doDepthTesting = true) {
		// Invoke vertex shader
		const vBuffer = Array.from(vertexBuffer);
		const vertex1 = vBuffer.slice(index1*vertexSpan,index1*vertexSpan+vertexSpan);
		const vertex2 = vBuffer.slice(index2*vertexSpan,index2*vertexSpan+vertexSpan);
		const vertex3 = vBuffer.slice(index3*vertexSpan,index3*vertexSpan+vertexSpan);
		const {pos: pos1, out: out1} = vertexShader(vertex1);
		const {pos: pos2, out: out2} = vertexShader(vertex2);
		const {pos: pos3, out: out3} = vertexShader(vertex3);

		// Input of fragment shader is output of vertex shader
		const in1 = out1 || [];
		const in2 = out2 || [];
		const in3 = out3 || [];

		// Make sure inputs to fragment shader are of equal length
		if (in1.length !== in2.length || in2.length !== in3.length) {
			throw new Error('Unbalanced output from vertex shader');
		}
		
		const input = new Array(in1.length);
		
		// Cache & noramlize coordinates
		const w1 = Math.abs(1/pos1[3]), w2 = Math.abs(1/pos2[3]), w3 = Math.abs(1/pos3[3]);

		const x1 = pos1[0]*w1, y1 = pos1[1]*w1, z1 = pos1[2]*w1;
		const x2 = pos2[0]*w2, y2 = pos2[1]*w2, z2 = pos2[2]*w2;
		const x3 = pos3[0]*w3, y3 = pos3[1]*w3, z3 = pos3[2]*w3;
		
		// Precompute constants for finding barycentric coordinates
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
				for (let t = 0; t < input.length; t++) input[t] = cb1*in1[t] +  cb2*in2[t] +  cb3*in3[t];
				
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
	}

	/**
	 * Draw triangles using a vertex buffer
	 * @param {VertexShader} vertexShader 
	 * @param {FragmentShader} fragmentShader 
	 * @param {VertexBuffer} vertexBuffer 
	 * @param {number} vertexSpan
	 * @param {boolean} [doDepthTesting=true]
	 */
	drawTriangles(vertexShader,fragmentShader,vertexBuffer,vertexSpan,doDepthTesting = true) {
		for (let i = 0, l = vertexBuffer.length / vertexSpan; i < l;) {
			let v1 = i++;
			let v2 = i++;
			let v3 = i++;
			this.drawTriangle(vertexShader,fragmentShader,vertexBuffer,vertexSpan,v1,v2,v3,doDepthTesting);
		}
	}

	
	/**
	 * Draw triangles using an index buffer
	 * @param {VertexShader} vertexShader 
	 * @param {FragmentShader} fragmentShader 
	 * @param {VertexBuffer} vertexBuffer 
	 * @param {number} vertexSpan
	 * @param {IndexBuffer} indexBuffer
	 * @param {boolean} [doDepthTesting=true]
	 */
	drawTrianglesByIndex(vertexShader,fragmentShader,vertexBuffer,vertexSpan,indexBuffer,doDepthTesting = true) {
		for (let i = 0, l = indexBuffer.length; i < l;) {
			let v1 = indexBuffer[i++];
			let v2 = indexBuffer[i++];
			let v3 = indexBuffer[i++];
			this.drawTriangle(vertexShader,fragmentShader,vertexBuffer,vertexSpan,v1,v2,v3,doDepthTesting);
		}
	}

	/**
	 * Sample 2D
	 * @param {number} u - U (0-1)
	 * @param {number} v - V (0-1)
	 * @returns {ArrayLike<number>} - {R,G,B,A,CharCode,Depth}
	 */
	sample2D(u,v) {
		const uSafe = u > 1 ? 1 : u < 0 ? 0 : u;
		const vSafe = v > 1 ? 1 : v < 0 ? 0 : v;

		const uPixel = (uSafe*this.width) 	| 0;
		const vPixel = (vSafe*this.height) 	| 0;

		const index = (vPixel * this.width + uPixel) * 6;
		return this.buffer.slice(index,index+6);
	}
}

/**
 * Display a RenderBuffer using an HTML canvas
 * @param {CanvasRenderingContext2D} renderingContext - Canvas rendering context
 * @param {RenderBuffer} renderBuffer - Render buffer
 * @param {number} cellSize - Cell size in pixels
 * @param {number} [startX=0] - X (from left)
 * @param {number} [startY=0] - Y (from bottom)
 */
export function renderToCanvas(renderingContext,renderBuffer,cellSize,startX = 0,startY = 0) {
	let printX = startX;
	let printY = renderingContext.canvas.height - startY;

	// iterate through RenderBuffer
	for (let i = 0, x = 0; i < renderBuffer.buffer.length; i+=6) {
		// get character & rgba
		const a = renderBuffer.buffer[i+3];
		if (a) {
			const r = renderBuffer.buffer[i] * 255;
			const g = renderBuffer.buffer[i+1] * 255;
			const b = renderBuffer.buffer[i+2] * 255;
			const char = String.fromCharCode(renderBuffer.buffer[i+4]);

			// set color
			renderingContext.fillStyle = `rgba(${r.toFixed(0)},${g.toFixed(0)},${b.toFixed(0)},${a.toFixed(2)})`;

			// fill text
			renderingContext.fillText(char, printX, printY);
		}
		
		// increament
		printX += cellSize;

		// Break line if end of line is reached.
		if (x === renderBuffer.width - 1) {
			printX = startX;
			printY -= cellSize;
			x = 0;
		} else {
			x++;
		}

	}
}
