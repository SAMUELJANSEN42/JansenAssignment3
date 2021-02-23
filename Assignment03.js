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

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(.9, .9, .9, 1.0);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //note that this is no longer a local variable (removed the "var")
    vertices = [
        vec2(0, 0.25),
        vec2(-0.25, 0),
        vec2(0.25, 0),
        vec2(0, -0.25)
    ];
    
    verticesTriangle = [
        vec2(.6, .6),
        vec2(1, .6),
        vec2(.8, 1)
    ];


    // establish shaders and uniform variables
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    thetaLoc = gl.getUniformLocation(program, "uTheta");
    programTriangle = initShaders(gl, "vertex-shader-still", "fragment-shader");

    // Note we do not load the buffers in the init function 

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
