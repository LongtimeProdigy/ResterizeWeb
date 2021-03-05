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
import Canvas from "./Canavs.js";
import Renderer from "./Renderer.js";

const renderer = new Renderer(Renderer.PHONG_LIGHTING);

const canvas = new Canvas("RayTrace", "blue");

// var camera = new Camera(
//     new Transform(new Vector3(-2, 1, 4), new Vector3(0, 30, 0), 1), 
//     1, 90);
const camera = new Camera(
    new Transform(new Vector3(0, 0, -5), new Vector3(0, 0, 0), 1), 
    1, 90);

var models;
const lights = [
    // new AmbientLight(0.2), 
    // new PointLight(0.6, new Vector3(0, 0, 5), 1), 
    new DirectionalLight(0.8, new Vector3(-1, 0, 1).Normalized()), 
]

if(canvas){
    Start();
}

async function Start(){
    var wood_texture = await LoadAsset("Texture/crate-texture.jpg");

    models = [
        // Model.CreateCube(
        //         "cube1", 
        //         new Transform(new Vector3(-1.5, 0, 7), new Vector3(0, 0, 0), new Vector3(0.75, 0.75, 0.75)), 
        //         new Vector3(0, 0, 0), 
        //         Math.sqrt(3), 
        //         wood_texture
        //     ), 
        // Model.CreateCube(
        //         "cube2", 
        //         new Transform(new Vector3(1.25, 2.5, 7.5), new Vector3(0, 195, 0), new Vector3(1, 1, 1)), 
        //         new Vector3(0, 0, 0), 
        //         Math.sqrt(3), 
        //         undefined
        //     ), 
        // Model.CreateSphere(
        //     15, Color.Green(), 
        //     "Sphere1", 
        //     new Transform(new Vector3(1.75, -0.5, 7), new Vector3(0, 0, 0), new Vector3(1.5, 1.5, 1.5)), 
        //     new Vector3(0, 0, 0), 
        //     1, 
        //     undefined
        // ), 

        Model.CreateCube(
            "cube1", 
            new Transform(new Vector3(-2, -1, 0), new Vector3(0, 0, 0), new Vector3(1, 1, 1)), 
            new Vector3(0, 0, 0), 
            Math.sqrt(3), 
            wood_texture
        ), 
        // Model.CreateCube(
        //     "cube2", 
        //     new Transform(new Vector3(-2, 0, 0), new Vector3(0, 0, 0), new Vector3(1, 1, 1)), 
        //     new Vector3(0, 0, 0), 
        //     Math.sqrt(3), 
        //     wood_texture
        // ), 
        // Model.CreateSphere(
        //     16, Color.Green(), 
        //     "Sphere1", 
        //     new Transform(new Vector3(3, 0, 10), new Vector3(0, 0, 0), new Vector3(1.5, 1.5, 1.5)), 
        //     new Vector3(0, 0, 0), 
        //     1
        // ), 
    ];

    // AssignMouseEvent();

    UpdateCanvas();
}

async function LoadAsset(path){
    var wood_texture = new Texture();
    return await wood_texture.LoadTexture(path);
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
    canvas.canvas.addEventListener("mousedown", e =>{
        mousedown = true;
    });

    canvas.canvas.addEventListener("mousemove", e =>{
        if(mousedown){
            let disVector = camera.transform.position;
            let disX = RotateYMatrix(e.movementX * Math.PI / 180).MultiplyVector3(disVector);

            let rotateMat = lookAt(disVector, new Vector3(0, 0, 0));

            camera.transform.position = disX;
            camera.transform.rotation = rotateMat.MultiplyVector3(camera.transform.rotation);

            UpdateCanvas();
        }
    });

    canvas.canvas.addEventListener("mouseup", e =>{
        mousedown =false;
    });
}

function UpdateCanvas(){
    // canvas.ClearCanvas();

    RenderModels();

    canvas.UpdateCanvas();
}

function RenderModels(){
    for(let i = 0; i < models.length; ++i){
        renderer.RenderModel(camera, canvas, models[i], lights);
    }
}