import Vector3 from "./Vector3.js";
import Color from "./Color.js";
import Vertex from "./Vertex.js";
import Vector2 from "./Vector2.js";

export default class Renderer{
    static FLAT_LIGHTING = 1;
    static GOURAUD_LIGHTING = 2;
    static PHONG_LIGHTING = 3;

    constructor(lightingMode){
        this.LightingMode = lightingMode;
    }

    RenderModel(camera, canvas, target, lights){
        let cameraMatrix = camera.GetMatrix();
        let modelMatrix = target.GetMatrix();
        let matrix = cameraMatrix.Multiply4x4(modelMatrix);
        let center = matrix.MultiplyVector3(target.center);
        
        let model = camera.PlaneClip(center, target);
        if(model == null){
            // console.log("Plane Culling");
            return;
        }
        
        let triangles = this.CullBackFace(model, matrix);
        // model.triangles = triangles;
        // console.log(model);
        
        let projected = [];
        let viewport = [];
        for(let j = 0; j < model.vertices.length; ++j){
            projected.push(
                canvas.ViewportToCanvas(
                    camera.ProjectVertex(
                        matrix.MultiplyVector3(model.vertices[j].position)
                    )
                )
            );

            viewport.push(camera.ProjectVertex(
                matrix.MultiplyVector3(model.vertices[j].position)
            ));
        }
        // console.log(
        //     Math.tan(90 / 2), 
        //     (2 * Math.tan(90 / 2)) + 0.5
        // )
        // console.log(viewport, projected);
        
        let modelRotateMatrix = model.GetRotateMatrix();
        let cameraRotateMatrix
        for(let j = 0; j < triangles.length; ++j){
            // if(j == 4){
                this.DrawFillTriangle(
                    triangles[j], model.vertices, projected
                    , canvas, camera, lights, model.texture, matrix, modelRotateMatrix
                    );
            // }
        }
    }

    CullBackFace(model, matrix){
        let triangles = [];
        for(let i = 0; i < model.triangles.length; ++i){
            let v0 = (matrix.MultiplyVector3(model.vertices[model.triangles[i].index[0]].position));
            let v1 = (matrix.MultiplyVector3(model.vertices[model.triangles[i].index[1]].position));
            let v2 = (matrix.MultiplyVector3(model.vertices[model.triangles[i].index[2]].position));
            let d01 = Vector3.Minus(v1, v0);
            let d12 = Vector3.Minus(v2, v1);
            let nor = Vector3.Cross(d01, d12);
            let dtc = Vector3.MultiplyScalar(v0, -1);
            let dot = Vector3.Dot(nor, dtc);
            if(dot > 0){
                // front
            }
            else{
                // back
                triangles.push(model.triangles[i]);
            }
        }
    
        return triangles;
    }

    DrawLine(P0, P1, color) {
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
    
    DrawWireframeTriangle(P0, P1, P2, color){
        this.DrawLine(P0, P1, color);
        this.DrawLine(P1, P2, color);
        this.DrawLine(P2, P0, color);
    }
    
    DrawFillTriangle(triangle, vertexes, projected, canvas, camera, lights, texture, matrix, modelRotateMatrix){
        let index = [0, 1, 2];
        if(projected[triangle.index[index[1]]].y < projected[triangle.index[index[0]]].y)
        {
            // let swap = triangle.index[0]; triangle.index[0] = triangle.index[1]; triangle.index[1] = swap;
            let swap2 = index[0]; index[0] = index[1]; index[1] = swap2;
        }
        if(projected[triangle.index[index[2]]].y < projected[triangle.index[index[0]]].y)
        {
            // let swap = triangle.index[0]; triangle.index[0] = triangle.index[2]; triangle.index[2] = swap;
            let swap2 = index[0]; index[0] = index[2]; index[2] = swap2;
        }
        if(projected[triangle.index[index[2]]].y < projected[triangle.index[index[1]]].y)
        {
            // let swap = triangle.index[2]; triangle.index[2] = triangle.index[1]; triangle.index[1] = swap;
            let swap2 = index[2]; index[2] = index[1]; index[1] = swap2;
        }
    
        let x02, x012;
        [x02, x012] = this.InterpolateTriangle(
            projected[triangle.index[index[0]]].y, projected[triangle.index[index[0]]].x, 
            projected[triangle.index[index[1]]].y, projected[triangle.index[index[1]]].x, 
            projected[triangle.index[index[2]]].y, projected[triangle.index[index[2]]].x
        );
    
        let z02, z012;
        [z02, z012] = this.InterpolateFloatTriangle(
            projected[triangle.index[index[0]]].y, 1 / projected[triangle.index[index[0]]].z, 
            projected[triangle.index[index[1]]].y, 1 / projected[triangle.index[index[1]]].z, 
            projected[triangle.index[index[2]]].y, 1 / projected[triangle.index[index[2]]].z
        );
        
        let cameraRotate = camera.GetRotateMatrix();
        // console.log(cameraRotate);
        let rotateMatrix = cameraRotate.Multiply4x4(modelRotateMatrix);
        let vertices = [];
        for(let i = 0; i < vertexes.length; ++i){
            vertices.push(new Vertex(
                matrix.MultiplyVector3(vertexes[i].position), 
                rotateMatrix.MultiplyVector3(vertexes[i].normal), 
                vertexes[i].uv, 
                vertexes[i].color
            ));
        }
        // console.log(
        //     vertices[triangle.index[index[0]]], 
        //     vertices[triangle.index[index[1]]], 
        //     vertices[triangle.index[index[2]]]
        // );
            
        // for uv
        let accurarity = true;
        let u02, u012, v02, v012;
        if(!accurarity){
            [u02, u012] = this.InterpolateFloatTriangle(
                projected[triangle.index[index[0]]].y, vertices[triangle.index[index[0]]].uv.x,
                projected[triangle.index[index[1]]].y, vertices[triangle.index[index[1]]].uv.x,
                projected[triangle.index[index[2]]].y, vertices[triangle.index[index[2]]].uv.x
                );
            [v02, v012] = this.InterpolateFloatTriangle(
                projected[triangle.index[index[0]]].y, vertices[triangle.index[index[0]]].uv.y,
                projected[triangle.index[index[1]]].y, vertices[triangle.index[index[1]]].uv.y,
                projected[triangle.index[index[2]]].y, vertices[triangle.index[index[2]]].uv.y
                );
        }
        else{
            [u02, u012] = this.InterpolateFloatTriangle(
                projected[triangle.index[index[0]]].y, vertices[triangle.index[index[0]]].uv.x / vertices[triangle.index[index[0]]].position.z,
                projected[triangle.index[index[1]]].y, vertices[triangle.index[index[1]]].uv.x / vertices[triangle.index[index[1]]].position.z,
                projected[triangle.index[index[2]]].y, vertices[triangle.index[index[2]]].uv.x / vertices[triangle.index[index[2]]].position.z
                );
            [v02, v012] = this.InterpolateFloatTriangle(
                projected[triangle.index[index[0]]].y, vertices[triangle.index[index[0]]].uv.y / vertices[triangle.index[index[0]]].position.z,
                projected[triangle.index[index[1]]].y, vertices[triangle.index[index[1]]].uv.y / vertices[triangle.index[index[1]]].position.z,
                projected[triangle.index[index[2]]].y, vertices[triangle.index[index[2]]].uv.y / vertices[triangle.index[index[2]]].position.z
                );
        }
        
        let intensity = 0;
        let i02 = [], i012 = [];
        let nx02, nx012, ny02, ny012, nz02, nz012;
        switch(this.LightingMode){
            case Renderer.FLAT_LIGHTING:
                let center = new Vector3(
                    (vertices[triangle.index[index[0]]].position.x + vertices[triangle.index[index[0]]].position.x + vertices[triangle.index[index[0]]].position.x) / 3.0, 
                    (vertices[triangle.index[index[1]]].position.y + vertices[triangle.index[index[1]]].position.y + vertices[triangle.index[index[1]]].position.y) / 3.0, 
                    (vertices[triangle.index[index[2]]].position.z + vertices[triangle.index[index[2]]].position.z + vertices[triangle.index[index[2]]].position.z) / 3.0, 
                );
                intensity = this.ComputeLighting(lights, center, vertices[triangle.index[0]].normal, camera);
            break;
            case Renderer.GOURAUD_LIGHTING:
                let i0 = this.ComputeLighting(lights, vertices[triangle.index[index[0]]].position, vertices[triangle.index[index[0]]].normal, camera);
                let i1 = this.ComputeLighting(lights, vertices[triangle.index[index[1]]].position, vertices[triangle.index[index[1]]].normal, camera);
                let i2 = this.ComputeLighting(lights, vertices[triangle.index[index[2]]].position, vertices[triangle.index[index[2]]].normal, camera);
                [i02, i012] = this.InterpolateFloatTriangle(
                    projected[triangle.index[index[0]]].y, i0, 
                    projected[triangle.index[index[1]]].y, i1, 
                    projected[triangle.index[index[2]]].y, i2
                    );
            break;
            case Renderer.PHONG_LIGHTING:
                [nx02, nx012] = this.InterpolateFloatTriangle(
                    projected[triangle.index[index[0]]].y, vertices[triangle.index[index[0]]].normal.x, 
                    projected[triangle.index[index[1]]].y, vertices[triangle.index[index[1]]].normal.x, 
                    projected[triangle.index[index[2]]].y, vertices[triangle.index[index[2]]].normal.x
                    );
                [ny02, ny012] = this.InterpolateFloatTriangle(
                    projected[triangle.index[index[0]]].y, vertices[triangle.index[index[0]]].normal.y, 
                    projected[triangle.index[index[1]]].y, vertices[triangle.index[index[1]]].normal.y, 
                    projected[triangle.index[index[2]]].y, vertices[triangle.index[index[2]]].normal.y
                    );
                [nz02, nz012] = this.InterpolateFloatTriangle(
                    projected[triangle.index[index[0]]].y, vertices[triangle.index[index[0]]].normal.z, 
                    projected[triangle.index[index[1]]].y, vertices[triangle.index[index[1]]].normal.z, 
                    projected[triangle.index[index[2]]].y, vertices[triangle.index[index[2]]].normal.z
                    );
            break;
        }
    
        let m = Math.floor(x02.length / 2);
        let x_left, x_right;
        // let h_left, h_right;
        let z_left, z_right;
        let i_left, i_right;
        let nx_left, nx_right, ny_left, ny_right, nz_left, nz_right;
        let u_left, u_right, v_left, v_right;
        if(x02[m] < x012[m]){
            [x_left, x_right] = [x02, x012];
            [z_left, z_right] = [z02, z012];
            [i_left, i_right] = [i02, i012];
    
            [nx_left, nx_right] = [nx02, nx012];
            [ny_left, ny_right] = [ny02, ny012];
            [nz_left, nz_right] = [nz02, nz012];
    
            [u_left, u_right] = [u02, u012];
            [v_left, v_right] = [v02, v012];
        }
        else{
            [x_left, x_right] = [x012, x02];
            [z_left, z_right] = [z012, z02];
            [i_left, i_right] = [i012, i02];
    
            [nx_left, nx_right] = [nx012, nx02];
            [ny_left, ny_right] = [ny012, ny02];
            [nz_left, nz_right] = [nz012, nz02];
    
            [u_left, u_right] = [u012, u02];
            [v_left, v_right] = [v012, v02];
        }
        
        for(let y = projected[triangle.index[index[0]]].y; y < projected[triangle.index[index[2]]].y; ++y){
            let x_l = x_left[y - projected[triangle.index[index[0]]].y];
            let x_r = x_right[y - projected[triangle.index[index[0]]].y];
            
            let zscan = this.InterpolateFloat(
                x_l, z_left[y - projected[triangle.index[index[0]]].y], 
                x_r, z_right[y - projected[triangle.index[index[0]]].y]
                );
    
            let il, ir, iscan;
            let nxl, nxr, nyl, nyr, nzl, nzr;
            let nxscan, nyscan, nzscan;
            if(this.LightingMode == Renderer.GOURAUD_LIGHTING){
                [il, ir] = [i_left[y - projected[triangle.index[index[0]]].y], i_right[y - projected[triangle.index[index[0]]].y]];
                iscan = this.InterpolateFloat(x_l, il, x_r, ir);
            }
            else if(this.LightingMode == Renderer.PHONG_LIGHTING){
                [nxl, nxr] = [nx_left[y - projected[triangle.index[index[0]]].y], nx_right[y - projected[triangle.index[index[0]]].y]];
                [nyl, nyr] = [ny_left[y - projected[triangle.index[index[0]]].y], ny_right[y - projected[triangle.index[index[0]]].y]];
                [nzl, nzr] = [nz_left[y - projected[triangle.index[index[0]]].y], nz_right[y - projected[triangle.index[index[0]]].y]];
    
                nxscan = this.InterpolateFloat(x_l, nxl, x_r, nxr);
                nyscan = this.InterpolateFloat(x_l, nyl, x_r, nyr);
                nzscan = this.InterpolateFloat(x_l, nzl, x_r, nzr);
            }
    
            let uscan = this.InterpolateFloat(
                x_l, u_left[y - projected[triangle.index[index[0]]].y], 
                x_r, u_right[y - projected[triangle.index[index[0]]].y]
                );
            let vscan = this.InterpolateFloat(
                x_l, v_left[y - projected[triangle.index[index[0]]].y], 
                x_r, v_right[y - projected[triangle.index[index[0]]].y]
                );
    
            for(let x = x_l; x < x_r; ++x){
                let depth = zscan[x - x_l];
    
                if(this.LightingMode == Renderer.GOURAUD_LIGHTING){
                    intensity = iscan[x - x_l];
                }
                else if(this.LightingMode == Renderer.PHONG_LIGHTING){
                    let vertex = this.UnProjectVertex(x, y, depth, camera, canvas);
                    let normal = new Vector3(nxscan[x - x_l], nyscan[x - x_l], nzscan[x - x_l]);
                    intensity = this.ComputeLighting(lights, vertex, normal, camera, x, y);
                }
                
                let u, v;
                if(accurarity){
                    u = uscan[x - x_l] / depth;
                    v = vscan[x - x_l] / depth;
                }
                else{
                    u = uscan[x - x_l];
                    v = vscan[x - x_l];
                }

                if(texture == undefined){
                    canvas.PutPixel(x, y, depth, Color.MultiplyScalar(vertices[triangle.index[index[0]]].color, intensity));
                }
                else{
                    let color = texture.GetTexel(u, v);
                    // let color = wood_texture.GetBillinearTexel(u, v);
                    canvas.PutPixel(x, y, depth, Color.MultiplyScalar(color, intensity));
                }
            }
        }
    }

    UnProjectVertex(x, y, iz, camera, canvas) {
        let c2v = canvas.CanvasToViewport(x, y);
        // let z = 1 / iz;
        // let ux = c2v.x * iz / camera.d;
        // let uy = c2v.y * iz / camera.d;
        // return new Vector3(ux, uy, oz);
        let temp = camera.UnProjectVertex(c2v, iz);
        // console.log(x, y, 1 / iz, "\n", c2v, "\n", temp);
        return temp;
    }

    BasicInterfolate(i0, d0, i1, d1){
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
    Interpolate(i0, d0, i1, d1){
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
    InterpolateTriangle(y0, v0, y1, v1, y2, v2) {
        let v01 = this.Interpolate(y0, v0, y1, v1);
        let v12 = this.Interpolate(y1, v1, y2, v2);
        let v02 = this.Interpolate(y0, v0, y2, v2);
        v01.pop();
        let v012 = v01.concat(v12);
        return [v02, v012];
    }
    InterpolateFloat(i0, d0, i1, d1){
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
    InterpolateFloatTriangle(y0, v0, y1, v1, y2, v2) {
        let v01 = this.InterpolateFloat(y0, v0, y1, v1);
        let v12 = this.InterpolateFloat(y1, v1, y2, v2);
        let v02 = this.InterpolateFloat(y0, v0, y2, v2);
        v01.pop();
        let v012 = v01.concat(v12);
        return [v02, v012];
    }

    ComputeLighting(lights, vertex, normal, camera){
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
                    var cameraMatrix = camera.GetMatrix();
                    vl = Vector3.Minus(cameraMatrix.MultiplyVector3(light.position), vertex).Normalized();
                }
                
                // Diffuse
                let dot = Vector3.Dot(vl, normal.Normalized());
                if(dot > 0){
                    illumination += dot * light.intensity;
                }
                // console.log(
                //     "lightPos:", cameraMatrix.MultiplyVector3(light.position), 
                //     "\nlightDir:", Vector3.Minus(cameraMatrix.MultiplyVector3(light.position), vertex), 
                //     "\ndot:", dot, 
                // )
                
                // Specular
                let reflected = this.Reflect(vl, normal).Normalized();
                let rdotv = Vector3.Dot(reflected, Vector3.Minus(new Vector3(0, 0, 0), vertex).Normalized());
                if(rdotv > 0){
                    let specular = 50;
                    illumination += Math.pow(rdotv, specular) * light.intensity;
                }
                // console.log(vl, normal)
                // console.log(
                //     "x, y:", x, y, 
                //     "\nvertex:", vertex, 
                //     "\nlightPos", cameraMatrix.MultiplyVector3(light.position), 
                //     "\nlightDir",  Vector3.Minus(cameraMatrix.MultiplyVector3(light.position), vertex), 
                //     "\nnormal:", normal, 
                //     "\nintensity:", illumination
                //     )
            }
        }
    
        return illumination;
    }
    
    Reflect(direction, normal) {
        return Vector3.Minus(
                    Vector3.MultiplyScalar(normal, 2 * Vector3.Dot(normal, direction)), 
                    direction
                );
    }
}