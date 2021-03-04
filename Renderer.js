import Vector3 from "./Vector3.js";
import Color from "./Color.js";

export default class Renderer{
    static FLAT_LIGHTING = 1;
    static GOURAUD_LIGHTING = 2;
    static PHONG_LIGHTING = 3;

    constructor(lightingMode){
        this.LightingMode = lightingMode;
    }

    RenderModel(camera, canvas, target, lights){
        let projected = [];
        
        let cameraMatrix = camera.GetMatrix();
        let modelMatrix = target.GetMatrix();
        let matrix = cameraMatrix.Multiply4x4(modelMatrix);
        let center = matrix.MultiplyVector3(target.center);

        let model = target;
        // camera.PlaneClip(center, target);
        if(model == null){
            return;
        }
        
        let triangles = this.CullBackFace(model, matrix);
        model.triangles = triangles;
        console.log(model);
        
        for(let j = 0; j < model.vertices.length; ++j){
            projected.push(
                canvas.ViewportToCanvas(
                    camera.ProjectVertex(
                        matrix.MultiplyVector3(model.vertices[j].position)
                    )
                )
            );
        }

        for(let j = 0; j < model.triangles.length; ++j){
            this.DrawFillTriangle(model.triangles[j], model.vertices, projected, canvas, camera, lights, matrix, model.texture);
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

    RenderTriangle(triangle, projected, vertices, normals){
        this.DrawFillTriangle(
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
        DrawLine(P0, P1, color);
        DrawLine(P1, P2, color);
        DrawLine(P2, P0, color);
    }
    
    DrawFillTriangle(triangle, vertices, projected, canvas, camera, lights, matrix, texture){
        let index = [0, 1, 2];
        // if(pvertices[index[1]].y < pvertices[index[1]].y) { let temp2 = index[0]; index[0] = index[1]; index[1] = temp2; }
        // if(pvertices[index[2]].y < pvertices[index[0]].y) { let temp2 = index[0]; index[0] = index[2]; index[2] = temp2; }
        // if(pvertices[index[2]].y < pvertices[index[1]].y) { let temp2 = index[1]; index[1] = index[2]; index[2] = temp2; }
        if(projected[triangle.index[1]].y < projected[triangle.index[0]].y)
        {
            let swap = triangle.index[0]; triangle.index[0] = triangle.index[1]; triangle.index[1] = swap;
            let swap2 = index[0]; index[0] = index[1]; index[1] = swap2;
        }
        if(projected[triangle.index[2]].y < projected[triangle.index[0]].y)
        {
            let swap = triangle.index[0]; triangle.index[0] = triangle.index[2]; triangle.index[2] = swap;
            let swap2 = index[0]; index[0] = index[2]; index[2] = swap2;
        }
        if(projected[triangle.index[2]].y < projected[triangle.index[1]].y)
        {
            let swap = triangle.index[2]; triangle.index[2] = triangle.index[1]; triangle.index[1] = swap;
            let swap2 = index[2]; index[2] = index[1]; index[1] = swap2;
        }
    
        // let x01 = this.InterpolateFloatTriangle(
        //     projected[triangle.index[0]].y, projected[triangle.index[0]].x, 
        //     projected[triangle.index[1]].y, projected[triangle.index[1]].x
        //     ); 
        // let x12 = this.InterpolateFloatTriangle(
        //     projected[triangle.index[1]].y, projected[triangle.index[1]].x, 
        //     projected[triangle.index[2]].y, projected[triangle.index[2]].x
        //     );
        // let x02 = this.InterpolateFloatTriangle(
        //     projected[triangle.index[0]].y, projected[triangle.index[0]].x, 
        //     projected[triangle.index[2]].y, projected[triangle.index[2]].x
        //     );

        // let [x02, x012] = EdgeInterpolate(p0.y, p0.x, p1.y, p1.x, p2.y, p2.x);
        // let [iz02, iz012] = EdgeInterpolate(p0.y, 1.0/v0.z, p1.y, 1.0/v1.z, p2.y, 1.0/v2.z);
        let x02, x012;
        [x02, x012] = this.InterpolateTriangle(
            projected[triangle.index[0]].y, projected[triangle.index[0]].x, 
            projected[triangle.index[1]].y, projected[triangle.index[1]].x, 
            projected[triangle.index[2]].y, projected[triangle.index[2]].x
        );
    
        // let h01 = InterpolateFloat(P0.y, P0.x, P1.y, P1.x);
        // let h12 = InterpolateFloat(P1.y, P1.x, P2.y, P2.x);
        // let h02 = InterpolateFloat(P0.y, P0.x, P2.y, P2.x);
    
        // let z01 = this.InterpolateFloat(
        //     projected[triangle.index[0]].y, projected[triangle.index[0]].z, 
        //     projected[triangle.index[1]].y, projected[triangle.index[1]].z
        //     );
        // let z12 = this.InterpolateFloat(
        //     projected[triangle.index[1]].y, projected[triangle.index[1]].z, 
        //     projected[triangle.index[2]].y, projected[triangle.index[2]].z
        //     );
        // let z02 = this.InterpolateFloat(
        //     projected[triangle.index[0]].y, projected[triangle.index[0]].z, 
        //     projected[triangle.index[2]].y, projected[triangle.index[2]].z
        //     );
        let z02, z012;
        [z02, z012] = this.InterpolateFloatTriangle(
            projected[triangle.index[0]].y, 1 / projected[triangle.index[0]].z, 
            projected[triangle.index[1]].y, 1 / projected[triangle.index[1]].z, 
            projected[triangle.index[2]].y, 1 / projected[triangle.index[2]].z
        );
            
        // for uv
        let accurarity = true;
        let u02, u012, v02, v012;
        if(!accurarity){
            [u02, u012] = this.InterpolateFloatTriangle(
                projected[triangle.index[0]].y, vertices[triangle.index[0]].uv.x,
                projected[triangle.index[1]].y, vertices[triangle.index[1]].uv.x,
                projected[triangle.index[2]].y, vertices[triangle.index[2]].uv.x
                );
            [v02, v012] = this.InterpolateFloatTriangle(
                projected[triangle.index[0]].y, vertices[triangle.index[0]].uv.y,
                projected[triangle.index[1]].y, vertices[triangle.index[1]].uv.y,
                projected[triangle.index[2]].y, vertices[triangle.index[2]].uv.y
                );
        }
        else{
            [u02, u012] = this.InterpolateFloatTriangle(
                projected[triangle.index[0]].y, vertices[triangle.index[0]].uv.x / matrix.MultiplyVector3(vertices[triangle.index[0]].position).z,
                projected[triangle.index[1]].y, vertices[triangle.index[1]].uv.x / matrix.MultiplyVector3(vertices[triangle.index[1]].position).z,
                projected[triangle.index[2]].y, vertices[triangle.index[2]].uv.x / matrix.MultiplyVector3(vertices[triangle.index[2]].position).z
                );
            [v02, v012] = this.InterpolateFloatTriangle(
                projected[triangle.index[0]].y, vertices[triangle.index[0]].uv.y / matrix.MultiplyVector3(vertices[triangle.index[0]].position).z,
                projected[triangle.index[1]].y, vertices[triangle.index[1]].uv.y / matrix.MultiplyVector3(vertices[triangle.index[1]].position).z,
                projected[triangle.index[2]].y, vertices[triangle.index[2]].uv.y / matrix.MultiplyVector3(vertices[triangle.index[2]].position).z
                );
        }
        
        let color2 = Color.Random();
        // console.log(vertices[triangle.index[0]], vertices[triangle.index[1]], vertices[triangle.index[2]], color2)
        // console.log(
        //     modelMatrix.MultiplyVector3(vertices[triangle.index[0]].position).z, 
        //     modelMatrix.MultiplyVector3(vertices[triangle.index[1]].position).z, 
        //     modelMatrix.MultiplyVector3(vertices[triangle.index[2]].position).z
        // )
        // console.log(
        //     vertices[triangle.index[0]].uv, 
        //     vertices[triangle.index[1]].uv, 
        //     vertices[triangle.index[2]].uv
        // )
        // console.log(u02, u012, v02, v012, z02, z012);
        
        // let iz02, iz012;
        // [iz02, iz012] = this.InterpolateTriangle(
        //     pvertices[index[0]].y, 1 / vertices[index[0]].z, 
        //     pvertices[index[1]].y, 1 / vertices[index[1]].z, 
        //     pvertices[index[2]].y, 1 / vertices[index[2]].z
        // );
    
        // // for lighting
        // let normal0 = (normals[triangle.index[0]]);
        // let normal1 = (normals[triangle.index[1]]);
        // let normal2 = (normals[triangle.index[2]]);
    
        let intensity = 0;
        let i02 = [], i012 = [];
        let nx02, nx012, ny02, ny012, nz02, nz012;
        switch(this.LightingMode){
            case Renderer.FLAT_LIGHTING:
                let center = new Vector3(
                    (vertices[triangle.index[0]].position.x + vertices[triangle.index[1]].position.x + vertices[triangle.index[2]].position.x) / 3.0, 
                    (vertices[triangle.index[0]].position.y + vertices[triangle.index[1]].position.y + vertices[triangle.index[2]].position.y) / 3.0, 
                    (vertices[triangle.index[0]].position.z + vertices[triangle.index[1]].position.z + vertices[triangle.index[2]].position.z) / 3.0, 
                );
                intensity = this.ComputeLighting(lights, center, vertices[triangle.index[0]].normal, camera);
            break;
            case Renderer.GOURAUD_LIGHTING:
                let i0 = this.ComputeLighting(lights, vertices.position[triangle.index[0]], triangle.normal[triangle.index[0]], camera);
                let i1 = this.ComputeLighting(lights, vertices.position[triangle.index[1]], triangle.normal[triangle.index[1]], camera);
                let i2 = this.ComputeLighting(lights, vertices.position[triangle.index[2]], triangle.normal[triangle.index[2]], camera);
                [i02, i012] = this.InterpolateFloatTriangle(
                    projected[triangle.index[0]].y, i0, 
                    projected[triangle.index[1]].y, i1, 
                    projected[triangle.index[2]].y, i2
                    );
            break;
            case Renderer.PHONG_LIGHTING:
                [nx02, nx012] = this.InterpolateFloatTriangle(
                    projected[triangle.index[0]].y, triangle.normal[triangle.index[0]].x, 
                    projected[triangle.index[1]].y, triangle.normal[triangle.index[1]].x, 
                    projected[triangle.index[2]].y, triangle.normal[triangle.index[2]].x
                    );
                [ny02, ny012] = this.InterpolateFloatTriangle(
                    projected[triangle.index[0]].y, triangle.normal[triangle.index[0]].y, 
                    projected[triangle.index[1]].y, triangle.normal[triangle.index[1]].y, 
                    projected[triangle.index[2]].y, triangle.normal[triangle.index[2]].y
                    );
                [nz02, nz012] = this.InterpolateFloatTriangle(
                    projected[triangle.index[0]].y, triangle.normal[triangle.index[0]].z, 
                    projected[triangle.index[1]].y, triangle.normal[triangle.index[1]].z, 
                    projected[triangle.index[2]].y, triangle.normal[triangle.index[2]].z
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
            // [h_left, h_right] = [h02, h012];
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
            // [h_left, h_right] = [h012, h02];
            [z_left, z_right] = [z012, z02];
            [i_left, i_right] = [i012, i02];
    
            [nx_left, nx_right] = [nx012, nx02];
            [ny_left, ny_right] = [ny012, ny02];
            [nz_left, nz_right] = [nz012, nz02];
    
            [u_left, u_right] = [u012, u02];
            [v_left, v_right] = [v012, v02];
        }
        // console.log(x_left, x_right);
    
        for(let y = projected[triangle.index[0]].y; y < projected[triangle.index[2]].y; ++y){
            let x_l = x_left[y - projected[triangle.index[0]].y];
            let x_r = x_right[y - projected[triangle.index[0]].y];
            
            // let h_segment = InterpolateFloat(x_l, h_left[y - P0.y], x_r, h_right[y - P0.y]);
            let zscan = this.InterpolateFloat(
                x_l, z_left[y - projected[triangle.index[0]].y], 
                x_r, z_right[y - projected[triangle.index[0]].y]
                );
            // let iz_segment = this.InterpolateFloat(
            //     x_l, iz_left[y - projected[triangle.index[0]].y], 
            //     x_r, iz_right[y - projected[triangle.index[0]].y]
            //     );
    
            let il, ir, iscan;
            let nxl, nxr, nyl, nyr, nzl, nzr;
            let nxscan, nyscan, nzscan;
            if(this.LightingMode == Renderer.GOURAUD_LIGHTING){
                [il, ir] = [i_left[y - projected[triangle.index[0]].y], i_right[y - projected[triangle.index[0]].y]];
                iscan = this.InterpolateFloat(x_l, il, x_r, ir);
            }
            else if(this.LightingMode == Renderer.PHONG_LIGHTING){
                [nxl, nxr] = [nx_left[y - projected[triangle.index[0]].y], nx_right[y - projected[triangle.index[0]].y]];
                [nyl, nyr] = [ny_left[y - projected[triangle.index[0]].y], ny_right[y - projected[triangle.index[0]].y]];
                [nzl, nzr] = [nz_left[y - projected[triangle.index[0]].y], nz_right[y - projected[triangle.index[0]].y]];
    
                nxscan = this.InterpolateFloat(x_l, nxl, x_r, nxr);
                nyscan = this.InterpolateFloat(x_l, nyl, x_r, nyr);
                nzscan = this.InterpolateFloat(x_l, nzl, x_r, nzr);
            }
    
            let uscan = this.InterpolateFloat(
                x_l, u_left[y - projected[triangle.index[0]].y], 
                x_r, u_right[y - projected[triangle.index[0]].y]
                );
            let vscan = this.InterpolateFloat(
                x_l, v_left[y - projected[triangle.index[0]].y], 
                x_r, v_right[y - projected[triangle.index[0]].y]
                );
            // console.log(vscan)
    
            for(let x = x_l; x < x_r; ++x){
                // let mul = h_segment[x - x_l];
                let depth = zscan[x - x_l];
                // let shaded_color = new Color(
                //     color.r * mul, 
                //     color.g * mul, 
                //     color.b * mul, 
                //     255
                // );
    
                if(this.LightingMode == Renderer.GOURAUD_LIGHTING){
                    intensity = iscan[x - x_l];
                }
                else if(this.LightingMode == Renderer.PHONG_LIGHTING){
                    let vertex = UnProjectVertex(x, y, depth);
                    let normal = new Vector3(nxscan[x - x_l], nyscan[x - x_l], nzscan[x - x_l]);
                    intensity = this.ComputeLighting(lights, vertex, normal, camera);
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
                // console.log(x, y, u, v);
                let color = texture.GetTexel(u, v);
                // let color = wood_texture.GetBillinearTexel(u, v);
                // console.log(x, y, u, v, color);
                // if(color.x == undefined){
                //     console.log(x, y, u, v, color)
                // }
                // else
                    canvas.PutPixel(x, y, depth, color);
            }
        }
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
                    let lightMatrix = light.GetMatrix();
                    let cameraMatrix = camera.GetMatrix();
                    let matrix = cameraMatrix.Multiply4x4(lightMatrix);
                    vl = (Vector3.Minus(matrix.MultiplyVector3(light.position), vertex).Normalized());
                }
    
                // Diffuse
                let dot = Vector3.Dot(vl, normal.Normalized());
                if(dot > 0){
                    illumination += dot * light.intensity;
                }
    
                // Specular
                let reflected = this.Reflect(vl, normal).Normalized();
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
    
    Reflect(direction, normal) {
        return Vector3.Minus(
                    Vector3.MultiplyScalar(normal, 2 * Vector3.Dot(normal, direction)), 
                    direction
                );
    }
}