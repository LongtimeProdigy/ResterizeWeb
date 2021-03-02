export default class Color{
    constructor(_r, _g, _b, _a){
        this.r = _r;
        this.g = _g;
        this.b = _b;
        this.a = _a;
    }

    static White(){
        return new Color(255, 255, 255, 255);
    }
    static Black(){
        return new Color(0, 0, 0, 255);
    }
    static Red(){
        return new Color(255, 0, 0, 255);
    }
    static Green(){
        return new Color(0, 255, 0, 255);
    }
    static Blue(){
        return new Color(0, 0, 255, 255);
    }
    static Yellow(){
        return new Color(255, 255, 0, 255);
    }
    static Purple(){
        return new Color(102, 0, 153, 255);
    }
    static Cyan(){
        return new Color(0, 255, 255, 255);
    }
    static Pink(){
        return new Color(253, 185, 200, 255);
    }
    static Random(){
        return new Color(
            Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 255);
    }

    static MultiplyScalar(color, num){
        return new Color(color.r*num, color.g*num, color.b*num, color.a);
    }

    static Interpolate(col1, col2, inter){
        return new Color(
            col1.r * inter + (1 - inter) * col2.r, 
            col1.g * inter + (1 - inter) * col2.g, 
            col1.b * inter + (1 - inter) * col2.b, 
            255
        );
    }
}