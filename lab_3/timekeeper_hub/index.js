const dateDisplay = document.getElementById("date-display");
const clockDisplay = document.getElementById("clock-display");

const timerForm = document.getElementById("timer-form");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const timerDisplay = document.getElementById("timer-display");
const statusText = document.getElementById("status-text");

let totalSeconds = 60;
let timerId = null;
let isPaused = false;

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateClock() {
  const now = new Date();
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  clockDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  dateDisplay.textContent = now.toDateString();
}

function renderTimer() {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  timerDisplay.textContent = `${pad(mins)}:${pad(secs)}`;
}

function setStatus(message, isDone = false) {
  statusText.textContent = message;
  statusText.classList.toggle("done", isDone);
}

function clearTimerInterval() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function runTimer() {
  clearTimerInterval();

  timerId = setInterval(() => {
    if (totalSeconds <= 0) {
      clearTimerInterval();
      setStatus("Time is up!", true);
      alert("Countdown completed.");
      return;
    }

    totalSeconds -= 1;
    renderTimer();

    if (totalSeconds === 0) {
      clearTimerInterval();
      setStatus("Time is up!", true);
      alert("Countdown completed.");
    }
  }, 1000);
}

function validateInput(minutesValue, secondsValue) {
  const minutes = Number(minutesValue);
  const seconds = Number(secondsValue);

  if (!Number.isInteger(minutes) || !Number.isInteger(seconds)) {
    setStatus("Please enter whole numbers only.");
    return null;
  }

  if (minutes < 0 || seconds < 0 || seconds > 59) {
    setStatus("Minutes must be >= 0 and seconds must be 0 to 59.");
    return null;
  }

  const secondsTotal = minutes * 60 + seconds;
  if (secondsTotal <= 0) {
    setStatus("Please set a countdown greater than zero.");
    return null;
  }

  return secondsTotal;
}

timerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const inputSeconds = validateInput(minutesInput.value, secondsInput.value);
  if (inputSeconds === null) {
    return;
  }

  totalSeconds = inputSeconds;
  isPaused = false;
  renderTimer();
  setStatus("Timer started.");
  runTimer();
});

pauseBtn.addEventListener("click", () => {
  if (timerId !== null) {
    clearTimerInterval();
    isPaused = true;
    setStatus("Timer paused.");
    pauseBtn.textContent = "Resume";
    return;
  }

  if (isPaused && totalSeconds > 0) {
    setStatus("Timer resumed.");
    pauseBtn.textContent = "Pause";
    runTimer();
  }
});

resetBtn.addEventListener("click", () => {
  clearTimerInterval();
  isPaused = false;
  pauseBtn.textContent = "Pause";

  minutesInput.value = 1;
  secondsInput.value = 0;
  totalSeconds = 60;

  renderTimer();
  setStatus("Timer reset to default.");
});

updateClock();
setInterval(updateClock, 1000);
renderTimer();
