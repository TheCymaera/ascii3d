export type ClipspacePosition = readonly [number, number, number, number];

export type Vertex = readonly number[];
export type Pixel = readonly number[];

export class VertexData {
	constructor(
		public position: ClipspacePosition,
		public pixel: Pixel,
	) {}
};

export class PixelData {
	constructor(
		public charCode: number,
		public r: number,
		public g: number,
		public b: number,
		public a: number,
	) {}
}

export type VertexShader = (vertex: Vertex) => VertexData;
export type PixelShader = (input: Pixel) => PixelData;

export class RenderBuffer {
	width: number;
	height: number;
	data: RenderBuffer.Data[] = [];
	
	constructor(width = 0, height = 0) {
		this.resize(width, height);
	}

	resize(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.data = [];
		for (let i = 0; i < width * height; i++) this.data[i] = new RenderBuffer.Data();
		this.clear();
	}

	clear(): this {
		for (let i = 0; i < this.data.length; i++) this.data[i] = new RenderBuffer.Data();
		return this;
	}
	
	sample2D(u: number, v: number): RenderBuffer.Data {
		const uSafe = u > 1 ? 1 : u < 0 ? 0 : u;
		const vSafe = v > 1 ? 1 : v < 0 ? 0 : v;

		const uPixel = Math.round(uSafe*this.width);
		const vPixel = Math.round(vSafe*this.height);

		const index = Math.max(0, Math.min(vPixel * this.width + uPixel, this.data.length - 1));
		return this.data[index];
	}

	drawTriangles(vertices: Vertex[], indices: number[], vertexShader: VertexShader, pixelShader: PixelShader, doDepthTesting = true) {
		const vertexData = vertices.map(vertexShader);
		for (let i = 0; i < indices.length; i += 3) {
			const vertex1 = vertexData[indices[i]];
			const vertex2 = vertexData[indices[i + 1]];
			const vertex3 = vertexData[indices[i + 2]];
			this.#drawTriangle(vertex1, vertex2, vertex3, pixelShader, doDepthTesting);
		}
	}

	renderToCanvas(
		renderingContext: CanvasRenderingContext2D,
		cellSize: number,
		startX = 0,
		startY = 0
	) {
		const c255 = (c: number)=>c * 255 | 0;

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				const pixel = this.data[x + y * this.width].pixel;

				const printX = startX + x * cellSize;
				const printY = renderingContext.canvas.height - startY - y * cellSize;

				renderingContext.fillStyle = `rgba(${c255(pixel.r)}, ${c255(pixel.g)}, ${c255(pixel.b)}, ${pixel.a.toFixed(2)})`;
				renderingContext.fillText(String.fromCharCode(Math.round(pixel.charCode)), printX, printY);
			}
		}
	}


	#drawTriangle(v1: VertexData, v2: VertexData, v3: VertexData, pixelShader: PixelShader, doDepthTesting = true) {
		const {position: pos1, pixel: pix1} = v1;
		const {position: pos2, pixel: pix2} = v2;
		const {position: pos3, pixel: pix3} = v3;
		
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
		let i = 0;
		for (let py = 0, y = -1; py < this.height; py++, y+=dy) {
			for (let px = 0, x = -1; px < this.width; px++, x+=dx, i++) {
				// find barycentric coordinates of point
				const b1 = (l1*(x-x3) + r1*(y-y3))*denom;
				const b2 = (l2*(x-x3) + r2*(y-y3))*denom;
				const b3 = 1 - b1 - b2;
				
				// skip if point is not inside triangle
				if (b1<0 || b2<0 || b3<0) continue;
				
				// find pixel inverse-z & inverse-w
				const iz = z1*b1 + z2*b2 + z3*b3;
				const iw = w1*b1 + w2*b2 + w3*b3
				
				// depth testing
				const depth = 1/iz;
				if (doDepthTesting && this.data[i].depth > depth) continue;
				
				// clip near & far
				if(iz < -1 || iz > 1) continue;
				
				// find the perspective-corrected barycentric coordinates
				const cb1 = 1/iw * b1 * w1;
				const cb2 = 1/iw * b2 * w2;
				const cb3 = 1/iw * b3 * w3;
				
				// use perspective-corrected b-coords to find interpolated pixel
				const pixel: number[] = new Array(pix1.length);
				for (let t = 0; t < pix1.length; t++) {
					pixel[t] = cb1*pix1[t] +  cb2*pix2[t] +  cb3*pix3[t];
				}
				
				// Invoke pixel shader
				this.data[i] = new RenderBuffer.Data(pixelShader(pixel), depth);
			}
		}
	}
}

export namespace RenderBuffer {
	export class Data {
		constructor(
			public pixel = new PixelData(0,1,1,1,0),
			public depth = 0,
		) {}
	}
}