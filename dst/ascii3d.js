;
export class RenderBuffer {
    constructor(width = 0, height = 0) {
        this.resize(width, height);
    }
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.buffer = new Float32Array(width * height * 6);
        this.clear();
    }
    clear() {
        this.buffer.fill(0);
        for (let i = 5, l = this.buffer.length; i < l; i += 6)
            this.buffer[i] = -1;
        return this;
    }
    drawTriangle(vertex1, vertex2, vertex3, vertexShader, fragmentShader, doDepthTesting = true) {
        const { position: pos1, fragment: frag1 } = vertexShader(vertex1);
        const { position: pos2, fragment: frag2 } = vertexShader(vertex2);
        const { position: pos3, fragment: frag3 } = vertexShader(vertex3);
        const input = new Array(frag1.length);
        const w1 = Math.abs(1 / pos1[3]), w2 = Math.abs(1 / pos2[3]), w3 = Math.abs(1 / pos3[3]);
        const x1 = pos1[0] * w1, y1 = pos1[1] * w1, z1 = pos1[2] * w1;
        const x2 = pos2[0] * w2, y2 = pos2[1] * w2, z2 = pos2[2] * w2;
        const x3 = pos3[0] * w3, y3 = pos3[1] * w3, z3 = pos3[2] * w3;
        const denom = 1 / ((y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3));
        const l1 = (y2 - y3), l2 = (y3 - y1), r1 = (x3 - x2), r2 = (x1 - x3);
        const dx = 2 / this.width, dy = 2 / this.height;
        for (let i = 0, py = 0, y = -1; py < this.height; py++, y += dy) {
            for (let px = 0, x = -1; px < this.width; px++, x += dx, i += 6) {
                const b1 = (l1 * (x - x3) + r1 * (y - y3)) * denom;
                const b2 = (l2 * (x - x3) + r2 * (y - y3)) * denom;
                const b3 = 1 - b1 - b2;
                if (b1 < 0 || b2 < 0 || b3 < 0)
                    continue;
                const iz = z1 * b1 + z2 * b2 + z3 * b3;
                const iw = w1 * b1 + w2 * b2 + w3 * b3;
                if (doDepthTesting && this.buffer[i + 5] > 1 / iz)
                    continue;
                if (iz < -1 || iz > 1)
                    continue;
                const cb1 = 1 / iw * b1 * w1;
                const cb2 = 1 / iw * b2 * w2;
                const cb3 = 1 / iw * b3 * w3;
                for (let t = 0; t < input.length; t++)
                    input[t] = cb1 * frag1[t] + cb2 * frag2[t] + cb3 * frag3[t];
                const frag = fragmentShader(input);
                this.buffer[i] = frag[0];
                this.buffer[i + 1] = frag[1];
                this.buffer[i + 2] = frag[2];
                this.buffer[i + 3] = frag[3];
                this.buffer[i + 4] = frag[4];
                this.buffer[i + 5] = 1 / iz;
            }
        }
        return this;
    }
    drawTriangles(vertices, vertexShader, fragmentShader, doDepthTesting = true) {
        for (let i = 0, l = vertices.length; i < l;) {
            const v1 = vertices[i++];
            const v2 = vertices[i++];
            const v3 = vertices[i++];
            this.drawTriangle(v1, v2, v3, vertexShader, fragmentShader, doDepthTesting);
        }
        return this;
    }
    sample2D(u, v) {
        const uSafe = u > 1 ? 1 : u < 0 ? 0 : u;
        const vSafe = v > 1 ? 1 : v < 0 ? 0 : v;
        const uPixel = (uSafe * this.width) | 0;
        const vPixel = (vSafe * this.height) | 0;
        const index = (vPixel * this.width + uPixel) * 6;
        return {
            r: this.buffer[index],
            g: this.buffer[index + 1],
            b: this.buffer[index + 2],
            a: this.buffer[index + 3],
            char: this.buffer[index + 4],
            depth: this.buffer[index + 5],
        };
    }
    renderToCanvas(renderingContext, cellSize, startX = 0, startY = 0) {
        let printX = startX;
        let printY = renderingContext.canvas.height - startY;
        for (let i = 0, x = 0; i < this.buffer.length; i += 6) {
            const a = this.buffer[i + 3];
            if (a) {
                const r = this.buffer[i] * 255;
                const g = this.buffer[i + 1] * 255;
                const b = this.buffer[i + 2] * 255;
                const char = String.fromCharCode(this.buffer[i + 4]);
                renderingContext.fillStyle = `rgba(${r.toFixed(0)},${g.toFixed(0)},${b.toFixed(0)},${a.toFixed(2)})`;
                renderingContext.fillText(char, printX, printY);
            }
            printX += cellSize;
            if (x === this.width - 1) {
                printX = startX;
                printY -= cellSize;
                x = 0;
            }
            else {
                x++;
            }
        }
        return this;
    }
}
export function createVertexArray(vertexBuffer, vertexSpan, indexBuffer) {
    const vertices = [];
    for (let i = 0; i < vertexBuffer.length; i += vertexSpan) {
        const vertex = vertexBuffer.slice(i, i + vertexSpan);
        vertices.push(vertex);
    }
    if (!indexBuffer)
        return vertices;
    const out = [];
    for (let i = 0; i < indexBuffer.length; i++) {
        out.push(vertices[indexBuffer[i]]);
    }
    return out;
}
//# sourceMappingURL=ascii3d.js.map