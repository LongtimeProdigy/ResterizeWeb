export default class Vector2{
    constructor(_x, _y){
        this.x = _x;
        this.y = _y;
    }

    static Swap(vec1, vec2){
        let temp = vec1;
        vec1 = vec2;
        vec2 = temp;
    }

    static Minus(vec1, vec2){
        return new Vector2(
            vec1.x - vec2.x, 
            vec1.y - vec2.y
        );
    }
}