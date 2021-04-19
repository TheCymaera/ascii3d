export const vertexBuffer = [
    -1, +1, +1, 1.0, 0.0, 0.0, "F".charCodeAt(0),
    -1, -1, +1, 1.0, 0.0, 0.0, "F".charCodeAt(0),
    -1, -1, -1, 1.0, 0.0, 0.0, "F".charCodeAt(0),
    -1, +1, -1, 1.0, 0.0, 0.0, "F".charCodeAt(0),
    +1, +1, +1, 0.7, 0.2, 0.5, "B".charCodeAt(0),
    +1, -1, +1, 0.7, 0.2, 0.5, "B".charCodeAt(0),
    +1, -1, -1, 0.7, 0.2, 0.5, "B".charCodeAt(0),
    +1, +1, -1, 0.7, 0.2, 0.5, "B".charCodeAt(0),
    +1, +1, -1, 0.2, 0.2, 0.7, "L".charCodeAt(0),
    +1, -1, -1, 0.2, 0.2, 0.7, "L".charCodeAt(0),
    -1, -1, -1, 0.2, 0.2, 0.7, "L".charCodeAt(0),
    -1, +1, -1, 0.2, 0.2, 0.7, "L".charCodeAt(0),
    +1, +1, +1, 0.0, 1.0, 0.0, "R".charCodeAt(0),
    +1, -1, +1, 0.0, 1.0, 0.0, "R".charCodeAt(0),
    -1, -1, +1, 0.0, 1.0, 0.0, "R".charCodeAt(0),
    -1, +1, +1, 0.0, 1.0, 0.0, "R".charCodeAt(0),
    -1, -1, -1, 0.5, 0.5, 1.0, "U".charCodeAt(0),
    -1, -1, +1, 0.5, 0.5, 1.0, "U".charCodeAt(0),
    +1, -1, +1, 0.5, 0.5, 1.0, "U".charCodeAt(0),
    +1, -1, -1, 0.5, 0.5, 1.0, "U".charCodeAt(0),
    -1, +1, -1, 1.0, 0.7, 0.0, "T".charCodeAt(0),
    -1, +1, +1, 1.0, 0.7, 0.0, "T".charCodeAt(0),
    +1, +1, +1, 1.0, 0.7, 0.0, "T".charCodeAt(0),
    +1, +1, -1, 1.0, 0.7, 0.0, "T".charCodeAt(0),
];
export const indexBuffer = [
    0, 1, 2,
    0, 2, 3,
    5, 4, 6,
    6, 4, 7,
    8, 9, 10,
    8, 10, 11,
    13, 12, 14,
    15, 14, 12,
    16, 17, 18,
    16, 18, 19,
    21, 20, 22,
    22, 20, 23
];
export const vertexSpan = 7;
import { createVertexArray } from "../../ascii3d.js";
export const vertices = createVertexArray(vertexBuffer, vertexSpan, indexBuffer);
//# sourceMappingURL=cube.js.map