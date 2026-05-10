// Konfigurasi Dasar sesuai Proposal (Grid 20x20)
const blockSize = 20; 
const rows = 20;
const cols = 20;
let board, context; 

// Inisialisasi Karakter
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;
let velocityX = 0;
let velocityY = 0;
let snakeBody = [];

// Inisialisasi Makanan
let foodX, foodY;

// Sistem Skor
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let gameOver = false;

// Variabel Animasi
let foodPulse = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");

    // Tampilkan High Score tersimpan
    document.getElementById("highScoreVal").innerText = highScore;

    placeFood();
    document.addEventListener("keydown", changeDirection);
    
    // Kecepatan game: 100 milidetik sesuai proposal
    setInterval(update, 100); 
}

function update() {
    if (gameOver) return;

    // 1. Gambar Latar Belakang
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    // 2. Gambar Makanan dengan Efek Pulse (Berdenyut)
    foodPulse += 0.2;
    let pulse = Math.sin(foodPulse) * 2;
    context.fillStyle = "#FF3131"; // Warna Merah
    context.shadowBlur = 15;
    context.shadowColor = "red";
    context.beginPath();
    context.arc(foodX + blockSize/2, foodY + blockSize/2, (blockSize/2 - 2) + pulse, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0; 

    // 3. Logika Makan & Update Skor
    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        score += 10;
        document.getElementById("scoreVal").innerText = score;
        
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
            document.getElementById("highScoreVal").innerText = highScore;
        }
        placeFood();
    }

    // 4. Pergerakan Tubuh Ular
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    // 5. Update Posisi Kepala
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    // 6. Gambar Kepala Ular (Warna Lime + Mata)
    context.fillStyle = "#32CD32";
    drawRoundedRect(snakeX, snakeY, blockSize-1, blockSize-1, 5);
    
    // Mata Ular
    context.fillStyle = "white";
    context.fillRect(snakeX + 4, snakeY + 4, 3, 3);
    context.fillRect(snakeX + 12, snakeY + 4, 3, 3);

    // 7. Gambar Segmen Tubuh
    context.fillStyle = "lime";
    for (let i = 0; i < snakeBody.length; i++) {
        drawRoundedRect(snakeBody[i][0], snakeBody[i][1], blockSize-1, blockSize-1, 3);
    }

    // 8. Cek Tabrakan Dinding
    if (snakeX < 0 || snakeX >= board.width || snakeY < 0 || snakeY >= board.height) {
        triggerGameOver();
    }

    // 9. Cek Tabrakan Tubuh Sendiri
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            triggerGameOver();
        }
    }
}

// Fungsi membuat kotak dengan sudut tumpul
function drawRoundedRect(x, y, w, h, r) {
    context.beginPath();
    context.roundRect(x, y, w, h, r);
    context.fill();
}

function changeDirection(e) {
    // Navigasi Arrows & WASD sesuai Proposal
    // Mencegah ular berbalik arah 180 derajat
    if ((e.code == "ArrowUp" || e.code == "KeyW") && velocityY != 1) {
        velocityX = 0; velocityY = -1;
    }
    else if ((e.code == "ArrowDown" || e.code == "KeyS") && velocityY != -1) {
        velocityX = 0; velocityY = 1;
    }
    else if ((e.code == "ArrowLeft" || e.code == "KeyA") && velocityX != 1) {
        velocityX = -1; velocityY = 0;
    }
    else if ((e.code == "ArrowRight" || e.code == "KeyD") && velocityX != -1) {
        velocityX = 1; velocityY = 0;
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function triggerGameOver() {
    gameOver = true;
    
    // Efek Getar Layar
    board.classList.add("shake-effect");
    
    // Overlay Game Over
    context.fillStyle = "rgba(0, 0, 0, 0.85)";
    context.fillRect(0, 0, board.width, board.height);
    
    context.fillStyle = "white";
    context.font = "bold 28px Courier New";
    context.textAlign = "center";
    context.fillText("GAME OVER", board.width/2, board.height/2 - 20);
    
    context.fillStyle = "#32CD32";
    context.font = "18px Courier New";
    context.fillText("Skor Akhir: " + score, board.width/2, board.height/2 + 20);
    
    context.fillStyle = "#888";
    context.font = "14px Courier New";
    context.fillText("Tekan F5 untuk mengulang", board.width/2, board.height/2 + 60);
                        }
