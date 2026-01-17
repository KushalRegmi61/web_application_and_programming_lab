let random_number = null;

let max_attempts = 5;
let attempt = 0;

function generateRandomNumber() {
  random_number = Math.floor(Math.random() * 100) + 1;
  console.log(
    "Generated Random Number (for testing purposes): ",
    random_number,
  );
}

function createPlayAgainButton() {
  const resultDiv = document.getElementById("result");
  const playAgainButton = document.createElement("button");
  playAgainButton.textContent = "Play Again";
  playAgainButton.addEventListener("click", function () {
    resetGame("restarted");
    resultDiv.innerHTML = "";
  });
  resultDiv.appendChild(playAgainButton);
}

document.getElementById("guess-button").addEventListener("click", function () {
  const user_guess = parseInt(document.getElementById("guess-input").value);

  //   clear the previous input
  document.getElementById("guess-input").value = "";

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  attempt += 1;

  if (user_guess === random_number) {
    const successMessage = document.createElement("p");
    successMessage.textContent = `Congratulations! You've guessed the correct number ${random_number} in ${attempt} attempts.`;
    resultDiv.appendChild(successMessage);

    createPlayAgainButton();
  } else if (attempt >= max_attempts) {
    alert(
      `Sorry! You've used all ${max_attempts} attempts. The correct number was ${random_number}.`,
    );

    createPlayAgainButton();
  } else if (user_guess < random_number) {
    const message = document.createElement("p");
    message.textContent = `Too low! Try again. ${max_attempts - attempt} attempts left.`;
    resultDiv.appendChild(message);
  } else if (user_guess > random_number) {
    const message = document.createElement("p");
    message.textContent = `Too high! Try again. ${max_attempts - attempt} attempts left.`;
    resultDiv.appendChild(message);
  }
});

function resetGame(message = "started") {
  attempt = 0;
  generateRandomNumber();
  document.getElementById("guess-input").value = "";
  alert(
    `Game has been ${message}. You have 5 new attempts to guess the number.`,
  );
}

// Initialize the game
generateRandomNumber();
