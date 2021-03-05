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
    static mainCamera;

    constructor(transform, d, fov){
        this.transform = transform;
        this.d = d;
        this.fov = fov;
        this.tan = Math.tan((fov * Math.PI / 180) / 2) * 2;

        this.transform.rotation = new Vector3(
            this.transform.rotation.x * Math.PI / 180, 
            this.transform.rotation.y * Math.PI / 180, 
            this.transform.rotation.z * Math.PI / 180
        )

        let s2 = Math.sqrt(2);
        this.clipPlanes = [
            new Plane(new Vector3(0, 0, 1), 1), // Near
            new Plane(new Vector3(s2, 0, s2), 0), // Left
            new Plane(new Vector3(-s2, 0, s2), 0), // Right
            new Plane(new Vector3(0, -s2, s2), 0), // Top
            new Plane(new Vector3(0, s2, s2), 0), // Bottom
        ];

        let theta = this.fov / 2;
        this.viewport =  new Rect(
            0, 
            0, 
            2 * this.d * Math.tan(theta * Math.PI / 180), 
            2 * this.d * Math.tan(theta * Math.PI / 180)
            );

        if(Camera.mainCamera == undefined){
            Camera.mainCamera = this;
        }
    }

    GetMatrix(){
        // multiple matrix rotate z * rotate y * rotate z * locate
        // let x = -this.transform.rotation.x;
        // let y = -this.transform.rotation.y;
        // let z = -this.transform.rotation.z;

        // let A = (-Math.sin(x)) * this.transform.position.x + Math.cos(x) * this.transform.position.z;
        // let B = Math.cos(y) * this.transform.position.x + Math.sin(y) * A;
        // let C = Math.cos(x) * this.transform.position.y + Math.sin(x) * this.transform.position.z;
        // let D = (-Math.sin(y)) * this.transform.position.x + Math.cos(y) * A;

        // let temp = new Matrix4x4(
        //     Math.cos(z)*Math.cos(y),    Math.cos(z)*Math.sin(y)*(-Math.sin(x))+Math.sin(z)*Math.cos(x), Math.cos(z)*Math.sin(y)*Math.cos(z)+Math.sin(z)*Math.sin(x),    Math.cos(z)*B + Math.sin(z)*C, 
        //     -Math.sin(z)*Math.cos(y),   Math.sin(z)*Math.sin(y)*Math.sin(x)+Math.cos(z)*Math.cos(x),    (-Math.sin(z))*Math.sin(y)*Math.cos(x)+Math.cos(z)*Math.sin(x), (-Math.sin(z))*B + Math.cos(z)*C, 
        //     Math.sin(y),                -Math.cos(y)*Math.sin(z),                                       Math.cos(y)*Math.cos(z),                                        (-Math.sin(y)) * this.transform.position.x + Math.cos(y) * A, 
        //     0, 0, 0, 1
        // )

        // return temp;

        let x = this.RotateXMatrix();
        let y = this.RotateYMatrix();
        let z = this.RotateZMatrix();

        let rotateMatrix = z.Multiply3x3(y.Multiply3x3(x));

        let matrix = Matrix4x4.FromMatrix3x3(rotateMatrix).Multiply4x4(this.LocateMatrix());

        return matrix;
    }
    GetRotateMatrix(){
        let x = -this.transform.rotation.x;
        let y = this.transform.rotation.y;
        let z = -this.transform.rotation.z;
        let rotateMat4 = new Matrix4x4(
            Math.cos(x)*Math.cos(y), Math.cos(x)*Math.sin(y)*Math.sin(z)+Math.sin(x)*Math.cos(z), -Math.cos(x)*Math.sin(y)*Math.cos(z)+Math.sin(x)*Math.sin(z), 0, 
            -Math.sin(x)*Math.cos(y), -Math.sin(x)*Math.sin(y)*Math.sin(z)+Math.cos(x)*Math.cos(z), Math.sin(x)*Math.sin(y)*Math.cos(z)+Math.cos(x)*Math.sin(z), 0, 
            Math.sin(y), -Math.cos(y)*Math.sin(z), Math.cos(y)*Math.cos(z), 0, 
            0, 0, 0, 1
        );

        return rotateMat4;
    }

    RotateXMatrix(){
        return new Matrix3x3(
            1, 0, 0, 
            0, Math.cos(this.transform.rotation.x), Math.sin(this.transform.rotation.x), 
            0, -Math.sin(this.transform.rotation.x), Math.cos(this.transform.rotation.x)
        )
    }
    RotateYMatrix(){
        return new Matrix3x3(
            Math.cos(this.transform.rotation.y), 0, -Math.sin(this.transform.rotation.y), 
            0, 1, 0, 
            Math.sin(this.transform.rotation.y), 0, Math.cos(this.transform.rotation.y)
        )
    }
    RotateZMatrix(){
        return new Matrix3x3(
            Math.cos(this.transform.rotation.z), Math.sin(this.transform.rotation.z), 0, 
            -Math.sin(this.transform.rotation.z), Math.cos(this.transform.rotation.z), 0, 
            0, 0, 1
        )
    }
    LocateMatrix(){
        return new Matrix4x4(
            1, 0, 0, -this.transform.position.x, 
            0, 1, 0, this.transform.position.y, 
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

    PlaneClip(center, model){
        for(let i = 0; i < this.clipPlanes.length; ++i){
            let distance = this.SignedDistance(this.clipPlanes[i], center);
            if(distance < -model.radius){
                return null;
            }
            else if(distance >= model.radius){
            }
            else{
                // let clipedModel = TrianglesClip(model, planes[i]);
                // return model;
            }
        }
    
        return model;
    }

    SignedDistance(plane, vertex){
        return Vector3.Dot(vertex, plane.normal) + plane.distance;
    }

    TrianglesClip(model, plane){
        let clipedVertices = [];
        let clipedTriangles = [];
        for(let i = 0; i < model.triangles; ++i){
            let vertex0 = model.vertices[model.triangles[i].x];
            let vertex1 = model.vertices[model.triangles[i].y];
            let vertex2 = model.vertices[model.triangles[i].z];
    
            let d0 = SignedDistance(plane, vertex0);
            let d1 = SignedDistance(plane, vertex1);
            let d2 = SignedDistance(plane, vertex2);
    
            if(d0 > 0 && d1 > 0 && d2 > 0){
                // // all vetex push
                // clipedTriangles.push(model.triangles[i]);
            }
            else if(d0 < 0 && d1 < 0 && d2 < 0){
                // Nothing
            }
            else if(d0 > 0 || d1 > 0 || d2 > 0){
                // just one vertex positive
                // triangle shink
            }
            else{
                // two vertex positive
                // make two triangles
            }
        }
    
        return model;
    }

    ProjectVertex(v){
        return new Vector3(
            v.x / (this.tan * v.z) + 0.5, 
            v.y / (this.tan * v.z) + 0.5, 
            v.z
        );
    }
}