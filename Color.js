export default class Color{
    constructor(_r, _g, _b, _a){
        this.r = _r;
        this.g = _g;
        this.b = _b;
        this.a = _a;
    }

    valueOf(){
        return {r: this.r, g: this.g, b: this.b, a: this.a};
    }
    
    static White(){
        return new Color(255, 255, 255, 255);
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
}