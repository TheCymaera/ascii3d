export declare type ClipspacePosition = readonly [number, number, number, number];
export declare type Vertex = readonly number[];
export declare type Pixel = readonly number[];
export declare class VertexData {
    position: ClipspacePosition;
    pixel: Pixel;
    constructor(position: ClipspacePosition, pixel: Pixel);
}
export declare class PixelData {
    charCode: number;
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(charCode: number, r: number, g: number, b: number, a: number);
}
export declare type VertexShader = (vertex: Vertex) => VertexData;
export declare type PixelShader = (input: Pixel) => PixelData;
export declare class RenderBuffer {
    #private;
    width: number;
    height: number;
    data: RenderBuffer.Data[];
    constructor(width?: number, height?: number);
    resize(width: number, height: number): void;
    clear(): this;
    sample2D(u: number, v: number): RenderBuffer.Data;
    drawTriangles(vertices: Vertex[], indices: number[], vertexShader: VertexShader, pixelShader: PixelShader, doDepthTesting?: boolean): void;
    renderToCanvas(renderingContext: CanvasRenderingContext2D, cellSize: number, startX?: number, startY?: number): void;
}
export declare namespace RenderBuffer {
    class Data {
        pixel: PixelData;
        depth: number;
        constructor(pixel?: PixelData, depth?: number);
    }
}
