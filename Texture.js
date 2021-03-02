import Color from "./Color.js";

export default class Texture{
    constructor(url, callback){
        if (!(this instanceof Texture)) { return new Texture(url); }

        this.image = new Image();
        this.image.src = url;
        
        this.image.onload = () => {
            this.iw = this.image.width;
            this.ih = this.image.height;
        
            this.canvas = document.createElement("canvas");
            this.canvas.width = this.iw;
            this.canvas.height = this.ih;
            var c2d = this.canvas.getContext("2d");
            c2d.drawImage(this.image, 0, 0, this.iw, this.ih);
            this.pixel_data = c2d.getImageData(0, 0, this.iw, this.ih);

            console.log("Texture Load Complete");
            console.log(callback);

            // callback();
        }

        this.image.onerror = (err) => {
            console.log("Texture Load Error", err);
            reject();
        }
    }

    GetTexel(u, v, x, y){
        let iu = (u * this.iw) | 0;
        let iv = (v * this.ih) | 0;

        let offset = ((iv - 1) * this.iw * 4 + (iu - 1) * 4);

        return new Color(
            this.pixel_data.data[offset + 0], 
            this.pixel_data.data[offset + 1], 
            this.pixel_data.data[offset + 2], 
            255
        )
    }
}