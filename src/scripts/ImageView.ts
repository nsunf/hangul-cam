export default class ImageView {
  image: HTMLImageElement;
  loaded: boolean;

  constructor(imgSrc: string) {
    this.image = new Image();
    this.image.src = imgSrc;

    this.loaded = false;
  }

  setOnLoad(onload: () => void) {
    this.image.onload = () => {
      this.loaded = true;
      onload();
    }
  }
}