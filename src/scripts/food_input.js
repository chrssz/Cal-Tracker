/* Handles the data given from the form food input */
/*This functionaliy handles the input of data, and the buttons associated with the input; Clear, Add Food */
import { addFood } from "./meal";
import { add_food_list } from "./food_list";

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
/* Handles the logic for which type of input user selected (Custom food or food list) */
function set_active(new_active){
    const slots = [document.getElementById("customFood-btn"), document.getElementById("foodList-btn")];
    const current_active = getActiveSlot();


    slots.forEach((element, i) => {
        if(element.classList.contains("active")){
            element.classList.remove("active");
        }

        if(i == new_active){
            element.classList.add("active");
        }
    });
    
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
                        document.getElementById("food-gram"), 
                        document.getElementById("food-list")]
    };
    const current_active = getActiveSlot();
    
    for(let key in message) {
        message[key].forEach(element => {
            element.classList.add("hidden");
        });
    }
    
    message[current_active].forEach(element =>{
        element.classList.remove("hidden");
    })
}
function add_input() {
    /* Based on the current active slot, add food to the corresponding function */
    
    const food = getFood();
    const slot = getActiveSlot();

    const toDo = [addFood, add_food_list];
    
    toDo[slot](food);
    clear_input();
}

/* Helper Functions */
function getActiveSlot() {
    const slots = [document.getElementById("customFood-btn"), document.getElementById("foodList-btn")];
    for (const [index, element] of slots.entries()) {
        if (element.classList.contains("active")) {
            return index;
        }
    }

    return 0;
}


function getFood() {
    const food_object = {
        id: generateId(),
        name: document.getElementById("food-name").value || '',
        calories: parseInt(document.getElementById("food-calories").value) || 0,
        fats: parseInt(document.getElementById("food-fats").value) || 0,
        carbs: parseInt(document.getElementById("food-carbs").value) || 0,
        protein: parseInt(document.getElementById("food-protein").value) || 0,
        grams: parseInt(document.getElementById("food-gram").value) || 0
    };

    return food_object;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
export {init_food_input_events, clear_input}