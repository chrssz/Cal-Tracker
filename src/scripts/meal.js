let current_meal = [];
let current_foods = [];
import { clear_input } from "./food_input";
import { renderAll } from "./uiRender";
import { setConsumed } from "./user_info";
function init_meal_events(){
    const save_meal = document.getElementById("save-meal");
    const cancel_meal = document.getElementById("cancel-meal");
    
    save_meal.addEventListener("click", () => {saveMeal();});
    cancel_meal.addEventListener("click", ()=>{cancelMeal();});
}
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
    console.log(current_foods);

    clearMealInsertedFoods();
    updateMealInsertedFoods();
}
function clear_meal_macros() {
    document.getElementById("meal-calories").innerHTML = 0;
    document.getElementById("meal-fats").innerHTML = 0;
    document.getElementById("meal-carbs").innerHTML =0;
    document.getElementById("meal-protein").innerHTML = 0;
}
function getTotalValue() {
    
    const total = {
        calories: 0,
        fats: 0,
        carbs: 0,
        protein: 0
    }

    current_foods.forEach(food => {
        total.calories += food.calories;
        total.fats += food.fats;
        total.carbs += food.carbs;
        total.protein += food.protein;
    });
    
    return total;
}

/* This can be optimized; in the future look for a hashmap to store selected foods for O(1) lookup and deletion */
function clearMealInsertedFoods() {
    const food_select = document.getElementById("food-selected");
    while (food_select.firstChild) {
        food_select.removeChild(food_select.firstChild);
    }
}

function updateMealInsertedFoods(){
    const food_select = document.getElementById("food-selected");
    current_foods.forEach(element => {
        const new_div = document.createElement("div");
        new_div.classList.add("added-food");

        const added_food_name_div = document.createElement("div");
        added_food_name_div.classList.add("added-food-name");
        
        added_food_name_div.innerHTML = element.name;

        const added_food_info_div = document.createElement("div");
        added_food_info_div.classList.add("added-food-info");

        added_food_info_div.innerHTML = `Cals:${element.calories} F:${element.fats}g C:${element.carbs}g P:${element.protein}g`;

        new_div.appendChild(added_food_name_div);
        new_div.appendChild(added_food_info_div);

        food_select.appendChild(new_div);
    });


}

function saveMeal() {
    /* Save this meal and its food contents */
    /*Some call to the api here, for now local. */

    close_meal_window();
    
    const total = getTotalValue(); /* Future api call here*/

    clear_input();
    clear_meal_macros();
    clearMealInsertedFoods();
    clear_meal_and_food();
    setConsumed(total);
    renderAll();
}

function cancelMeal(){
    close_meal_window();
    clear_input();
    clear_meal_and_food();
    clear_meal_macros();
    clearMealInsertedFoods();
}
function clear_meal_and_food(){
    current_foods = {};
    current_foods = {};
}
function close_meal_window(){
    document.getElementById("add-meal-container").classList.remove("open");
}
export {update_meal_macros, init_meal_events}