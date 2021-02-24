import Vector2 from "./Vector2.js";
import Color from "./Color.js";
import Vector3 from "./Vector3.js";
import Triangle from "./Triangle.js";
import Model from "./Model.js";
import Transform from "./Transform.js";
import Camera from "./Camera.js";

var canvas = document.getElementById("RayTrace");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "red";
ctx.fillRect(0, 0, canvas.width, canvas.height);
var id = ctx.getImageData(0, 0, WIDTH, HEIGHT);
var pixels = id.data;

var depthBuffer;

const d = 1;
const V_WIDTH = 2;
const V_HEIGHT = 2;

var camera = new Camera(
    new Transform(new Vector3(0, 0, 0), new Vector3(0, 0, 0), 1)
    , d, 45);

/**
 * vertices
 */
var vAf = new Vector3(-2, -0.5, 5);
var vBf = new Vector3(-2, 0.5, 5);
var vCf = new Vector3(-1, 0.5, 5);
var vDf = new Vector3(-1, -0.5, 5);
var vAb = new Vector3(-2, -0.5, 6);
var vBb = new Vector3(-2, 0.5, 6);
var vCb = new Vector3(-1, 0.5, 6);
var vDb = new Vector3(-1, -0.5, 6);

/**
 * vertices
 * triangle (indices, color)
 * model (name, vertices, triangles, local position)
 */
var vertices = [];
var triangles = [];
var translatePos = new Vector3(0, 0, 6);
var models = [];

var RED = new Color(255, 0, 0, 255);
var GREEN = new Color(0, 255, 0, 255);
var BLUE = new Color(0, 0, 255, 255);
var YELLOW = new Color(255, 255, 0, 255);
var PURPLE = new Color(255, 0, 255, 255);
var CYAN = new Color(0, 255, 255, 255);

if(canvas.getContext){
    // Main2D();

    // Main3D();

    Render3DObjects();

    ctx.putImageData(id, 0, 0);
}

function Main2D(){
    let color = new Color(255, 255, 255, 255);
    DrawLine(new Vector2(100, 100), new Vector2(500, 500), color);
    DrawLine(new Vector2(100, 100), new Vector2(200, 500), color);
    DrawLine(new Vector2(500, 100), new Vector2(200, 500), color);
    DrawLine(new Vector2(500, 100), new Vector2(500, 500), color);
    DrawLine(new Vector2(100, 500), new Vector2(500, 500), color);
    DrawLine(new Vector2(500, 100), new Vector2(100, 100), color);
    DrawLine(new Vector2(100, 500), new Vector2(100, 100), color);

    DrawFillTriangle(new Vector2(100, 100), 
    new Vector2(100, 500), 
    new Vector2(500, 550), 
    new Color(0, 255, 0, 255));
    DrawWireframeTriangle(new Vector2(100, 100), 
    new Vector2(100, 500), 
    new Vector2(500, 550), 
    new Color(0, 0, 0, 255));
}

function Main3D(){
    let frontColor = new Color(0, 0, 255, 255);
    DrawLine(ProjectVertex(vAf), ProjectVertex(vBf), frontColor);
    DrawLine(ProjectVertex(vBf), ProjectVertex(vCf), frontColor);
    DrawLine(ProjectVertex(vCf), ProjectVertex(vDf), frontColor);
    DrawLine(ProjectVertex(vDf), ProjectVertex(vAf), frontColor);

    let backColor = new Color(255, 0, 0, 255);
    DrawLine(ProjectVertex(vAb), ProjectVertex(vBb), backColor);
    DrawLine(ProjectVertex(vBb), ProjectVertex(vCb), backColor);
    DrawLine(ProjectVertex(vCb), ProjectVertex(vDb), backColor);
    DrawLine(ProjectVertex(vDb), ProjectVertex(vAb), backColor);

    let frontToBackColor = new Color(0, 255, 0, 255);
    DrawLine(ProjectVertex(vAf), ProjectVertex(vAb), frontToBackColor);
    DrawLine(ProjectVertex(vBf), ProjectVertex(vBb), frontToBackColor);
    DrawLine(ProjectVertex(vCf), ProjectVertex(vCb), frontToBackColor);
    DrawLine(ProjectVertex(vDf), ProjectVertex(vDb), frontToBackColor);
}

function Render3DObjects(){
    MakeVertices();
    MakeTriangles();

    MakeDepthBuffer();

    // let projected = [];
    // for(let i = 0; i < vertices.length; ++i){
    //     projected.push(ProjectVertex(vertices[i].Add(translatePos)));
    // }

    // for(let i = 0; i < triangles.length; ++i){
    //     RenderTriangle(triangles[i], projected);
    // }

    MakeModels();
    RenderModel();
}

//#region 2D
function BasicInterpolate(i0, d0, i1, d1){
    if(i0 == i1){
        return [d0];
    }

    let values = [];
    const a = ((d1 - d0) / (i1 - i0));
    let d = d0;

    for(let i = i0; i < i1; ++i){
        values.push(Math.floor(d));
        d += a;
    }

    return values;
}
function Interpolate(i0, d0, i1, d1){
    // if(i0 == i1){
    //     return [d0];
    // }

    let values = [];
    // const a = ((d1 - d0) / (i1 - i0));
    // let d = d0;

    // for(let i = i0; i < i1; ++i){
    //     values.push(Math.floor(d));
    //     d += a;
    // }

    let dx = i1 - i0;
    let dy = d1 - d0;
    
    let stepX = 1, stepY = 1;
    
    if(dx < 0){
        stepX = -1;
    }
    if(dy < 0){
        stepY = -1;
    }
    console.log("y delta:", dx, "x delta:", dy)

    // down to 1
    if(dx > dy){
        let increase = 2 * dy;
        let friction;
        if(dy < 0){
            friction = increase - dx;
        }
        else{
            friction = increase + dx;
        }
        console.log("up", increase, friction)
    
        for(let i = i0, j = d0; i <= i1; i += stepX){
            friction += increase;
    
            if(friction <= 0){
                j += stepY;
                friction -= 2 * dx;
    
            }
            values.push(j);
        }
    }
    // up to 1
    else{
        let increase = 2 * dx;
        let friction;
        if(dx < 0){
            friction = increase - dy;
        }
        else{
            friction = increase + dy;
        }
        console.log("down", increase, friction)

        for(let i = d0, j = i0; i <= d1; i += stepY){
            friction += increase;

            if(friction >= 0){
                ++j
                friction -= 2 * dy;
                
            }
            values.push(i);
        }
    }
    // console.log(values);

    return values;
}
function InterpolateFloat(i0, d0, i1, d1){
    if(i0 == i1){
        return [d0];
    }

    let values = [];
    const a = (d1 - d0) / (i1 - i0);
    let d = d0;

    for(let i = i0; i < i1; ++i){
        values.push(d);
        d += a;
    }

    return values;
}

function PutPixel(x, y, color){
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
        return;
    }

    let off = (y * WIDTH + x) * 4;
    pixels[off      ] = color.r;
    pixels[off + 1  ] = color.g;
    pixels[off + 2  ] = color.b;
    pixels[off + 3  ] = color.a;
}

function DrawLine(P0, P1, color) {
    let dx = Math.abs(P1.x - P0.x);
    let dy = Math.abs(P1.y - P0.y);

    P0.x = Math.round(P0.x);
    P0.y = Math.round(P0.y);
    P1.x = Math.round(P1.x);
    P1.y = Math.round(P1.y);

    if(dx > dy){
        if(P0.x > P1.x){
            // Vector2.Swap(P0, P1);
            let temp = new Vector2(P0.x, P0.y);
            P0 = P1;
            P1 = temp;
        }

        let ys = BasicInterpolate(P0.x, P0.y, P1.x, P1.y);

        for(let i = P0.x; i < P1.x; ++i){
            PutPixel(i, ys[i - P0.x], color);
        }
    }
    else{
        if(P0.y > P1.y){
            // Vector2.Swap(P0, P1);
            let temp = new Vector2(P0.x, P0.y);
            P0 = P1;
            P1 = temp;
        }

        let xs = BasicInterpolate(P0.y, P0.x, P1.y, P1.x);

        for(let i = P0.y; i < P1.y; ++i){
            PutPixel(xs[i - P0.y], i, color);
        }
    }
}

function DrawWireframeTriangle(P0, P1, P2, color){
    DrawLine(P0, P1, color);
    DrawLine(P1, P2, color);
    DrawLine(P2, P0, color);
}

function DrawFillTriangle(P0, P1, P2, color){
    console.log(P0, P1, P2)
    if(P1.y < P0.y) { let temp=P0; P0=P1; P1=temp; }
    if(P2.y < P0.y) { let temp=P0; P0=P2; P2=temp; }
    if(P2.y < P1.y) { let temp=P1; P1=P2; P2=temp; }

    if(P1.x > P0.x) { let temp=P0; P0=P1; P1=temp; }
    // if(P2.x > P0.x) { let temp=P0; P0=P2; P2=temp; }
    // if(P2.x > P1.x) { let temp=P1; P1=P2; P2=temp; }

    console.log(P0, P1, P2)

    let x01 = Interpolate(P0.y, P0.x, P1.y, P1.x);  // 0 to 1
    let x12 = Interpolate(P1.y, P1.x, P2.y, P2.x);  // 1 to 2
    let x02 = Interpolate(P0.y, P0.x, P2.y, P2.x);  // 0 to 2

    let h01 = InterpolateFloat(P0.y, P0.x, P1.y, P1.x);
    let h12 = InterpolateFloat(P1.y, P1.x, P2.y, P2.x);
    let h02 = InterpolateFloat(P0.y, P0.x, P2.y, P2.x);

    let z01 = InterpolateFloat(P0.y, P0.z, P1.y, P1.z);  // 0 to 1
    let z12 = InterpolateFloat(P1.y, P1.z, P2.y, P2.z);  // 1 to 2
    let z02 = InterpolateFloat(P0.y, P0.z, P2.y, P2.z);  // 0 to 2

    x01.splice(x01.length - 1, 1);
    let x012 = x01.concat(x12);

    h01.splice(h01.length - 1, 1);
    let h012 = h01.concat(h12);

    z01.splice(z01.length - 1, 1);
    let z012 = z01.concat(z12);

    let m = Math.floor(x02.length / 2);
    let x_left = 0, x_right = 0;
    let h_left = 0, h_right = 0;
    let z_left = 0, z_right = 0;
    if(x02[m] < x012[m]){
        x_left = x02;
        x_right = x012;

        h_left = h02;
        h_right = h012;

        z_left = z02;
        z_right = z012;
    }
    else{
        x_left = x012;
        x_right = x02;

        h_left = h012;
        h_right = h02;

        z_left = z012;
        z_right = z02;
    }

    for(let y = P0.y; y < P2.y; ++y){
        let x_l = x_left[y - P0.y];
        let x_r = x_right[y - P0.y];
        
        let h_segment = InterpolateFloat(x_l, h_left[y - P0.y], x_r, h_right[y - P0.y]);
        let z_segment = InterpolateFloat(x_l, z_left[y - P0.y], x_r, z_right[y - P0.y]);
        
        for(let x = x_l; x < x_r; ++x){
            let mul = h_segment[x - x_l];
            let depth = z_segment[x - x_l];
            if(depth < depthBuffer[x + y * WIDTH]){
                let shaded_color = new Color(
                    color.r * mul, 
                    color.g * mul, 
                    color.b * mul, 
                    255
                )
                PutPixel(x, y, shaded_color);

                depthBuffer[x + y * WIDTH] = depth;
            }
        }
    }
}
//#endregion

//#region 3D
function ViewportToCanvas(x, y, z){
    return new Vector3(
        Math.floor(x * WIDTH / V_WIDTH) + WIDTH / 2, 
        Math.floor(y * HEIGHT / V_HEIGHT) + HEIGHT / 2, 
        (z));
}
function ProjectVertex(v){
    return ViewportToCanvas(v.x * d / v.z, v.y * d / v.z, v.z);
}
//#endregion

//#region Models
function MakeVertices(){
    vertices.push(new Vector3(1, 1, 1));
    vertices.push(new Vector3(-1, 1, 1));
    vertices.push(new Vector3(-1, -1, 1));
    vertices.push(new Vector3(1, -1, 1));
    vertices.push(new Vector3(1, 1, -1));
    vertices.push(new Vector3(-1, 1, -1));
    vertices.push(new Vector3(-1, -1, -1));
    vertices.push(new Vector3(1, -1, -1));
}
function GenerateSphere(divs, color) {
    var vertexes = [];
    var triangleses = [];
  
    var delta_angle = 2.0*Math.PI / divs;
  
    // Generate vertexes and normals.
    for (var d = 0; d < divs + 1; d++) {
      var y = (2.0 / divs) * (d - divs/2);
      var radius = Math.sqrt(1.0 - y*y);
      for (var i = 0; i < divs; i++) {
        var vertex = new Vector3(
            radius*Math.cos(i*delta_angle), 
            y, 
            radius*Math.sin(i*delta_angle));
        vertexes.push(vertex);
      }
    }
  
    // Generate triangles.
    for (var d = 0; d < divs; d++) {
      for (var i = 0; i < divs - 1; i++) {
        var i0 = d*divs + i;
        triangleses.push(new Triangle([i0, i0+divs+1, i0+1], color, [vertexes[i0], vertexes[i0+divs+1], vertexes[i0+1]]));
        triangleses.push(new Triangle([i0, i0+divs, i0+divs+1], color, [vertexes[i0], vertexes[i0+divs], vertexes[i0+divs+1]]));
      }
    }
  
    return new Model("Sphere", vertexes, triangleses, 
    new Transform(new Vector3(0, 0, 3), new Vector3(0, 0, 0), 1), 
    new Vector3(0, 0, 0), 1);
  }
function MakeTriangles(){
    triangles.push(new Triangle([0, 1, 2], Color.Red()));
    triangles.push(new Triangle([0, 2, 3], Color.Red()));
    triangles.push(new Triangle([4, 0, 3], Color.Green()));
    triangles.push(new Triangle([4, 3, 7], Color.Green()));
    triangles.push(new Triangle([5, 4, 7], Color.Blue()));
    triangles.push(new Triangle([5, 7, 6], Color.Blue()));
    triangles.push(new Triangle([1, 5, 6], Color.Yellow()));
    triangles.push(new Triangle([1, 6, 2], Color.Yellow()));
    triangles.push(new Triangle([4, 5, 1], Color.Purple()));
    triangles.push(new Triangle([4, 1, 0], Color.Purple()));
    triangles.push(new Triangle([2, 6, 7], Color.Cyan()));
    triangles.push(new Triangle([2, 7, 3], Color.Cyan()));
    // triangles.push(new Triangle([0, 1, 2], Color.White()));
    // triangles.push(new Triangle([0, 2, 3], Color.White()));
    // triangles.push(new Triangle([4, 0, 3], Color.White()));
    // triangles.push(new Triangle([4, 3, 7], Color.White()));
    // triangles.push(new Triangle([5, 4, 7], Color.White()));
    // triangles.push(new Triangle([5, 7, 6], Color.White()));
    // triangles.push(new Triangle([1, 5, 6], Color.White()));
    // triangles.push(new Triangle([1, 6, 2], Color.White()));
    // triangles.push(new Triangle([4, 5, 1], Color.White()));
    // triangles.push(new Triangle([4, 1, 0], Color.White()));
    // triangles.push(new Triangle([2, 6, 7], Color.White()));
    // triangles.push(new Triangle([2, 7, 3], Color.White()));
}
function MakeDepthBuffer(){
    depthBuffer = new Array();
    depthBuffer.length = WIDTH * HEIGHT;

    for(let i = 0; i < depthBuffer.length; ++i){
        depthBuffer[i] = Infinity;
    }
}
function RenderTriangle(triangle, projected){
    // if(is){
    //     console.log(
    //         projected[triangle.index[0]], 
    //         projected[triangle.index[1]], 
    //         projected[triangle.index[2]]
    //     );
    // }
    DrawFillTriangle(
        projected[triangle.index[0]], 
        projected[triangle.index[1]], 
        projected[triangle.index[2]], 
        triangle.color
    );

    DrawWireframeTriangle(
        projected[triangle.index[0]], 
        projected[triangle.index[1]], 
        projected[triangle.index[2]], 
        new Color(255, 255, 255, 255)
    );
}
function MakeModels(){
    models.push(new Model(
        "cube1", vertices, triangles, 
        new Transform(
            new Vector3(-2.8, -2.8, 5), new Vector3(0, 0, 0), 1
        ), 
        new Vector3(0, 0, 0), Math.sqrt(3)
    ));

    // models.push(new Model(
    //     "cube2", vertices, triangles, 
    //     new Transform(
    //         new Vector3(4, 4, 10), new Vector3(0, 0, 0), 2
    //     ), 
    //     new Vector3(0, 0, 0), Math.sqrt(3)
    // ));

    models.push(GenerateSphere(12, GREEN));

    // models.push(new Model("Plane", 
    // [
    //     new Vector3(-1, -1, 0), new Vector3(1, -1, 0), 
    //     new Vector3(-1, 1, 0), new Vector3(1, 1, 0)
    // ], 
    // [
    //     new Triangle([0, 2, 1], new Color(0, 0, 255, 255), []), 
    //     new Triangle([1, 2, 3], new Color(0, 255, 0, 255), [])
    // ], 
    // new Transform(new Vector3(0, 0, 5), new Vector3(0, 0, 0), 1), 
    // new Vector3(0, 0, 0), 1));
}

function RenderModel(){
    var c_Matrix = camera.GetMatrix();

    for(let i = 0; i < models.length; ++i){
        let projected = [];
        let m_Matrix = models[i].GetWroldMatrix();
        let matrix = c_Matrix.Multiply4x4(m_Matrix);
        let center = matrix.MultiplyVector3(models[i].center);
        let model = Clip(camera.clipPlanes, center, models[i]);
        if(model == null){
            continue;
        }

        let triangles = CullBackFace(model, camera, matrix);
        // model.triangles = triangles;
        
        for(let j = 0; j < model.vertices.length; ++j){
            projected.push(
                ProjectVertex(matrix.MultiplyVector3(model.vertices[j]))
            );
        }
        
        for(let j = 0; j < model.triangles.length; ++j){
            RenderTriangle(model.triangles[j], projected);
        }
    }
}

function CullBackFace(model, camera, matrix){
    let triangles = [];
    for(let i = 0; i < model.triangles.length; ++i){
        let v0 = matrix.MultiplyVector3(model.vertices[model.triangles[i].index[0]]);
        let v1 = matrix.MultiplyVector3(model.vertices[model.triangles[i].index[1]]);
        let v2 = matrix.MultiplyVector3(model.vertices[model.triangles[i].index[2]]);
        let d01 = v1.Minus(v0);
        let d12 = v2.Minus(v1);
        let nor = Vector3.Cross(d01, d12);
        let dtc = camera.transform.position.Minus(v0);
        let dot = Vector3.Dot(nor, dtc);
        if(dot > 0){
            // front
            triangles.push(model.triangles[i]);
        }
        else{
            // back
        }
    }

    return triangles;
}

function Clip(planes, center, model){
    for(let i = 0; i < planes.length; ++i){
        let distance = SignedDistance(planes[i], center);
        if(distance < -model.radius){
            return null;
        }
        else if(distance >= model.radius){
        }
        else{
            let clipedModel = TrianglesClip(model, planes[i]);
            return clipedModel;
        }
    }

    return model;
}

function TrianglesClip(model, plane){
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

function SignedDistance(plane, vertex){
    return Vector3.Dot(vertex, plane.normal) + plane.distance;
}