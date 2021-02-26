import Vector3 from "./Vector3.js";
import Vector4 from "./Vector4.js"

export default class Matrix4x4{
    constructor(a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, d1, d2, d3, d4){
        this.a1 = a1;
        this.a2 = a2;
        this.a3 = a3;
        this.a4 = a4;
        this.b1 = b1;
        this.b2 = b2;
        this.b3 = b3;
        this.b4 = b4;
        this.c1 = c1;
        this.c2 = c2;
        this.c3 = c3;
        this.c4 = c4;
        this.d1 = d1;
        this.d2 = d2;
        this.d3 = d3;
        this.d4 = d4;       
    }

    static FromMatrix3x3(mat3x3){
        return new Matrix4x4(
            mat3x3.a1, mat3x3.a2, mat3x3.a3, 0, 
            mat3x3.b1, mat3x3.b2, mat3x3.b3, 0, 
            mat3x3.c1, mat3x3.c2, mat3x3.c3, 0, 
            0, 0, 0, 0
        );
    }

    AddLocate(vec3){
        return new Matrix4x4(
            this.a1, this.a2, this.a3, vec3.x, 
            this.b1, this.b2, this.b3, vec3.y, 
            this.c1, this.c2, this.c3, vec3.z, 
            this.d1, this.d2, this.d3, this.d4, 
        )
    }

    AddScale(num){
        return new Matrix4x4(
            this.a1, this.a2, this.a3, this.a4, 
            this.b1, this.b2, this.b3, this.b4, 
            this.c1, this.c2, this.c3, this.c4, 
            this.d1, this.d2, this.d3, num 
        );
    }

    MultiplyVector3(vec3){
        let mul = vec3.MultiplyScalar(this.d4);
        let temp = new Vector3(
            (this.a1*mul.x + this.a2*mul.y + this.a3*mul.z + this.a4), 
            (this.b1*mul.x + this.b2*mul.y + this.b3*mul.z + this.b4), 
            (this.c1*mul.x + this.c2*mul.y + this.c3*mul.z + this.c4)
        );
        // let temp = new Vector3(
        //     (this.a1*vec3.x + this.a2*vec3.y + this.a3*vec3.z + this.a4), 
        //     (this.b1*vec3.x + this.b2*vec3.y + this.b3*vec3.z + this.b4), 
        //     (this.c1*vec3.x + this.c2*vec3.y + this.c3*vec3.z + this.c4)
        // ).MultiplyScalar(this.d4);

        return temp;
    }

    Multiply4x4(mat){
        return new Matrix4x4(
            this.a1*mat.a1+this.a2*mat.b1+this.a3*mat.c1+this.a4*mat.d1, 
            this.a1*mat.a2+this.a2*mat.b2+this.a3*mat.c2+this.a4*mat.d2, 
            this.a1*mat.a3+this.a2*mat.b3+this.a3*mat.c3+this.a4*mat.d3, 
            this.a1*mat.a4+this.a2*mat.b4+this.a3*mat.c4+this.a4*mat.d4, 
            this.b1*mat.a1+this.b2*mat.b1+this.b3*mat.c1+this.b4*mat.d1, 
            this.b1*mat.a2+this.b2*mat.b2+this.b3*mat.c2+this.b4*mat.d2, 
            this.b1*mat.a3+this.b2*mat.b3+this.b3*mat.c3+this.b4*mat.d3, 
            this.b1*mat.a4+this.b2*mat.b4+this.b3*mat.c4+this.b4*mat.d4, 
            this.c1*mat.a1+this.c2*mat.b1+this.c3*mat.c1+this.c4*mat.d1, 
            this.c1*mat.a2+this.c2*mat.b2+this.c3*mat.c2+this.c4*mat.d2, 
            this.c1*mat.a3+this.c2*mat.b3+this.c3*mat.c3+this.c4*mat.d3, 
            this.c1*mat.a4+this.c2*mat.b4+this.c3*mat.c4+this.c4*mat.d4, 
            this.d1*mat.a1+this.d2*mat.b1+this.d1*mat.c1+this.d4*mat.d1, 
            this.d1*mat.a2+this.d2*mat.b2+this.d1*mat.c2+this.d4*mat.d2, 
            this.d1*mat.a3+this.d2*mat.b3+this.d1*mat.c3+this.d4*mat.d3, 
            this.d1*mat.a4+this.d2*mat.b4+this.d1*mat.c4+this.d4*mat.d4 
        )
    }

    Transpose(){
        return new Matrix4x4(
            this.a1, this.b1, this.c1, this.d1, 
            this.a2, this.b2, this.c2, this.d2, 
            this.a3, this.b3, this.c3, this.d3, 
            this.a4, this.b4, this.c4, this.d4
        )
    }
}