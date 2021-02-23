//author: your name here
//date:
//description: provide a brief description of your program
//proposed points (out of 10): a description of the number
//of points you believe your assignment is worth

"use strict";

var canvas;
var gl;
let colors;

var theta = 0.0;
var thetaLoc;
var dx = 0.01;
var dxLoc;
var dy = 0.01;
var dyLoc;

var vertices;
var verticesTriangle;
var program;
var programTriangle;
var direction = true;
var speed = 0.1
var goingright = true;
var goingup = true;
var freeze = true;


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
        vec2(.4, .27),
        vec2(.4, .2),
        vec2(1, .2),
        vec2(.7, .0),
        vec2(.85, .2),
        vec2(1, .2),
        vec2(1, .7),
        vec2(.85, .2),
        vec2(1, .7),
        vec2(.85, .7)
    ];


    program = initShaders(gl, "vertex-shader", "fragment-shader");
    thetaLoc = gl.getUniformLocation(program, "uTheta");
    dxLoc = gl.getUniformLocation(program, "udx");
    dyLoc = gl.getUniformLocation(program, "udy");
    programTriangle = initShaders(gl, "vertex-shader-still", "fragment-shader");

    document.getElementById("slider").onclick = function(event){
        speed = parseFloat(event.target.value);
        console.log("slider!!!", speed)
    }
    document.getElementById("Direction").onclick = function(){
        console.log("pressed button");
        direction = !direction;
    }
    document.getElementById("Controls").onclick = function(event){
        switch(event.target.index){
            case 0:
                freeze = !freeze;
                break;
            case 1:
                freeze = true;
        }
    }
    window.onkeydown = function(event){
        var key = String.fromCharCode(event.keyCode);
        switch (key ){
            case 'A': 
            case 'a':
                dx +=0.1
                break;
            case 'S':
            case 's':
                dy +=0.1
                break;
            case 'D':
            case 'd':
                dx -=0.1
                break;
            case 'F':
            case 'f':
                dy -=0.1
                break;
            
        }
        };
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
    if(freeze){
    if (direction==true){
        theta += speed;  
    }
    else{
        theta -= speed;
    }
    if (Math.abs(dx) > 0.75){
        goingup = !goingup
    }
    if(goingup == true){
        dy += 0.01;  
    }
    else{
        dy -= 0.01;
    }
    if (Math.abs(dx) > 0.75){
        goingright = !goingright
    }
    if(goingright == true){
        dx += 0.01;  
    }
    else{
        dx -= 0.01;
    }
    }
    else{
        dx = 0;
        dy = 0;
    }
    gl.uniform1f(dyLoc, dy);
    gl.uniform1f(dxLoc, dx);
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
