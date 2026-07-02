const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");

const toggleDark = document.getElementById("toggleDark");
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

const budgetInput = document.getElementById("budgetInput");
const budgetStatus = document.getElementById("budgetStatus");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budget = 0;

// Add transaction
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    category: category.value
  };

  transactions.push(transaction);
  updateApp();

  text.value = "";
  amount.value = "";
  category.value = "";
});

// Delete
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateApp();
}

// UI render
function render() {
  list.innerHTML = "";

  transactions.forEach(t => {
    const sign = t.amount < 0 ? "-" : "+";

    const li = document.createElement("li");

    li.innerHTML = `
      <div>
        <strong>${t.text}</strong><br/>
        <small>${t.category}</small>
      </div>
      <div>
        ${sign}₹${Math.abs(t.amount)}
        <button onclick="deleteTransaction(${t.id})">x</button>
      </div>
    `;

    list.appendChild(li);
  });
}

// Update values
function updateValues() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((a,b)=>a+b,0);
  const incomeTotal = amounts.filter(v=>v>0).reduce((a,b)=>a+b,0);
  const expenseTotal = amounts.filter(v=>v<0).reduce((a,b)=>a+b,0)*-1;

  balance.innerText = `₹${total}`;
  income.innerText = `₹${incomeTotal}`;
  expense.innerText = `₹${expenseTotal}`;
}

// Chart
function drawChart() {
  const amounts = transactions.map(t => t.amount);

  const incomeTotal = amounts.filter(v=>v>0).reduce((a,b)=>a+b,0);
  const expenseTotal = amounts.filter(v=>v<0).reduce((a,b)=>a+b,0)*-1;

  const total = incomeTotal + expenseTotal;

  ctx.clearRect(0,0,300,200);

  if(total === 0) return;

  const incomeAngle = (incomeTotal/total)*2*Math.PI;

  ctx.beginPath();
  ctx.moveTo(150,100);
  ctx.arc(150,100,70,0,incomeAngle);
  ctx.fillStyle="green";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(150,100);
  ctx.arc(150,100,70,incomeAngle,2*Math.PI);
  ctx.fillStyle="red";
  ctx.fill();
}

// Budget
budgetInput.addEventListener("change",()=>{
  budget = +budgetInput.value;
  updateBudget();
});

function updateBudget(){
  const expenseTotal = transactions
    .filter(t=>t.amount<0)
    .reduce((a,b)=>a+b.amount,0)*-1;

  if(budget===0) return;

  if(expenseTotal > budget){
    budgetStatus.innerText = "⚠ Budget Exceeded!";
    budgetStatus.style.color="red";
  } else {
    budgetStatus.innerText = "✔ Within Budget";
    budgetStatus.style.color="lightgreen";
  }
}

// Save
function save(){
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Dark mode
toggleDark.addEventListener("click",()=>{
  document.body.classList.toggle("dark");
});

// Master update
function updateApp(){
  render();
  updateValues();
  drawChart();
  updateBudget();
  save();
}

updateApp();