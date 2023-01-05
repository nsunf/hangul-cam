import Camera from "./Camera";
import { getGrayScale, seperateSentence } from "./utils";
import ImageView from "./ImageView";


export default class Canvas {
  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  offscreen: { canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D };

  camera?: Camera;
  imageView?: ImageView;


  constructor() {
    this.element = document.createElement('canvas');
    this.ctx = this.element.getContext('2d')!;
    let offscreenCanvas = document.createElement('canvas'); 
    this.offscreen = { canvas: offscreenCanvas, ctx: offscreenCanvas.getContext('2d')! };
    this.offscreen.canvas.width = innerWidth;
    this.offscreen.canvas.height = innerHeight;

    const root = document.getElementById('root');
    if (root) root.appendChild(this.element);

    this.setSize();
    addEventListener('resize', this.setSize.bind(this));
  }

  setSize() {
    this.element.width = innerWidth;
    this.element.height = innerHeight;
  }

  setCamera(videoHeight: number) {
    this.camera = new Camera(videoHeight);
  }

  setImage(imgSrc: string, callback: () => void) {
    this.imageView = new ImageView(imgSrc);
    this.imageView.setOnLoad(callback)
  }

  clear() {
    // this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  playVideo() {
    if (!this.camera) return;
    const offCtx = this.offscreen.ctx;

    offCtx.save();
    offCtx.translate(this.camera.videoEl.videoWidth, 0);
    offCtx.scale(-1, 1);
    offCtx.drawImage(this.camera.videoEl, 0, 0);
    offCtx.restore();
  }

  drawImage(pixels: number) {
    if (!this.imageView) return;
    const offCtx = this.offscreen.ctx;
    // const offCtx = this.ctx;
    let img = this.imageView.image;
    let imgRatio = img.height/img.width;
    
    img.height = pixels;
    img.width = img.height / imgRatio;
    
    offCtx.drawImage(img, 0, 0, img.width, img.height);
  }

  drawText(str: string, scale: number, colors: string[]) {
    let width = 0;
    let height = 0;

    if (this.camera) {
      if (this.camera.loaded === false) return;
      width = this.camera.videoEl.videoWidth;
      height = this.camera.videoEl.videoHeight;
    } else if (this.imageView) {
      if (this.imageView.loaded === false) return;
      width = this.imageView.image.width;
      height = this.imageView.image.height;
    } else {
      return;
    }
    const ctx = this.ctx; 
    const offCtx = this.offscreen.ctx;

    const imageData = offCtx.getImageData(0, 0, width, height);  
    const pixels = imageData.data;

    ctx.font = scale + 'px bmdohyeon'
    ctx.textBaseline = 'top';

    let startX = (ctx.canvas.width - width * scale)/2;
    let startY = scale/7;

    let grayScales: number[] = [];
    let minGrayScale = 1;
    let maxGrayScale = 0;

    let pickedColors: string[] = [];

    for (let i = 0; i < pixels.length; i += 4) {
      let r = pixels[i + 0];
      let g = pixels[i + 1];
      let b = pixels[i + 2];
      pickedColors.push(`rgb(${r}, ${g}, ${b})`)
      let grayScale = Math.floor((getGrayScale(r, g, b)/256) * 1000) / 1000;

      grayScales.push(grayScale);
      minGrayScale = Math.min(grayScale, minGrayScale);
      maxGrayScale = Math.max(grayScale, maxGrayScale);

    }
    let grayScaleRange = maxGrayScale - minGrayScale + 0.001;
    grayScales.forEach((_grayScale, i) => {
      let grayScale = (_grayScale - minGrayScale)/grayScaleRange;
      let x = i % width;
      let y = Math.floor(i/width);

      let asciiIdx = str.length - 1 - Math.floor(str.length * grayScale);
      // let asciiIdx = Math.floor(str.length * grayScale);
      let colorIdx = Math.floor(colors.length * grayScale);
      ctx.fillStyle = colors.length === 0 ? pickedColors[i] : colors[colorIdx];
      // ctx.fillStyle = pickedColors[i];
      ctx.fillText(str[asciiIdx], startX + x * scale, startY + y * scale);
    })
  }

  sortByGrayScale(str: string, separate: boolean) {
    let chars = seperateSentence(str, separate);

    let charArr = chars.map(char => ({ char, grayScale: 0 }));

    const offCtx = this.offscreen.ctx;

    offCtx.fillStyle = 'white';
    offCtx.font = 'bold 20px san-serif';
    offCtx.textBaseline = 'top';
    for (let charIdx = 0; charIdx < chars.length; charIdx++) {
      offCtx.fillRect(0, 0, 20, 20);
      offCtx.save();
      offCtx.fillStyle = 'black';
      offCtx.fillText(chars[charIdx], 0, 0, 20);
      offCtx.restore();

      let textGrayLevels: number[] = [];
      const textImg = offCtx.getImageData(0, 0, 20, 20);
      const pixels = textImg.data;
      for (let pixelIdx = 0; pixelIdx < pixels.length; pixelIdx += 4) {
        let r = pixels[pixelIdx + 0];
        let grayScale = r/256;
        textGrayLevels.push(grayScale);
      }
      charArr[charIdx].grayScale = textGrayLevels.reduce((lhs, rhs) => lhs + rhs)/textGrayLevels.length;
    }
    offCtx.clearRect(0, 0, offCtx.canvas.width, offCtx.canvas.height);
    return charArr.sort((lhs, rhs) => lhs.grayScale < rhs.grayScale ? -1 : 1).map(char => char.char).join('');
  }

  get width() {
    return this.element.width;
  }

  get height() {
    return this.element.height;
  }
}