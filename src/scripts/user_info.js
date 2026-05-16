//Gathers User info; calories, macro goals, meals etc.
//Functions here to be replaced with api calls in future
import { apiPost, apiGet, apiDelete } from "./api";
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
let user_meals = new Map(); /*  Users meals created */
let user_foods = new Map(); /* Food List */
async function getUserGoals(caller){
    const response = await apiGet('/goals/getGoals');
    return response
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
async function setUserGoals(new_goals){
    return await apiPost('/goals/postGoals', new_goals);
}
function setConsumed(consumed) {
    for(let key in consumed){
        user_consumed[key] += consumed[key];
    }
}

function addUserMeals(meal){
    user_meals.set(meal.id, meal);

}

function addUserFoods(food){
    user_foods.set(food.id, food);
}

function removeUserFood(food){
    user_foods.delete(food.id);
}

function removeUserMeal(meal){
    if(user_meals.has(meal.id)){
        meal.forEach(food => {
            for(let macro in user_consumed){
                user_consumed[macro] -= (food[macro]|| 0);
            }
        });
        user_meals.delete(meal.id);
    }
}
export {
    getUserGoals, getUserConsumed, 
    setConsumed, setUserGoals, 
    getUserFoods, addUserFoods, removeUserFood, 
    getUserMeals, addUserMeals, removeUserMeal
};