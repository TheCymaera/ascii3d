export const vertexBuffer = [
	// FRONT
	-1,+1,+1,	1.0,0.0,0.0,	"F".charCodeAt(0),
	-1,-1,+1,	1.0,0.0,0.0,	"F".charCodeAt(0),
	-1,-1,-1,	1.0,0.0,0.0,	"F".charCodeAt(0),
	-1,+1,-1,	1.0,0.0,0.0,	"F".charCodeAt(0),
	// BACK
	+1,+1,+1,	0.7,0.2,0.5,	"B".charCodeAt(0),
	+1,-1,+1,	0.7,0.2,0.5,	"B".charCodeAt(0),
	+1,-1,-1,	0.7,0.2,0.5,	"B".charCodeAt(0),
	+1,+1,-1,	0.7,0.2,0.5,	"B".charCodeAt(0),
	// LEFT
	+1,+1,-1,	0.2,0.2,0.7,	"L".charCodeAt(0),
	+1,-1,-1,	0.2,0.2,0.7,	"L".charCodeAt(0),
	-1,-1,-1,	0.2,0.2,0.7,	"L".charCodeAt(0),
	-1,+1,-1,	0.2,0.2,0.7,	"L".charCodeAt(0),
	// RIGHT
	+1,+1,+1,	0.0,1.0,0.0,	"R".charCodeAt(0),
	+1,-1,+1,	0.0,1.0,0.0,	"R".charCodeAt(0),
	-1,-1,+1,	0.0,1.0,0.0,	"R".charCodeAt(0),
	-1,+1,+1,	0.0,1.0,0.0,	"R".charCodeAt(0),
	// UNDER
	-1,-1,-1,	0.5,0.5,1.0,	"U".charCodeAt(0),
	-1,-1,+1,	0.5,0.5,1.0,	"U".charCodeAt(0),
	+1,-1,+1,	0.5,0.5,1.0,	"U".charCodeAt(0),
	+1,-1,-1,	0.5,0.5,1.0,	"U".charCodeAt(0),
	// TOP
	-1,+1,-1,	1.0,0.7,0.0,	"T".charCodeAt(0),
	-1,+1,+1,	1.0,0.7,0.0,	"T".charCodeAt(0),
	+1,+1,+1,	1.0,0.7,0.0,	"T".charCodeAt(0),
	+1,+1,-1,	1.0,0.7,0.0,	"T".charCodeAt(0),
];

export const indexBuffer = [
	// FRONT
	0,1,2,
	0,2,3,
	// BACK
	5,4,6,
	6,4,7,
	// LEFT
	8,9,10,
	8,10,11,
	// RIGHT
	13,12,14,
	15,14,12,
	// UNDER
	16,17,18,
	16,18,19,
	// TOP
	21,20,22,
	22,20,23
];

export const vertexSpan = 7;

import { createVertexArray } from "../../ascii3d.js";
export const vertices = createVertexArray(vertexBuffer, vertexSpan, indexBuffer);