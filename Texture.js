import Color from "./Color.js";

export default class Texture{
    constructor(url, callback){
        if (!(this instanceof Texture)) { return new Texture(url); }

        this.image = new Image();
        this.image.src = url;
        
        this.image.onload = () => {
            this.iw = this.image.width - 1;
            this.ih = this.image.height - 1;
        
            this.canvas = document.createElement("canvas");
            this.canvas.width = this.image.width;
            this.canvas.height = this.image.height;
            var c2d = this.canvas.getContext("2d");
            c2d.drawImage(this.image, 0, 0, this.image.width, this.image.height);
            this.pixel_data = c2d.getImageData(0, 0, this.image.width, this.image.height);

            console.log(this);
        }

        this.image.onerror = (err) => {
            console.log("Texture Load Error", err);
            reject();
        }
    }

    GetTexel(u, v){
        let iu = (u * this.iw) | 0;
        let iv = (v * this.ih) | 0;

        let offset = (iv * this.image.width * 4 + iu * 4);

        let color2 = new Color(
            this.pixel_data.data[offset + 0], 
            this.pixel_data.data[offset + 1], 
            this.pixel_data.data[offset + 2], 
            255
        );

        return color2;
    }

    GetBillinearTexel(u, v){
        let iu = (u * this.iw);
        let iv = (v * this.ih);

        let tx = iu | 0;
        let ty = iv | 0;
        let fx = iu - tx;
        let fy = iv - ty;

        let TL = new Color(
            this.pixel_data.data[ty * this.image.width * 4 + tx * 4 + 0], 
            this.pixel_data.data[ty * this.image.width * 4 + tx * 4 + 1], 
            this.pixel_data.data[ty * this.image.width * 4 + tx * 4 + 2], 
            this.pixel_data.data[ty * this.image.width * 4 + tx * 4 + 3]
        )
        let TR = new Color(
            this.pixel_data.data[ty * this.image.width * 4 + (tx + 1) * 4 + 0], 
            this.pixel_data.data[ty * this.image.width * 4 + (tx + 1) * 4 + 1], 
            this.pixel_data.data[ty * this.image.width * 4 + (tx + 1) * 4 + 2], 
            this.pixel_data.data[ty * this.image.width * 4 + (tx + 1) * 4 + 3]
        )
        let BL = new Color(
            this.pixel_data.data[(ty + 1) * this.image.width * 4 + tx * 4 + 0], 
            this.pixel_data.data[(ty + 1) * this.image.width * 4 + tx * 4 + 1], 
            this.pixel_data.data[(ty + 1) * this.image.width * 4 + tx * 4 + 2], 
            this.pixel_data.data[(ty + 1) * this.image.width * 4 + tx * 4 + 3]
        )
        let BR = new Color(
            this.pixel_data.data[(ty + 1) * this.image.width * 4 + (tx + 1) * 4 + 0], 
            this.pixel_data.data[(ty + 1) * this.image.width * 4 + (tx + 1) * 4 + 1], 
            this.pixel_data.data[(ty + 1) * this.image.width * 4 + (tx + 1) * 4 + 2], 
            this.pixel_data.data[(ty + 1) * this.image.width * 4 + (tx + 1) * 4 + 3]
        )

        let CT = Color.Interpolate(TR, TL, fx);
        let CB = Color.Interpolate(BR, BL, fx);

        return Color.Interpolate(CT, CB, fy);
    }

    Frac(f){
        return f % 1;
    }
}