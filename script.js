let budget = 0;
let barCount = 0;
let currentpl = [100];
let currentBarNo = 0;
let currentBarBu = 0;
let currentBarRem = 0;
let startButton = document.querySelector('#start');
let stage = document.querySelector('.content');

setUpSettings()
startButton.addEventListener('click', startApp);

//Potentially rename to 'initialise'
function startApp() {
    // add transition before removing
    startButton.remove();

    let inputField = document.createElement('input');
    let inputLabel = document.createElement('label');
    let submitButton = document.createElement('button');
    let queryField = document.createElement('div');

    queryField.classList.add('query-field');
    inputField.classList.add('budget-form');
    inputField.setAttribute('type','number');
    inputField.setAttribute('name', 'budgetInput');
    inputField.setAttribute('onkeydown', 'return event.keyCode !== 69');
    
    inputLabel.setAttribute('for', 'budgetInput');
    inputLabel.innerText = "What is your monthly budget?";

    submitButton.innerText = "Submit";
    submitButton.setAttribute('id', 'submit-button');
    
    queryField.appendChild(inputLabel);
    queryField.appendChild(inputField);
    queryField.appendChild(submitButton);

    stage.appendChild(queryField);

    submitButton.addEventListener('click', setBudget);

}

function setBudget () {
    budget = document.querySelector('.budget-form').value;
    if(+budget < 0) {
        alert('Please enter a valid number');
    }
    else {
        stage.innerHTML = '';
        createBar();
        addNewBar();
        addBudgetDisplay();
    }
}

function createBar() {
    let barBlock = document.createElement('div');
    let bar = document.createElement('div');
    let barTitle = document.createElement('h3');

    bar.classList.add('budget-bar');
    barTitle.setAttribute('contenteditable', 'true');
    //given barname, make it changeable
    let barName = "bar" + "-" + barCount;
    bar.setAttribute('id', barName);
    barTitle.innerText = barName;
    barBlock.setAttribute('id', barName); // create function that loops through bar blocks and adds new number on top
    barBlock.classList.add('bar-block');
    
    stage.appendChild(barBlock);
    barBlock.appendChild(barTitle);
    barBlock.appendChild(bar);
    //bar = document.querySelector('.budget-bar');
    //bar = document.getElementById(`#${barName}`);
    bar = document.querySelector(`.budget-bar#${barName}`);
    bar.style.background = 'linear-gradient(to top, orange 100%, orangered 0%)';
    barBlock.appendChild(createBarNav());

    if(document.contains(document.getElementById("add-bar-button"))) {
        document.getElementById("add-bar-button").remove();
        addNewBar();
    }
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
    setInputAttributes(total, remainder);
    barNavigation.classList.add('bar-nav');
    plusButton.classList.add('nav-button');
    plusButton.classList.add('nav-plus');
    minusButton.classList.add('nav-button');
    funds.classList.add('funds');
    funds.setAttribute('id', `#bar-${currentBarNo}`);
    total.classList.add('total');
    remainder.classList.add('remainder');
    remainder.addEventListener('input', updateValues);
    total.addEventListener('input', updateValues);

    funds.appendChild(remainder);
    funds.appendChild(total);
    barNavigation.appendChild(plusButton);
    barNavigation.appendChild(minusButton);
    barNavigation.appendChild(funds);

    setupButtons(minusButton, plusButton, remainder.value);

    return barNavigation;
}

function setInputAttributes(total, remainder) {
    remainder.setAttribute('value', getRemainingBudget());
    remainder.setAttribute('type','number');
    remainder.setAttribute('min','0');
    remainder.setAttribute('onkeydown', 'return event.keyCode !== 69');
    remainder.setAttribute('onkeydown', 'return event.keyCode !== 189');
    remainder.setAttribute('onkeydown', 'return event.keyCode !== 187');
    total.setAttribute('value', getRemainingBudget());
    total.setAttribute('type','number');
    total.setAttribute('min','0');
    total.setAttribute('onkeydown', 'return event.keyCode !== 69');
    total.setAttribute('onkeydown', 'return event.keyCode !== 189');
    total.setAttribute('onkeydown', 'return event.keyCode !== 187');
}

function setupButtons(minus, plus, bud) {
    let remainder = document.querySelector('#testBar .remainder');

    currentBarNo = barCount;
    barCount++;
    currentBarBu = bud;
    currentBarRem = bud;

    minus.addEventListener('click', changeValue);
    plus.addEventListener('click', changeValue);
}

// now needs to display actual value and allocate it to the bar
function changeValue(e) {
    //let currentBar = document.querySelector(`#bar-${currentBarNo}.budget-bar`)
    let operand = 10;
    let currentBar = document.querySelector(`.budget-bar#${e.currentTarget.parentElement.parentElement.id}`);
    currentBarNo = e.currentTarget.parentElement.parentElement.id.slice(-1); //gets current barnumber from parents
    if(e.currentTarget.innerText === '+' && currentpl[currentBarNo] < 100) {
        currentpl[currentBarNo] += ((10/currentBarBu) * 100);
        updateBarValues(currentBar);
        updateRemainder(operand);
    }
    if(e.currentTarget.innerText === '-' && currentpl[currentBarNo] > 0) {
        currentpl[currentBarNo] -= ((10/currentBarBu) * 100);
        updateBarValues(currentBar);
        updateRemainder(-operand);
    }
}

function updateRemainder(value) {
    //let remainder = bar.closest(`#bar-${currentBarNo} .bar-block`).;
    let funds = document.querySelector(`#bar-${currentBarNo} .funds`);
    let remainder = funds.firstChild;
    let total = funds.lastChild;
    let num = +remainder.value;
    let tot = +total.value;

    if(value < 0 && num < Math.abs(value)) {
        value = -num;
    }
    if(value > 0 && num + value > tot) {
        value = tot - num;
    }
    remainder.value = num + value;
}

// function to readjust the bar and internal logic when total/remainder is changed
function updateValues(e) {
    let total = document.querySelector(`#bar-${currentBarNo} .total`);
    let remainder = document.querySelector(`#bar-${currentBarNo} .remainder`);
    let rem = +remainder.value;

    if(checkBudgetLogic(getBarTotals(), rem)) {
        currentBarNo = e.currentTarget.parentElement.parentElement.parentElement.id.slice(-1);
        currentBarBu = total.value;
        currentBarRem = remainder.value;
        currentpl[currentBarNo] = (remainder.value/currentBarBu) * 100;
        updateBarValues(document.querySelector(`#bar-${currentBarNo} .budget-bar`));
    }
    else {
        total.value = currentBarBu;
        remainder.value = currentBarRem;
    }
}

function updateBarValues(bar) {
    bar.style.background = `linear-gradient(to top, orange ${currentpl[currentBarNo]}%, orangered 0%)`;
}

function addNewBar() {
    let button = document.createElement('button');
    button.setAttribute('id', 'add-bar-button');
    button.innerText = "+";
    button.addEventListener('click', createBar);
    stage.appendChild(button);
    currentpl.push(100);
}

function addBudgetDisplay() {
    let body = document.querySelector('body');
    let displayBudget = document.createElement('input');
    let display = document.createElement('div');
    display.setAttribute('id', 'budget-display');
    displayBudget.setAttribute('value', budget);
    displayBudget.setAttribute('id', 'budget');
    displayBudget.setAttribute('onkeydown', 'return event.keyCode !== 189');
    displayBudget.setAttribute('onkeydown', 'return event.keyCode !== 187');
    display.innerText = 'Total Budget: £';
    display.appendChild(displayBudget);
    body.insertBefore(display, stage);
    displayBudget.addEventListener('input', updateBudget);
}

function updateBudget() {
    let num = document.querySelector('#budget').value;
    budget = +num;
}

function getRemainingBudget() {
    leftover = getBarTotals();
    return budget - leftover;
}

function getBarTotals() {
    let num = 0;
    let totals = document.getElementsByClassName('total');
    for(let i = 0; i < totals.length; i++) {
        num = num + +totals[i].value;
    }
    return num;
}

// checks that the bar totals add up to the total budget
function checkBudgetLogic(total, remainder) {
    if(total > budget) {
        alert("You're over the budget!");
        return false;
    }
    if(remainder > total) {
        alert("The remainder is higher than the total!");
        return false;
    }
    else {
        return true;
    }
}


// Settings Functions:

function setUpSettings() {
    settings = document.querySelector('#settings');
    settings.addEventListener("click", openSettings);
}

function openSettings() {
    let blur = document.createElement('div')
    let menu = document.createElement('div');
    let increment = document.createElement('div');
    let description = document.createElement('p');
    let value = document.createElement('input');
    description.innerText = "+/- increment"
    value.setAttribute('type', 'number');
    value.setAttribute('min', 0);
    increment.appendChild(description);
    increment.appendChild(value)
    menu.setAttribute('id', 'menu-box');
    menu.appendChild(increment);
    blur.setAttribute('id','blur-screen')

    document.body.appendChild(blur)
    document.body.appendChild(menu)
}


//update the way currentBarNo is updated too long atm//let remainder = bar.closest(`#bar-${currentBarNo} .bar-block`).;

//optional: make currency changable + potentially make every total, remainder etc part of a "bar" object + make sub & add button operand changeable + don't allow for empty input when setting budget

