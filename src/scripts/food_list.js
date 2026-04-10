/* Renders and handles input for food_list */
import { addUserFoods, getUserFoods, getUserGoals } from "./user_info";


function update_food_list(food) {
    addUserFoods(food);
    
    const user_foods = getUserFoods(); /* Future Api call here */
    const food_list = document.getElementById("food-items");

    user_foods.forEach(food => {
        const new_div = document.createElement("div");
        new_div.classList.add("food-list-item");

        new_div.textContent = food.name;

        food_list.appendChild(new_div);

    });
    
    console.log("Updated list!");
    console.log(getUserFoods());
}

export {update_food_list}