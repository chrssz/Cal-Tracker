/* One meal has : foods, foods have calories and macros */
let foods = [];

function init_meal_events() {
    const add_f = document.getElementById("add-food");
    const clear_f = document.getElementById("clear-food")
    add_f.addEventListener("click", () => { 
        add_food();
    });
    clear_f.addEventListener("click", () => {
        clear_input();
    })
}   

function add_food() {
    const user_input = ["input-calories", "input-fats", "input-carbs", "input-protein"];
    const food = {
        name: document.getElementById("input-name").value || "Unnamed Food",
        calories: 0,
        fats: 0,
        carbs: 0,
        protein: 0
    };
    user_input.forEach(element => {
        let form = document.getElementById(element);
        let s = element.slice(6);
        food[s] = Math.max(0, parseInt(form.value) || 0);
    });
    foods.push(food);
    renderMealTotal(); 
    renderFoodList();  
    clear_input();
}

function renderMealTotal() {
    const total = getFoodTotal();
    document.getElementById("meal-calories").innerText = total.calories;
    document.getElementById("meal-fats").innerText = total.fats;
    document.getElementById("meal-carbs").innerText = total.carbs;
    document.getElementById("meal-protein").innerText = total.protein;
}

function renderFoodList() {
    const food_items = document.getElementById("food-selected");
    food_items.innerHTML = "";
    foods.forEach((food, index) => {
        const div = document.createElement("div");
        div.classList.add("food-item");
        div.innerText = `${food.name} — ${food.calories}kcal`;
        food_items.appendChild(div);
    });
}

function clearFoods(){
    foods = [];
    document.getElementById("food-selected").innerHTML = "";
    document.getElementById("meal-calories").innerText = 0;
    document.getElementById("meal-fats").innerText = 0;
    document.getElementById("meal-carbs").innerText = 0;
    document.getElementById("meal-protein").innerText = 0;

    clear_input();
}
function clear_input(){
    const input = ["input-name", "input-calories", "input-fats", "input-carbs", "input-protein"];
    input.forEach(element => {
        const current = document.getElementById(element);
        
        current.value = '';
    });
}
function getFoodTotal() {
    const total = {calories: 0, fats: 0, carbs: 0, protein: 0};
    foods.forEach(food => {
        for(let macro in total) {
            total[macro] += food[macro] || 0;
        }
    });
    return total;
}

export {init_meal_events, clearFoods, getFoodTotal, clear_input};