const rollButton = document.getElementById("rollButton");
const resetButton = document.getElementById("resetButton");
const totalScoreElement = document.getElementById("totalScore");
const messageElement = document.getElementById("message");
const rollsTableBody = document.getElementById("rollsTableBody");
const diceContainerWrapper = document.getElementById("diceContainerWrapper");

let totalScore = 0;
let currentRoll = null;

function rollDice() {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 6) + 1);
}

function getDiceFace(value) {
    switch (value) {
        case 1: return "⚀";
        case 2: return "⚁";
        case 3: return "⚂";
        case 4: return "⚃";
        case 5: return "⚄";
        case 6: return "⚅";
        default: return "";
    }
}

function displayDice(dice) {
    if (currentRoll) {
        diceContainerWrapper.removeChild(currentRoll.diceContainer); // Remove previous dice container
    }

    const diceContainer = document.createElement("div");
    diceContainer.className = "dice-container rolling";

    dice.forEach(value => {
        const diceElement = document.createElement("div");
        diceElement.className = "dice";
        diceElement.textContent = getDiceFace(value);
        diceContainer.appendChild(diceElement);
    });

    currentRoll = { diceContainer };
    diceContainer.addEventListener("animationend", () => {
        currentRoll.diceContainer.classList.remove("rolling");
    });

    diceContainerWrapper.innerHTML = "";  
    diceContainerWrapper.appendChild(diceContainer);

    void diceContainer.offsetWidth;
    diceContainer.classList.add("rolling");
}

function showFireworks() {
    const fireworksContainer = document.createElement("div");
    fireworksContainer.className = "fireworks-container";
    for (let i = 0; i < 20; i++) {
        const firework = document.createElement("div");
        firework.className = "firework";
        fireworksContainer.appendChild(firework);
    }
    document.body.appendChild(fireworksContainer);
    setTimeout(() => {
        document.body.removeChild(fireworksContainer);
    }, 5000); // Remove fireworks after 5 seconds
}

function calculateScore(dice) {
    const counts = Array.from({ length: 6 }, () => 0);
    let score = 0;

    dice.forEach(value => {
        counts[value - 1]++;
    });

    // 3 of a Kind 1's
    if (counts[0] >= 3) {
        score += 1000;
        counts[0] -= 3;
    }

    // 3 of a Kind 2-5
    for (let i = 1; i <= 4; i++) {
        if (counts[i] >= 3) {
            score += (i + 1) * 100;
            counts[i] -= 3;
        }
    }

    // Single 1's
    score += counts[0] * 100;

    // Single 5's
    score += counts[4] * 50;

    // Straight
    if (counts.every(count => count === 1)) {
        score += 1500;
    }

    return score;
}

function updateMessage(message) {
    messageElement.innerText = message;
    messageElement.style.display = "block";
}

function updateTotalScore() {
    totalScoreElement.innerText = totalScore;
}

function addRollToTable(dice, score) {
    const row = document.createElement("tr");
    const diceCell = document.createElement("td");
    diceCell.innerText = dice.join(", ");
    const scoreCell = document.createElement("td");
    scoreCell.innerText = score;
    const totalScoreCell = document.createElement("td");
    totalScoreCell.innerText = totalScore;
    row.appendChild(diceCell);
    row.appendChild(scoreCell);
    row.appendChild(totalScoreCell);
    rollsTableBody.appendChild(row);
}

rollButton.addEventListener("click", () => {
    // Clear previous results
    rollsTableBody.innerHTML = '';

    const dice = rollDice();
    displayDice(dice);

    // Calculate the score for the current roll
    const score = calculateScore(dice);
    
    // Add the current score to the totalScore and update it on UI
    totalScore += score;
    updateTotalScore();

    // Now update the roll table
    addRollToTable(dice, score);
    
    if (totalScore >= 10000) {
        updateMessage("You've reached 10000 points! Congratulations!");
        rollButton.disabled = true;
        // Call the showFireworks function here
        showFireworks();
    }
});

 // Remove any remaining confetti elements from the DOM
    // Remove any remaining confetti elements from the DOM
    const confettiElements = document.querySelectorAll(".confetti");
    confettiElements.forEach((element) => {
        document.body.removeChild(element);
    });


resetButton.addEventListener("click", () => {
    totalScore = 0;
    currentRoll = null;
    rollsTableBody.innerHTML = "";
    totalScoreElement.innerText = totalScore;
    diceContainerWrapper.innerHTML = "";
    messageElement.innerText = "";
    rollButton.disabled = false;
});

