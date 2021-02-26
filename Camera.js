import Matrix3x3 from "./Matrix3x3.js";
import Matrix4x4 from "./Matrix4x4.js";
import Rect from "./Rect.js";
import Vector3 from "./Vector3.js";

class Plane{
    constructor(normal, distance){
        this.normal = normal;
        this.distance = distance;
    }
}

export default class Camera{
    constructor(transform, d, fov){
        this.transform = transform;
        this.d = d;
        this.fov = fov;

        this.clipPlanes = [];
        this.CalcClipPlaneFomulas();
    }

    CalcClipPlaneFomulas(){
        let s2 = Math.sqrt(2);
        this.clipPlanes = [
            new Plane(new Vector3(0, 0, 1), -1), // Near
            new Plane(new Vector3(s2, 0, s2), 0), // Left
            new Plane(new Vector3(-s2, 0, s2), 0), // Right
            new Plane(new Vector3(0, -s2, s2), 0), // Top
            new Plane(new Vector3(0, s2, s2), 0), // Bottom
        ];
    }

    GetMatrix(){
        let x = this.RotateXMatrix();
        let y = this.RotateYMatrix();
        let z = this.RotateZMatrix();

        let rotateMat3 = x.Multiply3x3(y.Multiply3x3(z));

        let rotateMat4 = Matrix4x4.FromMatrix3x3(rotateMat3);
        let locatedMat4 = rotateMat4.AddLocate(new Vector3(
            -this.transform.position.x, 
            -this.transform.position.y, 
            -this.transform.position.z
        ));

        let completeMat4 = locatedMat4.AddScale(1);

        return completeMat4;
    }

    RotateXMatrix(){
        return new Matrix3x3(
            1, 0, 0, 
            0, Math.cos(-this.transform.rotation.x), -Math.sin(-this.transform.rotation.x), 
            0, Math.sin(-this.transform.rotation.x), Math.cos(-this.transform.rotation.x)
        )
    }
    RotateYMatrix(){
        return new Matrix3x3(
            Math.cos(-this.transform.rotation.y), 0, Math.sin(-this.transform.rotation.y), 
            0, 1, 0, 
            -Math.sin(-this.transform.rotation.y), 0, Math.cos(-this.transform.rotation.y)
        )
    }
    RotateZMatrix(){
        return new Matrix3x3(
            Math.cos(-this.transform.rotation.z), -Math.sin(-this.transform.rotation.z), 0, 
            Math.sin(-this.transform.rotation.z), Math.cos(-this.transform.rotation.z), 0, 
            0, 0, 1
        )
    }

    GetViewport(){
        let theta = this.fov / 2;
        return new Rect(0, 0, 
            2 * this.d * Math.tan(theta * Math.PI / 180), 
            2 * this.d * Math.tan(theta * Math.PI / 180)
            );
    }
}