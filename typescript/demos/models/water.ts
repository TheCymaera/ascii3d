export const vertexBuffer = [
	-6,-5,-6,	0,0,
	-6,-5,+6,	0,1,
	+6,-5,+6,	1,1,
	+6,-5,-6,	1,0,
];
export const indexBuffer = [0,1,2,0,2,3];
export const vertexSpan = 5;

import { createVertexArray } from "../../ascii3d.js";
export const vertices = createVertexArray(vertexBuffer, vertexSpan, indexBuffer);