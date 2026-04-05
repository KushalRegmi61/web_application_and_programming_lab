const defaultTheme = {
  backgroundColor: "#f4f7fb",
  textColor: "#1d2433",
  buttonColor: "#0b7a75",
};

const selectedTheme = { ...defaultTheme };

const backgroundInput = document.getElementById("bg-color");
const textInput = document.getElementById("text-color");
const buttonInput = document.getElementById("button-color");
const resetButton = document.getElementById("reset-btn");
const themeOutput = document.getElementById("theme-output");

function renderThemeObject() {
  themeOutput.textContent = JSON.stringify(selectedTheme, null, 2);
}

function applyTheme() {
  document.documentElement.style.setProperty(
    "--bg-color",
    selectedTheme.backgroundColor,
  );
  document.documentElement.style.setProperty(
    "--text-color",
    selectedTheme.textColor,
  );
  document.documentElement.style.setProperty(
    "--button-color",
    selectedTheme.buttonColor,
  );
  renderThemeObject();
}

function syncInputsWithTheme(theme) {
  backgroundInput.value = theme.backgroundColor;
  textInput.value = theme.textColor;
  buttonInput.value = theme.buttonColor;
}

backgroundInput.addEventListener("input", () => {
  selectedTheme.backgroundColor = backgroundInput.value;
  applyTheme();
});

textInput.addEventListener("input", () => {
  selectedTheme.textColor = textInput.value;
  applyTheme();
});

buttonInput.addEventListener("input", () => {
  selectedTheme.buttonColor = buttonInput.value;
  applyTheme();
});

resetButton.addEventListener("click", () => {
  Object.assign(selectedTheme, defaultTheme);
  syncInputsWithTheme(selectedTheme);
  applyTheme();
});

syncInputsWithTheme(selectedTheme);
applyTheme();
