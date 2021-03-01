import Matrix3x3 from "./Matrix3x3.js"
import Matrix4x4 from "./Matrix4x4.js"
import Vector3 from "./Vector3.js"
import Triangle from "./Triangle.js"
import Color from "./Color.js"
import Vector2 from "./Vector2.js"

var vertices = [
    new Vector3(1, 1, 1), 
    new Vector3(-1, 1, 1), 
    new Vector3(-1, -1, 1), 
    new Vector3(1, -1, 1), 
    new Vector3(1, 1, -1), 
    new Vector3(-1, 1, -1), 
    new Vector3(-1, -1, -1), 
    new Vector3(1, -1, -1)
];
var triangles = [
    new Triangle([0, 1, 2], Color.Red()     , [new Vector3( 0,  0,  1), new Vector3( 0,  0,  1), new Vector3( 0,  0,  1)], [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)]), 
    new Triangle([0, 2, 3], Color.Red()     , [new Vector3( 0,  0,  1), new Vector3( 0,  0,  1), new Vector3( 0,  0,  1)], [new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)]), 
    new Triangle([4, 0, 3], Color.Green()   , [new Vector3( 1,  0,  0), new Vector3( 1,  0,  0), new Vector3( 1,  0,  0)], [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)]), 
    new Triangle([4, 3, 7], Color.Green()   , [new Vector3( 1,  0,  0), new Vector3( 1,  0,  0), new Vector3( 1,  0,  0)], [new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)]), 
    new Triangle([5, 4, 7], Color.Blue()    , [new Vector3( 0,  0, -1), new Vector3( 0,  0, -1), new Vector3( 0,  0, -1)], [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)]), 
    new Triangle([5, 7, 6], Color.Blue()    , [new Vector3( 0,  0, -1), new Vector3( 0,  0, -1), new Vector3( 0,  0, -1)], [new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)]), 
    new Triangle([1, 5, 6], Color.Yellow()  , [new Vector3(-1,  0,  0), new Vector3(-1,  0,  0), new Vector3(-1,  0,  0)], [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)]), 
    new Triangle([1, 6, 2], Color.Yellow()  , [new Vector3(-1,  0,  0), new Vector3(-1,  0,  0), new Vector3(-1,  0,  0)], [new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)]), 
    new Triangle([4, 5, 1], Color.Purple()  , [new Vector3( 0,  1,  0), new Vector3( 0,  1,  0), new Vector3( 0,  1,  0)], [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)]), 
    new Triangle([4, 1, 0], Color.Purple()  , [new Vector3( 0,  1,  0), new Vector3( 0,  1,  0), new Vector3( 0,  1,  0)], [new Vector2(0, 1), new Vector2(1, 1), new Vector2(0, 0)]), 
    new Triangle([2, 6, 7], Color.Cyan()    , [new Vector3( 0, -1,  0), new Vector3( 0, -1,  0), new Vector3( 0, -1,  0)], [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)]), 
    new Triangle([2, 7, 3], Color.Cyan()    , [new Vector3( 0, -1,  0), new Vector3( 0, -1,  0), new Vector3( 0, -1,  0)], [new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)])
];

export default class Model{
    constructor(_name, _vertices, _triangles, _transform, _center, _radius){
        this.name = _name;
        this.vertices = _vertices;
        this.triangles = _triangles;
        this.transform = _transform;
        this.center = _center;
        this.radius = _radius;
    }

    static CreateCube(_name, _transform, _center, _radius){
        return new Model(_name, vertices, triangles, _transform, _center, _radius);
    }
    static CreateSphere(divs, color, _name, _transform, _center, _radius){
        var vertexes = [];
        var triangleses = [];
    
        var delta_angle = 2.0*Math.PI / divs;
    
        // Generate vertexes and normals.
        for (var d = 0; d < divs + 1; d++) {
            var y = (2.0 / divs) * (d - divs / 2.0);
            var radius = Math.sqrt(1.0 - y*y);
            for (var i = 0; i < divs; i++) {
                var vertex = new Vector3(
                        radius*Math.cos(i*delta_angle), 
                        y, 
                        radius*Math.sin(i*delta_angle)
                    );
                vertexes.push(vertex);
            }
        }
    
        // Generate triangles.
        for (var d = 0; d < divs; d++) {
            for (var i = 0; i < divs - 1; i++) {
                var i0 = d*divs + i;
                var offset = 1;
                // i == divs - 1 ? -i : 1;
                triangleses.push(new Triangle([i0, i0+divs+offset, i0+offset], color, [vertexes[i0], vertexes[i0+divs+offset], vertexes[i0+offset]]));
                triangleses.push(new Triangle([i0, i0+divs, i0+divs+offset], color, [vertexes[i0], vertexes[i0+divs], vertexes[i0+divs+offset]]));
            }
        }
    
        return new Model(_name, vertexes, triangleses, _transform, _center, _radius);
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

    GetWroldRotationMatrix(){
        let x = this.RotateXMatrix();
        let y = this.RotateYMatrix();
        let z = this.RotateZMatrix();

        let rotateMat3 = x.Multiply3x3(y.Multiply3x3(z));

        let rotateMat4 = Matrix4x4.FromMatrix3x3(rotateMat3);

        return rotateMat4;
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
            Math.cos(this.transform.rotation.y), 0, -Math.sin(this.transform.rotation.y), 
            0, 1, 0, 
            Math.sin(this.transform.rotation.y), 0, Math.cos(this.transform.rotation.y)
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