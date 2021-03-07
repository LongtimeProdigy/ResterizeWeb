import Color from "./Color.js";
import Vector3 from "./Vector3.js";
import Model from "./Model.js";
import Transform from "./Transform.js";
import Camera from "./Camera.js";
import AmbientLight from "./AmbientLight.js";
import PointLight from "./PointLight.js";
import DirectionalLight from "./DirectionalLight.js";
import Texture from "./Texture.js"
import Matrix3x3 from "./Matrix3x3.js";
import Matrix4x4 from "./Matrix4x4.js";
import Canvas from "./Canavs.js";
import Renderer from "./Renderer.js";

const renderer = new Renderer(Renderer.PHONG_LIGHTING);

var BACKGROUNDCOLOR = new Color(126, 126, 126 ,255);
const canvas = new Canvas("CPU Resterize", 
`rgba(${BACKGROUNDCOLOR.r}, ${BACKGROUNDCOLOR.g}, ${BACKGROUNDCOLOR.b}, 1)`);

var camera = new Camera(
    new Transform(new Vector3(-3, 1, 2), new Vector3(0, 30, 0), 1), 
    1, 90);

const lights = [
    new AmbientLight(0.1), 
    new PointLight(0.7, new Vector3(0, 0, 3.9), 1), 
    new DirectionalLight(0.2, new Vector3(-1, 0, 1)), 
]

if(canvas && renderer){
    Start();
}

var wood_texture;
var models;

async function Start(){
    wood_texture = await LoadAsset("Texture/crate-texture.jpg");
    models = [
        Model.CreateCube(
                "cube1", 
                new Transform(new Vector3(-2.5, 0, 5), new Vector3(0, 0, 0), new Vector3(0.75, 0.75, 0.75)), 
                new Vector3(0, 0, 0), 
                Math.sqrt(3), 
                wood_texture
        ), 
        Model.CreateCube(
                "cube2", 
                new Transform(new Vector3(-1.25, 2.5, 5), new Vector3(0, 195, 0), new Vector3(1, 1, 1)), 
                new Vector3(0, 0, 0), 
                Math.sqrt(3), 
                wood_texture
        ), 
        Model.CreateCube(
            "cube2", 
            new Transform(new Vector3(1, 0, 5), new Vector3(0, -30, 0), new Vector3(1, 1, 1)), 
            new Vector3(0, 0, 0), 
            Math.sqrt(3), 
            wood_texture
        ), 
    ];

    AttachEvent(models);

    // AssignMouseEvent();

    CanvasUpdate();
}
//#region MouseEvent
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
            let disVector = camera.transform.position.position;
            let disX = RotateYMatrix(e.movementX * Math.PI / 180).MultiplyVector3(disVector);

            let rotateMat = lookAt(disVector, new Vector3(0, 0, 0));

            camera.transform.position.position = disX;
            camera.transform.position.rotation = rotateMat.MultiplyVector3(camera.transform.position.rotation);

            UpdateCanvas();
        }
    });

    canvas.canvas.addEventListener("mouseup", e =>{
        mousedown =false;
    });
}
//#endregion

function AttachEvent(){
    //#region CameraPosition Button
    //#region Position
    // X
    var CameraPositionX = document.getElementById("CameraPositionX");
    CameraPositionX.onchange = () =>{
        camera.transform.position.x = Number(CameraPositionX.value);
        CanvasUpdate();
    }
    var CameraPositionXUPButton = document.getElementById("CameraPositionXUP");
    CameraPositionXUPButton.onclick = () => {
        CameraPositionX.value = Number(CameraPositionX.value) + 1;
        camera.transform.position.x = Number(CameraPositionX.value);
        CanvasUpdate();
    }
    var CameraPositionXDOWNButton = document.getElementById("CameraPositionXDOWN");
    CameraPositionXDOWNButton.onclick = () => {
        CameraPositionX.value = Number(CameraPositionX.value) - 1;
        camera.transform.position.x = Number(CameraPositionX.value);
        CanvasUpdate();
    }
    // Y
    var CameraPositionY = document.getElementById("CameraPositionY");
    CameraPositionY.onchange = () =>{
        camera.transform.position.y = Number(CameraPositionY.value);
        CanvasUpdate();
    }
    var CameraPositionYUPButton = document.getElementById("CameraPositionYUP");
    CameraPositionYUPButton.onclick = () => {
        CameraPositionY.value = Number(CameraPositionY.value) + 1;
        camera.transform.position.y = Number(CameraPositionY.value);
        CanvasUpdate();
    }
    var CameraPositionYDOWNButton = document.getElementById("CameraPositionYDOWN");
    CameraPositionYDOWNButton.onclick = () => {
        CameraPositionY.value = Number(CameraPositionY.value) - 1;
        camera.transform.position.y = Number(CameraPositionY.value);
        CanvasUpdate();
    }
    // Z
    var CameraPositionZ = document.getElementById("CameraPositionZ");
    CameraPositionZ.onchange = () =>{
        camera.transform.position.z = Number(CameraPositionZ.value);
        CanvasUpdate();
    }
    var CameraPositionZUPButton = document.getElementById("CameraPositionZUP");
    CameraPositionZUPButton.onclick = () => {
        CameraPositionZ.value = Number(CameraPositionZ.value) + 1;
        camera.transform.position.z = Number(CameraPositionZ.value);
        CanvasUpdate();
    }
    var CameraPositionZDOWNButton = document.getElementById("CameraPositionZDOWN");
    CameraPositionZDOWNButton.onclick = () => {
        CameraPositionZ.value = Number(CameraPositionZ.value) - 1;
        camera.transform.position.z = Number(CameraPositionZ.value);
        CanvasUpdate();
    }
    CameraPositionX.value = camera.transform.position.x;
    CameraPositionY.value = camera.transform.position.y;
    CameraPositionZ.value = camera.transform.position.z;
    //#endregion
    //#region Rotation
    // X
    var CameraRotationX = document.getElementById("CameraRotationX");
    CameraRotationX.onchange = () =>{
        camera.transform.rotation.x = Number(CameraRotationX.value) * Math.PI / 180;
        CanvasUpdate();
    }
    var CameraRotationXUPButton = document.getElementById("CameraRotationXUP");
    CameraRotationXUPButton.onclick = () => {
        CameraRotationX.value = Number(CameraRotationX.value) + 1;
        camera.transform.rotation.x = Number(CameraRotationX.value) * Math.PI / 180;
        CanvasUpdate();
    }
    var CameraRotationXDOWNButton = document.getElementById("CameraRotationXDOWN");
    CameraRotationXDOWNButton.onclick = () => {
        CameraRotationX.value = Number(CameraRotationX.value) - 1;
        camera.transform.rotation.x = Number(CameraRotationX.value) * Math.PI / 180;
        CanvasUpdate();
    }

    // Y
    var CameraRotationY = document.getElementById("CameraRotationY");
    CameraRotationY.onchange = () =>{
        camera.transform.rotation.y = Number(CameraRotationY.value) * Math.PI / 180;
        CanvasUpdate();
    }
    var CameraRotationYUPButton = document.getElementById("CameraRotationYUP");
    CameraRotationYUPButton.onclick = () => {
        CameraRotationY.value = Number(CameraRotationY.value) + 1;
        camera.transform.rotation.y = Number(CameraRotationY.value) * Math.PI / 180;
        CanvasUpdate();
    }
    var CameraRotationYDOWNButton = document.getElementById("CameraRotationYDOWN");
    CameraRotationYDOWNButton.onclick = () => {
        CameraRotationY.value = Number(CameraRotationY.value) - 1;
        camera.transform.rotation.y = Number(CameraRotationY.value) * Math.PI / 180;
        CanvasUpdate();
    }

    // Z
    var CameraRotationZ = document.getElementById("CameraRotationZ");
    CameraRotationZ.onchange = () =>{
        camera.transform.rotation.z = Number(CameraRotationZ.value) * Math.PI / 180;
        CanvasUpdate();
    }
    var CameraRotationZUPButton = document.getElementById("CameraRotationZUP");
    CameraRotationZUPButton.onclick = () => {
        CameraRotationZ.value = Number(CameraRotationZ.value) + 1;
        camera.transform.rotation.z = Number(CameraRotationZ.value) * Math.PI / 180;
        CanvasUpdate();
    }
    var CameraRotationZDOWNButton = document.getElementById("CameraRotationZDOWN");
    CameraRotationZDOWNButton.onclick = () => {
        CameraRotationZ.value = Number(CameraRotationZ.value) - 1;
        camera.transform.rotation.z = Number(CameraRotationZ.value) * Math.PI / 180;
        CanvasUpdate();
    }
    CameraRotationX.value = camera.transform.rotation.x * 180 / Math.PI;
    CameraRotationY.value = camera.transform.rotation.y * 180 / Math.PI;
    CameraRotationZ.value = camera.transform.rotation.z * 180 / Math.PI;
    //#endregion
    //#region FOV
    var CameraFOV = document.getElementById("CameraFOV");
    CameraFOV.onchange = () => {
        camera.fov = Number(CameraFOV.value);
        CanvasUpdate();
    }
    var CameraFOVUP = document.getElementById("CameraFOVUP");
    CameraFOVUP.onclick = () => {
        CameraFOV.value = Number(CameraFOV.value) + 1;
        camera.fov = Number(CameraFOV.value);
        CanvasUpdate();
    }
    var CameraFOVDOWN = document.getElementById("CameraFOVDOWN");
    CameraFOVDOWN.onclick = () => {
        CameraFOV.value = Number(CameraFOV.value) - 1;
        camera.fov = Number(CameraFOV.value);
        CanvasUpdate();
    }
    CameraFOV.value = camera.fov;
    //#endregion
    //#endregion

    //#region BackGround
    var BackgroundColorR = document.getElementById("BackgroundColorR");
    BackgroundColorR.onchange = () => {
        BACKGROUNDCOLOR.r = Number(BackgroundColorR.value);
        canvas.backgroundColor = `rgba(${BACKGROUNDCOLOR.r}, ${BACKGROUNDCOLOR.g}, ${BACKGROUNDCOLOR.b}, 1)`;
        CanvasUpdate();
    }
    var BackgroundColorG = document.getElementById("BackgroundColorG");
    BackgroundColorG.onchange = () => {
        BACKGROUNDCOLOR.g = Number(BackgroundColorG.value);
        canvas.backgroundColor = `rgba(${BACKGROUNDCOLOR.r}, ${BACKGROUNDCOLOR.g}, ${BACKGROUNDCOLOR.b}, 1)`;
        CanvasUpdate();
    }
    var BackgroundColorB = document.getElementById("BackgroundColorB");
    BackgroundColorB.onchange = () => {
        BACKGROUNDCOLOR.b = Number(BackgroundColorB.value);
        canvas.backgroundColor = `rgba(${BACKGROUNDCOLOR.r}, ${BACKGROUNDCOLOR.g}, ${BACKGROUNDCOLOR.b}, 1)`;
        CanvasUpdate();
    }
    BackgroundColorR.value = BACKGROUNDCOLOR.r;
    BackgroundColorG.value = BACKGROUNDCOLOR.g;
    BackgroundColorB.value = BACKGROUNDCOLOR.b;
    //#endregion

    //#region Lighting
    //#region Ambient
    var AmbientIntensity = document.getElementById("AmbientIntensity");
    AmbientIntensity.onchange = () => {
        lights[0].intensity = Number(AmbientIntensity.value);
        CanvasUpdate();
    }
    AmbientIntensity.value = lights[0].intensity;
    //#endregion
    //#region Direciontal
    var DirectionalIntensity = document.getElementById("DirectionalIntensity");
    DirectionalIntensity.onchange = () => {
        lights[2].intensity = Number(DirectionalIntensity.value);
        CanvasUpdate();
    }
    DirectionalIntensity.value = lights[2].intensity;

    var DirectionVector3X = document.getElementById("DirectionVector3X");
    DirectionVector3X.onchange = () => {
        lights[2].direction.x = Number(DirectionVector3X.value);
        CanvasUpdate();
    }
    DirectionVector3X.value = lights[2].direction.x;

    var DirectionVector3Y = document.getElementById("DirectionVector3Y");
    DirectionVector3Y.onchange = () => {
        lights[2].direction.y = Number(DirectionVector3Y.value);
        CanvasUpdate();
    }
    DirectionVector3Y.value = lights[2].direction.y;

    var DirectionVector3Z = document.getElementById("DirectionVector3Z");
    DirectionVector3Z.onchange = () => {
        lights[2].direction.z = Number(DirectionVector3Z.value);
        CanvasUpdate();
    }
    DirectionVector3Z.value = lights[2].direction.z;
    //#endregion
    //#region Point
    var PointIntensity = document.getElementById("PointIntensity");
    PointIntensity.onchange = () => {
        lights[1].intensity = Number(PointIntensity.value);
        CanvasUpdate();
    }
    PointIntensity.value = lights[1].intensity;

    var PointVector3X = document.getElementById("PointVector3X");
    PointVector3X.onchange = () => {
        lights[1].position.x = Number(PointVector3X.value);
        CanvasUpdate();
    }
    PointVector3X.value = lights[1].position.x;

    var PointVector3Y = document.getElementById("PointVector3Y");
    PointVector3Y.onchange = () => {
        lights[1].position.y = Number(PointVector3Y.value);
        CanvasUpdate();
    }
    PointVector3Y.value = lights[1].position.y;

    var PointVector3Z = document.getElementById("PointVector3Z");
    PointVector3Z.onchange = () => {
        lights[1].position.z = Number(PointVector3Z.value);
        CanvasUpdate();
    }
    PointVector3Z.value = lights[1].position.z;
    //#endregion
    //#endregion

    //#region models
    //#region Position
    var RedPositionX = document.getElementById("RedPositionX");
    var RedPositionY = document.getElementById("RedPositionY");
    var RedPositionZ = document.getElementById("RedPositionZ");
    var GreenPositionX = document.getElementById("GreenPositionX");
    var GreenPositionY = document.getElementById("GreenPositionY");
    var GreenPositionZ = document.getElementById("GreenPositionZ");
    var BluePositionX = document.getElementById("BluePositionX");
    var BluePositionY = document.getElementById("BluePositionY");
    var BluePositionZ = document.getElementById("BluePositionZ");
    // var PlanePositionX = document.getElementById("PlanePositionX");
    // var PlanePositionY = document.getElementById("PlanePositionY");
    // var PlanePositionZ = document.getElementById("PlanePositionZ");
    RedPositionX.onchange = () => {
        models[0].transform.position.x = Number(RedPositionX.value);
        CanvasUpdate();
    }
    RedPositionX.value = models[0].transform.position.x;
    RedPositionY.onchange = () => {
        models[0].transform.position.y = Number(RedPositionY.value);
        CanvasUpdate();
    }
    RedPositionY.value = models[0].transform.position.y;
    RedPositionZ.onchange = () => {
        models[0].transform.position.z = Number(RedPositionZ.value);
        CanvasUpdate();
    }
    RedPositionZ.value = models[0].transform.position.z;

    GreenPositionX.onchange = () => {
        models[1].transform.position.x = Number(GreenPositionX.value);
        CanvasUpdate();
    }
    GreenPositionX.value = models[1].transform.position.x;
    GreenPositionY.onchange = () => {
        models[1].transform.position.y = Number(GreenPositionY.value);
        CanvasUpdate();
    }
    GreenPositionY.value = models[1].transform.position.y;
    GreenPositionZ.onchange = () => {
        models[1].transform.position.z = Number(GreenPositionZ.value);
        CanvasUpdate();
    }
    GreenPositionZ.value = models[1].transform.position.z;

    BluePositionX.onchange = () => {
        models[2].transform.position.x = Number(BluePositionX.value);
        CanvasUpdate();
    }
    BluePositionX.value = models[2].transform.position.x;
    BluePositionY.onchange = () => {
        models[2].transform.position.y = Number(BluePositionY.value);
        CanvasUpdate();
    }
    BluePositionY.value = models[2].transform.position.y;
    BluePositionZ.onchange = () => {
        models[2].transform.position.z = Number(BluePositionZ.value);
        CanvasUpdate();
    }
    BluePositionZ.value = models[2].transform.position.z;

    // PlanePositionX.onchange = () => {
    //     models[3].transform.position.x = Number(PlanePositionX.value);
    //     CanvasUpdate();
    // }
    // PlanePositionX.value = models[3].transform.position.x;
    // PlanePositionY.onchange = () => {
    //     models[3].transform.position.y = Number(PlanePositionY.value);
    //     CanvasUpdate();
    // }
    // PlanePositionY.value = models[3].transform.position.y;
    // PlanePositionZ.onchange = () => {
    //     models[3].transform.position.z = Number(PlanePositionZ.value);
    //     CanvasUpdate();
    // }
    // PlanePositionZ.value = models[3].transform.position.z;
    //#endregion
    
    //#region Rotation
    var RedRotationX = document.getElementById("RedRotationX");
    var RedRotationY = document.getElementById("RedRotationY");
    var RedRotationZ = document.getElementById("RedRotationZ");
    var GreenRotationX = document.getElementById("GreenRotationX");
    var GreenRotationY = document.getElementById("GreenRotationY");
    var GreenRotationZ = document.getElementById("GreenRotationZ");
    var BlueRotationX = document.getElementById("BlueRotationX");
    var BlueRotationY = document.getElementById("BlueRotationY");
    var BlueRotationZ = document.getElementById("BlueRotationZ");
    RedRotationX.onchange = () => {
        models[0].transform.rotation.x = Number(RedRotationX.value) * Math.PI / 180;
        CanvasUpdate();
    }
    RedRotationX.value = models[0].transform.rotation.x * 180 / Math.PI;
    RedRotationY.onchange = () => {
        models[0].transform.rotation.y = Number(RedRotationY.value) * Math.PI / 180;
        CanvasUpdate();
    }
    RedRotationY.value = models[0].transform.rotation.y * 180 / Math.PI;
    RedRotationZ.onchange = () => {
        models[0].transform.rotation.z = Number(RedRotationZ.value) * Math.PI / 180;
        CanvasUpdate();
    }
    RedRotationZ.value = models[0].transform.rotation.z * 180 / Math.PI;

    GreenRotationX.onchange = () => {
        models[1].transform.rotation.x = Number(GreenRotationX.value) * Math.PI / 180;
        CanvasUpdate();
    }
    GreenRotationX.value = models[1].transform.rotation.x * 180 / Math.PI;
    GreenRotationY.onchange = () => {
        models[1].transform.rotation.y = Number(GreenRotationY.value) * Math.PI / 180;
        CanvasUpdate();
    }
    GreenRotationY.value = models[1].transform.rotation.y * 180 / Math.PI;
    GreenRotationZ.onchange = () => {
        models[1].transform.rotation.z = Number(GreenRotationZ.value) * Math.PI / 180;
        CanvasUpdate();
    }
    GreenRotationZ.value = models[1].transform.rotation.z * 180 / Math.PI;

    BlueRotationX.onchange = () => {
        models[2].transform.rotation.x = Number(BlueRotationX.value) * Math.PI / 180;
        CanvasUpdate();
    }
    BlueRotationX.value = models[2].transform.rotation.x * 180 / Math.PI;
    BlueRotationY.onchange = () => {
        models[2].transform.rotation.y = Number(BlueRotationY.value) * Math.PI / 180;
        CanvasUpdate();
    }
    BlueRotationY.value = models[2].transform.rotation.y * 180 / Math.PI;
    BlueRotationZ.onchange = () => {
        models[2].transform.rotation.z = Number(BlueRotationZ.value) * Math.PI / 180;
        CanvasUpdate();
    }
    BlueRotationZ.value = models[2].transform.rotation.z * 180 / Math.PI;
    //#endregion
    
    //#region Scale
    var RedScaleX = document.getElementById("RedScaleX");
    var RedScaleY = document.getElementById("RedScaleY");
    var RedScaleZ = document.getElementById("RedScaleZ");
    var GreenScaleX = document.getElementById("GreenScaleX");
    var GreenScaleY = document.getElementById("GreenScaleY");
    var GreenScaleZ = document.getElementById("GreenScaleZ");
    var BlueScaleX = document.getElementById("BlueScaleX");
    var BlueScaleY = document.getElementById("BlueScaleY");
    var BlueScaleZ = document.getElementById("BlueScaleZ");
    RedScaleX.onchange = () => {
        models[0].transform.scale.x = Number(RedScaleX.value);
        CanvasUpdate();
    }
    RedScaleX.value = models[0].transform.scale.x;
    RedScaleY.onchange = () => {
        models[0].transform.scale.y = Number(RedScaleY.value);
        CanvasUpdate();
    }
    RedScaleY.value = models[0].transform.scale.y;
    RedScaleZ.onchange = () => {
        models[0].transform.scale.z = Number(RedScaleZ.value);
        CanvasUpdate();
    }
    RedScaleZ.value = models[0].transform.scale.z;

    GreenScaleX.onchange = () => {
        models[1].transform.scale.x = Number(GreenScaleX.value);
        CanvasUpdate();
    }
    GreenScaleX.value = models[1].transform.scale.x;
    GreenScaleY.onchange = () => {
        models[1].transform.scale.y = Number(GreenScaleY.value);
        CanvasUpdate();
    }
    GreenScaleY.value = models[1].transform.scale.y;
    GreenScaleZ.onchange = () => {
        models[1].transform.scale.z = Number(GreenScaleZ.value);
        CanvasUpdate();
    }
    GreenScaleZ.value = models[1].transform.scale.z;

    BlueScaleX.onchange = () => {
        models[2].transform.scale.x = Number(BlueScaleX.value);
        CanvasUpdate();
    }
    BlueScaleX.value = models[2].transform.scale.x;
    BlueScaleY.onchange = () => {
        models[2].transform.scale.y = Number(BlueScaleY.value);
        CanvasUpdate();
    }
    BlueScaleY.value = models[2].transform.scale.y;
    BlueScaleZ.onchange = () => {
        models[2].transform.scale.z = Number(BlueScaleZ.value);
        CanvasUpdate();
    }
    BlueScaleZ.value = models[2].transform.scale.z;
    //#endregion

    // //#region Radius
    // var RedRadius = document.getElementById("RedRadius");
    // var GreenRadius = document.getElementById("GreenRadius");
    // var BlueRadius = document.getElementById("BlueRadius");
    // var PlaneRadius = document.getElementById("PlaneRadius");

    // RedRadius.onchange = () => {
    //     models[0].radius = Number(RedRadius.value);
    //     CanvasUpdate();
    // }
    // RedRadius.value = models[0].radius;

    // GreenRadius.onchange = () => {
    //     models[1].radius = Number(GreenRadius.value);
    //     CanvasUpdate();
    // }
    // GreenRadius.value = models[1].radius;

    // BlueRadius.onchange = () => {
    //     models[2].radius = Number(BlueRadius.value);
    //     CanvasUpdate();
    // }
    // BlueRadius.value = models[2].radius;

    // PlaneRadius.onchange = () => {
    //     models[3].radius = Number(PlaneRadius.value);
    //     CanvasUpdate();
    // }
    // PlaneRadius.value = models[3].radius;
    // //#endregion
    // //#region Specular
    // var RedSpecular = document.getElementById("RedSpecular");
    // var GreenSpecular = document.getElementById("GreenSpecular");
    // var BlueSpecular = document.getElementById("BlueSpecular");
    // var PlaneSpecular = document.getElementById("PlaneSpecular");

    // RedSpecular.onchange = () => {
    //     models[0].specular = Number(RedSpecular.value);
    //     CanvasUpdate();
    // }
    // RedSpecular.value = models[0].specular;

    // GreenSpecular.onchange = () => {
    //     models[1].specular = Number(GreenSpecular.value);
    //     CanvasUpdate();
    // }
    // GreenSpecular.value = models[1].specular;

    // BlueSpecular.onchange = () => {
    //     models[2].specular = Number(BlueSpecular.value);
    //     CanvasUpdate();
    // }
    // BlueSpecular.value = models[2].specular;

    // PlaneSpecular.onchange = () => {
    //     models[3].specular = Number(PlaneSpecular.value);
    //     CanvasUpdate();
    // }
    // PlaneSpecular.value = models[3].specular;
    // //#endregion
    // //#region Refelction
    // var RedReflection = document.getElementById("RedReflection");
    // var GreenReflection = document.getElementById("GreenReflection");
    // var BlueReflection = document.getElementById("BlueReflection");
    // var PlaneReflection = document.getElementById("PlaneReflection");

    // RedReflection.onchange = () => {
    //     models[0].reflective = Number(RedReflection.value);
    //     CanvasUpdate();
    // }
    // RedReflection.value = models[0].reflective;

    // GreenReflection.onchange = () => {
    //     models[1].reflective = Number(GreenReflection.value);
    //     CanvasUpdate();
    // }
    // GreenReflection.value = models[1].reflective;

    // BlueReflection.onchange = () => {
    //     models[2].reflective = Number(BlueReflection.value);
    //     CanvasUpdate();
    // }
    // BlueReflection.value = models[2].reflective;

    // PlaneReflection.onchange = () => {
    //     models[3].reflective = Number(PlaneReflection.value);
    //     CanvasUpdate();
    // }
    // PlaneReflection.value = models[3].reflective;
    // //#endregion
    //#endregion
}

function CanvasUpdate(){
    canvas.ClearCanvas();

    RenderModels();

    canvas.UpdateCanvas();
}

function RenderModels(){
    for(let i = 0; i < models.length; ++i){
        renderer.RenderModel(camera, canvas, models[i], lights);
    }
}