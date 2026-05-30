import { getUserMeals, removeUserMeal, removeConsumed } from "./user_info";
import { renderAll } from "./uiRender";
import { set_Consumed } from "./progress";

async function updateHistoryUi() {
    const history_container = document.getElementById("today-meal-history");
    if (!history_container) return;

    history_container.innerHTML = "";
  
    const user_meals = JSON.parse(localStorage.getItem("meals") || "[]");

    if (user_meals.length === 0) {
        const empty = document.createElement("div");
        empty.classList.add("history-empty");
        empty.innerHTML = "No meals added today.";
        history_container.appendChild(empty);
        return;
    }
    
    user_meals.forEach((meal, index) => {
        const history_panel = new HistoryPanel(meal, index);
        history_container.appendChild(history_panel.get_div_element());
    });
}
function removeMealLocalStorage(meal) {
    const user_meals = JSON.parse(localStorage.getItem("meals") || "[]");;
    const new_meals = [];
    user_meals.forEach(item => {
        if(item.id !== meal.id){
            new_meals.push(item);
        }
    });

    localStorage.setItem("meals", JSON.stringify(new_meals));

}
class HistoryPanel {
    constructor(meal, mealIndex) {
        this.meal = meal;
        this.foods = meal.foods;   // ← extract foods from meal object
        this.name = meal.name;     // ← extract name from meal object
        this.index = mealIndex;
        this.div = null;
        this.total = {calories: 0, fats: 0, carbs: 0, protein: 0};
    }

    get_div_element() {
        if (this.div != null) return this.div;

        const panel = document.createElement("div");
        panel.classList.add("history-panel");

        /* ---------- Header ---------- */
        const header = document.createElement("div");
        header.classList.add("history-panel-header");

        const title = document.createElement("div");
        title.classList.add("history-panel-title");
        title.innerHTML = this.name || `Meal ${this.index + 1}`;

        const remove_btn = document.createElement("button");
        remove_btn.type = "button";
        remove_btn.classList.add("history-remove-btn");
        remove_btn.innerHTML = "×";
        remove_btn.addEventListener("click", () => { this.remove_meal(); });

        header.appendChild(title);
        header.appendChild(remove_btn);

        const foods_container = document.createElement("div");
        foods_container.classList.add("history-foods-container");

        let total_calories = 0;
        let total_carbs = 0;
        let total_fats = 0;
        let total_protein = 0;

        this.foods.forEach(food => {
            total_calories += food.calories || 0;
            total_carbs += food.carbs || 0;
            total_fats += food.fats || 0;
            total_protein += food.protein || 0;

            const food_item = document.createElement("div");
            food_item.classList.add("history-food-item");

            const food_name = document.createElement("div");
            food_name.classList.add("history-food-name");
            food_name.innerHTML = food.name;

            const food_info = document.createElement("div");
            food_info.classList.add("history-food-info");
            food_info.innerHTML =
                `${food.calories} cal • ` +
                `P:${food.protein}g • ` +
                `C:${food.carbs}g • ` +
                `F:${food.fats}g`;

            food_item.appendChild(food_name);
            food_item.appendChild(food_info);
            foods_container.appendChild(food_item);


        });
        this.total.calories = total_calories;
        this.total.fats = total_fats;
        this.total.carbs = total_carbs;
        this.total.protein = total_protein;

        const totals = document.createElement("div");
        totals.classList.add("history-total-macros");
        totals.innerHTML =
            `${total_calories} cal • ` +
            `P:${total_protein}g • ` +
            `C:${total_carbs}g • ` +
            `F:${total_fats}g`;

        panel.appendChild(header);
        panel.appendChild(foods_container);
        panel.appendChild(totals);

        this.div = panel;
        return panel;
    }
    
    async remove_meal() {
        removeMealLocalStorage(this.meal);
        set_Consumed(this.total, false);
        

        if (this.div != null){this.div.remove()};
        updateHistoryUi();
        renderAll();
        try{
            const response = await removeUserMeal(this.meal);
            if(response.error){
                console.log(`${response.error}`);
            }

            

        } catch(err){
            console.log(err);
        }
        
        try{
            const response = await removeConsumed(this.foods);
            if(response.error){
                console.log(response.error);
            }
            
        }catch(err){
            console.log(err);
        }
        
       
        
    }
}

export { updateHistoryUi };