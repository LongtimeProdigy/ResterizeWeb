import Vector3 from "./Vector3.js";

export default class Canvas{
    constructor(canvasName, backgroundColor){
        this.canvas = document.getElementById(canvasName);
        this.WIDTH = this.canvas.width;
        this.HEIGHT = this.canvas.height;

        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        
        this.id = this.ctx.getImageData(0, 0, this.WIDTH, this.HEIGHT);
        this.pixels = this.id.data;

        this.depthBuffer = new Array();
        this.depthBuffer.length = this.WIDTH * this.HEIGHT;
        for(let i = 0; i < this.depthBuffer.length; ++i){
            this.depthBuffer[i] = -Infinity;
        }
    }

    ClearCanvas(){
        // 픽셀 정리
        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        // 컨텍스트 리셋
        this.ctx.beginPath();

        this.id = this.ctx.getImageData(0, 0, this.WIDTH, this.HEIGHT);
        this.pixels = this.id.data;
    }

    UpdateCanvas(){
        this.ctx.putImageData(this.id, 0, 0);
    }

    PutPixel(x, y, depth, color){
        // x = this.WIDTH / 2 + (x | 0);
        // y = this.HEIGHT / 2 - (y | 0) - 1;
        
        if (x < 0 || x >= this.WIDTH || y < 0 || y >= this.HEIGHT) {
            return;
        }
        
        if(this.UpdateDepthBufferIfCloser(x, y, depth)){
            let off = (y * this.WIDTH + x) * 4;
            this.pixels[  off] = color.r;
            this.pixels[++off] = color.g;
            this.pixels[++off] = color.b;
            this.pixels[++off] = color.a;
        }
    }

    UpdateDepthBufferIfCloser(x, y, depth) {
        let offset = x + this.WIDTH * y;
        if (this.depthBuffer[offset] < depth){
            this.depthBuffer[offset] = depth;
            return true;
        }
        
        return false;
    }

    ViewportToCanvas(vec){
        return new Vector3(
                (vec.x * this.WIDTH) | 0, 
                (vec.y * this.HEIGHT) | 0, 
                vec.z
            );
    }
    CanvasToViewport(x, y){
        return new Vector3(
            (x / WIDTH), 
            (y / HEIGHT), 
            0
        );
    }

    UnProjectVertex(x, y, z) {
        let ux = x*z / camera.d;
        let uy = y*z / camera.d;
        let p2d = CanvasToViewport(ux, uy);
        return new Vector3(p2d.x, p2d.y, z);
    }
}