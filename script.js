document.addEventListener('DOMContentLoaded', function() {
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
    };

    const display = document.getElementById('display');

    function updateDisplay() {
        display.textContent = calculator.displayValue;
    }

    function inputDigit(digit) {
        const { displayValue, waitingForSecondOperand } = calculator;

        if (waitingForSecondOperand) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }

    function inputDecimal(dot) {
        if (calculator.waitingForSecondOperand) {
            calculator.displayValue = '0.';
            calculator.waitingForSecondOperand = false;
            return;
        }

        if (!calculator.displayValue.includes(dot)) {
            calculator.displayValue += dot;
        }
    }

    function handleOperator(nextOperator) {
        const { firstOperand, displayValue, operator } = calculator;
        const inputValue = parseFloat(displayValue);

        if (operator && calculator.waitingForSecondOperand) {
            calculator.operator = nextOperator;
            return;
        }

        if (firstOperand === null && !isNaN(inputValue)) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = result;
        }

        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
    }

    function calculate(firstOperand, secondOperand, operator) {
        if (operator === '+') {
            return firstOperand + secondOperand;
        } else if (operator === '-') {
            return firstOperand - secondOperand;
        } else if (operator === '*') {
            return firstOperand * secondOperand;
        } else if (operator === '/') {
            return firstOperand / secondOperand;
        } else if (operator === '%') {
            return (firstOperand / 100) * secondOperand;
        }

        return secondOperand;
    }

    function resetCalculator() {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
    }

    function handlePlusMinus() {
        const { displayValue } = calculator;
        const value = parseFloat(displayValue);
        
        if (value !== 0) {
            calculator.displayValue = (value * -1).toString();
        }
    }

    document.querySelector('.calculator-keys').addEventListener('click', (event) => {
        const { target } = event;
        
        if (!target.matches('button')) {
            return;
        }

        if (target.classList.contains('operator')) {
            if (target.value === 'clear') {
                resetCalculator();
            } else if (target.value === 'plusminus') {
                handlePlusMinus();
            } else {
                handleOperator(target.value);
            }
            updateDisplay();
            return;
        }

        if (target.value === '.') {
            inputDecimal(target.value);
            updateDisplay();
            return;
        }

        inputDigit(target.value);
        updateDisplay();
    });

    // Initialize display
    updateDisplay();
});
