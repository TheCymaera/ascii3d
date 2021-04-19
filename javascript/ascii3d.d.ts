export declare type ClipspacePosition = [number, number, number, number];
export declare type Vertex = ArrayLike<number>;
export interface VertexShaderOutput<F extends Fragment> {
    position: ClipspacePosition;
    fragment: F;
}
export declare type Fragment = number[];
export declare type FragmentShaderOutput = [number, number, number, number, number];
export declare type VertexShader<V extends Vertex, F extends Fragment> = (vertex: V) => VertexShaderOutput<F>;
export declare type FragmentShader<O extends Fragment> = (input: O) => FragmentShaderOutput;
export declare type VertexArray<V extends Vertex> = V[];
export interface PixelInfo {
    r: number;
    g: number;
    b: number;
    a: number;
    char: number;
    depth: number;
}
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
export declare function createVertexArray<V extends number[]>(vertexBuffer: number[], vertexSpan: number, indexBuffer?: number[]): VertexArray<V>;
