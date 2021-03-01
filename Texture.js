export default class Texture{
    constructor(url, callback){
        if (!(this instanceof Texture)) { return new Texture(url); }

        var texture = this;

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

            console.log(this);

            callback();
        }
    }

    LoadTexture(url){
        var texture = this;

        return new Promise((resolve, reject) => {
            this.image = new Image();
            this.image.src = url;
            
            this.image.onload = function() {
                texture.iw = texture.image.width;
                texture.ih = texture.image.height;
            
                texture.canvas = document.createElement("canvas");
                texture.canvas.width = texture.iw;
                texture.canvas.height = texture.ih;
                var c2d = texture.canvas.getContext("2d");
                c2d.drawImage(texture.image, 0, 0, texture.iw, texture.ih);
                texture.pixel_data = c2d.getImageData(0, 0, texture.iw, texture.ih);

                console.log(texture);

                resolve();
            }
        });
    }

    GetTexel(u, v){
        let iu = (u * this.iw) | 0;
        let iv = (v * this.ih) | 0;

        let offset = (iv * this.iw * 4 + iu * 4);

        return [
            this.pixel_data.data[offset + 0], 
            this.pixel_data.data[offset + 1], 
            this.pixel_data.data[offset + 2]
        ]
    }
}