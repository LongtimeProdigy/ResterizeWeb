import Light from "./Light.js";

export default class DirectionalLight extends Light{
    constructor(intensity, direction){
        super("direction", intensity);

        this.direction = direction;
    }
}