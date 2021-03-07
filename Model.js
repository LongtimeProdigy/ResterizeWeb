import Matrix3x3 from "./Matrix3x3.js"
import Matrix4x4 from "./Matrix4x4.js"
import Vector3 from "./Vector3.js"
import Triangle from "./Triangle.js"
import Color from "./Color.js"
import Vector2 from "./Vector2.js"
import Vertex from "./Vertex.js"
import Transform from "./Transform.js"

var vertices = [
    // new Vector3(1, 1, 1), 
    // new Vector3(-1, 1, 1), 
    // new Vector3(-1, -1, 1), 
    // new Vector3(1, -1, 1), 
    // new Vector3(1, 1, -1), 
    // new Vector3(-1, 1, -1), 
    // new Vector3(-1, -1, -1), 
    // new Vector3(1, -1, -1)

    // far 0~3
    new Vertex(new Vector3(1, 1, 1),    new Vector3(0, 0, 1), new Vector2(0, 0), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(1, -1, 1),   new Vector3(0, 0, 1), new Vector2(0, 1), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(-1, -1, 1),  new Vector3(0, 0, 1), new Vector2(1, 1), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(-1, 1, 1),   new Vector3(0, 0, 1), new Vector2(1, 0), new Color(255, 255, 255, 255)), 

    // up 4~7
    new Vertex(new Vector3(1, 1, -1),   new Vector3(0, 1, 0), new Vector2(0, 0), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(1, 1, 1),    new Vector3(0, 1, 0), new Vector2(0, 1), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(-1, 1, 1),   new Vector3(0, 1, 0), new Vector2(1, 1), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(-1, 1, -1),  new Vector3(0, 1, 0), new Vector2(1, 0), new Color(255, 255, 255, 255)), 

    // left 8~11
    new Vertex(new Vector3(-1, 1, 1),   new Vector3(-1, 0, 0), new Vector2(0, 0), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(-1, -1, 1),  new Vector3(-1, 0, 0), new Vector2(0, 1), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(-1, -1, -1), new Vector3(-1, 0, 0), new Vector2(1, 1), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(-1, 1, -1),  new Vector3(-1, 0, 0), new Vector2(1, 0), new Color(255, 255, 255, 255)), 

    // front 12~15
    new Vertex(new Vector3(-1, 1, -1),  new Vector3(0, 0, -1), new Vector2(0, 0), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(-1, -1, -1), new Vector3(0, 0, -1), new Vector2(0, 1), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(1, -1, -1),  new Vector3(0, 0, -1), new Vector2(1, 1), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(1, 1, -1),   new Vector3(0, 0, -1), new Vector2(1, 0), new Color(255, 255, 255, 255)), 

    // right 16~19
    new Vertex(new Vector3(1, 1, -1),   new Vector3(1, 0, 0), new Vector2(0, 0), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(1, -1, -1),  new Vector3(1, 0, 0), new Vector2(0, 1), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(1, -1, 1),   new Vector3(1, 0, 0), new Vector2(1, 1), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(1, 1, 1),    new Vector3(1, 0, 0), new Vector2(1, 0), new Color(255, 255, 255, 255)), 

    // down 20~23
    new Vertex(new Vector3(1, -1, -1),  new Vector3(0, -1, 0), new Vector2(0, 0), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(-1, -1, -1), new Vector3(0, -1, 0), new Vector2(0, 1), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(-1, -1, 1),  new Vector3(0, -1, 0), new Vector2(1, 1), new Color(255, 255, 255, 255)), 
    new Vertex(new Vector3(1, -1, 1),   new Vector3(0, -1, 0), new Vector2(1, 0), new Color(255, 255, 255, 255)), 
];
var triangles = [
    // new Triangle([0, 1, 2], Color.Red()     , [new Vector3( 0,  0,  1), new Vector3( 0,  0,  1), new Vector3( 0,  0,  1)], [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)]), 
    // new Triangle([0, 2, 3], Color.Red()     , [new Vector3( 0,  0,  1), new Vector3( 0,  0,  1), new Vector3( 0,  0,  1)], [new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)]), 
    // new Triangle([4, 0, 3], Color.Green()   , [new Vector3( 1,  0,  0), new Vector3( 1,  0,  0), new Vector3( 1,  0,  0)], [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)]), 
    // new Triangle([4, 3, 7], Color.Green()   , [new Vector3( 1,  0,  0), new Vector3( 1,  0,  0), new Vector3( 1,  0,  0)], [new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)]), 
    // new Triangle([5, 4, 7], Color.Blue()    , [new Vector3( 0,  0, -1), new Vector3( 0,  0, -1), new Vector3( 0,  0, -1)], [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)]), 
    // new Triangle([5, 7, 6], Color.Blue()    , [new Vector3( 0,  0, -1), new Vector3( 0,  0, -1), new Vector3( 0,  0, -1)], [new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)]), 
    // new Triangle([1, 5, 6], Color.Yellow()  , [new Vector3(-1,  0,  0), new Vector3(-1,  0,  0), new Vector3(-1,  0,  0)], [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)]), 
    // new Triangle([1, 6, 2], Color.Yellow()  , [new Vector3(-1,  0,  0), new Vector3(-1,  0,  0), new Vector3(-1,  0,  0)], [new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)]), 
    // new Triangle([4, 5, 1], Color.Purple()  , [new Vector3( 0,  1,  0), new Vector3( 0,  1,  0), new Vector3( 0,  1,  0)], [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)]), 
    // new Triangle([4, 1, 0], Color.Purple()  , [new Vector3( 0,  1,  0), new Vector3( 0,  1,  0), new Vector3( 0,  1,  0)], [new Vector2(0, 1), new Vector2(1, 1), new Vector2(0, 0)]), 
    // new Triangle([2, 6, 7], Color.Cyan()    , [new Vector3( 0, -1,  0), new Vector3( 0, -1,  0), new Vector3( 0, -1,  0)], [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)]), 
    // new Triangle([2, 7, 3], Color.Cyan()    , [new Vector3( 0, -1,  0), new Vector3( 0, -1,  0), new Vector3( 0, -1,  0)], [new Vector2(0, 0), new Vector2(1, 1), new Vector2(0, 1)])

    new Triangle([0, 1, 2]), 
    new Triangle([0, 2, 3]), 

    new Triangle([4, 5, 6]), 
    new Triangle([4, 6, 7]), 

    new Triangle([8, 9, 10]), 
    new Triangle([8, 10, 11]), 

    new Triangle([12, 13, 14]), 
    new Triangle([12, 14, 15]), 

    new Triangle([16, 17, 18]), 
    new Triangle([16, 18, 19]), 

    new Triangle([20, 21, 22]), 
    new Triangle([20, 22, 23]), 
];

export default class Model{
    constructor(_name, _vertices, _triangles, _transform, _center, _radius, _texture){
        this.name = _name;
        this.vertices = _vertices;
        this.triangles = _triangles;
        this.transform = new Transform(
            _transform.position, 
            new Vector3(
                _transform.rotation.x * Math.PI / 180, 
                _transform.rotation.y * Math.PI / 180, 
                _transform.rotation.z * Math.PI / 180
                ), 
            _transform.scale
            );
        this.center = _center;
        this.radius = _radius;
        this.texture = _texture;
    }

    static CreateCube(_name, _transform, _center, _radius, _texture){
        return new Model(_name, vertices, triangles, _transform, _center, _radius, _texture);
    }
    // static CreateSphere(divs, color, _name, _transform, _center, _radius){
    //     var vertexes = [];
    //     var triangleses = [];
    
    //     var delta_angle = 2.0*Math.PI / divs;
    
    //     // Generate vertexes and normals.
    //     for (var d = 0; d < divs + 1; d++) {
    //         var y = (2.0 / divs) * (d - divs / 2.0);
    //         var radius = Math.sqrt(1.0 - y*y);
    //         for (var i = 0; i < divs; i++) {
    //             var vertex = new Vector3(
    //                     radius*Math.cos(i*delta_angle), 
    //                     y, 
    //                     radius*Math.sin(i*delta_angle)
    //                 );
    //             vertexes.push(vertex);
    //         }
    //     }
    
    //     // Generate triangles.
    //     for (var d = 0; d < divs; d++) {
    //         for (var i = 0; i < divs - 1; i++) {
    //             var i0 = d*divs + i;
    //             var offset = 1;
    //             // i == divs - 1 ? -i : 1;
    //             triangleses.push(new Triangle([i0, i0+divs+offset, i0+offset], color, [vertexes[i0], vertexes[i0+divs+offset], vertexes[i0+offset]]));
    //             triangleses.push(new Triangle([i0, i0+divs, i0+divs+offset], color, [vertexes[i0], vertexes[i0+divs], vertexes[i0+divs+offset]]));
    //         }
    //     }
    
    //     return new Model(_name, vertexes, triangleses, _transform, _center, _radius);
    // }

    GetMatrix(){
        let x = this.transform.rotation.z;
        let y = this.transform.rotation.y;
        let z = this.transform.rotation.x;
        let temp = new Matrix4x4(
            Math.cos(x)*Math.cos(y) * this.transform.scale.x, Math.cos(x)*Math.sin(y)*Math.sin(z)+Math.sin(x)*Math.cos(z), -Math.cos(x)*Math.sin(y)*Math.cos(z)+Math.sin(x)*Math.sin(z), this.transform.position.x, 
            -Math.sin(x)*Math.cos(y), -Math.sin(x)*Math.sin(y)*Math.sin(z)+Math.cos(x)*Math.cos(z) * this.transform.scale.y, Math.sin(x)*Math.sin(y)*Math.cos(z)+Math.cos(x)*Math.sin(z), this.transform.position.y, 
            Math.sin(y), -Math.cos(y)*Math.sin(z), Math.cos(y)*Math.cos(z) * this.transform.scale.z, this.transform.position.z, 
            0, 0, 0, 1
        )

        return temp;
    }

    GetRotateMatrix(){
        let x = this.transform.rotation.x;
        let y = this.transform.rotation.y;
        let z = this.transform.rotation.z;
        let rotateMat4 = new Matrix4x4(
            Math.cos(x)*Math.cos(y), Math.cos(x)*Math.sin(y)*Math.sin(z)+Math.sin(x)*Math.cos(z), -Math.cos(x)*Math.sin(y)*Math.cos(z)+Math.sin(x)*Math.sin(z), 0, 
            -Math.sin(x)*Math.cos(y), -Math.sin(x)*Math.sin(y)*Math.sin(z)+Math.cos(x)*Math.cos(z), Math.sin(x)*Math.sin(y)*Math.cos(z)+Math.cos(x)*Math.sin(z), 0, 
            Math.sin(y), -Math.cos(y)*Math.sin(z), Math.cos(y)*Math.cos(z), 0, 
            0, 0, 0, 1
        )

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
            Math.cos(this.transform.rotation.y), 0, Math.sin(this.transform.rotation.y), 
            0, 1, 0, 
            -Math.sin(this.transform.rotation.y), 0, Math.cos(this.transform.rotation.y)
        )
    }
    RotateZMatrix(){
        return new Matrix3x3(
            Math.cos(this.transform.rotation.z), Math.sin(this.transform.rotation.z), 0, 
            -Math.sin(this.transform.rotation.z), Math.cos(this.transform.rotation.z), 0, 
            0, 0, 1
        )
    }
}