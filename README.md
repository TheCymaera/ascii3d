# Ascii3D

## Introduction
Ascii3D is a text-based 3D rendering library for JavaScript and TypeScript.

## Demos
- [Rainbow Triangle](https://heledron.com/misc/ascii3d/demos/rainbow-triangle/)
- [Rotating Cube](https://heledron.com/misc/ascii3d/demos/rotating-cube/)
- [Water Shader](https://heledron.com/misc/ascii3d/demos/water/)

## Render Buffers
A render buffer contains the result of draw calls. They have a width, height, and an array of character-codes, RGBA, and depth values. A render buffer is created like so:

```typescript
import { RenderBuffer } from "ascii3d";

const width = 30, height = 30;
const renderBuffer = new RenderBuffer(width, height);
```

## Vertex Arrays
A vertex array contains arbitrary numeric data about vertices. They normally contain spacial data (X, Y, Z), color (R, G, B, A), UV, and/or character codes.

```typescript
const vertexArray = [
// 	X  	 Y    R    G    B    CharCode
	[-.5, -.5, 1.0, 1.0, 0.0, "#".charCodeAt(0)],
	[-.5, 0.5, 0.0, 1.0, 1.0, "#".charCodeAt(0)],
	[0.5, 0.5, 1.0, 0.0, 1.0, "#".charCodeAt(0)],
	[0.5, -.5, 1.0, 1.0, 0.0, "#".charCodeAt(0)]
];
```

A lot of 3D models are stored as vertex buffers and index buffers. You can convert them into a vertex array using the `createVertexArray()` function. For example:

```typescript
import { createVertexArray } from "ascii3d";
	
const vertexBuffer = [ 1, 2, 3 ];
const vertexSize = 1;
const indexBuffer  = [ 1, 2, 3 ];
const vertexArray  = createVertexArray(vertexBuffer, vertexSize, indexBuffer);
```

## Vertex Shaders and Fragment Shaders
A vertex shader accepts a vertex as an input and outputs a <dfn>clipspace-position</dfn> and a <dfn>fragment</dfn>.<br/>
The clipspace-position is 4-component vector.<br/>
The fragment is an array of arbitrary numeric values describing the pixel at the vertex. They are interpolated for every pixel and sent to the fragment shader.

```typescript
function vertexShader([x, y, r, g, b, charCode]) {
	return {
		position: [x, y, 0, 1],
		fragment: [r, g, b, 1, charCode]
	}
}
```

A fragment shader accepts a fragment as an input (provided by the vertex shader), and outputs its color and character code.

```typescript
function fragmentShader(fragment) {
	// output directly. ([r, g, b, a, charCode])
	return fragment;
}
```

## Draw Calls
To make a draw call, use the `renderBuffer.drawTriangles()` method. If depth-testing is enabled, pixels with a greater depth will not be drawn over.

```typescript
const doDepthTesting = true;
renderBuffer.drawTriangles(vertices, vertexShader, fragmentShader, doDepthTesting);
```

## Rendering to a 2D canvas
One way to display a render buffer is through an HTML canvas element.

```typescript
renderBuffer.renderToCanvas(
	ctx, 			// CanvasRenderingContext2D
	letterSpacing, 	// letter spacing
	0, 0 			// optional: start position (from bottom left)
);
```

## Attribution
Special thanks to:

- [ASCIICKER](https://asciicker.com/x13/) for inspiring this project.
- [Sessamekesh](https://github.com/sessamekesh) for the [models](https://github.com/sessamekesh/IndigoCS-webgl-tutorials) adapted for the demos.
- The [glMatrix](http://glmatrix.net/) library used in the rotating cube and water shader demo.
- This [Stack Overflow thread](https://stackoverflow.com/questions/24441631/how-exactly-does-opengl-do-perspectively-correct-linear-interpolation) for holding my hand through the maths.

## License
Licensed under MIT.<br/>
<br/>
All files can be used for commercial or non-commercial purposes. Do not resell. Attribution is appreciated but not due.