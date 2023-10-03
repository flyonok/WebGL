// 获取画布和上下文
const canvas = document.getElementById("checkersCanvas");
const ctx = canvas.getContext("2d");

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

// 绘制棋盘
function drawBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const tileX = col * tileSize;
            const tileY = row * tileSize;
            if ((row + col) % 2 === 0) {
                ctx.fillStyle = "lightgray";
            } else {
                ctx.fillStyle = "darkgray";
            }
            ctx.fillRect(tileX, tileY, tileSize, tileSize);
        }
    }
}

// 绘制棋子
function drawPieces() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const tileX = col * tileSize + tileSize / 2;
            const tileY = row * tileSize + tileSize / 2;
            if (board[row][col] === 1) {
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(tileX, tileY, tileSize / 2 - 5, 0, Math.PI * 2);
                ctx.fill();
            } else if (board[row][col] === 2) {
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.arc(tileX, tileY, tileSize / 2 - 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// 清空画布
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 主绘制函数
function draw() {
    clearCanvas();
    drawBoard();
    drawPieces();
}

// 初始化游戏
function init() {
    draw();
}

// 启动游戏
init();
