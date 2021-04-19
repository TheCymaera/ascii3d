export const vertex = ([x, y, r, g, b, charCode]) => {
    return {
        position: [x, y, 0, 1],
        fragment: [r, g, b, 1, charCode]
    };
};
export const fragment = (fragment) => {
    return fragment;
};
//# sourceMappingURL=rgba-2d.js.map