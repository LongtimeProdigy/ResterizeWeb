import Vector2 from "./Vector2.js";
import Color from "./Color.js";
import Vector3 from "./Vector3.js";
import Triangle from "./Triangle.js";
import Model from "./Model.js";
import Transform from "./Transform.js";
import Camera from "./Camera.js";
import AmbientLight from "./AmbientLight.js";
import PointLight from "./PointLight.js";
import DirectionalLight from "./DirectionalLight.js";
import Rect from "./Rect.js";
import Texture from "./Texture.js"
import Matrix3x3 from "./Matrix3x3.js";
import Matrix4x4 from "./Matrix4x4.js";

// 1 == Flat, 2 == Gouraud, 3 == Phong
const FLAT_LIGHTING = 1;
const GOURAUD_LIGHTING = 2;
const PHONG_LIGHTING = 3;
var LightingMode = PHONG_LIGHTING;

//#region Canvas
var canvas = document.getElementById("RayTrace");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

var ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
var id = ctx.getImageData(0, 0, WIDTH, HEIGHT);
var pixels = id.data;
function PutPixel(x, y, color){
    x = WIDTH / 2 + (x | 0);
    y = HEIGHT / 2 - (y | 0) - 1;

    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
        return;
    }

    let off = (y * WIDTH + x) * 4;
    pixels[  off] = color.r;
    pixels[++off] = color.g;
    pixels[++off] = color.b;
    pixels[++off] = color.a;
}

function ViewportToCanvas(x, y, z){
    return new Vector3(
            (x * WIDTH / Viewport.width) | 0, 
            (y * HEIGHT / Viewport.height) | 0, 
            z
        );
}
function CanvasToViewport(x, y){
    return new Vector3((x * Viewport.width / WIDTH), (y * Viewport.height / HEIGHT), 0);
}
function ProjectVertex(v){
    return ViewportToCanvas(v.x * camera.d / v.z, v.y * camera.d / v.z, v.z);
}
function UnProjectVertex(x, y, z) {
    let ux = x*z / camera.d;
    let uy = y*z / camera.d;
    let p2d = CanvasToViewport(ux, uy);
    return new Vector3(p2d.x, p2d.y, z);
}

var depthBuffer = new Array();
depthBuffer.length = WIDTH * HEIGHT;
for(let i = 0; i < depthBuffer.length; ++i){
    depthBuffer[i] = Infinity;
}
function UpdateDepthBufferIfCloser(x, y, depth) {
    x = canvas.width/2 + (x | 0);
    y = canvas.height/2 - (y | 0) - 1;
    
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT){
        return false;
    }
    
    let offset = x + canvas.width*y;
    if (depthBuffer[offset] == undefined || depth < depthBuffer[offset]) {
        depthBuffer[offset] = depth;
        return true;
    }
    
    return false;
}
//#endregion

// var camera = new Camera(
//     new Transform(new Vector3(-2, 1, 4), new Vector3(0, -30, 0), 1), 
//     1, 90);
var camera = new Camera(
    new Transform(new Vector3(0, 0, -3), new Vector3(0, 0, 0), 1), 
    1, 90);
const Viewport = camera.GetViewport();
    
var models = [
    // Model.CreateCube(
    //         "cube1", 
    //         new Transform(new Vector3(-1.5, 0, 7), new Vector3(0, 0, 0), new Vector3(0.75, 0.75, 0.75)), 
    //         new Vector3(0, 0, 0), 
    //         Math.sqrt(3)
    //     ), 
    // Model.CreateCube(
    //         "cube2", 
    //         new Transform(new Vector3(1.25, 2.5, 7.5), new Vector3(0, 195 * Math.PI / 180, 0), new Vector3(1, 1, 1)), 
    //         new Vector3(0, 0, 0), 
    //         Math.sqrt(3)
    //     ), 
    // Model.CreateSphere(
    //     15, Color.Green(), 
    //     "Sphere1", 
    //     new Transform(new Vector3(1.75, -0.5, 7), new Vector3(0, 0, 0), new Vector3(1.5, 1.5, 1.5)), 
    //     new Vector3(0, 0, 0), 
    //     1
    // ), 

    Model.CreateCube(
        "cube1", 
        new Transform(new Vector3(0, 0, 0), new Vector3(0, 0 * Math.PI / 180, 0), new Vector3(1, 1, 1)), 
        new Vector3(0, 0, 0), 
        Math.sqrt(3)
    ), 
    // Model.CreateCube(
    //     "cube2", 
    //     new Transform(new Vector3(1, 1, 0), new Vector3(0, 0 * Math.PI / 180, 0), new Vector3(1, 1, 1)), 
    //     new Vector3(0, 0, 0), 
    //     Math.sqrt(3)
    // ), 
    // Model.CreateSphere(
    //     16, Color.Green(), 
    //     "Sphere1", 
    //     new Transform(new Vector3(3, 0, 10), new Vector3(0, 0, 0), new Vector3(1.5, 1.5, 1.5)), 
    //     new Vector3(0, 0, 0), 
    //     1
    // ), 
];

var lights = [
    new AmbientLight(0.2), 
    new PointLight(0.6, new Vector3(0, 0, 5), 1), 
    new DirectionalLight(0.2, new Vector3(0, 1, -1).Normalized()), 
]

var wood_texture;

if(canvas.getContext){
    Start();
}

async function Start(){
    await LoadAssets();

    AssignMouseEvent();

    UpdateCanvas();
}

function RotateXMatrix(degree){
    return new Matrix3x3(
        1, 0, 0, 
        0, Math.cos(degree), -Math.sin(degree), 
        0, Math.sin(degree), Math.cos(degree)
    )
}
function RotateYMatrix(degree){
    return new Matrix3x3(
        Math.cos(degree), 0, -Math.sin(degree), 
        0, 1, 0, 
        Math.sin(degree), 0, Math.cos(degree)
    )
}

function lookAt(from, to, tmp = new Vector3(0, 1, 0)) 
{ 
    let forward = Vector3.Minus(from, to).Normalized();
    // normalize(from - to); 
    let right = Vector3.Cross(tmp, forward);
    // crossProduct(normalize(tmp), forward); 
    let up = Vector3.Cross(forward, right);
    // crossProduct(forward, right); 
 
    let camToWorld = new Matrix4x4(
        right.x, right.y, right.z, 
        up.x, up.y, up.z, 
        forward.x, forward.y, forward.z, 
        from.x, from.y, from.z
    ); 
 
    return camToWorld; 
} 

var mousedown = false;
function AssignMouseEvent(){
    canvas.addEventListener("mousedown", e =>{
        mousedown = true;
    });

    canvas.addEventListener("mousemove", e =>{
        if(mousedown){
            let disVector = camera.transform.position;
            let disX = RotateYMatrix(e.movementX * Math.PI / 180).MultiplyVector3(disVector);

            let rotateMat = lookAt(disVector, new Vector3(0, 0, 0));

            camera.transform.position = disX;
            camera.transform.rotation = rotateMat.MultiplyVector3(camera.transform.rotation);

            UpdateCanvas();
        }
    });

    canvas.addEventListener("mouseup", e =>{
        mousedown =false;
    });
}

async function LoadAssets(){
    wood_texture = new Texture();
    await wood_texture.LoadTexture("crate-texture.jpg");
}

async function UpdateCanvas(){
    // 픽셀 정리
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // 컨텍스트 리셋
    ctx.beginPath();

    id = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    pixels = id.data;

    RenderModel();

    ctx.putImageData(id, 0, 0);
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

        let triangles = CullBackFace(model, matrix);
        model.triangles = triangles;
        
        for(let j = 0; j < model.vertices.length; ++j){
            projected.push(
                ProjectVertex(matrix.MultiplyVector3(model.vertices[j]))
            );
        }
        for(let j = 0; j < model.triangles.length; ++j){
            let vertices = [
                matrix.MultiplyVector3(model.vertices[model.triangles[j].index[0]]), 
                matrix.MultiplyVector3(model.vertices[model.triangles[j].index[1]]), 
                matrix.MultiplyVector3(model.vertices[model.triangles[j].index[2]])
            ];
            let normals = [
                matrix.MultiplyVector3(model.triangles[j].normal[0]), 
                matrix.MultiplyVector3(model.triangles[j].normal[1]), 
                matrix.MultiplyVector3(model.triangles[j].normal[2])
            ]
            RenderTriangle(model.triangles[j], projected, vertices, normals);
        }
    }
}

function RenderTriangle(triangle, projected, vertices, normals){
    DrawFillTriangle(
        [projected[triangle.index[0]], projected[triangle.index[1]], projected[triangle.index[2]]], 
        triangle.color, vertices, normals, triangle.uv
    );

    // DrawWireframeTriangle(
    //     projected[triangle.index[0]], 
    //     projected[triangle.index[1]], 
    //     projected[triangle.index[2]], 
    //     Color.Black()
    // );
}

//#region Lighting
function ComputeLighting(vertex, normal){
    var illumination = 0;
    for(let i = 0; i < lights.length; ++i){
        let light = lights[i];
        if(light.type == "ambient"){
            illumination += light.intensity;
        }
        else{
            let vl;
            if(light.type == "direction"){
                let cameraMatrix = camera.GetRotateMatrix();
                vl = cameraMatrix.MultiplyVector3(Vector3.MultiplyScalar(light.direction, -1));
            }
            else if(light.type == "point"){
                let cameraWholeMatrix = camera.GetMatrix();
                vl = (Vector3.Minus(cameraWholeMatrix.MultiplyVector3(light.position), vertex).Normalized());
            }

            // Diffuse
            let dot = Vector3.Dot(vl, normal.Normalized());
            if(dot > 0){
                illumination += dot * light.intensity;
            }

            // Specular
            let reflected = Reflect(vl, normal).Normalized();
            let rdotv = Vector3.Dot(reflected, Vector3.Minus(new Vector3(0, 0, 0), vertex).Normalized());
            if(rdotv > 0){
                let specular = 50;
                illumination += Math.pow(rdotv, specular) * light.intensity;
            }
            // console.log(vl, normal)
        }
    }

    return illumination;
}

function Reflect(direction, normal) {
    return Vector3.Minus(
                Vector3.MultiplyScalar(normal, 2 * Vector3.Dot(normal, direction)), 
                direction
            );
}
//#endregion

//#region Draw
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

function DrawWireframeTriangle(P0, P1, P2, color){
    DrawLine(P0, P1, color);
    DrawLine(P1, P2, color);
    DrawLine(P2, P0, color);
}

function DrawFillTriangle(pvertices, color, vertices, normals, uvs){
    let index = [0, 1, 2];
    if(pvertices[index[1]].y < pvertices[index[1]].y) { let temp2 = index[0]; index[0] = index[1]; index[1] = temp2; }
    if(pvertices[index[2]].y < pvertices[index[0]].y) { let temp2 = index[0]; index[0] = index[2]; index[2] = temp2; }
    if(pvertices[index[2]].y < pvertices[index[1]].y) { let temp2 = index[1]; index[1] = index[2]; index[2] = temp2; }

    let x01 = BasicInterfolate(pvertices[index[0]].y, pvertices[index[0]].x, pvertices[index[1]].y, pvertices[index[1]].x);  // 0 to 1
    let x12 = BasicInterfolate(pvertices[index[1]].y, pvertices[index[1]].x, pvertices[index[2]].y, pvertices[index[2]].x);  // 1 to 2
    let x02 = BasicInterfolate(pvertices[index[0]].y, pvertices[index[0]].x, pvertices[index[2]].y, pvertices[index[2]].x);  // 0 to 2

    // let h01 = InterpolateFloat(P0.y, P0.x, P1.y, P1.x);
    // let h12 = InterpolateFloat(P1.y, P1.x, P2.y, P2.x);
    // let h02 = InterpolateFloat(P0.y, P0.x, P2.y, P2.x);

    let z01 = InterpolateFloat(pvertices[index[0]].y, pvertices[index[0]].z, pvertices[index[1]].y, pvertices[index[1]].z);  // 0 to 1
    let z12 = InterpolateFloat(pvertices[index[1]].y, pvertices[index[1]].z, pvertices[index[2]].y, pvertices[index[2]].z);  // 1 to 2
    let z02 = InterpolateFloat(pvertices[index[0]].y, pvertices[index[0]].z, pvertices[index[2]].y, pvertices[index[2]].z);  // 0 to 2

    // for uv
    let u02, u012, v02, v012;
    [u02, u012] = InterpolateTriangle(
                P0.y, uvs[index[0]].x / vertices[index[0]].z,
                P1.y, uvs[index[1]].x / vertices[index[1]].z,
                P2.y, uvs[index[2]].x / vertices[index[2]].z
            );
    [v02, v012] = InterpolateTriangle(
                P0.y, uvs[index[0]].y / vertices[index[0]].z,
                P1.y, uvs[index[1]].y / vertices[index[1]].z,
                P2.y, uvs[index[2]].y / vertices[index[2]].z
            );
    
    let iz02, iz012;
    [iz02, iz012] = InterpolateTriangle(
        P0.y, 1 / vertices[index[0]].z, 
        P1.y, 1 / vertices[index[1]].z, 
        P2.y, 1 / vertices[index[2]].z
    );

    // for lighting
    let normal0 = (normals[index[0]]);
    let normal1 = (normals[index[1]]);
    let normal2 = (normals[index[2]]);

    // let [x02, x012] = EdgeInterpolate(p0.y, p0.x, p1.y, p1.x, p2.y, p2.x);
    // let [iz02, iz012] = EdgeInterpolate(p0.y, 1.0/v0.z, p1.y, 1.0/v1.z, p2.y, 1.0/v2.z);

    let intensity = 0, center = new Vector3(0, 0, 0);
    let i02 = [], i012 = [];
    let nx02, nx012, ny02, ny012, nz02, nz012;
    switch(LightingMode){
        case FLAT_LIGHTING:
            center = new Vector3(
                (vertices[index[0]].x + vertices[index[1]].x + vertices[index[2]].x) / 3.0, 
                (vertices[index[0]].y + vertices[index[1]].y + vertices[index[2]].y) / 3.0, 
                (vertices[index[0]].z + vertices[index[1]].z + vertices[index[2]].z) / 3.0, 
            );
            intensity = ComputeLighting(center, normal0);
        break;
        case GOURAUD_LIGHTING:
            let i0 = ComputeLighting(vertices[index[0]], normal0);
            let i1 = ComputeLighting(vertices[index[1]], normal1);
            let i2 = ComputeLighting(vertices[index[2]], normal2);
            [i02, i012] = InterpolateTriangle(P0.y, i0, P1.y, i1, P2.y, i2);
        break;
        case PHONG_LIGHTING:
            [nx02, nx012] = InterpolateTriangle(P0.y, normal0.x, P1.y, normal1.x, P2.y, normal2.x);
            [ny02, ny012] = InterpolateTriangle(P0.y, normal0.y, P1.y, normal1.y, P2.y, normal2.y);
            [nz02, nz012] = InterpolateTriangle(P0.y, normal0.z, P1.y, normal1.z, P2.y, normal2.z);
        break;
    }

    x01.splice(x01.length - 1, 1);
    let x012 = x01.concat(x12);

    // h01.splice(h01.length - 1, 1);
    // let h012 = h01.concat(h12);

    z01.splice(z01.length - 1, 1);
    let z012 = z01.concat(z12);

    let m = Math.floor(x02.length / 2);
    let x_left, x_right;
    // let h_left, h_right;
    let z_left, z_right;
    let i_left, i_right;
    let nx_left, nx_right, ny_left, ny_right, nz_left, nz_right;
    let u_left, u_right, v_left, v_right;
    let iz_left, iz_right;
    if(x02[m] < x012[m]){
        [x_left, x_right] = [x02, x012];
        // [h_left, h_right] = [h02, h012];
        [z_left, z_right] = [z02, z012];
        [i_left, i_right] = [i02, i012];

        [nx_left, nx_right] = [nx02, nx012];
        [ny_left, ny_right] = [ny02, ny012];
        [nz_left, nz_right] = [nz02, nz012];

        [u_left, u_right] = [u02, u012];
        [v_left, v_right] = [v02, v012];

        [iz_left, iz_right] = [iz02, iz012];
    }
    else{
        [x_left, x_right] = [x012, x02];
        // [h_left, h_right] = [h012, h02];
        [z_left, z_right] = [z012, z02];
        [i_left, i_right] = [i012, i02];

        [nx_left, nx_right] = [nx012, nx02];
        [ny_left, ny_right] = [ny012, ny02];
        [nz_left, nz_right] = [nz012, nz02];

        [u_left, u_right] = [u012, u02];
        [v_left, v_right] = [v012, v02];

        [iz_left, iz_right] = [iz012, iz02];
    }

    for(let y = P0.y; y < P2.y; ++y){
        let x_l = x_left[y - P0.y];
        let x_r = x_right[y - P0.y];
        
        // let h_segment = InterpolateFloat(x_l, h_left[y - P0.y], x_r, h_right[y - P0.y]);
        let z_segment = InterpolateFloat(x_l, z_left[y - P0.y], x_r, z_right[y - P0.y]);
        let iz_segment = InterpolateFloat(x_l, iz_left[y - P0.y], x_r, iz_right[y - P0.y]);

        let il, ir, iscan;
        let nxl, nxr, nyl, nyr, nzl, nzr;
        let nxscan, nyscan, nzscan;
        if(LightingMode == GOURAUD_LIGHTING){
            [il, ir] = [i_left[y - P0.y], i_right[y - P0.y]];
            iscan = InterpolateFloat(x_l, il, x_r, ir);
        }
        else if(LightingMode == PHONG_LIGHTING){
            [nxl, nxr] = [nx_left[y - P0.y], nx_right[y - P0.y]];
            [nyl, nyr] = [ny_left[y - P0.y], ny_right[y - P0.y]];
            [nzl, nzr] = [nz_left[y - P0.y], nz_right[y - P0.y]];

            nxscan = InterpolateFloat(x_l, nxl, x_r, nxr);
            nyscan = InterpolateFloat(x_l, nyl, x_r, nyr);
            nzscan = InterpolateFloat(x_l, nzl, x_r, nzr);
        }

        let uscan, vscan;
        uscan = InterpolateFloat(x_l, u_left[y - P0.y], x_r, u_right[y - P0.y]);
        vscan = InterpolateFloat(x_l, v_left[y - P0.y], x_r, v_right[y - P0.y]);

        for(let x = x_l; x < x_r; ++x){
            // let mul = h_segment[x - x_l];
            let depth = z_segment[x - x_l];
            // let shaded_color = new Color(
            //     color.r * mul, 
            //     color.g * mul, 
            //     color.b * mul, 
            //     255
            // );

            if(LightingMode == GOURAUD_LIGHTING){
                intensity = iscan[x - x_l];
            }
            else if(LightingMode == PHONG_LIGHTING){
                let vertex = UnProjectVertex(x, y, depth);
                let normal = new Vector3(nxscan[x - x_l], nyscan[x - x_l], nzscan[x - x_l]);
                intensity = ComputeLighting(vertex, normal);
            }

            let u = (uscan[x - x_l] / iz_segment[x - x_l]);
            let v = (vscan[x - x_l] / iz_segment[x - x_l]);
            let color2 = wood_texture.GetTexel(u, v);
            // let color2 = wood_texture.GetBillinearTexel(u, v);

            if(UpdateDepthBufferIfCloser(x, y, depth)){
                PutPixel(x, y, Color.MultiplyScalar(color2, intensity));
                depthBuffer[x + y * WIDTH] = depth;
            }
        }
    }
}

function Clamp0To1(num){
    return Math.max(Math.min(num, 1), 0);
}
//#endregion

//#region Render Mathmatics
function BasicInterfolate(i0, d0, i1, d1){
    if(i0 == i1){
        return [d0];
    }

    let values = [];
    const a = (d1 - d0) / (i1 - i0);
    let d = d0;

    for(let i = i0; i <= i1; ++i){
        values.push(Math.round(d));
        d += a;
    }

    return values;
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

    for(let i = i0; i < i1; ++i){
        values.push(d);
        d += a;
    }

    values.push(d1);

    return values;
}
function InterpolateTriangle(y0, v0, y1, v1, y2, v2) {
    let v01 = InterpolateFloat(y0, v0, y1, v1);
    let v12 = InterpolateFloat(y1, v1, y2, v2);
    let v02 = InterpolateFloat(y0, v0, y2, v2);
    v01.pop();
    let v012 = v01.concat(v12);
    return [v02, v012];
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

function CullBackFace(model, matrix){
    let triangles = [];
    for(let i = 0; i < model.triangles.length; ++i){
        let v0 = (matrix.MultiplyVector3(model.vertices[model.triangles[i].index[0]]));
        let v1 = (matrix.MultiplyVector3(model.vertices[model.triangles[i].index[1]]));
        let v2 = (matrix.MultiplyVector3(model.vertices[model.triangles[i].index[2]]));
        let d01 = Vector3.Minus(v1, v0);
        let d12 = Vector3.Minus(v2, v1);
        let nor = Vector3.Cross(d01, d12);
        let dtc = Vector3.MultiplyScalar(v0, -1);
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