const quizQuestions = [
  {
    question: "JavaScript is a compiled language.",
    answer: false,
  },
  {
    question: "Arrays in JavaScript can hold multiple data types.",
    answer: true,
  },
  {
    question: "The '===' operator checks for value equality only, not type.",
    answer: false,
  },
  {
    question: "JavaScript is single-threaded.",
    answer: true,
  },
  {
    question: "The 'let' keyword has function scope.",
    answer: false,
  },
];

let currentQuestionIndex = 0;
let score = 0;
let totalScore = quizQuestions.length;

document.getElementById("play-quiz").addEventListener("click", function () {
  currentQuestionIndex = 0;
  score = 0;
  renderQuestion();
});

function renderQuestion() {
  const questionContainer = document.getElementById("questions-container");
  const resultContainer = document.getElementById("result");

  // Check if quiz is completed first
  if (currentQuestionIndex >= totalScore) {
    resultContainer.innerHTML = "";

    questionContainer.innerHTML = "<h2>Quiz Completed!</h2>";
    const finalScore = document.createElement("p");
    finalScore.textContent = `Your final score is ${score} out of ${totalScore}.`;
    questionContainer.appendChild(finalScore);
    return;
  }

  // Clear previous question
  questionContainer.innerHTML = "";

  // display question question one by one
  const questionObj = quizQuestions[currentQuestionIndex];

  const questionElement = document.createElement("p");
  questionElement.textContent = `Q${currentQuestionIndex + 1}: ${questionObj.question}`;

  questionContainer.appendChild(questionElement);

  // True Button
  const trueButton = document.createElement("button");
  trueButton.textContent = "True";
  trueButton.addEventListener("click", function () {
    checkAnswer(true);
  });
  questionContainer.appendChild(trueButton);

  // False Button
  const falseButton = document.createElement("button");
  falseButton.textContent = "False";
  falseButton.addEventListener("click", function () {
    checkAnswer(false);
  });
  questionContainer.appendChild(falseButton);

  resultContainer.textContent = `Score: ${score} / ${totalScore}`;
}

function checkAnswer(userAnswer) {
  const questionObj = quizQuestions[currentQuestionIndex];

  if (userAnswer === questionObj.answer) {
    score++;
    alert("Correct!");
  } else {
    alert("Incorrect!");
  }

  currentQuestionIndex++;
  renderQuestion();
}
