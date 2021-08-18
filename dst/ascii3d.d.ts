/**
 * Ascii3D
 * ======================================================
 * Can be used for commercial or non-commercial purposes.
 * DO NOT RESELL.
 * Attribution is appreciated but not due.
 * ======================================================
 * @module ascii3d
 * @author Cymaera
 */
/**
 * Clipspace position between -1 and 1.
 */
export declare type ClipspacePosition = [number, number, number, number];
/**
 * Arbitrary numeric data describing a vertex.
 * Used as the input to a vertex shader.
 */
export declare type Vertex = ArrayLike<number>;
/**
 * The output of a vertex shader. Contains a
 * clipspace position and a 'fragment', which
 * is interpolated for each pixel and sent
 * to the fragment shader.
 */
export interface VertexShaderOutput<F extends Fragment> {
    position: ClipspacePosition;
    fragment: F;
}
/**
 * Arbitrary numeric data describing a pixel.
 * Used as the input to a fragment shader.
 */
export declare type Fragment = number[];
/**
 * The output of a fragment shader.
 * [R, G, B, A, CharacterCode]
 */
export declare type FragmentShaderOutput = [number, number, number, number, number];
/**
 * Computes the clipspace position and fragment for a vertex.
 */
export declare type VertexShader<V extends Vertex, F extends Fragment> = (vertex: V) => VertexShaderOutput<F>;
/**
 * Computes the RGBA and character code for a fragment.
 */
export declare type FragmentShader<F extends Fragment> = (input: F) => FragmentShaderOutput;
/**
 * An array of vertices.
 * Use "createVertexArray" to create one
 * from a vertex buffer and an index buffer.
 */
export declare type VertexArray<V extends Vertex> = V[];
/**
 * The output of renderBuffer.sample2D.
 */
export interface PixelInfo {
    r: number;
    g: number;
    b: number;
    a: number;
    char: number;
    depth: number;
}
/**
 * Contains the result of draw calls.
 */
export declare class RenderBuffer {
    readonly width: number;
    readonly height: number;
    readonly buffer: Float32Array;
    constructor(width?: number, height?: number);
    resize(width: number, height: number): void;
    clear(): this;
    drawTriangle<V extends Vertex, F extends Fragment>(vertex1: V, vertex2: V, vertex3: V, vertexShader: VertexShader<V, F>, fragmentShader: FragmentShader<F>, doDepthTesting?: boolean): this;
    drawTriangles<V extends Vertex, F extends Fragment>(vertices: VertexArray<V>, vertexShader: VertexShader<V, F>, fragmentShader: FragmentShader<F>, doDepthTesting?: boolean): this;
    sample2D(u: number, v: number): PixelInfo;
    renderToCanvas(renderingContext: CanvasRenderingContext2D, cellSize: number, startX?: number, startY?: number): this;
}
/**
 * Create vertex array from a vertex buffer and an index buffer.
 */
export declare function createVertexArray<V extends number[]>(vertexBuffer: number[], vertexSpan: number, indexBuffer?: number[]): VertexArray<V>;
