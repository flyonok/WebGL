"use strict";

var canvas;
var gl;
var points;
var redraw = false;
var stop = false;
var i;
var vertices = [
    vec3(-0.5, -0.5, -0.5),
    vec3(0.5, -0.5, -0.5),
    vec3(0.0, 0.5, 0.0),
    vec3(0.0, -0.5, 0.5),
];
var NumPoints = 5000;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the vertices of our 3D gasket

    


    points = [vec3(0.0, 0.0, 0.0)];
    

    canvas.addEventListener("mousedown", (event) => {
        console.log('mousedown');
        if (event.button === 0) {
            redraw = true;
            stop = false;
            render();
        } else if (event.button === 1) {
            redraw = false;
        } else if (event.button === 2) {
            stop = true;
            render();
        }
        

    });


    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    

};


function render() {
    
    if (redraw && !stop) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        points = [vec3(0.0, 0.0, 0.0)];
        for (i = 0; points.length < NumPoints; ++i) {
            var j = Math.floor(Math.random() * 4);

            points.push(mix(points[i], vertices[j], 0.5));
        }
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
        gl.drawArrays(gl.POINTS, 0, points.length);
        window.requestAnimationFrame(render);
    } else if (stop) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

}
