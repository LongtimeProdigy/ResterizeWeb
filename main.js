import Vector2 from "./Vector2.js";
import Color from "./Color.js";
import Vector3 from "./Vector3.js";
import Triangle from "./Triangle.js";
import Model from "./Model.js";
import Transform from "./Transform.js";
import Camera from "./Camera.js";

// 1 == Flat, 2 == Gouraud, 3 == Phong
var LightingMode = 1;

var canvas = document.getElementById("RayTrace");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

var ctx = canvas.getContext("2d");
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
var id = ctx.getImageData(0, 0, WIDTH, HEIGHT);
var pixels = id.data;

function ViewportToCanvas(x, y, z){
    return new Vector3(
        Math.round(x * WIDTH / Viewport.width) + WIDTH / 2, 
        Math.round(y * HEIGHT / Viewport.height) + HEIGHT / 2, 
        (z));
}
function ProjectVertex(v){
    return ViewportToCanvas(v.x * camera.d / v.z, v.y * camera.d / v.z, v.z);
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

var depthBuffer;

var camera = new Camera(
    new Transform(new Vector3(0, 0, 0), new Vector3(0, 0, 0), 1), 
    1, 90);

const Viewport = camera.GetViewport();

var models = [];

if(canvas.getContext){
    Render3DObjects();

    ctx.putImageData(id, 0, 0);
}

function Render3DObjects(){
    depthBuffer = new Array();
    depthBuffer.length = WIDTH * HEIGHT;
    for(let i = 0; i < depthBuffer.length; ++i){
        depthBuffer[i] = Infinity;
    }

    models.push(
        Model.CreateCube(
            "cube1", 
            new Transform(new Vector3(-2.8, -2.8, 5), new Vector3(0, 0, 0), 1), 
            new Vector3(0, 0, 0), 
            Math.sqrt(3))
            );
    models.push(
        Model.CreateCube(
            "cube1", 
            new Transform(new Vector3(5.8, 5.8, 10), new Vector3(0, 0, 0), 2), 
            new Vector3(0, 0, 0), 
            Math.sqrt(3))
            );
    models.push(Model.CreateSphere(
        12, Color.Green(), 
        "Sphere1", 
        new Transform(new Vector3(0, 0, 3), new Vector3(0, 0, 0), 1), 
        new Vector3(0, 0, 0), 
        1));

    RenderModel();
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
        model.triangles = triangles;
        
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

function RenderTriangle(triangle, projected){
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

//#region Lighting
function ComputeLighting(vertex, normal, camera, lights){
    var illumination = 0;
    for(let i = 0; i < lights.length; ++i){
        let light = light[i];
        if(light.type == "Ambient"){
            illumination += light.intensity;
        }
        else{
            let vl;
            if(light.type == "Directional"){
                let cameraMatrix = 
            }
            else{

            }
        }
    }
}
//#endregion

//#region Render Mathmatics
function DrawWireframeTriangle(P0, P1, P2, color){
    DrawLine(P0, P1, color);
    DrawLine(P1, P2, color);
    DrawLine(P2, P0, color);
}

function DrawFillTriangle(P0, P1, P2, color){
    if(P1.y < P0.y) { let temp=P0; P0=P1; P1=temp; }
    if(P2.y < P0.y) { let temp=P0; P0=P2; P2=temp; }
    if(P2.y < P1.y) { let temp=P1; P1=P2; P2=temp; }

    let x01 = Interpolate(P0.y, P0.x, P1.y, P1.x);  // 0 to 1
    let x12 = Interpolate(P1.y, P1.x, P2.y, P2.x);  // 1 to 2
    let x02 = Interpolate(P0.y, P0.x, P2.y, P2.x);  // 0 to 2

    let h01 = InterpolateFloat(P0.y, P0.x, P1.y, P1.x);
    let h12 = InterpolateFloat(P1.y, P1.x, P2.y, P2.x);
    let h02 = InterpolateFloat(P0.y, P0.x, P2.y, P2.x);

    let z01 = InterpolateFloat(P0.y, P0.z, P1.y, P1.z);  // 0 to 1
    let z12 = InterpolateFloat(P1.y, P1.z, P2.y, P2.z);  // 1 to 2
    let z02 = InterpolateFloat(P0.y, P0.z, P2.y, P2.z);  // 0 to 2

    var intensity = 0, center = new Vector3(0, 0, 0);
    switch(LightingMode){
        case 1:
            center = new Vector3(
                (P0.x + P1.x + P2.x) / 3.0, 
                (P0.y + P1.y + P2.y) / 3.0, 
                (P0.z + P1.z + P2.z) / 3.0
            );
            intensity = 
        break;
        case 2:
        break;
        case 3:
        break;
    }

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
            let shaded_color = new Color(
                color.r * mul, 
                color.g * mul, 
                color.b * mul, 
                255
            );
            if(depth < depthBuffer[x + y * WIDTH]){
                
                PutPixel(x, y, shaded_color);
                
                depthBuffer[x + y * WIDTH] = depth;
            }
        }
    }
}

function Interpolate(i0, d0, i1, d1){
    let values = [];

    let di = i1 - i0;
    let dd = d1 - d0;
    let abdd = Math.abs(dd);

    let step = 1;
    if(d1 < d0){
        step = -1;
    }

    if(Math.abs(i1 - i0) > Math.abs(d1 - d0)){
        let increase = 2 * abdd;
        let friction = -di;
        
        for(let y = i0, x = d0; y != i1; ++y){
            friction += increase;

            if(friction >= 0){
                friction -= 2 * di;
                x += step;
            }

            values.push(x);
        }
    }
    else{
        let increase = 2 * di;
        let friction = -abdd;

        for(let x = d0, y = i0; x != d1; x += step){
            friction += increase;

            if(friction >= 0){
                friction -= 2 * abdd;
                ++y;

                values.push(x);
            }
        }
    }

    values.push(d1);

    return values;
}
function InterpolateFloat(i0, d0, i1, d1){
    if(i0 == i1){
        return [d0];
    }

    let values = [];
    const a = (d1 - d0) / (i1 - i0);
    let d = d0;

    for(let i = i0; i <= i1; ++i){
        values.push(d);
        d += a;
    }

    return values;
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
            let temp = new Vector2(P0.x, P0.y);
            P0 = P1;
            P1 = temp;
        }

        let ys = Interpolate(P0.x, P0.y, P1.x, P1.y);

        for(let i = P0.x; i < P1.x; ++i){
            PutPixel(i, ys[i - P0.x], color);
        }
    }
    else{
        if(P0.y > P1.y){
            let temp = new Vector2(P0.x, P0.y);
            P0 = P1;
            P1 = temp;
        }

        let xs = Interpolate(P0.y, P0.x, P1.y, P1.x);

        for(let i = P0.y; i < P1.y; ++i){
            PutPixel(xs[i - P0.y], i, color);
        }
    }
}
//#endregion

//#region Camera Clipping
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

function SignedDistance(plane, vertex){
    return Vector3.Dot(vertex, plane.normal) + plane.distance;
}
//#endregion