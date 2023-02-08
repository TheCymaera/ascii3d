# Ascii3D

## Introduction
Ascii3D is a text-based 3D rendering library for JavaScript and TypeScript.

## Demos
- [Rainbow Triangle](https://heledron.com/misc/ascii3d/demos/rainbow-triangle/)
- [Rotating Cube](https://heledron.com/misc/ascii3d/demos/rotating-cube/)
- [Water Shader](https://heledron.com/misc/ascii3d/demos/water/)


## Installation
Install via <a href="https://www.npmjs.com/package/ascii3d">npm</a>:
```
npm install ascii3d
```

## 3D Mesh
A 3D meshes consists of vertices, paired in threes to form triangles.
```typescript
const vertices = [
// 	X  	 Y    R    G    B    CharCode
	[-.5, -.5, 1.0, 1.0, 0.0, "#".charCodeAt(0)],
	[-.5, 0.5, 0.0, 1.0, 1.0, "#".charCodeAt(0)],
	[0.5, 0.5, 1.0, 0.0, 1.0, "#".charCodeAt(0)],
	[0.5, -.5, 1.0, 1.0, 0.0, "#".charCodeAt(0)],
];

const indices = [
	0, 1, 2, // triangle 1
	0, 2, 3, // triangle 2
]
```

## Vertex and Pixel Shaders
A vertex shader is responsible for interpreting vertices.
Pixel data is interpolated for each point inside the triangle and sent to the pixel shader.
```typescript
function vertexShader([x, y, r, g, b, charCode]) {
	const clipspacePosition = [x, y, 0, 1];
	const pixel = [r, g, b, charCode];

	return new VertexData(clipspacePosition, pixel);
}
```

A pixel shader is responsible for interpreting pixels provided by the vertex shader.
```typescript
function vertexShader([r, g, b, charCode]) {
	return new PixelData(charCode, r, g, b, 1);
}
```


## Render Buffers
A render buffer is a 2D array of pixels with depth information.
They contain the result of draw calls.

```typescript
// create buffer
const width = 30, height = 30;
const renderBuffer = new RenderBuffer(width, height);

// draw a triangle
const doDepthTesting = true;
renderBuffer.drawTriangle(vertices, indices, vertexShader, pixelShader, doDepthTesting);

// sample as a texture
const u = .5, v = .5;
renderBuffer.sample2D(u,v);
```


## Displaying with a 2D canvas
One way to display a render buffer is through an HTML canvas element.
```typescript
renderBuffer.renderToCanvas(
	ctx,            // CanvasRenderingContext2D
	letterSpacing,  // letter spacing
	0, 0            // optional: start position (from bottom left)
);
```

## Attribution
Special thanks to:
- [ASCIICKER](https://asciicker.com/x13/) for inspiring this project.
- [Sessamekesh](https://github.com/sessamekesh) for the 
	[models](https://github.com/sessamekesh/IndigoCS-webgl-tutorials) adapted for the demos.
- This [Stack Overflow thread](https://stackoverflow.com/questions/24441631/how-exactly-does-opengl-do-perspectively-correct-linear-interpolation)
	for holding my hand through the maths.

## License
Licensed under MIT.

All files can be used for commercial or non-commercial purposes. Do not resell. Attribution is appreciated but not due.
