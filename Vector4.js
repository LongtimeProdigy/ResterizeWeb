import Vector3 from "./Vector3.js";

export default class Vector4{
    constructor(_x, _y, _z, _w){
        if(_x instanceof Vector3){

        }
        else{
            this.x = _x;
            this.y = _y;
            this.z = _z;
            this.w = _w;
        }
    }

    FromVector3(vector3){
        this.x = vector3.x;
        this.y = vector3.y;
        this.z = vector3.z;
        this.w = 1;
    }
}