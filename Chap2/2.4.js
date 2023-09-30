var gl;
var canvas;
var positionLocation;
window.onload = function init() {
    // 获取Canvas元素和WebGL上下文
    canvas = document.getElementById('gl-canvas');
    // canvas.style.backgroundColor = 'green';
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    // 顶点着色器代码
    const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    gl_PointSize = 1.0;
  }
`;

    // 片段着色器代码
    const fragmentShaderSource = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // 设置点的颜色为黑色
  }
`;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // 创建顶点着色器对象并编译
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    // 创建片段着色器对象并编译
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // 创建着色器程序并链接
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    // 获取顶点属性位置
    positionLocation = gl.getAttribLocation(shaderProgram, 'position');
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    // 启用顶点属性数组
    gl.enableVertexAttribArray(positionLocation);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // 初始化海龟的位置和方向
    let turtleX = 0;
    let turtleY = 0;
    let turtleAngle = 0;
    let penDown = true;

    // 前进
    function forward(distance) {
        const radians = (turtleAngle * Math.PI) / 180;
        const dx = Math.cos(radians) * distance;
        const dy = Math.sin(radians) * distance;

        if (penDown) {
            // 绘制点
            const vertices = new Float32Array([turtleX + dx, turtleY + dy]);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            gl.drawArrays(gl.POINTS, 0, 1);
            // gl.deleteBuffer(buffer);
        }

        // 更新海龟位置
        turtleX += dx;
        turtleY += dy;
    }

    // 右转
    function right(angle) {
        turtleAngle += angle;
    }

    // 左转
    function left(angle) {
        turtleAngle -= angle;
    }

    // 抬起/放下画笔
    function pen(upDown) {
        penDown = upDown;
    }

    // 分形山脉生成函数
    function drawMountain(iterations, length) {
        if (iterations === 0) {
            forward(length);
        } else {
            const newLength = length / 2;
            drawMountain(iterations - 1, newLength);
            left(45);
            drawMountain(iterations - 1, newLength);
            right(90);
            drawMountain(iterations - 1, newLength);
            left(45);
            drawMountain(iterations - 1, newLength);
        }
    }

    // 初始化海龟位置和角度
    turtleX = 0;
    turtleY = 0;
    turtleAngle = 0;

    // 开始绘制分形山脉
    drawMountain(5, 200);

    // 这将绘制一个分形山脉，细分次数为5，长度为200
}
