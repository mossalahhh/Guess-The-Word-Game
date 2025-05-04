// setting game name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;

// setting game options
let numOfTries = 6;
let numOfLetters = 6;
let currentTry = 1;
let numOfHints = 2;
// manage words
let wordGuess = "";
let words = [
  "Create",
  "Ubdate",
  "Branch",
  "Master",
  "Delete",
  "Fabric",
  "Eagles",
  "Rabbit",
];
// get random word in each iteration
wordGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
// console.log(wordGuess);
let messageArea = document.querySelector(".message");
// manage Hints
document.querySelector(".hint span").innerHTML = numOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function generateInput() {
  let inputContainer = document.querySelector(".inputs");
  // make try div
  for (let i = 1; i <= numOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i !== 1) tryDiv.classList.add("disabled-inputs");
    // make inputs of try div
    for (let j = 1; j <= numOfLetters; j++) {
      let inputs = document.createElement("input");
      inputs.type = "text";
      inputs.id = `guess-${i}-letter-${j}`;
      inputs.setAttribute("maxlength", "1");
      tryDiv.appendChild(inputs);
    }
    inputContainer.appendChild(tryDiv);
  }
  //اول ديف اول input
  inputContainer.children[0].children[1].focus();

  // Disabled All inputs except first one
  const disabledInputs = document.querySelectorAll(".disabled-inputs input");
  disabledInputs.forEach((input) => {
    input.disabled = true;
  });

  //iteration on inputs
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      // convert input to uppercase
      this.value = this.value.toUpperCase();
      // switch to another input
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });

    input.addEventListener("keydown", function (event) {
      const currentIndex = Array.from(inputs).indexOf(this); // or event.target
      if (event.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) inputs[nextInput].focus();
      }
    });

    input.addEventListener("keydown", function (event) {
      const currentIndex = Array.from(inputs).indexOf(this); // or event.target
      if (event.key === "ArrowLeft") {
        const prevInput = currentIndex - 1;
        if (prevInput >= 0) inputs[prevInput].focus();
      }
    });
  });
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuess);

function handleGuess() {
  let successGuess = true;
  for (let i = 1; i <= numOfLetters; i++) {
    let inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
    let letter = inputField.value.toLowerCase();
    // كتبت هنا i-1 عشان انا باديء الفور لوب ب واحد واول اندكس في الاراي بيبقي 0
    let actualLetter = wordGuess[i - 1];
    if (letter === actualLetter && letter !== "") {
      // letter is correct
      inputField.classList.add("yes-in-place");
    } else if (wordGuess.includes(letter) && letter !== "") {
      // letter is correct but not in place
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
    if (letter === "") {
      successGuess = false;
    }
  }

  //check user if win or lose
  if (successGuess) {
    messageArea.innerHTML = `Congarts <span>YOU WIN!!</span>`;

    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
    guessButton.disabled = true;
    getHintButton.disabled = true;
  } else {
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disabled-inputs");
    const currentTryInput = document.querySelectorAll(
      `.try-${currentTry} input`
    );
    currentTryInput.forEach((input) => (input.disabled = true));

    currentTry++;

    const nextTry = document.querySelectorAll(`.try-${currentTry} input`);
    nextTry.forEach((input) => (input.disabled = false));

    let element = document.querySelector(`.try-${currentTry}`);
    if (element) {
      document
        .querySelector(`.try-${currentTry}`)
        .classList.remove("disabled-inputs");
      element.children[1].focus();
    } else {
      guessButton.disabled = true;
      getHintButton.disabled = true;
      messageArea.innerHTML = `You Lose The Word Is <span>${wordGuess}</span>`;
    }
  }
}

function getHint() {
  if (numOfHints > 0) {
    numOfHints--;
    document.querySelector(".hint span").innerHTML = numOfHints;
  }
  if (numOfHints === 0) {
    getHintButton.disabled = true;
  }

  const enableInputs = document.querySelectorAll("input:not([disabled])");
  const emtyEnabledInputs = Array.from(enableInputs).filter(
    (input) => input.value === ""
  );
  if (emtyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emtyEnabledInputs.length);
    const randomInput = emtyEnabledInputs[randomIndex];

    const indexToFill = Array.from(enableInputs).indexOf(randomInput);

    if (indexToFill !== -1) {
      randomInput.value = wordGuess[indexToFill].toUpperCase();
    }
  }
}

function handleBackSpace(event) {
  if (event.key === "Backspace") {
    const input = document.querySelectorAll("input:not([disabled])");
    // active element العنصر اللي انا واقف عليه
    const currentIndex = Array.from(input).indexOf(document.activeElement);
    if (currentIndex > 0) {
      const currentInput = input[currentIndex];
      const prevInput = input[currentIndex - 1];
      currentInput.value = "";
      prevInput.value = "";
      prevInput.focus();
    }
  }
}

document.addEventListener("keydown", handleBackSpace);
window.onload = function () {
  generateInput();
};
