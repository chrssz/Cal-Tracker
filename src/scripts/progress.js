function renderBars(){
    updateFillSize();
}
function set_Consumed(new_consumed, increment = true){
    const current = JSON.parse(localStorage.getItem("consumed"));
    const sign = increment? 1 : -1;
    for(let key in current){
        if (current[key] == NaN){
            current[key] = 0;
            continue;
        }
        current[key] = Math.max(current[key] +  (sign * new_consumed[key]), 0);
    }

    localStorage.setItem("consumed", JSON.stringify(current));
}

function updateFillSize(){
    const {calories, carbs, fats, protein} = JSON.parse(localStorage.getItem("consumed"));

    const {calories: goal_cals, fats: goal_fats, carbs: goal_carbs, protein: goal_protein} = JSON.parse(localStorage.getItem("goals"));
    const bar_to_label = {
        "calorie-bar-fill": [calories, goal_cals],
        "carb-bar-fill": [carbs, goal_carbs],
        "fat-bar-fill": [fats, goal_fats],
        "protein-bar-fill": [protein, goal_protein],
    }

    for(let key in bar_to_label){
        
        const bar = document.getElementById(key);
   
        const [user_consumed, user_goals] = bar_to_label[key];
 
        const percent = Math.min(((user_consumed / user_goals ) * 100), 100);
        bar.style.width = percent + '%';

        updateProgressText(key, user_consumed, user_goals);

    }
    
}

function updateProgressText(bar_name, userConsumed, userGoals){
    const bar_to_label = {
        "calorie-bar-fill": ["calories-consumed", "calories-goal"],
        "carb-bar-fill": ["carb-consumed", "carb-goal"],
        "fat-bar-fill": ["fat-consumed", "fat-goal"],
        "protein-bar-fill": ["protein-consumed", "protein-goal"]
    }

    const [consumed, goal] = bar_to_label[bar_name];
  
    let consumedText = document.getElementById(consumed);
    let goalText = document.getElementById(goal);

    consumedText.innerText = userConsumed;
    goalText.innerText = userGoals;
}

export {renderBars, set_Consumed};