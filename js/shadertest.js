//========================dat.gui=======================

var Ctrl2d = function() {
    this.x = 100;
    this.y = 100;
    this.rotate = 0.0;
    this.scalex = 1.0;
    this.scaley = 1.0;
}
var ctrl2d;
var gl2d;
var matrixLocation2d;
var Ctrl3d = function() {
    this.f = 0.0;
    this.x = 0;
    this.y = 0;
    this.z = -500;
    this.rx = 222;
    this.ry = 127;
    this.rz = 0;
    this.sx = 1;
    this.sy = 1;
    this.sz = 1;
    this.fieldOfViewRadians = degToRad(60);
}
var ctrl3d;
var gl3d;
var matrixLocation3d;
var fieldOfViewRadians3d;
window.onload = function() {
    ctrl2d = new Ctrl2d();
    var gui = new dat.GUI();
    var folder1 = gui.addFolder('2d');
    var ex = folder1.add(ctrl2d, 'x', 0, 500);
    var ey = folder1.add(ctrl2d, 'y', 0, 500);
    var er = folder1.add(ctrl2d, 'rotate', -360, 360);
    var esx = folder1.add(ctrl2d, 'scalex', -1.0, 1.0);
    var esy = folder1.add(ctrl2d, 'scaley', -1.0, 1.0);
    // ex.onFinishChange(do2dmatrix);
    // ey.onFinishChange(do2dmatrix);
    // er.onFinishChange(do2dmatrix);
    // esx.onFinishChange(do2dmatrix);
    // esy.onFinishChange(do2dmatrix);
    ex.onChange(do2dmatrix);
    ey.onChange(do2dmatrix);
    er.onChange(do2dmatrix);
    esx.onChange(do2dmatrix);
    esy.onChange(do2dmatrix);

    ctrl3d = new Ctrl3d();

    var folder2 = gui.addFolder('3d');
    var ex3d = folder2.add(ctrl3d, 'x', -500, 500);
    var ey3d = folder2.add(ctrl3d, 'y', -500, 500);
    var ez3d = folder2.add(ctrl3d, 'z', -500, 0);
    var erx3d = folder2.add(ctrl3d, 'rx', -360, 360);
    var ery3d = folder2.add(ctrl3d, 'ry', -360, 360);
    var erz3d = folder2.add(ctrl3d, 'rz', -360, 360);
    var esx3d = folder2.add(ctrl3d, 'sx', 0, 1);
    var esy3d = folder2.add(ctrl3d, 'sy', 0, 1);
    var esz3d = folder2.add(ctrl3d, 'sz', 0, 1);
    var efr3d = folder2.add(ctrl3d, 'fieldOfViewRadians', degToRad(0), degToRad(180));

    ex3d.onChange(draw3dScene);
    ey3d.onChange(draw3dScene);
    ez3d.onChange(draw3dScene);
    erx3d.onChange(draw3dScene);
    ery3d.onChange(draw3dScene);
    erz3d.onChange(draw3dScene);
    esx3d.onChange(draw3dScene);
    esy3d.onChange(draw3dScene);
    esz3d.onChange(draw3dScene);
    efr3d.onChange(draw3dScene);

    //main
    main2d();
    // do2dmatrix();
    // main2dtexture();

    main3d();
}

function do2dmatrix() {
    // gl2d.clear(gl2d.COLOR_BUFFER_BIT);
    var translationMatrix = matrix2dTranslation(ctrl2d.x, ctrl2d.y);
    var rad = ctrl2d.rotate * Math.PI / 180;
    var rotationMatrix = matrix2dRotation(rad);
    var scaleMatrix = matrix2dScale(ctrl2d.scalex, ctrl2d.scaley);

    var matrix = matrixMultiply3x3(scaleMatrix, rotationMatrix);
    matrix = matrixMultiply3x3(matrix, translationMatrix);
    // console.log(matrix);

    gl2d.uniformMatrix3fv(matrixLocation2d, false, matrix);
    gl2d.drawArrays(gl2d.TRIANGLES, 0, 6);
}



//==================function================================
function resizeCanvasToDisplaySize(canvas) {
    multiplier = 1;
    var width = canvas.clientWidth * multiplier | 0;
    var height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}

function matrixMultiply3x3(l, r) {
    var m = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ];
    m[0] = l[0] * r[0] + l[1] * r[3] + l[2] * r[6];
    m[1] = l[0] * r[1] + l[1] * r[4] + l[2] * r[7];
    m[2] = l[0] * r[2] + l[1] * r[5] + l[2] * r[8];
    m[3] = l[3] * r[0] + l[4] * r[3] + l[5] * r[6];
    m[4] = l[3] * r[1] + l[4] * r[4] + l[5] * r[7];
    m[5] = l[3] * r[2] + l[4] * r[5] + l[5] * r[8];
    m[6] = l[6] * r[0] + l[7] * r[3] + l[8] * r[6];
    m[7] = l[6] * r[1] + l[7] * r[4] + l[8] * r[7];
    m[8] = l[6] * r[2] + l[7] * r[5] + l[8] * r[8];
    return m;
}

function matrixMultiply4x4(l, r) {
    var m = [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ];
    m[0] = l[0] * r[0] + l[1] * r[4] + l[2] * r[8] + l[3] * r[12];
    m[1] = l[0] * r[1] + l[1] * r[5] + l[2] * r[9] + l[3] * r[13];
    m[2] = l[0] * r[2] + l[1] * r[6] + l[2] * r[10] + l[3] * r[14];
    m[3] = l[0] * r[3] + l[1] * r[7] + l[2] * r[11] + l[3] * r[15];
    m[4] = l[4] * r[0] + l[5] * r[4] + l[6] * r[8] + l[7] * r[12];
    m[5] = l[4] * r[1] + l[5] * r[5] + l[6] * r[9] + l[7] * r[13];
    m[6] = l[4] * r[2] + l[5] * r[6] + l[6] * r[10] + l[7] * r[14];
    m[7] = l[4] * r[3] + l[5] * r[7] + l[6] * r[11] + l[7] * r[15];
    m[8] = l[8] * r[0] + l[9] * r[4] + l[10] * r[8] + l[11] * r[12];
    m[9] = l[8] * r[1] + l[9] * r[5] + l[10] * r[9] + l[11] * r[13];
    m[10] = l[8] * r[2] + l[9] * r[6] + l[10] * r[10] + l[11] * r[14];
    m[11] = l[8] * r[3] + l[9] * r[7] + l[10] * r[11] + l[11] * r[15];
    m[12] = l[12] * r[0] + l[13] * r[4] + l[14] * r[8] + l[15] * r[12];
    m[13] = l[12] * r[1] + l[13] * r[5] + l[14] * r[9] + l[15] * r[13];
    m[14] = l[12] * r[2] + l[13] * r[6] + l[14] * r[10] + l[15] * r[14];
    m[15] = l[12] * r[3] + l[13] * r[7] + l[14] * r[11] + l[15] * r[15];
    return m;
}

function createShader(gl, sourceCode, type) {
    // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
    var shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var info = gl.getShaderInfoLog(shader);
        throw "Could not compile WebGL program. \n\n" + info;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);


    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw ("program filed to link:" + gl.getProgramInfoLog(program));
    }

    return program;
}

function matrix2dTranslation(tx, ty) {
    return [
        1, 0, 0,
        0, 1, 0,
        tx, ty, 1
    ];
}

function matrix2dRotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
        c, -s, 0,
        s, c, 0,
        0, 0, 1
    ];
}

function matrix2dScale(sx, sy) {
    return [
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1
    ];
}

function matrix3dTranslation(tx, ty, tz) {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1
    ];
}

function matrix3dXRotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1
    ];
};

function matrix3dYRotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1
    ];
};

function matrix3dZRotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
        c, s, 0, 0, -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];
}

function matrix3dScale(sx, sy, sz) {
    return [
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1,
    ];
}

function makePerspective(fieldOfViewInRadians, aspect, near, far) {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);

    return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0
    ];
};

function radToDeg(r) {
    return r * 180 / Math.PI;
}

function degToRad(d) {
    return d * Math.PI / 180;
}

//====================3d============================
var sv3dsource = `
attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}
`
var sf3dsource = `
precision mediump float;
varying vec4 v_color;

void main() {
   gl_FragColor = v_color;
}
`

function main3d() {
    var canvas = document.getElementById("webgl3d");
    var gl = canvas.getContext("webgl");

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    var sv3d = createShader(gl, sv3dsource, gl.VERTEX_SHADER);
    var sf3d = createShader(gl, sf3dsource, gl.FRAGMENT_SHADER);

    var program = createProgram(gl, sv3d, sf3d);
    gl.useProgram(program);

    var positionLocation = gl.getAttribLocation(program, "a_position");
    var colorLocation = gl.getAttribLocation(program, "a_color");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    set3dGeometry(gl);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(colorLocation);

    // We'll supply RGB as bytes.
    gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);
    set3dColors(gl);

    var translation = [-150, 0, -360];
    var rotation = [degToRad(190), degToRad(40), degToRad(320)];
    var scale = [1, 1, 1];
    var fieldOfViewRadians = degToRad(60);

    gl3d = gl;
    matrixLocation3d = matrixLocation;
    ctrl3d.fieldOfViewRadians = fieldOfViewRadians;

    draw3dScene();
}

function set3dGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            //xy0
            -75,-75,-75,
            -75,75,-75,
            75,-75,-75,
            75,-75,-75,
            -75,75,-75,
            75,75,-75,
            //xz1
            75,75,-75,            
            -75,75,-75,
            -75,75,75,
            -75,75,75,
            75,75,75,
            75,75,-75,
            //yz0
            -75,75,-75,
            -75,-75,-75,
            -75,-75,75,
            -75,-75,75,
            -75,75,75,
            -75,75,-75,
            //xz0
            -75,-75,75,
            -75,-75,-75,
            75,-75,-75,
            75,-75,-75,
            75,-75,75,
            -75,-75,75,
            //yz1
            75,-75,-75,
            75,75,-75,
            75,-75,75,
            75,-75,75,
            75,75,-75,
            75,75,75,
            //xy1
            -75,-75,75,
            75,-75,75,
            -75,75,75,
            -75,75,75,
            75,-75,75,
            75,75,75,
            
     
        ]),
        gl.STATIC_DRAW);
}

function set3dColors(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Uint8Array([


            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,

            80, 210, 100,
            80, 210, 100,
            80, 210, 100,
            80, 210, 100,
            80, 210, 100,
            80, 210, 100,

            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,

            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,

            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,

            70, 100, 210,
            70, 100, 210,
            70, 100, 210,
            70, 100, 210,
            70, 100, 210,
            70, 100, 210

        ]),
        gl.STATIC_DRAW);
}

function draw3dScene() {
    resizeCanvasToDisplaySize(gl3d.canvas);

    gl3d.viewport(0, 0, gl3d.canvas.width, gl3d.canvas.height);

    gl3d.clear(gl3d.COLOR_BUFFER_BIT | gl3d.DEPTH_BUFFER_BIT);

    var aspect = gl3d.canvas.clientWidth / gl3d.canvas.clientHeight;
    var projectionMatrix =
        makePerspective(ctrl3d.fieldOfViewRadians, aspect, 1, 2000);
    var translationMatrix =
        matrix3dTranslation(ctrl3d.x, ctrl3d.y, ctrl3d.z);
    var rotationXMatrix = matrix3dXRotation(degToRad(ctrl3d.rx));
    var rotationYMatrix = matrix3dYRotation(degToRad(ctrl3d.ry));
    var rotationZMatrix = matrix3dZRotation(degToRad(ctrl3d.rz));
    var scaleMatrix = matrix3dScale(ctrl3d.sx, ctrl3d.sy, ctrl3d.sz);

    var matrix = matrixMultiply4x4(scaleMatrix, rotationZMatrix);
    matrix = matrixMultiply4x4(matrix, rotationYMatrix);
    matrix = matrixMultiply4x4(matrix, rotationXMatrix);
    matrix = matrixMultiply4x4(matrix, translationMatrix);
    matrix = matrixMultiply4x4(matrix, projectionMatrix);
    // console.log(matrix);

    gl3d.uniformMatrix4fv(matrixLocation3d, false, matrix);

    gl3d.drawArrays(gl3d.TRIANGLES, 0, 6 * 6);
}
//====================2d============================
var sv2dsource = `
attribute vec2 a_position;

uniform vec2 u_resolution;
uniform mat3 u_matrix;
varying vec4 v_color;

void main() {
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;
  vec2 zeroToOne = position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  v_color = gl_Position * 0.5 + 0.5;
}
`
var sf2dsource = `
precision mediump float;
varying vec4 v_color;
void main() { 
    // gl_FragColor = vec4(0, 1, 0, 1);  
    gl_FragColor=v_color;
}
`

function main2d() {
    var canvas = document.getElementById("webgl2d");
    var gl = canvas.getContext("webgl");

    var sv2d = createShader(gl, sv2dsource, gl.VERTEX_SHADER);
    var sf2d = createShader(gl, sf2dsource, gl.FRAGMENT_SHADER);

    var program = createProgram(gl, sv2d, sf2d);
    gl.useProgram(program);

    var positionLocation = gl.getAttribLocation(program, "a_position");
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            0, 0,
            300, 0,
            0, 300,
            0, 300,
            300, 0,
            300, 300
        ]),
        gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl2d = gl;
    matrixLocation2d = matrixLocation;
    var translationMatrix = matrix2dTranslation(ctrl2d.x, ctrl2d.y);
    var rad = ctrl2d.rotate * Math.PI / 180;
    var rotationMatrix = matrix2dRotation(rad);
    var scaleMatrix = matrix2dScale(ctrl2d.scalex, ctrl2d.scaley);

    var matrix = matrixMultiply3x3(scaleMatrix, rotationMatrix);
    matrix = matrixMultiply3x3(matrix, translationMatrix);
    // console.log(matrix);

    gl2d.uniformMatrix3fv(matrixLocation2d, false, matrix);
    gl2d.drawArrays(gl2d.TRIANGLES, 0, 6);

}


//==============2dtexture============================
var sv2dtexsource = `
uniform mat3 u_matrix;
attribute vec2 a_position;
uniform vec2 u_resolution;
varying vec2 v_color;

void main() {
    vec2 position = (u_matrix * vec3(a_position, 1)).xy;
   vec2 zeroToOne = position / u_resolution;
   vec2 zeroToTwo = zeroToOne * 2.0;
   vec2 clipSpace = zeroToTwo - 1.0;

   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
   v_color = clipSpace;
}

`
var sf2dtexsource = `
precision mediump float;
uniform sampler2D u_image;
varying vec2 v_color;
 
void main() {
   gl_FragColor = texture2D(u_image, v_color);
}
`

function main2dtexture() {

    var image = new Image();
    image.src = './img/head.jpg';
    image.onload = function() {
        render(image);
    }

    function render(image) {
        var canvas = document.getElementById("webgl2d");
        var gl = canvas.getContext("webgl");
        var sv2d = createShader(gl, sv2dtexsource, gl.VERTEX_SHADER);
        var sf2d = createShader(gl, sf2dtexsource, gl.FRAGMENT_SHADER);

        var program = createProgram(gl, sv2d, sf2d);
        gl.useProgram(program);

        var positionLocation = gl.getAttribLocation(program, "a_position");
        var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
        var matrixLocation = gl.getUniformLocation(program, "u_matrix");
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                0, 0,
                300, 0,
                0, 300,
                0, 300,
                300, 0,
                300, 300
            ]),
            gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl2d = gl;
        matrixLocation2d = matrixLocation;
        var translationMatrix = matrix2dTranslation(ctrl2d.x, ctrl2d.y);
        var rad = ctrl2d.rotate * Math.PI / 180;
        var rotationMatrix = matrix2dRotation(rad);
        var scaleMatrix = matrix2dScale(ctrl2d.scalex, ctrl2d.scaley);

        var matrix = matrixMultiply3x3(scaleMatrix, rotationMatrix);
        matrix = matrixMultiply3x3(matrix, translationMatrix);
        // console.log(matrix);

        gl2d.uniformMatrix3fv(matrixLocation2d, false, matrix);
        gl2d.drawArrays(gl2d.TRIANGLES, 0, 6);

    }
}