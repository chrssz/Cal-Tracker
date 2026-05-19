//Handles data given by user.
import { renderAll } from "./uiRender.js";
import { getUserGoals, setUserGoals } from "./user_info.js";
import { apiGet, apiPost } from "./api.js";
const userGoal_form = ["set-calories", "set-fats", "set-carbs", "set-protein"];

function init_form_events(){
    //Initialize all save/cancel buttons
    const save_goal_btn = document.getElementById("save-goals");
    const cancel_goal_btn = document.getElementById("cancel-goals");

    // Event listeners
    save_goal_btn.addEventListener("click", () => { save_goal(); });
    cancel_goal_btn.addEventListener("click", () => { cancel_goal(); })

    set_default_goal(null);
}
/*  Functionality for save goal button */
async function save_goal(){
    const goal = await getUserGoals('save_goal');
    const options_window = document.getElementById("options-window");

    userGoal_form.forEach(element => {
        let current = document.getElementById(element);
        let s = element.slice(4);
        let value = current.value != 0 ? parseInt(current.value) : goal[s];
        goal[s] = Math.max(0, value);
    });
    
    await setUserGoals(goal);
    set_default_goal(goal);
    renderAll();
    options_window.classList.remove("open");
}

/* Functionality For cancel goal button */
function cancel_goal(){
    const options_window = document.getElementById("options-window");
    options_window.classList.remove("open");
}

async function set_default_goal(goal) {
    if(goal === null){
        goal = await getUserGoals();
    } 
    userGoal_form.forEach(form => {
        const current = document.getElementById(form);
        let s = form.slice(4);
        current.value = goal[s];
    });
}

export { init_form_events };