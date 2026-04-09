/* Handles the data given from the form food input */
/*This functionaliy handles the input of data, and the buttons associated with the input; Clear, Add Food */
import { update_meal_macros } from "./meal";
function init_food_input_events(){
    init_food_input_clear();
    init_food_input_add();
}

function init_food_input_clear(){
    let btn = document.getElementById("clear-food");
    btn.addEventListener("click", () => {clear_input();});
}

function init_food_input_add(){
    let btn = document.getElementById("add-food");

    btn.addEventListener("click", () => {add_input();});
}

function clear_input(){
    const inputs = ["food-name","food-calories","food-fats","food-carbs", "food-protein"];
    inputs.forEach(element => {
        const form = document.getElementById(element);
        form.value = '';
    });
}
function add_input() {
    /* Add input, can be added to two different states. It can be added to the current meal state ||
       Or it can be added to the user-foods-list state */
    const food = getFood();
    const slot = getActiveSlot();

    const toDo = [update_meal_macros];
    
    toDo[slot](food);
    clear_input();
}

/* Helper Functions */
function getActiveSlot() {
    const slots = [document.getElementById("customFood-btn"), document.getElementById("foodList-btn")];
    if (slots[0].classList.contains("active")){
        return 0;
    }

    return 1;
}

function getFood() {
    const food_object = {
        name: document.getElementById("food-name").value || '',
        calories: parseInt(document.getElementById("food-calories").value) || 0,
        fats: parseInt(document.getElementById("food-fats").value) || 0,
        carbs: parseInt(document.getElementById("food-carbs").value) || 0,
        protein: parseInt(document.getElementById("food-protein").value) || 0
    };

    return food_object;
}
export {init_food_input_events, clear_input}