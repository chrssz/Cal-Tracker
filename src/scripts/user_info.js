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

export {getUserGoals, getUserConsumed};