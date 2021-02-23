export default class Vector3{
    constructor(_x, _y, _z){
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }

    static Dot(vec1, vec2){
        return vec1.x*vec2.x + vec1.y*vec2.y + vec1.z*vec2.z;
    }

    static Cross(vec1, vec2){
        return new Vector3(
            vec1.y*vec2.z-vec1.z*vec2.y, 
            vec1.z*vec2.x-vec1.x*vec2.z, 
            vec1.x*vec2.y-vec1.y*vec2.x
            );
    }

    Add(vec2){
        return new Vector3(
            this.x + vec2.x, 
            this.y + vec2.y, 
            this.z + vec2.z
        );
    }
    Minus(vec2){
        return new Vector3(
            this.x - vec2.x, 
            this.y - vec2.y, 
            this.z - vec2.z
        );
    }

    MultiplyScalar(num){
        return new Vector3(
            this.x * num, 
            this.y * num, 
            this.z * num
        );
    }
}