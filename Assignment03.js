//author: Samuel Jansen
//date: Tuesday Febuary 23th, 2021
//description: This program creates an animation of a basketball 
//                          and a hoop with the user having the 
//                          abililty to control the ball in many ways
//proposed points (out of 10):10/10 I completed all five steps to get 
//                                  all 10 points on this assignemt not only 
//                                  that but I also put lots of work into the animation.

"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;
var dx = 0.01;      //varibles to control motion
var dxLoc;
var dy = 0.01;
var dyLoc;

var vertices;
var vertices1;
var vertices2;          //varibles to control shaders both fragment and vertex
var verticesTriangle;

var program;
var program1;
var program2;           //varibles that are untilzed in the buffers
var programTriangle;

var direction = true;
var speed = 0.1
var goingright = true;      //animation control varibles
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
        vec2(-0.25, 0),     //verticles for the sqaure
        vec2(0.25, 0),
        vec2(0, -0.25)
    ];
    
    verticesTriangle = [
        vec2(.85, .2),
        vec2(1, .7),        //verticles for the hoop triangles
        vec2(1, .2),
        vec2(.85, .2),
        vec2(1, .7),
        vec2(.85, .7),
    ];

    vertices1 = [
        vec2(1, .2),
        vec2(.4, .2),
        vec2(.4, .27),          //verticles for the hoop triangles
        vec2(1, .2),
        vec2(1, .27),
        vec2(.4, .27),
    ];

    vertices2 = [
        vec2(.4, .2),       //verticles for the hoop triangles
        vec2(1, .2),
        vec2(.7, .0),
    ];
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    program1 = initShaders(gl, "vertex-shader-still", "fragment-shader_1");
    program2 = initShaders(gl, "vertex-shader-still", "fragment-shader_2");
    programTriangle = initShaders(gl, "vertex-shader-still", "fragment-shader");
    //intializes the vertex and fragment shaders and buffer varibles

    thetaLoc = gl.getUniformLocation(program, "uTheta");
    dxLoc = gl.getUniformLocation(program, "udx");
    dyLoc = gl.getUniformLocation(program, "udy");
    

    document.getElementById("slider").onclick = function(event){
        speed = parseFloat(event.target.value);
        console.log("slider!!!", speed)
        //communicates with the html slide function
    }
    document.getElementById("Direction").onclick = function(){
        console.log("pressed button");
        direction = !direction;
        //communicates with the html button function
    }
    document.getElementById("Controls").onclick = function(event){
        switch(event.target.index){
            case 0:
                freeze = !freeze;
                break;
            case 1:
                freeze = true;
                //communicates with the html menu function
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
            //allows for key presses to update and change the program
        }
        };
    render();
}; //render function


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    gl.useProgram(program);
   
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    //sets up the array buffers for the vertices and postions 
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
    } // this code controls the movement of the square around the screen
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
            //the uniforms varibles for the html code
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.useProgram(programTriangle);
    
    var bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesTriangle), gl.STATIC_DRAW);
    //second array buffer for the triangles
    var positionLoc2 = gl.getAttribLocation(programTriangle, "aPosition");
    gl.vertexAttribPointer(positionLoc2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc2);
    //draws the trianghles
    gl.drawArrays(gl.TRIANGLES, 0, verticesTriangle.length);

    gl.useProgram(program1);
    
    var bufferId3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices1), gl.STATIC_DRAW);

    var positionLoc3 = gl.getAttribLocation(program1, "aPosition");
    gl.vertexAttribPointer(positionLoc3, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc3);

    gl.drawArrays(gl.TRIANGLES, 0, vertices1.length);
    // the last two seconds intialize buffers for the other fragment shaders
    gl.useProgram(program2);
    
    var bufferId4 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId4);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW);

    var positionLoc4 = gl.getAttribLocation(program2, "aPosition");
    gl.vertexAttribPointer(positionLoc4, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc4);

    gl.drawArrays(gl.TRIANGLES, 0, vertices2.length);

    requestAnimationFrame(render);
}
