// Function to render food items in the food log
function renderFoodLog(foodLog) {
    const foodLogElement = document.getElementById('food-log');
    foodLogElement.innerHTML = '';  // Clear existing list

    foodLog.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.name} - ${entry.quantity} units`;
        foodLogElement.appendChild(listItem);
    });
}

// Handle adding more food items dynamically
document.getElementById('add-item').addEventListener('click', function() {
    const foodItemsDiv = document.getElementById('food-items');
    const newFoodDiv = document.createElement('div');
    newFoodDiv.classList.add('food-item');

    const foodNameInput = document.createElement('input');
    foodNameInput.type = 'text';
    foodNameInput.placeholder = 'Food name';
    foodNameInput.classList.add('food-name');
    foodNameInput.required = true;

    const foodQuantityInput = document.createElement('input');
    foodQuantityInput.type = 'number';
    foodQuantityInput.placeholder = 'Quantity';
    foodQuantityInput.classList.add('food-quantity');
    foodQuantityInput.min = 1;  // Minimum quantity is 1
    foodQuantityInput.required = true;

    newFoodDiv.appendChild(foodNameInput);
    newFoodDiv.appendChild(foodQuantityInput);
    foodItemsDiv.appendChild(newFoodDiv);
});

// Handle calculating total calories
document.getElementById('calculate').addEventListener('click', function() {
    const foodItems = [];
    const foodNames = document.getElementsByClassName('food-name');
    const foodQuantities = document.getElementsByClassName('food-quantity');

    for (let i = 0; i < foodNames.length; i++) {
        const name = foodNames[i].value.trim();
        const quantity = foodQuantities[i].value.trim();
        if (name && quantity) {
            foodItems.push({ name, quantity });
        }
    }

    console.log("Food Items to send:", foodItems);  // Debugging line

    // Check if foodItems is not empty
    if (foodItems.length === 0) {
        alert("Please enter at least one food item.");
        return;
    }

    // Send food items to the backend for calorie calculation
    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foodItems }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Response from server:", data);  // Debugging line
        const totalCalories = data.total_calories;

        // Update total calories on the page
        document.getElementById('total-calories').textContent = totalCalories;

        // Render updated food log on the page
        renderFoodLog(foodItems); // Just display the current items in the log
    })
    .catch(error => console.error('Error:', error));
});

// Initialize food log on page load (no stored values)
window.onload = function() {
    const foodLog = [];  // Clear food log
    renderFoodLog(foodLog);
};
