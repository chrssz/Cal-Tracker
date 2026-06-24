import { removeUserMeal, removeConsumed } from "./user_info";
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

    render_scroll_indicators(user_meals.length);
}
function removeMealLocalStorage(meal) {
    const user_meals = JSON.parse(localStorage.getItem("meals") || "[]");;
    const new_meals = [];
    
    user_meals.forEach(item => {
        if(item.meal_id !== meal.meal_id){
            new_meals.push(item);
        }
    });

    localStorage.setItem("meals", JSON.stringify(new_meals));

}
function render_scroll_indicators(count) {
    const container = document.getElementById('today-meals');
    let dots_wrap = container.querySelector('.scroll-indicators');

    if(dots_wrap) dots_wrap.remove();
    if(count <= 1) return; // no dots needed for 0 or 1 meal

    dots_wrap = document.createElement('div');
    dots_wrap.classList.add('scroll-indicators');

    for(let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.classList.add('scroll-dot');
        if(i === 0) dot.classList.add('active');
        dot.dataset.index = i;
        dots_wrap.appendChild(dot);
    }

    container.appendChild(dots_wrap);

    const scroll_el = document.getElementById('today-meal-history');

    const update_active = () => {
        const index = Math.round(scroll_el.scrollLeft / scroll_el.clientWidth);
        dots_wrap.querySelectorAll('.scroll-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    };

    scroll_el.addEventListener('scroll', () => {
        requestAnimationFrame(update_active);
    });

    dots_wrap.querySelectorAll('.scroll-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            scroll_el.scrollTo({ left: index * scroll_el.clientWidth, behavior: 'smooth' });
        });
    });
}
class HistoryPanel {
    constructor(meal, mealIndex) {
        this.meal = meal;
        this.foods = meal.foods;  
        this.name = meal.name;     
        this.index = mealIndex;
        this.div = null;
        this.total = {calories: meal['calories'], fats: meal['fats'], carbs: meal['carbs'], protein: meal['protein']};
    }

    get_div_element() {
        if (this.div != null) return this.div;

        const panel = document.createElement("div");
        panel.classList.add("history-panel");

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

        this.foods.forEach(food => {
            

            const food_item = document.createElement("div");
            food_item.classList.add("history-food-item");

            const food_name = document.createElement("div");
            food_name.classList.add("history-food-name");
            food_name.innerHTML = food.name;

            const food_info = document.createElement("div");
            food_info.classList.add("history-food-info");
            food_info.innerHTML =
                `${food.calories} cal • ` +
                `F:${food.fats}g • ` +
                `C:${food.carbs}g • ` +
                `P:${food.protein}g`;

            food_item.appendChild(food_name);
            food_item.appendChild(food_info);
            foods_container.appendChild(food_item);

        });
       

        const totals = document.createElement("div");
        totals.classList.add("history-total-macros");
        totals.innerHTML =
            `${this.total["calories"]} cal • ` +
            `F:${this.total["fats"]}g • ` +
            `C:${this.total["carbs"]}g • ` +
            `P:${this.total["protein"]}g`;

        panel.appendChild(header);
        panel.appendChild(foods_container);
        panel.appendChild(totals);

        this.div = panel;
        return panel;
    }
    
    async remove_meal() {
        removeMealLocalStorage(this.meal);
        console.log(this.total);
        await set_Consumed(this.total, false);
        
        
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
        
    }
}

export { updateHistoryUi };