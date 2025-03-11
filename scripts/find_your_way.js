const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");
const message = document.getElementById("message");
const instruction = document.getElementById("instruction");

const gridSize = 5;
const cellSize = canvas.width / gridSize;

const player = { x: 0, y: 4 };
const destination = { x: 4, y: 0 };
const correctPath = ["up", "right", "up", "left", "up"];
let step = 0;

function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ddd";
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
    ctx.fillStyle = "red";
    ctx.fillRect(destination.x * cellSize, destination.y * cellSize, cellSize, cellSize);
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(player.x * cellSize + cellSize / 2, player.y * cellSize + cellSize / 2, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();
    
    if (step < correctPath.length) {
        instruction.textContent = `Instruction: Move ${correctPath[step]}`;
    } else {
        instruction.textContent = "🎉 You arrived!";
    }
}

drawMap();

function move(direction) {
    if (step >= correctPath.length) return;
    
    let correctMove = false;
    if (correctPath[step] === direction) {
        correctMove = true;
    }
    
    if (correctMove) {
        if (direction === "up" && player.y > 0) player.y--;
        else if (direction === "right" && player.x < gridSize - 1) player.x++;
        else if (direction === "left" && player.x > 0) player.x--;
        
        step++;
        message.textContent = "";
        drawMap();
    } else {
        message.textContent = "❌ Wrong move! Follow the instruction!";
        return;
    }
    
    if (step === correctPath.length && player.x === destination.x && player.y === destination.y) {
        message.textContent = "🏆 Congratulations! You found the way!";
    } else if (step === correctPath.length) {
        message.textContent = "❌ You took the wrong path! Try again.";
    }
}

function restartGame() {
    player.x = 0;
    player.y = 4;
    step = 0;
    message.textContent = "";
    instruction.textContent = `Instruction: Move ${correctPath[0]}`;
    drawMap();
}
