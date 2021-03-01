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

    static Add(vec1, vec2){
        return new Vector3(
            vec1.x + vec2.x, 
            vec1.y + vec2.y, 
            vec1.z + vec2.z
        );
    }
    static Minus(vec1, vec2){
        return new Vector3(
            vec1.x - vec2.x, 
            vec1.y - vec2.y, 
            vec1.z - vec2.z
        );
    }

    static MultiplyScalar(vec, num){
        return new Vector3(
            vec.x * num, 
            vec.y * num, 
            vec.z * num
        );
    }

    Length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    Normalized(){
        let length = this.Length();
        return new Vector3(this.x / length, this.y / length, this.z / length);
    }
}