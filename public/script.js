import Ball from "./Ball.js";
import Paddle from "./Paddle.js";
document.addEventListener("click", () => {
    hitSound.play().catch(error => console.log("Audio play blocked:", error));
}, { once: true }); // This ensures it only runs once.
// Load Sound Effect
const hitSound = new Audio("sounds/hit.wav");



const ball = new Ball(document.getElementById("ball"))
const playerPaddle = new Paddle(document.getElementById("player-paddle"))
const computerPaddle = new Paddle(document.getElementById("computer-paddle"))
const playerScoreElem = document.getElementById("player-score")
const computerScoreElem = document.getElementById("computer-score")

let lastTime
function update(time) {
    if (lastTime != null) {
        const delta = time - lastTime;
        const ballRect = ball.rect();
        const playerRect = playerPaddle.rect();
        const computerRect = computerPaddle.rect();

        ball.update(delta, [playerRect, computerRect]);
        computerPaddle.update(delta, ball.y);

        const hue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hue"));
        document.documentElement.style.setProperty("--hue", hue + delta * 0.01);

        // Check if the ball hits the paddles and play sound
        if (isCollision(ballRect, playerRect) || isCollision(ballRect, computerRect)) {
            hitSound.currentTime = 0;  // Reset sound to prevent delay
            hitSound.play();
        }

        if (isLose()) handleLose();
    }

    lastTime = time;
    window.requestAnimationFrame(update);
}

// Function to check collision
function isCollision(ballRect, paddleRect) {
    return (
        ballRect.left <= paddleRect.right &&
        ballRect.right >= paddleRect.left &&
        ballRect.top <= paddleRect.bottom &&
        ballRect.bottom >= paddleRect.top
    );
}

function isLose() {
    const rect = ball.rect();
    return rect.right >= window.innerWidth || rect.left <= 0;
}

function handleLose() {
    const rect = ball.rect();
    if (rect.right >= window.innerWidth) {
        playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1;
    } else {
        computerScoreElem.textContent = parseInt(computerScoreElem.textContent) + 1;
    }

    ball.reset();
    computerPaddle.reset();
}
function playSound(audio) {
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => console.log("Audio play blocked:", error));
    }
}
playSound(hitSound);

document.addEventListener("mousemove", (e) => {
    playerPaddle.position = (e.y / window.innerHeight) * 100;
});

window.requestAnimationFrame(update);