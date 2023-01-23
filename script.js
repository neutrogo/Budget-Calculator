let budget = 0;
let barCount = 0;
let currentpl = 100;
let currentBarNo = 0;
let startButton = document.querySelector('#start');
let stage = document.querySelector('.content');


startButton.addEventListener('click', startApp);

//Potentially rename to 'initialise'
function startApp() {
    // add transition before removing
    startButton.remove();

    let inputField = document.createElement('input');
    let inputLabel = document.createElement('label');
    let submitButton = document.createElement('button');

    inputField.classList.add('budget-form');
    inputField.setAttribute('type','number');
    inputField.setAttribute('name', 'budgetInput');
    
    inputLabel.setAttribute('for', 'budgetInput');
    inputLabel.innerText = "What is your monthly budget?";

    submitButton.innerText = "Submit";
    submitButton.setAttribute('id', 'submit-button');
    
    stage.appendChild(inputLabel);
    stage.appendChild(inputField);
    stage.appendChild(submitButton);

    submitButton.addEventListener('click', setBudget);

}

function setBudget () {
    budget = document.querySelector('.budget-form').value;
    stage.innerHTML = '';
    createBar();
}

function createBar() {
    let bar = document.createElement('div');
    let barTitle = document.createElement('h3');

    bar.classList.add('budget-bar');
    //given barname, make it changeable
    barName = "bar" + "-" + barCount;
    bar.setAttribute('id', barName);
    barTitle.innerText = barName;

    stage.appendChild(barTitle);
    stage.appendChild(bar);
    bar = document.querySelector('.budget-bar');
    bar.style.background = 'linear-gradient(to top, orange 100%, orangered 0%)';
    let barNavigation = document.createElement('div');
    let plusButton = document.createElement('button');
    let minusButton = document.createElement('button');
    let remainder = document.createElement('p');
    
    plusButton.innerText = '+';
    minusButton.innerText = '-';
    remainder.innerText = 'placeholder';
    barNavigation.classList.add('bar-nav');
    plusButton.classList.add('nav-button');
    plusButton.classList.add('nav-plus');
    minusButton.classList.add('nav-button');
    remainder.classList.add('remainder');
    barNavigation.appendChild(plusButton);
    barNavigation.appendChild(minusButton);
    barNavigation.appendChild(remainder);
    stage.appendChild(barNavigation);

    setupButtons(bar, minusButton, plusButton);
}

function setupButtons(bar, minus, plus) {
    currentBarNo = barCount;
    minus.addEventListener('click', changeValue);
    plus.addEventListener('click', changeValue);
}

// now needs to display actual value and allocate it to the bar
function changeValue(e) {
    let currentBar = document.querySelector(`#bar-${currentBarNo}`)
    if(e.currentTarget.innerText === '+' && currentpl < 100) {
        currentpl += 10;
        currentBar.style.background = `linear-gradient(to top, orange ${currentpl}%, orangered 0%)`;
    }
    if(e.currentTarget.innerText === '-' && currentpl > 0) {
        currentpl -= 10;
        currentBar.style.background = `linear-gradient(to top, orange ${currentpl}%, orangered 0%)`;
    }
}