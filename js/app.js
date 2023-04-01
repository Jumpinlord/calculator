

function init() {
  let enable = false;
  let historyArr = [];
  let tempNum = '';
  let operationType = '';
  let isPercent = false;
  let isEqual = false;
  const body = document.querySelector('body');
  const calc = document.querySelector('.calc');
  const result = document.querySelector('.calc__result');
  const calcHistory = document.querySelector('.calc__history');
  const powerBtn = document.querySelector('#power-btn');

  function clickHandler({ target }) {
    if (target.classList.contains('calc__btn')) {
      const data = target.dataset.type;
      operation(data);
      renderTotal(tempNum);
      renderHistory(historyArr);
    }
  }

  function keyPressHandler({key}) {
    if (key === ' ') {
      return;
  }
    const data = key;
    operation(data);
    renderTotal(tempNum);
    renderHistory(historyArr);
  }

  function operation(data) {
    if (data >= 0) {
      operationType = 'number';
      tempNum = tempNum === '0' ? data : tempNum + data;
      tempNum.length > 12 ? tempNum = tempNum.substring(0, 12) : tempNum
    }
    else if (data === '.') {
      operationType = 'number';

      if (!/\./.test(tempNum)) {
        if (tempNum) {
          tempNum = tempNum + '.';
        } else tempNum = '0';
      }
    }
    else if (data === 'Backspace' && operationType === 'number') {
      tempNum = tempNum.substring(0, tempNum.length - 1);
      tempNum = tempNum ? tempNum : '0';
      isPercent = false;
    }
    else if (['+', '-', '/', '*', ].includes(data) && tempNum) {
      operationType = data;
      historyArr.push(tempNum, operationType);
      tempNum = '';
      isPercent = false;
    }
    else if (data === 'clear') {
      historyArr = [];
      tempNum = '0';
      isPercent = false;
    }
    else if (data === '%') {
      historyArr.push(tempNum);
      isPercent = true;
      isEqual = false;
      tempNum = calculate(historyArr, isPercent, isEqual);
    }
    else if (data === '=') {
      if (!isPercent) {
        historyArr.push(tempNum);
        if (historyArr[1] == '/' && historyArr[2] == '0') {
          tempNum = 'error';
          return;
        }
      }
      isEqual = true;
      tempNum = calculate(historyArr, isPercent, isEqual);
      historyArr = [];
      isPercent = false;
    }
  }

  function renderTotal(value) {
    const totalBlock = calc.querySelector('.calc__result');
    totalBlock.innerHTML = value;
  }

  function renderHistory(historyArray) {
    const historyBlock = calc.querySelector('.calc__history');
    let htmlElems = '';

    historyArray.forEach(elem => {
      if (elem >= 0) {
        htmlElems = htmlElems + `&nbsp;<span>${elem}</span>`;
      }
      else if (['+', '-', '/', '*', '%'].includes(elem)) {
        elem = elem === '*' ? '×' : elem === '/' ? '÷' : elem
        htmlElems = htmlElems + `&nbsp;<span>${elem}</span>`;
      }
    });
    historyBlock.innerHTML = htmlElems;
  }

  // calculating
  function calculate(historyArray, isPercent, isEqual) {
    let total = 0;
    historyArray.forEach((item, idx) => {
      item = parseFloat(item);

      if (idx === 0) {
        total = parseFloat(item);
      }
      else if (idx - 2 >= 0 && isPercent && idx -2 === historyArray.length - 3 ) {
        const x = total
        const n = item
        const operator = historyArray[idx - 1]

        if (!isEqual) {
          total = calcPercent(x, operator, n)
        } else {
          total = calcPercentEqual(x, operator, n);
        }
      }
      else if (idx - 2 >= 0) {
        const prevItem = historyArray[idx - 1];

        if (item >= 0) {
          if (prevItem === '+') total += item;
          else if (prevItem === '-') total -= item;
          else if (prevItem === '*') total *= item;
          else if (prevItem === '/') total /= item;
          else if (prevItem === '%') total = total / 100 * item
        }
      }
    });

    let stringTotal = String( parseFloat(total.toFixed(12)) );
    if ( stringTotal.length > 10 ) {
      return String( parseFloat(total.toFixed(12)).toExponential(10) )
    } else {
      return stringTotal;
    }
  }

  //calc percent when % pressed
  function calcPercent(x, operator, n) {
    let total;
    if (['+', '-'].includes(operator)) {
      total = x * (n / 100);
    }
    else if (['*', '/'].includes(operator)) {
      total = n / 100;
    }
    return total;
  }

  //calc percent when % and = pressed
  function calcPercentEqual(x, operator, n) {
    let total;
    if (operator === '+') {
      total = x + (n / 100 * x);
    }
    else if (operator === '-') {
      total = x - (n / 100 * x);
    }
    else if (operator === '*') {
      total = x * (n / 100 );
    }
    else if (operator === '/') {
      total = x / (n / 100);
    }
    return total
  }

  // Toggle On and Off
  function togglePower() {
    enable = !enable;

    if (enable) {
      tempNum = '0';
      calc.addEventListener('click', clickHandler);
      body.addEventListener('keyup', keyPressHandler);
    } else {
      result.textContent = '';
      calcHistory.textContent = '';
      tempNum = '';
      historyArr = [];
      operationType = '';
      calc.removeEventListener('click', clickHandler);
      body.removeEventListener('keyup', keyPressHandler)
    }
  }
  powerBtn.addEventListener('click', togglePower);
}

document.addEventListener('DOMContentLoaded', init);

