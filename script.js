let budget = 0;
let barCount = 0;
let currentpl = 100;
let currentBarNo = 0;
let currentBarBu = 0; //has to be changed to allow for changing the budget of the bar
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
    let barBlock = document.createElement('div');
    let bar = document.createElement('div');
    let barTitle = document.createElement('h3');

    barBlock.setAttribute('id', 'testBar'); // create function that loops through bar blocks and adds new number on top
    bar.classList.add('budget-bar');
    //given barname, make it changeable
    let barName = "bar" + "-" + barCount;
    bar.setAttribute('id', barName);
    barTitle.innerText = barName;
    
    stage.appendChild(barBlock);
    barBlock.appendChild(barTitle);
    barBlock.appendChild(bar);
    bar = document.querySelector('.budget-bar');
    bar.style.background = 'linear-gradient(to top, orange 100%, orangered 0%)';
    barBlock.appendChild(createBarNav());
}

function createBarNav() {
    let barNavigation = document.createElement('div');
    let plusButton = document.createElement('button');
    let minusButton = document.createElement('button');
    let funds = document.createElement('div');
    let total = document.createElement('input');
    let remainder = document.createElement('input');
    
    plusButton.innerText = '+';
    minusButton.innerText = '-';
    remainder.setAttribute('value', budget);
    remainder.setAttribute('type','number');
    total.setAttribute('value', budget);
    total.setAttribute('type','number');
    barNavigation.classList.add('bar-nav');
    plusButton.classList.add('nav-button');
    plusButton.classList.add('nav-plus');
    minusButton.classList.add('nav-button');
    funds.classList.add('funds');
    total.classList.add('total');
    remainder.classList.add('remainder');

    funds.appendChild(total);
    funds.appendChild(remainder);
    barNavigation.appendChild(plusButton);
    barNavigation.appendChild(minusButton);
    barNavigation.appendChild(funds);

    setupButtons(minusButton, plusButton, remainder.value);

    return barNavigation;
}

function setupButtons(minus, plus, bud) {
    let remainder = document.querySelector('#testBar .remainder');

    currentBarNo = barCount;
    currentBarBu = bud; 

    minus.addEventListener('click', changeValue);
    plus.addEventListener('click', changeValue);
}

// now needs to display actual value and allocate it to the bar
function changeValue(e) {
    let currentBar = document.querySelector(`#bar-${currentBarNo}`)
    if(e.currentTarget.innerText === '+' && currentpl < 100) {
        currentpl += ((10/currentBarBu) * 100);
        currentBar.style.background = `linear-gradient(to top, orange ${currentpl}%, orangered 0%)`;
        updateRemainder(10);
    }
    if(e.currentTarget.innerText === '-' && currentpl > 0) {
        currentpl -= ((10/currentBarBu) * 100);
        currentBar.style.background = `linear-gradient(to top, orange ${currentpl}%, orangered 0%)`;
        updateRemainder(-10);
    }
}

function updateRemainder(value) {
    let remainder = document.querySelector('#testBar .remainder');
    let num = +remainder.value
    remainder.value = num + value;
}

//issue when budget is under 10