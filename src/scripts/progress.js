import {getUserGoals, getUserConsumed } from "./user_info.js";


function renderBars(){
    const progressBars = ["calorie-bar-fill", "fat-bar-fill", "carb-bar-fill", "protein-bar-fill"];
    progressBars.forEach(element => {
        updateFillSize(element);
    });
}

function updateFillSize(bar){
    // bar: [Goals, CurrentUserConsumed]
    const {calories, carbs, fats, protein} = getUserConsumed();
    const {calories: goal_cals, fats: goal_fats, carbs: goal_carbs, protein: goal_protein} = getUserGoals();
    const bar_to_label = {
        "calorie-bar-fill": [calories, goal_cals],
        "carb-bar-fill": [carbs, goal_carbs],
        "fat-bar-fill": [fats, goal_fats],
        "protein-bar-fill": [protein, goal_protein],
    }
    const [user_consumed, user_goals] = bar_to_label[bar];
   
    let current = document.getElementById(bar);
    const percent = Math.min(((user_consumed / user_goals ) * 100), 100);
    current.style.width = percent + '%';

    updateProgressText(bar, user_consumed, user_goals)
}

function updateProgressText(bar, userConsumed, userGoals){
    const bar_to_label = {
        "calorie-bar-fill": ["calories-consumed", "calories-goal"],
        "carb-bar-fill": ["carb-consumed", "carb-goal"],
        "fat-bar-fill": ["fat-consumed", "fat-goal"],
        "protein-bar-fill": ["protein-consumed", "protein-goal"]
    }

    const [consumed, goal] = bar_to_label[bar];
  
    let consumedText = document.getElementById(consumed);
    let goalText = document.getElementById(goal);

    consumedText.innerText = userConsumed;
    goalText.innerText = userGoals;
}

export {renderBars};