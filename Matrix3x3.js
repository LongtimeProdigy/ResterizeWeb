import Vector3 from "./Vector3.js";

export default class Matrix3x3{
    constructor(a1, a2, a3, b1, b2, b3, c1, c2, c3){
        this.a1 = a1;
        this.a2 = a2;
        this.a3 = a3;
        this.b1 = b1;
        this.b2 = b2;
        this.b3 = b3;
        this.c1 = c1;
        this.c2 = c2;
        this.c3 = c3;
    }

    Multiply3x3(mat){
        return new Matrix3x3(
            this.a1*mat.a1 + this.a2*mat.b1 + this.a3*mat.c1, 
            this.a1*mat.a2 + this.a2*mat.b2 + this.a3*mat.c2, 
            this.a1*mat.a3 + this.a2*mat.b3 + this.a3*mat.c3, 
            this.b1*mat.a1 + this.b2*mat.b1 + this.b3*mat.c1, 
            this.b1*mat.a2 + this.b2*mat.b2 + this.b3*mat.c2, 
            this.b1*mat.a3 + this.b2*mat.b3 + this.b3*mat.c3, 
            this.c1*mat.a1 + this.c2*mat.b1 + this.c3*mat.c1, 
            this.c1*mat.a2 + this.c2*mat.b2 + this.c3*mat.c2, 
            this.c1*mat.a3 + this.c2*mat.b3 + this.c3*mat.c3 
        );
    }

    MultiplyVector3(vec){
        return new Vector3(
            this.a1*vec.x+this.a2*vec.y+this.a3*vec.z, 
            this.b1*vec.x+this.b2*vec.y+this.b3*vec.z, 
            this.c1*vec.x+this.c2*vec.y+this.c3*vec.z
        )
    }
}