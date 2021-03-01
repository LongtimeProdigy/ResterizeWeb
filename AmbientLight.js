import Light from "./Light.js"

export default class AmbientLight extends Light{
    constructor(intensity){
        super("ambient", intensity);
    }
}