const canvas = document.getElementById("checkersCanvas");
const gl = canvas.getContext("webgl");

// 定义棋盘和棋子信息
const board = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
];

const tileSize = canvas.width / 8;
const canvasHalf = canvas.width / 2;
let selectedTile = null;

// 初始化着色器和缓冲区
const vertexShaderSource = `
  // 顶点着色器代码
  attribute vec2 position;

  void main() {

    gl_Position = vec4(position, 0.0, 1.0);
  }
`;
const fragmentShaderSource = `
    // 片元着色器代码
    precision mediump float;
    uniform vec4 u_color;

    void main() {
        gl_FragColor = u_color;
    }
`;

// 创建着色器程序
const shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(shaderProgram);

// 获取着色器中的属性和变量

const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "position");
const colorUniformLocation = gl.getUniformLocation(shaderProgram, "u_color");

// 设置点击事件处理程序
// canvas.addEventListener("click", (event) => {
//     const x = event.clientX - canvas.getBoundingClientRect().left;
//     const y = event.clientY - canvas.getBoundingClientRect().top;
//     const col = Math.floor(x / tileSize);
//     const row = Math.floor(y / tileSize);

//     if (selectedTile === null) {
//         if (board[row][col] === 1) {
//             selectedTile = { row, col };
//         }
//     } else {
//         // 在这里实现棋子移动和游戏规则
//         // 您需要处理棋子的合法移动、跳吃等情况
//         // 更新棋盘状态和检查胜利条件
//         // 如果游戏结束，弹出游戏结束提示
//         selectedTile = null;
//     }

//     drawBoard();
//     drawPieces();
// });

// 绘制棋盘
function drawBoard() {
    // 在这里使用 WebGL 绘制棋盘的网格
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const darkSquareColor = [0.5, 0.25, 0.0, 1.0];
    const lightSquareColor = [0.9, 0.7, 0.0, 1.0];
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const isDarkSquare = (row + col) % 2 === 0;
            const squareColor = isDarkSquare ? darkSquareColor : lightSquareColor;

            const x = col * tileSize - canvasHalf;
            const y = (7 - row) * tileSize - canvasHalf;

            // 使用 WebGL 绘制正方形
            drawSquare(x, y, tileSize, squareColor);
        }
    }
}

// 绘制正方形
function drawSquare(x, y, size, color) {
    // console.log(`color:${color}`);
    const vertices = new Float32Array([
        x / canvasHalf, y / canvasHalf,
        (x + size)/canvasHalf, y/canvasHalf,
        (x + size)/canvasHalf, (y + size)/canvasHalf,
        x/canvasHalf, y/canvasHalf,
        (x + size)/canvasHalf, (y + size)/canvasHalf,
        x/ canvasHalf, (y + size)/canvasHalf
    ]);

    // const colorBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // 启用顶点着色器属性
    gl.enableVertexAttribArray(positionAttributeLocation);

    // 告诉 WebGL 如何从位置缓冲区中提取数据
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // 绘制正方形
    gl.uniform4fv(colorUniformLocation, color);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// 绘制棋子
function drawPieces() {
    // 在这里使用 WebGL 绘制棋子
    const radius = tileSize * 0.4 / canvasHalf;
    const pieceColor = [0.0, 0.0, 0.0, 1.0]; // 黑色棋子
    const whiteColor = [1.0, 1.0, 1.0, 1.0]; // 白色

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === 1) {
                const x = col * tileSize + tileSize / 2 - canvasHalf;
                const y = (7 - row) * tileSize + tileSize / 2 - canvasHalf;

                // 使用 WebGL 绘制圆形棋子
                drawCircle( x / canvasHalf, y / canvasHalf, radius, pieceColor);
            }
            else if (board[row][col] === 2){
                const x = col * tileSize + tileSize / 2 - canvasHalf;
                const y = (7 - row) * tileSize + tileSize / 2 - canvasHalf;
                drawCircle( x/ canvasHalf, y / canvasHalf, radius, whiteColor);
            
            }
        }
    }
}

// 绘制圆形
function drawCircle(x, y, radius, color) {
    // 在这里使用 WebGL 绘制圆形
    const segments = 32; // 圆形近似所使用的三角形数量
    const angleIncrement = (2 * Math.PI) / segments;
    
    const vertices = [];

    for (let i = 0; i < segments; i++) {
        const angle = i * angleIncrement;
        const x1 = x + radius * Math.cos(angle);
        const y1 = y + radius * Math.sin(angle);
        const x2 = x + radius * Math.cos(angle + angleIncrement);
        const y2 = y + radius * Math.sin(angle + angleIncrement);

        vertices.push(x, y, x1, y1, x2, y2);
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // 启用顶点着色器属性
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // 告诉 WebGL 如何从位置缓冲区中提取数据
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // 绘制圆形
    gl.uniform4fv(colorUniformLocation, color);
    gl.drawArrays(gl.TRIANGLES, 0, segments * 3); // 一个三角形有3个顶点
}

// 清空画布
function clearCanvas() {
    gl.clear(gl.COLOR_BUFFER_BIT);
}

// 主绘制函数
function draw() {
    clearCanvas();
    drawBoard();
    drawPieces();
    requestAnimationFrame(draw);
}

// 初始化 WebGL 设置和启动游戏循环
function init() {
    // 初始化 WebGL 着色器、缓冲区等

    draw(); // 启动游戏循环
}

// 辅助函数：创建着色器程序
function createShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
        return null;
    }

    return program;
}

// 辅助函数：创建着色器
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

init();
