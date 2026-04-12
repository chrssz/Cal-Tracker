/* Renders and handles input for food_list */
import { addUserFoods, getUserFoods, getUserGoals } from "./user_info";

import { addFood, removeFood } from "./meal";

function update_food_list(food) {
    clear_food_list();
    addUserFoods(food);
    
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
        new_div.textContent = this.food.name;

        const select = this.get_select_btn();
        //const del = this.get_delete_btn(); Implement later to allow user to remove items from list
        
        new_div.appendChild(select);
        //new_div.appendChild(del);

        this.div = new_div;
        return new_div;
    }
    select_div(btn){
        btn.classList.add("active");
        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).slice(2);
        }
        /* This food item can be added to selected foods one or many times, give it a new I.D */
        const new_food_instance = structuredClone(this.food);
        new_food_instance.id = generateId();
        addFood(new_food_instance);
    }
    
    delete_div(){
        if(this.div != null){
            this.div.remove();
        }
    }

    get_delete_btn(){
        const btn = document.createElement("button");
        btn.type = "button";
        btn.classList.add("delete-item-btn");
        btn.addEventListener("click", () => {this.delete_div();})
        return btn;
    }

    get_select_btn(){
        const btn = document.createElement("button");
        btn.type = "button";
        btn.classList.add("select-item-btn");
        btn.addEventListener("click", () => {this.select_div(btn);})
        return btn;
    }
}
export {update_food_list}