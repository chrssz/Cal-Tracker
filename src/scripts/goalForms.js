//Handles data given by user.
import { renderAll } from "./uiRender.js";
import { setUserGoals } from "./user_info.js";

const userGoal_form = ["set-calories", "set-fats", "set-carbs", "set-protein"];

function init_form_events(){
    //Initialize all save/cancel buttons
    const save_goal_btn = document.getElementById("save-goals");
    const cancel_goal_btn = document.getElementById("cancel-goals");

    // Event listeners
    save_goal_btn.addEventListener("click", () => { save_goal(); });
    cancel_goal_btn.addEventListener("click", () => { cancel_goal(); })

    
}
/*  Functionality for save goal button */
function save_goal(){
    const goal = {calories: 0, fats: 0, carbs: 0, protein: 0};
    const options_window = document.getElementById("options-window");
    userGoal_form.forEach(element => {
        let current = document.getElementById(element);
        let s = element.slice(4);
        let value = parseInt(current.value) || 0;
        goal[s] = Math.max(0, value);
    });
    setUserGoals(goal);
    renderAll();
    options_window.classList.remove("open");
}

/* Functionality For cancel goal button */
function cancel_goal(){
    const options_window = document.getElementById("options-window");
    options_window.classList.remove("open");
}

export { init_form_events };