//Gathers User info; calories, macro goals, meals etc.
//Functions here to be replaced with api calls in future
const user_goals = {
    calories: 2000,
    fats: 50,
    carbs: 50,
    protein: 50
};

const user_consumed = {
    calories: 0,
    fats: 0,
    carbs: 0,
    protein: 0
};
function getUserGoals(){
    return user_goals;
}
function getUserConsumed() {
    return user_consumed;
}
function setUserGoals(new_goals){
    
    for(let key in new_goals){
        user_goals[key] = new_goals[key];
    }
    
    return 1;
}
function setConsumed(consumed) {
    for(let key in new_goals){
        user_consumed[key] = consumed[key];
    }

    return 1;
}


export {getUserGoals, getUserConsumed, setConsumed, setUserGoals};