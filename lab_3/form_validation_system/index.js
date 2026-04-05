const form = document.getElementById("signup-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const formMessage = document.getElementById("form-message");

function setFieldState(inputElement, errorElement, message) {
  errorElement.textContent = message;
  inputElement.classList.toggle("invalid", message.length > 0);
}

function validateName() {
  const value = nameInput.value.trim();

  if (value.length === 0) {
    setFieldState(nameInput, nameError, "Name is required.");
    return false;
  }

  if (value.length < 3) {
    setFieldState(nameInput, nameError, "Name must be at least 3 characters.");
    return false;
  }

  setFieldState(nameInput, nameError, "");
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (value.length === 0) {
    setFieldState(emailInput, emailError, "Email is required.");
    return false;
  }

  if (!emailPattern.test(value)) {
    setFieldState(emailInput, emailError, "Enter a valid email address.");
    return false;
  }

  setFieldState(emailInput, emailError, "");
  return true;
}

function validatePassword() {
  const value = passwordInput.value;

  if (value.length === 0) {
    setFieldState(passwordInput, passwordError, "Password is required.");
    return false;
  }

  if (value.length < 8) {
    setFieldState(
      passwordInput,
      passwordError,
      "Password must be at least 8 characters.",
    );
    return false;
  }

  setFieldState(passwordInput, passwordError, "");
  return true;
}

nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", validatePassword);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  if (!isNameValid || !isEmailValid || !isPasswordValid) {
    formMessage.textContent =
      "Form submission blocked. Fix the errors and try again.";
    formMessage.classList.add("error");
    return;
  }

  formMessage.textContent = "Form submitted successfully.";
  formMessage.classList.remove("error");
});
