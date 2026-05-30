import { renderBars } from "./progress.js";
import { init_form_events } from "./goalForms.js";
import { init_food_input_events } from "./food_input.js";
import { init_meal_events } from "./meal.js";
import { init_food_list_buttons } from "./food_list.js";
import { apiPost } from "./api.js";
import { updateHistoryUi } from "./food_history.js";
import { init_ai_agent_events } from "./ai_agent.js";
//Will render all components in document
function renderAll()
{
    renderDate();
    renderBars();
}
function init_events()
{
    init_form_events();
    init_options_event();
    init_log_meal_event();
    init_food_input_events();
    init_meal_events();
    init_food_list_buttons();
    init_logout_event();
    init_ai_agent_events();
    updateHistoryUi();
}

function renderDate()
{
    const num_to_months = {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December"
    }

    let p = document.getElementById("date");

    let todayDay = new Date();
    let month = num_to_months[todayDay.getMonth()];
    let day = todayDay.getDate();
    let year = todayDay.getFullYear();

    let manualDate = `${month} ${day}, ${year}`;

    p.innerHTML = manualDate;
}

function init_options_event(){
    const btn = document.getElementById("options-button");

    btn.addEventListener("click", () => {
        const options_window = document.getElementById("options-window");
        options_window.classList.add("open");
    });
}

function init_log_meal_event() {
    const btn = document.getElementById("log-meal-button");
    btn.addEventListener("click", () =>{
        const window = document.getElementById("add-meal-container");
        window.classList.add("open");
    });
}

function init_logout_event() {
    const btn = document.getElementById("logout-button");
    btn.addEventListener("click", async () => {
        await apiPost('/auth/logout');
        
        window.location.href = "/login.html";
    });
}
export {renderAll, init_events};