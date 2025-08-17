declare module 'dom-to-image-more' {
  const domtoimage: {
    toPng: (node: Node, options?: any) => Promise<string>;
    toJpeg: (node: Node, options?: any) => Promise<string>;
    toSvg: (node: Node, options?: any) => Promise<string>;
    toPixelData: (node: Node, options?: any) => Promise<Uint8Array>;
    toBlob: (node: Node, options?: any) => Promise<Blob>;
  };
  export default domtoimage;
}
