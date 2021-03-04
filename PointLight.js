import Light from "./Light.js";
import Matrix4x4 from "./Matrix4x4.js";

export default class PointLight extends Light{
    constructor(intensity, position, distance){
        super("point", intensity);

        this.position = position;
        this.distance = distance;
    }

    GetMatrix(){
        let temp = new Matrix4x4(
            1, 0, 0, this.position.x, 
            0, 1, 0, this.position.y, 
            0, 0, 1, this.position.z, 
            0, 0, 0, 1
        )

        return temp;
    }
}