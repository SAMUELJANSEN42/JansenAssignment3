"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;

var vertices;
var verticesTriangle;
var program;
var programTriangle;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1.0);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vertices = [
        vec2(0, 0.25),
        vec2(-0.25, 0),
        vec2(0.25, 0),
        vec2(0, -0.25)
    ];
    
    verticesTriangle = [
        vec2(.4, .2),
        vec2(1, .2),
        vec2(.4, .27),
        vec2(1, .2),
        vec2(1, .27),
        vec2(.4, .27)
    ];


    program = initShaders(gl, "vertex-shader", "fragment-shader");
    thetaLoc = gl.getUniformLocation(program, "uTheta");
    programTriangle = initShaders(gl, "vertex-shader-still", "fragment-shader");

    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    gl.useProgram(program);
   
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    theta += 0.0;
    gl.uniform1f(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.useProgram(programTriangle);
    
    var bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesTriangle), gl.STATIC_DRAW);

    var positionLoc2 = gl.getAttribLocation(programTriangle, "aPosition");
    gl.vertexAttribPointer(positionLoc2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc2);

    gl.drawArrays(gl.TRIANGLES, 0, verticesTriangle.length);

    requestAnimationFrame(render);
}
