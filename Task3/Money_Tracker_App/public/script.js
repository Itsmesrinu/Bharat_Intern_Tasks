let expenses = [];
let totalAmount = 0;

const categorySelect = document.getElementById('category');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const timeInput = document.getElementById('time-input');
const addBtn = document.getElementById('add-btn');
const deleteBtn = document.getElementById('delete-btn');
const expensesTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

addBtn.addEventListener('click', async function () {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;
    const time = timeInput.value;

    if (category === '' || isNaN(amount) || amount <= 0 || date === '' || time === '') {
        alert('Please enter valid details');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/addExpense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category, amount, date, time }),
        });

        if (!response.ok) {
            throw new Error('Failed to add expense');
        }

        const result = await response.json();
        console.log(result.message);
        alert('Expense Added Successfully');

        // Update the UI or perform any other necessary actions
        const expense = { category, amount, date, time };
        expenses.push(expense);
        totalAmount += amount;
        totalAmountCell.textContent = totalAmount;

        renderExpense(expense);
    } catch (error) {
        console.error(error.message);
        alert('Failed to add expense');
    }
});

deleteBtn.addEventListener('click', async function () {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;
    const time = timeInput.value;

    if (category === '' || isNaN(amount) || amount <= 0 || date === '' || time === '') {
        alert('Please enter valid details');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/deleteExpense', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category, amount, date, time }),
        });

        if (!response.ok) {
            throw new Error(`Failed to delete expense: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result.message);

        // Update the UI or perform any other necessary actions
        removeExpense({ category, amount, date, time });
        alert('Expense Deleted Successfully');
    } catch (error) {
        console.error(error.message);
        alert('Failed to delete expense: ' + error.message);
    }
});

function renderExpense(expense) {
    const newRow = expensesTableBody.insertRow();
    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const timeCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();
    const deleteBtn = document.createElement('button');

    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    /*deleteBtn.addEventListener('click', function () {
        expenses.splice(expenses.indexOf(expense), 1);
        totalAmount -= expense.amount;
        totalAmountCell.textContent = totalAmount;
        expensesTableBody.removeChild(newRow); */
        deleteBtn.addEventListener('click', async function () {
            const category = categorySelect.value;
            const amount = Number(amountInput.value);
            const date = dateInput.value;
            const time = timeInput.value;
        
            if (category === '' || isNaN(amount) || amount <= 0 || date === '' || time === '') {
                alert('Please enter valid details');
                return;
            }
        
            try {
                const response = await fetch('http://localhost:3000/deleteExpense', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ category, amount, date, time }),
                });
        
                if (!response.ok) {
                    throw new Error(`Failed to delete expense: ${response.statusText}`);
                }
        
                const result = await response.json();
                console.log(result.message);
        
                // Update the UI or perform any other necessary actions
                removeExpense({ category, amount, date, time });
                alert('Expense Deleted Successfully');
            } catch (error) {
                console.error(error.message);
                alert('Failed to delete expense: ' + error.message);
            }
    });
    

    categoryCell.textContent = expense.category;
    amountCell.textContent = expense.amount;
    dateCell.textContent = expense.date;
    timeCell.textContent = expense.time;    
    deleteCell.appendChild(deleteBtn);
}

async function handleDelete(expense) {
    try {
        console.log('Sending DELETE request:', expense);

        const response = await fetch('http://localhost:3000/deleteExpense', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expense),
        });

        if (!response.ok) {
            throw new Error('Failed to delete expense');
        }

        const result = await response.json();
        console.log('Delete response:', result.message);

        // Update the UI or perform any other necessary actions
        removeExpense(expense);
    } catch (error) {
        console.error(error.message);
        alert('Failed to delete expense');
    }
}

function removeExpense(expense) {
    const index = expenses.findIndex(
        (e) => e.category === expense.category && e.amount === expense.amount && e.date === expense.date && e.time === expense.time
    );

    if (index !== -1) {
        const deletedExpense = expenses.splice(index, 1)[0];
        totalAmount -= deletedExpense.amount;
        totalAmountCell.textContent = totalAmount;

        // Find and remove the corresponding row from the table
        const rows = expensesTableBody.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            const rowExpense = {
                category: cells[0].textContent,
                amount: parseFloat(cells[1].textContent),
                date: cells[2].textContent,
                time: cells[3].textContent,
            };

            if (
                rowExpense.category === deletedExpense.category &&
                rowExpense.amount === deletedExpense.amount &&
                rowExpense.date === deletedExpense.date &&
                rowExpense.time === deletedExpense.time
            ) {
                expensesTableBody.removeChild(rows[i]);
                break;
            }
        }
    }
}


const viewHistoryBtn1 = document.getElementById('view-history-btn');
viewHistoryBtn1.addEventListener('click', async function () {
    try {
        const response = await fetch('http://localhost:3000/getExpenses');
        if (!response.ok) {
            throw new Error('Failed to fetch expense history');
        }

        const expenses = await response.json();
        displayExpenseHistory(expenses);
    } catch (error) {
        console.error(error.message);
        alert('Failed to fetch expense history');
    }
});

function displayExpenseHistory(expenses) {
    // Logic to display the full expense list on your page
    // You can use a modal, a separate page, or any other method to display the history.
    // For simplicity, let's assume you have a div with the ID 'expense-history' to display the list.

    const expenseHistoryDiv = document.getElementById('expense-history');
    expenseHistoryDiv.innerHTML = '';

    expenses.forEach((expense) => {
        const expenseInfo = document.createElement('p');
        expenseInfo.textContent = `Category: ${expense.category}, Amount: ${expense.amount}, Date: ${expense.date}, Time: ${expense.time}`;
        expenseHistoryDiv.appendChild(expenseInfo);
    });

    // You can customize this based on your UI requirements
}

const viewHistoryBtn2 = document.getElementById('view-history-btn');
const historySection = document.getElementById('expense-history'); // Adjust the id accordingly

viewHistoryBtn2.addEventListener('click', function () {
    // Toggle visibility
    historySection.style.display = historySection.style.display === 'none' ? 'block' : 'none';
});

/*
// Example using fetch
const openHistoryBtn = document.getElementById('open-history-btn');
openHistoryBtn.addEventListener('click', function () {
    fetch('/openHistory', { method: 'POST' })
        .then(response => response.text())
        .then(message => console.log(message))
        .catch(error => console.error('Error:', error));
});

const closeHistoryBtn = document.getElementById('close-history-btn');
const reloadHistoryBtn = document.getElementById('reload-history-btn');

closeHistoryBtn.addEventListener('click', function () {
    // Send request to close history
    sendHistoryRequest('closeHistory');
});

reloadHistoryBtn.addEventListener('click', function () {
    // Send request to reload history
    sendHistoryRequest('reloadHistory');
});

function sendHistoryRequest(action) {
    fetch(`/${action}`, { method: 'POST' })
        .then(response => response.text())
        .then(message => console.log(message))
        .catch(error => console.error('Error:', error));
} */
