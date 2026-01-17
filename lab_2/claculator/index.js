let currentInput = '';
let currentOperation = '';
let previousInput = '';
let history = [];
const MAX_HISTORY = 5;

const historyList = document.getElementById('history-list');

function appendNumber(number) {
    currentInput += number;
    document.getElementById('display').value = `${currentInput} ${currentOperation} ${previousInput}`;
}

function appendOperation(operation) {
    if (currentInput === '') return;
    if (previousInput !== '') {
        calculate(); 
    }
    currentOperation = operation;
    previousInput = currentInput;
    currentInput = '';
    document.getElementById('display').value = `${previousInput} ${currentOperation}`;
}


function calculate() {
    if (previousInput === '' && currentInput === '') return;
    
    const previous = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    let result;
    
    switch (currentOperation) {
        case '+':
            result = previous + current;
            break;
        case '-':
            result = previous - current;
            break;
        case '*':
            result = previous * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero');
                return;
            }

            result = previous / current;
            break;
        default:
            return;
    }

    const expression = `${previous} ${currentOperation} ${current} = ${result}`;
    addToHistory(expression);
    
    currentInput = result.toString();
    currentOperation = '';
    previousInput = '';
    document.getElementById('display').value = currentInput;
}

function clearDisplay() {
    currentInput = '';
    currentOperation = '';
    previousInput = '';
    document.getElementById('display').value = '';
}

function addToHistory(entry) {
    history.push(entry);
    if (history.length > MAX_HISTORY) {
        history.shift();
    }
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    [...history].reverse().forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    history = [];
    renderHistory();
}

