document.addEventListener("DOMContentLoaded", function () {
    const incomeInput = document.getElementById("income");
    const calculateBtn = document.getElementById("calculate");
    const resultDiv = document.getElementById("result");
    const categories = ["Rent", "Food", "Transportation", "Savings", "Entertainment", "Other"];
    let budgetChart;

    function getExpenseValues() {
        return categories.map(category => parseFloat(document.getElementById(`expense-${category.toLowerCase()}`).value) || 0);
    }

    function initializeChart(income, expenseValues) {
        const ctx = document.getElementById("budgetChart").getContext("2d");
        if (budgetChart) budgetChart.destroy();

        budgetChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: [...categories, "Remaining Budget"],
                datasets: [{
                    data: [...expenseValues, income - expenseValues.reduce((a, b) => a + b, 0)],
                    backgroundColor: ["#e74c3c", "#3498db", "#f39c12", "#2ecc71", "#9b59b6", "#34495e", "#2ecc71"],
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => `${tooltipItem.label}: $${tooltipItem.raw.toFixed(2)}`
                        }
                    }
                },
                animation: { animateScale: true }
            }
        });
    }

    calculateBtn.addEventListener("click", function () {
        const income = parseFloat(incomeInput.value) || 0;
        const expenseValues = getExpenseValues();
        const totalExpenses = expenseValues.reduce((a, b) => a + b, 0);
        if (income <= 0) {
            resultDiv.innerHTML = "<p style='color: red;'>Please enter a valid income.</p>";
            return;
        }

        const balance = income - totalExpenses;
        resultDiv.innerHTML = `<p>Your remaining budget: <strong>$${balance.toFixed(2)}</strong></p>` +
            (balance < 0 ? "<p style='color: red;'>You're over budget! Reduce expenses.</p>" :
                balance > 0 ? "<p style='color: green;'>You're within budget! Great job!</p>" :
                    "<p style='color: orange;'>You're breaking even. Be mindful of unexpected expenses.</p>");

        initializeChart(income, expenseValues);
    });
});
