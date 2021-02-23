import Matrix3x3 from "./Matrix3x3.js"
import Matrix4x4 from "./Matrix4x4.js"

export default class Model{
    constructor(_name, _vertices, _triangles, _transform, _center, _radius){
        this.name = _name;
        this.vertices = _vertices;
        this.triangles = _triangles;
        this.transform = _transform;
        this.center = _center;
        this.radius = _radius;
    }

    Translate(){
        let mat4x4 = this.GetWroldMatrix();

        let result = [];
        for(let i = 0; i < this.vertices.length; ++i){
            result.push(mat4x4.MultiplyVector3(this.vertices[i]));
        }

        return result;
    }

    GetWroldMatrix(){
        let x = this.RotateXMatrix();
        let y = this.RotateYMatrix();
        let z = this.RotateZMatrix();

        let rotateMat3 = x.Multiply3x3(y.Multiply3x3(z));

        let rotateMat4 = Matrix4x4.FromMatrix3x3(rotateMat3);
        let locatedMat4 = rotateMat4.AddLocate(this.transform.position);

        let completeMat4 = locatedMat4.AddScale(this.transform.scale);

        return completeMat4;
    }

    RotateXMatrix(){
        return new Matrix3x3(
            1, 0, 0, 
            0, Math.cos(this.transform.rotation.x), -Math.sin(this.transform.rotation.x), 
            0, Math.sin(this.transform.rotation.x), Math.cos(this.transform.rotation.x)
        )
    }
    RotateYMatrix(){
        return new Matrix3x3(
            Math.cos(this.transform.rotation.y), 0, Math.sin(this.transform.rotation.y), 
            0, 1, 0, 
            -Math.sin(this.transform.rotation.y), 0, Math.cos(this.transform.rotation.y)
        )
    }
    RotateZMatrix(){
        return new Matrix3x3(
            Math.cos(this.transform.rotation.z), -Math.sin(this.transform.rotation.z), 0, 
            Math.sin(this.transform.rotation.z), Math.cos(this.transform.rotation.z), 0, 
            0, 0, 1
        )
    }
}