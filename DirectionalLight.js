import Light from "./Light.js";
import Vector3 from "./Vector3.js";

export default class DirectionalLight extends Light{
    constructor(intensity, direction){
        super("direction", intensity);

        this.direction = direction;
    }
}