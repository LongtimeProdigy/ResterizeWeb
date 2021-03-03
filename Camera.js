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

        this.transform.rotation = new Vector3(
            this.transform.rotation.x * Math.PI / 180, 
            this.transform.rotation.y * Math.PI / 180, 
            this.transform.rotation.z * Math.PI / 180
        )

        this.clipPlanes = [];
        this.CalcClipPlaneFomulas();
    }

    GetViewport(){
        let theta = this.fov / 2;
        return new Rect(0, 0, 
            2 * this.d * Math.tan(theta * Math.PI / 180), 
            2 * this.d * Math.tan(theta * Math.PI / 180)
            );
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
        // let x1 = this.RotateXMatrix();
        // let y1 = this.RotateYMatrix();
        // let z1 = this.RotateZMatrix();

        // let rotateMat3 = x1.Multiply3x3(y1.Multiply3x3(z1));

        // let rotateMat4 = Matrix4x4.FromMatrix3x3(rotateMat3);
        // // let locatedMat4 = rotateMat4.AddLocate(new Vector3(
        // //     -this.transform.position.x, 
        // //     -this.transform.position.y, 
        // //     -this.transform.position.z
        // // ));
        // let locatedMat4 = this.LocateMatrix();

        // let returnMatrix = rotateMat4.Multiply4x4(locatedMat4);

        let x = -this.transform.rotation.x;
        let y = -this.transform.rotation.y;
        let z = -this.transform.rotation.z;
        let temp = new Matrix4x4(
            Math.cos(x)*Math.cos(y), Math.cos(x)*Math.sin(y)*Math.sin(z)+Math.sin(x)*Math.cos(z), -Math.cos(x)*Math.sin(y)*Math.cos(z)+Math.sin(x)*Math.sin(z), -this.transform.position.x, 
            -Math.sin(x)*Math.cos(y), -Math.sin(x)*Math.sin(y)*Math.sin(z)+Math.cos(x)*Math.cos(z), Math.sin(x)*Math.sin(y)*Math.cos(z)+Math.cos(x)*Math.sin(z), -this.transform.position.y, 
            Math.sin(y), -Math.cos(y)*Math.sin(z), Math.cos(y)*Math.cos(z), -this.transform.position.z, 
            0, 0, 0, 1
        )

        return temp;
    }
    GetRotateMatrix(){
        let x = this.RotateXMatrix();
        let y = this.RotateYMatrix();
        let z = this.RotateZMatrix();

        let rotateMat3 = x.Multiply3x3(y.Multiply3x3(z));

        let rotateMat4 = Matrix4x4.FromMatrix3x3(rotateMat3);
        // let locatedMat4 = rotateMat4.AddLocate(new Vector3(
        //     -this.transform.position.x, 
        //     -this.transform.position.y, 
        //     -this.transform.position.z
        // ));
        // let locatedMat4 = this.LocateMatrix();

        // let returnMatrix = rotateMat4.Multiply4x4(locatedMat4);

        return rotateMat4;
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
            Math.cos(-this.transform.rotation.y), 0, -Math.sin(-this.transform.rotation.y), 
            0, 1, 0, 
            Math.sin(-this.transform.rotation.y), 0, Math.cos(-this.transform.rotation.y)
        )
    }
    RotateZMatrix(){
        return new Matrix3x3(
            Math.cos(-this.transform.rotation.z), -Math.sin(-this.transform.rotation.z), 0, 
            Math.sin(-this.transform.rotation.z), Math.cos(-this.transform.rotation.z), 0, 
            0, 0, 1
        )
    }
    LocateMatrix(){
        return new Matrix4x4(
            1, 0, 0, -this.transform.position.x, 
            0, 1, 0, -this.transform.position.y, 
            0, 0, 1, -this.transform.position.z, 
            0, 0, 0, 1
        )
    }

    GetForwardVector(){
        return this.GetRotateMatrix().MultiplyVector3(new Vector3(0, 0, 1));
    }

    GetRightVector(){
        return this.GetRotateMatrix().MultiplyVector3(new Vector3(1, 0, 0));
    }

    GetUpVector(){
        return this.GetRotateMatrix().MultiplyVector3(new Vector3(0, 1, 0));
    }
}