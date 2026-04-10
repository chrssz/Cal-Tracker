/* Handles the data given from the form food input */
/*This functionaliy handles the input of data, and the buttons associated with the input; Clear, Add Food */
import { update_meal_macros } from "./meal";
import { update_food_list } from "./food_list";
function init_food_input_events(){
    init_food_input_clear();
    init_food_input_add();
    init_tab_select();
    init_save_food_to_list();
}

function init_food_input_clear(){
    let btn = document.getElementById("clear-food");
    btn.addEventListener("click", () => {clear_input();});
}

function init_save_food_to_list(){
    const btn = document.getElementById("save-food");

    btn.addEventListener("click", () => {add_input();});
}

function init_food_input_add(){
    let btn = document.getElementById("add-food");

    btn.addEventListener("click", () => {add_input();});
}
function init_tab_select(){
    let custom_btn = document.getElementById("customFood-btn");
    let food_btn = document.getElementById("foodList-btn");
    /* 0 for custom_btn; 1 for active_btn */
    custom_btn.addEventListener("click", () => {
        set_active(0); 
        updateText();
    })
    food_btn.addEventListener("click", () => {
        set_active(1); 
        updateText();

    })
}
function set_active(new_active){
    const slots = [document.getElementById("customFood-btn"), document.getElementById("foodList-btn")];
    const windows = [null, document.getElementById("food-list")];
    const current_active = getActiveSlot();
    
    if (current_active != new_active)
    {
        const new_active = (current_active + 1) % 2;

        slots[current_active].classList.remove("active");
        slots[new_active].classList.add("active");
        
        if(windows[current_active] != null){
            windows[current_active].classList.add("hidden");
        }
        
        if(windows[new_active] != null){
            windows[new_active].classList.remove("hidden");
        }
    }
    
}

function clear_input(){
    const inputs = ["food-name","food-calories","food-fats","food-carbs", "food-protein", "food-gram"];
    inputs.forEach(element => {
        const form = document.getElementById(element);
        form.value = '';
    });
}
function updateText(){
    const message = { 0: [document.getElementById("add-food")],
                      1: [document.getElementById("save-food"), 
                        document.getElementById("enter-gram"),
                        document.getElementById("food-gram")]
    };
    const current_active = getActiveSlot();

    message[(current_active + 1) % 2].forEach(element => {
        element.classList.add("hidden");
    });

    message[current_active].forEach(element =>{
        element.classList.remove("hidden");
    })
}
function add_input() {
    /* Add input, can be added to two different states. It can be added to the current meal state ||
       Or it can be added to the user-foods-list state */
    const food = getFood();
    const slot = getActiveSlot();

    const toDo = [update_meal_macros, update_food_list];
    
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
        protein: parseInt(document.getElementById("food-protein").value) || 0,
        grams: parseInt(document.getElementById("food-gram").value) || 0
    };

    return food_object;
}

export {init_food_input_events, clear_input}