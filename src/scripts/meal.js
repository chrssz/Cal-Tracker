let current_meal = [];
let current_foods = [];

function update_meal_macros(food_object){
    const meal_cals = parseInt(document.getElementById("meal-calories").textContent) || 0;
    const meal_fats = parseInt(document.getElementById("meal-fats").textContent) || 0;
    const meal_carbs = parseInt(document.getElementById("meal-carbs").textContent) || 0;
    const meal_protein = parseInt(document.getElementById("meal-protein").textContent) || 0;
    
    document.getElementById("meal-calories").innerHTML = meal_cals + food_object.calories;
    document.getElementById("meal-fats").innerHTML = meal_fats + food_object.fats;
    document.getElementById("meal-carbs").innerHTML = meal_carbs + food_object.carbs;
    document.getElementById("meal-protein").innerHTML = meal_protein + food_object.protein;

    current_meal.push(food_object);
    current_foods.push(food_object);

    updateMealInsertedFoods();
}

function getTotalValue() {
    const forms = ["food-calories", "food-fats", "food-carbs", "food-protein"];

    total = {
        calories: 0,
        fats: 0,
        carbs: 0,
        protein: 0
    }
    current_meal.forEach(food => {
        total.calories += food.calories;
        total.fats += food.fats;
        total.carbs += food.carbs;
        total.protein += food.protein;
    });
    
    return total;
}


function updateMealInsertedFoods(){
    const food_select = document.getElementById("food-selected");
    current_foods.forEach(element => {
        const new_div = document.createElement("div");
        new_div.textContent = element.name;

        food_select.appendChild(new_div);
    });


}
function clearMeal() {
    current_meal = {};
}

export {update_meal_macros}