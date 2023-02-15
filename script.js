let budget = 0;
let barCount = 0;
let currentpl = [100];
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
    let queryField = document.createElement('div');

    queryField.classList.add('query-field');
    inputField.classList.add('budget-form');
    inputField.setAttribute('type','number');
    inputField.setAttribute('name', 'budgetInput');
    
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
    stage.innerHTML = '';
    createBar();
    addNewBar();
}

function createBar() {
    let barBlock = document.createElement('div');
    let bar = document.createElement('div');
    let barTitle = document.createElement('h3');

    bar.classList.add('budget-bar');
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
    remainder.setAttribute('value', budget);
    remainder.setAttribute('type','number');
    total.setAttribute('value', budget);
    total.setAttribute('type','number');
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
    barCount++;
    currentBarBu = bud; 

    minus.addEventListener('click', changeValue);
    plus.addEventListener('click', changeValue);
}

// now needs to display actual value and allocate it to the bar
function changeValue(e) {
    //let currentBar = document.querySelector(`#bar-${currentBarNo}.budget-bar`)
    let currentBar = document.querySelector(`.budget-bar#${e.currentTarget.parentElement.parentElement.id}`);
    currentBarNo = e.currentTarget.parentElement.parentElement.id.slice(-1); //gets current barnumber from parents
    if(e.currentTarget.innerText === '+' && currentpl[currentBarNo] < 100) {
        currentpl[currentBarNo] += ((10/currentBarBu) * 100);
        updateBarValues(currentBar);
        updateRemainder(10);
    }
    if(e.currentTarget.innerText === '-' && currentpl[currentBarNo] > 0) {
        currentpl[currentBarNo] -= ((10/currentBarBu) * 100);
        updateBarValues(currentBar);
        updateRemainder(-10);
    }
}

function updateRemainder(value) {
    //let remainder = bar.closest(`#bar-${currentBarNo} .bar-block`).;
    let funds = document.querySelector(`#bar-${currentBarNo} .funds`);
    let remainder = funds.lastChild;
    let num = +remainder.value
    remainder.value = num + value;
}

// function to readjust the bar and internal logic when total/remainder is changed
function updateValues(e) {
    currentBarNo = e.currentTarget.parentElement.parentElement.parentElement.id.slice(-1);
    let total = document.querySelector(`#bar-${currentBarNo} .total`);
    let remainder = document.querySelector(`#bar-${currentBarNo} .remainder`);
    currentBarBu = total.value;
    currentpl[currentBarNo] = (remainder.value/currentBarBu) * 100;
    updateBarValues(document.querySelector(`#bar-${currentBarNo} .budget-bar`));
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

//issue when budget is under 10
//update the way currentBarNo is updated too long atm