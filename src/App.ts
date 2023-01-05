import Canvas from "./scripts/Canvas";
import { sortHexColors } from "./scripts/utils";

import songhaImg from '../public/송하맹호도.jpeg';

import starry_night_img from '../public/1364px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg';
import monalisa from '../public/1449px-Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg';
import girl_with_a_pearl_earring from '../public/1845px-Meisje_met_de_parel.jpg';

import the_last_supper from '../public/The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg';
import creation_of_adam from '../public/1617px-Creación_de_Adán.jpg'

export default class App {
  canvas: Canvas;

  lastTimeStamp: number;
  frameRate: number;
  frameTimer: number;

  mode: 'camera'|'image' = 'camera';
  image = girl_with_a_pearl_earring;
  text = '양준수';
  // text = '훈민정음';

  // text = '별이빛나는밤';
  // text = '모나리자';
  // text = '진주귀고리를한소녀';

  // text = '최후의만찬';
  // text = '천지창조';

  // text = '가나다라마바사아자차카타파하';
  separateOn = false;
  pixelLevel = 20;

  // cameraPixels: number = 9 * this.pixelLevel;
  cameraPixels: number = 1 * this.pixelLevel;

  colors: string[] = [];
  // colors: string[] = ['#171717', '#3F7D6E', '#AA262D', '#F0AE2B', '#F8FCFB'];
  // colors: string[] = ['#1E2621', '#20308C', '#2B448C', '#5377A6', '#BDBF80', '#BFA62A', '#E4EAE0'];
  // colors: string[] = ['#0D0000', '#403001', '#59291E', '#A69563', '#BF6B04', '#F2EAD0', '#D9D0BF'];

  constructor() {
    this.canvas = new Canvas();

    this.lastTimeStamp = 0;
    this.frameRate = 30;
    this.frameTimer = 0;

    this.init();
    this.animate();
  }

  init() {
    this.text = this.canvas.sortByGrayScale(this.text, this.separateOn);
    this.colors = sortHexColors(this.colors);

    if (this.mode === 'camera') {
      this.canvas.setCamera(this.cameraPixels);
    } else {
      this.canvas.setImage(this.image, () => this.canvas.drawImage(this.cameraPixels));
      this.frameRate = 1;
    }
  }

  render() {
    this.canvas.clear();
    if (this.mode === 'camera') {
      this.canvas.playVideo();
    }
    this.canvas.drawText(this.text, Math.floor(innerHeight/this.cameraPixels*1000)/1000, this.colors);
  }

  animate(timeStamp: number = 0) {
    let deltaTime = timeStamp - this.lastTimeStamp;
    if (this.frameTimer > 1000/this.frameRate) {
      this.render();
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    this.lastTimeStamp = timeStamp;
    requestAnimationFrame(this.animate.bind(this));
  }
}