import Light from "./Light.js";

export default class PointLight extends Light{
    constructor(intensity, position, distance){
        super("point", intensity);

        this.position = position;
        this.distance = distance;
    }
}