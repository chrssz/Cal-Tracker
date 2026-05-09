/* Renders and handles input for food_list */
import { addUserFoods, getUserFoods, getUserGoals, removeUserFood } from "./user_info";

import { addFood, removeFood } from "./meal";
function init_food_list_buttons(){
    init_gram_add_cancel();
    init_tabs();
}
function add_food_list(food){
    addUserFoods(food);
    update_food_list();
}
function remove_food_list(food){
    removeUserFood(food);
    update_food_list();
}
function update_food_list() {
    clear_food_list();

    const user_foods = getUserFoods(); /* Future Api call here */
    const food_list = document.getElementById("food-items");

    user_foods.forEach(food => {
        const new_div = new FoodListItem(food);
        
        food_list.appendChild(new_div.get_div_element());
    });
    
}

function clear_food_list(){
    const food_list = document.getElementById("food-items"); 
    while (food_list.firstChild) {
        food_list.removeChild(food_list.firstChild);
    }
}
function getActiveTab(){
    const possible = [document.getElementById("servings"), document.getElementById("serving-grams")];
    if (possible[0].classList.contains("active")){
        return 0;
    }
    else{
        return 1;
    }
}
/* Buttons for the gram insert window */
function init_gram_add_cancel(){
    const add = document.getElementById("add-food-list-insert");
    const cancel = document.getElementById("cancel-food-list-insert");
    

    add.addEventListener("click", () => {
        const prompt_window = document.getElementById("serving-size-prompt");
        const back_ground_fade = document.getElementById("background-fade");
        const serving = Math.max(parseInt(document.getElementById("serving-size-input").value) || 0 , 0);

        const food = selected_food.get_food_clone(getActiveTab(), serving);

        addFood(food);

        prompt_window.classList.add("hidden");
        back_ground_fade.classList.add("hidden");
    });
    cancel.addEventListener("click",() => {
        
        const prompt_window = document.getElementById("serving-size-prompt");
        const back_ground_fade = document.getElementById("background-fade");
        
        prompt_window.classList.add("hidden");
        back_ground_fade.classList.add("hidden");
        
    });

}
function init_tabs(){
    const tabs = [document.getElementById("servings"), document.getElementById("serving-grams")];
    const message = [document.getElementById("serving-size-msg"), document.getElementById("serving-grams-msg")];
    const place_holder = ["Number of servings ex: (1, 2)", "Number of grams ex: (70 g)"];
    const input_button = document.getElementById("serving-size-input");

    function change_active(){
        const active = getActiveTab();
        
        tabs[active].classList.remove("active");
        message[active].classList.add("hidden");

        const new_active = (active + 1) % 2;

        tabs[new_active].classList.add("active");
        message[new_active].classList.remove("hidden");
        input_button.placeholder = place_holder[new_active];
    }

    tabs[0].addEventListener("click", ()=>{
        if(tabs[getActiveTab()] != tabs[0]){
            change_active();
        }
    });

    tabs[1].addEventListener("click", ()=>{
        if(tabs[getActiveTab()] != tabs[1])
        {
            change_active();
        }

    });
}
let selected_food = null;
/* I should've gone with an OOP approach with my other code. it is really clean. Should've done soooner; learning is good */
/* QOL Improvements: Allow user to select one item, and choose a serving size for the food. */

class FoodListItem {
    constructor(foodObject){
        this.food = foodObject;
        this.div = null;
    }
    
    get_div_element(){
        if(this.div != null)
        {
            return this.div;
        }
        const new_div = document.createElement("div");
        new_div.classList.add("food-list-item");
  
        const foodname_div = document.createElement("div");

        foodname_div.classList.add("added-food-name");
        foodname_div.innerHTML = `${this.food.name}`;

        const info_div = document.createElement("div");

        info_div.classList.add("added-food-info");
        info_div.innerHTML = `Cals:${this.food.calories} F:${this.food.fats}g C:${this.food.carbs}g P:${this.food.protein}g`;

        // press and hold for options menu
        let hold_timer;
        new_div.addEventListener("pointerdown", () => {
            hold_timer = setTimeout(() => {
                this.show_options_menu();
            }, 600);  // 600 ms
        });
        new_div.addEventListener("pointerup", () => clearTimeout(hold_timer));
        new_div.addEventListener("pointerleave", () => clearTimeout(hold_timer));

        new_div.append(foodname_div);
        new_div.append(info_div);

        this.div = new_div;
        return new_div;
    }
    
    get_food_clone(activeTab ,grams){
        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).slice(2);
        }
        
        const new_food_instance = structuredClone(this.food);

        const formula = [grams, this.food.grams ? grams / this.food.grams : 0];
        const scale = formula[activeTab];

        new_food_instance.id = generateId();
        new_food_instance.calories = Math.ceil( this.food.calories * scale );
        new_food_instance.carbs = Math.ceil(this.food.carbs * scale);
        new_food_instance.fats = Math.ceil(this.food.fats * scale);
        new_food_instance.protein = Math.ceil(this.food.protein * scale);
        new_food_instance.grams = Math.ceil(grams);
        
        console.log(new_food_instance);
        return new_food_instance;
    }
    show_options_menu(){
        const parentDiv = document.getElementById("main")
        const options = document.createElement("div");
        const back_ground_fade = document.getElementById("background-fade");
        back_ground_fade.classList.remove("hidden");
        options.classList.add("prompt-window");
        
        const add = document.createElement("button");
        const del = document.createElement("button");
        
        add.classList.add("overlay-btn");
        del.classList.add("overlay-btn");

        add.innerHTML = `Add to meal`;
        del.innerHTML = `Delete from list`;

        add.addEventListener("click", ()=>{
            this.select_div();
            options.remove();
        });

        del.addEventListener("click", ()=>{
            this.delete_div();
            options.remove();
            back_ground_fade.classList.add("hidden");
            
        })
        options.appendChild(add);
        options.appendChild(del);

        parentDiv.appendChild(options);
    }
    delete_div(){
        if(this.div != null){
            this.div.remove();
            removeUserFood(this.food);
        }
    }
    select_div(){
        if(this.div != null){
            selected_food = this;
            this.serving_size_prompt();
        }
    }

    /* Prompts user for serving size they want of this foods' instance */
    serving_size_prompt(){
        const prompt_window = document.getElementById("serving-size-prompt");
        const back_ground_fade = document.getElementById("background-fade");

        prompt_window.classList.remove("hidden");
        back_ground_fade.classList.remove("hidden");
    }


}
export {add_food_list, init_food_list_buttons}