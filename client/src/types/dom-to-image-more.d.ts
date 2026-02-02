declare module 'dom-to-image-more' {
  const domtoimage: {
    toPng: (node: Node, options?: object) => Promise<string>;
    toJpeg: (node: Node, options?: object) => Promise<string>;
    toSvg: (node: Node, options?: object) => Promise<string>;
    toPixelData: (node: Node, options?: object) => Promise<Uint8Array>;
    toBlob: (node: Node, options?: object) => Promise<Blob>;
  };
  export default domtoimage;
}
