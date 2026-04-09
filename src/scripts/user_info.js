//Gathers User info; calories, macro goals, meals etc.
//Functions here to be replaced with api calls in future
let user_goals = {
    calories: 2000,
    fats: 50,
    carbs: 50,
    protein: 50
};
let user_consumed = {
    calories: 0,
    fats: 0,
    carbs: 0,
    protein: 0
};
let user_meals = [];
let user_foods = [];
function getUserGoals(){
    return user_goals;
}
function getUserConsumed() {
    return user_consumed;
}
function getUserMeals(){
    return user_meals;
}
function getUserFoods(){
    return user_foods;
}
function setUserGoals(new_goals){
    
    for(let key in new_goals){
        user_goals[key] = new_goals[key];
    }
    
}
function setConsumed(consumed) {
    for(let key in consumed){
        user_consumed[key] += consumed[key];
    }
}

function addUserMeals(meal){
    user_meals.push(meal);
}

function addUserFoods(food){
    user_foods.push(food);
}
export {getUserGoals, getUserConsumed, setConsumed, setUserGoals, getUserFoods, addUserFoods};