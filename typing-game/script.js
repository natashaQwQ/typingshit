const typingText = document.querySelector(".typing-text p"),
    inpField = document.querySelector(".input-field"),
    tryAgainBtn = document.querySelector("button"),
    timeTag = document.querySelector(".time span b"),
    mistakeTag = document.querySelector(".mistake span"),
    wpmTag = document.querySelector(".wpm span"),
    cpmTag = document.querySelector(".cpm span"),
    scoreList = document.getElementById("score-list");

let timer,
    maxTime = 60,
    timeLeft = maxTime,
    charIndex = mistakes = isTyping = 0;

function randomParagraph() {
    let randIndex = Math.floor(Math.random() * paragraphs.length);
    console.log(randIndex);
    typingText.innerHTML = "";
    paragraphs[randIndex].split("").forEach(char => {
        let span = `<span>${char}</span>`;
        typingText.innerHTML += span;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
    const characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];
    if (charIndex < characters.length - 1 && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(initTimer, 1000); 
            isTyping = true;
        }

        if (typedChar == null) {
            if (charIndex > 0) {
                charIndex--;
                if (characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            if (characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }

        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
    } else {
        clearInterval(timer);
        inpField.value = "";
        saveScore(wpmTag.innerText);
    }
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
    } else {
        clearInterval(timer);
    }
}

function resetGame() {
    randomParagraph();
    inpField.value = "";
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    timeTag.innerText = timeLeft;
    mistakeTag.innerText = mistakes;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
}

function saveScore(wpm) {
    let name = prompt("Enter your name:");
    if (!name) return;

    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push({ name, wpm: parseInt(wpm) });
    scores.sort((a, b) => b.wpm - a.wpm);
    scores = scores.slice(0, 10);
    localStorage.setItem("scores", JSON.stringify(scores));
    displayScores();
    resetGame();
}

function displayScores() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scoreList.innerHTML = scores.map(score => `<li><span>${score.name}</span><span>${score.wpm}</span></li>`).join("");
}

resetGame();
displayScores();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
