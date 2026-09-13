// maakt variabelen aan en wijst DOM-elementen toe aan deze variabelen met behulp van de document.querySelector-methode.
const wordText = document.querySelector(".word"),
    hintText = document.querySelector(".hint-copy"),
    timeText = document.querySelector(".time b"),
    inputField = document.querySelector("input"),
    refreshBtn = document.querySelector(".refresh-word"),
    checkBtn = document.querySelector(".check-word");

let correctWord, timer, score = Number(sessionStorage.getItem("unjumble-score") || 0);
const scoreEl = document.getElementById("score");
const toast = document.getElementById("toast");
const timeoutModal = document.getElementById("timeout-modal");
const modalWord = document.getElementById("modal-word");
const modalBtn = document.getElementById("modal-btn");
const winnerModal = document.getElementById("winner-modal");
const winnerScore = document.getElementById("winner-score");
const winnerBtn = document.getElementById("winner-btn");
const winnerTitle = document.getElementById("winner-title");
const winnerNote = document.getElementById("winner-note");

let toastTimer;
let usedWords = new Set(JSON.parse(sessionStorage.getItem("unjumble-used-words") || "[]"));
let completedCount = Number(sessionStorage.getItem("unjumble-completed-count") || 0);

const setScore = value => {
    score = value;
    scoreEl.innerText = score;
    sessionStorage.setItem("unjumble-score", String(score));
};

const saveRun = () => {
    sessionStorage.setItem("unjumble-used-words", JSON.stringify([...usedWords]));
    sessionStorage.setItem("unjumble-completed-count", String(completedCount));
};

scoreEl.innerText = score;

const showToast = (msg, type) => {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.className = `toast show ${type}`;
    toastTimer = setTimeout(() => toast.className = "toast", 2000);
};

const showTimeoutModal = () => {
    modalWord.textContent = correctWord.toUpperCase();
    timeoutModal.classList.add("show");
};

const showWinnerModal = () => {
    clearInterval(timer);
    const perfectRun = completedCount === words.length;
    winnerTitle.innerHTML = perfectRun ? "You cleared<br>the board." : "Run complete.";
    winnerNote.innerHTML = perfectRun ? "Every signal<br>decoded" : "The pool is<br>complete";
    winnerScore.textContent = `${completedCount} / ${words.length}`;
    winnerModal.classList.add("show");
};

modalBtn.addEventListener("click", () => {
    timeoutModal.classList.remove("show");
    initGame();
});

winnerBtn.addEventListener("click", () => {
    winnerModal.classList.remove("show");
    usedWords = new Set();
    completedCount = 0;
    setScore(0);
    saveRun();
    initGame();
});

// initialiseert een array met objecten genaamd 'words'. Elk object in de array heeft twee eigenschappen: 'word' en 'hint'.
let words = [
    {
        word: "addition",
        hint: "The process of adding numbers"
    },
    {
        word: "meeting",
        hint: "Event in which people come together"
    },
    {
        word: "number",
        hint: "Math symbol used for counting"
    },
    {
        word: "exchange",
        hint: "The act of trading"
    },
    {
        word: "canvas",
        hint: "Piece of fabric for oil painting"
    },
    {
        word: "garden",
        hint: "Space for planting flower and plant"
    },
    {
        word: "position",
        hint: "Location of someone or something"
    },
    {
        word: "feather",
        hint: "Hair like outer covering of bird"
    },
    {
        word: "comfort",
        hint: "A pleasant feeling of relaxation"
    },
    {
        word: "tongue",
        hint: "The muscular organ of mouth"
    },
    {
        word: "expansion",
        hint: "The process of increase or grow"
    },
    {
        word: "country",
        hint: "A politically identified region"
    },
    {
        word: "group",
        hint: "A number of objects or persons"
    },
    {
        word: "taste",
        hint: "Ability of tongue to detect flavour"
    },
    {
        word: "store",
        hint: "Large shop where goods are traded"
    },
    {
        word: "field",
        hint: "Area of land for farming activities"
    },
    {
        word: "friend",
        hint: "Person other than a family member"
    },
    {
        word: "pocket",
        hint: "A bag for carrying small items"
    },
    {
        word: "needle",
        hint: "A thin and sharp metal pin"
    },
    {
        word: "expert",
        hint: "Person with extensive knowledge"
    },
    {
        word: "statement",
        hint: "A declaration of something"
    },
    {
        word: "second",
        hint: "One-sixtieth of a minute"
    },
    {
        word: "library",
        hint: "Place containing collection of books"
    },
]



const initTimer = maxTime => {
    clearInterval(timer);
    timer = setInterval(() => {
        if (maxTime > 0) {
            maxTime--;
            return timeText.innerText = maxTime;
        }
        setScore(0);
        clearInterval(timer);
        showTimeoutModal();
    }, 1000);
}

// 127- Roept de functie initTimer aan met een argument van 30 (betekent 30 seconden).
// 128- Selecteert een willekeurig object (randomObj) uit een array met de naam woorden. De willekeurige selectie is gebaseerd op het genereren van een willekeurige index met behulp van Math.random()
// 129 Dit stukje code voert een shuffle-operatie uit op de letters van een woord dat is opgeslagen in het object genaamd randomObj.
const initGame = () => {
    if (usedWords.size >= words.length) return showWinnerModal();
    initTimer(30);
    let availableWords = words.filter(({ word }) => !usedWords.has(word));
    let randomObj = availableWords[Math.floor(Math.random() * availableWords.length)];
    usedWords.add(randomObj.word);
    saveRun();
    let wordArray = randomObj.word.split("");
    for (let i = wordArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    wordText.innerText = wordArray.join("");
    hintText.innerText = randomObj.hint;
    correctWord = randomObj.word.toLowerCase();;
    inputField.value = "";
    inputField.setAttribute("maxlength", correctWord.length);
}
initGame();



const checkWord = () => {
    let userWord = inputField.value.toLowerCase();
    if (!userWord) return showToast("Type a word first!", "wrong");
    if (userWord !== correctWord) {
        setScore(0);
        showToast(`Wrong! It was "${correctWord.toUpperCase()}"`, "wrong");
    } else {
        setScore(score + 1);
        completedCount++;
        saveRun();
        showToast("Correct!", "correct");
        document.querySelector(".container").classList.add("success-pulse");
        setTimeout(() => document.querySelector(".container").classList.remove("success-pulse"), 500);
    }
    if (usedWords.size >= words.length) return showWinnerModal();
    initGame();
}

refreshBtn.addEventListener("click", initGame);
checkBtn.addEventListener("click", checkWord);
inputField.addEventListener("keydown", e => {
    if (e.key === "Enter") checkWord();
});