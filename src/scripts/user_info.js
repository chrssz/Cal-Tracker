//Gathers User info; calories, macro goals, meals etc.
//Functions here to be replaced with api calls in future
import { apiPost, apiGet, apiDelete } from "./api";

/* Goals */
async function getUserGoals(caller){
    const response = await apiGet('/goals/getGoals');
    return response
}

async function setUserGoals(new_goals){
    return await apiPost('/goals/postGoals', new_goals);
}

/* Consumed */
async function getUserConsumed() {
    return await apiGet('/consumed/getConsumed');
}
async function setConsumed(data) {
    return await apiPost('/consumed/incrementConsumed', data);
}
async function removeConsumed(data){
    return await apiPost('/consumed/decrementConsumed', data);
}
/* Meals */
async function getUserMeals(){
    return await apiGet('/meals/getMeals');
}

async function addUserMeals(meal){
    return await apiPost('/meals/postMeal', meal);

}

async function removeUserMeal(meal){
    return await apiDelete(`/meals/deleteMeal/${meal.meal_id}`)
}
/* A function that just performs clean on the database; Call it everytime app is visited */
async function clearUserMeals(){
    return await apiDelete('/meals/cleanup');
}
/* Food List */

async function getUserFoods(){
    return await apiGet('/food-list/getFoodList');
}

async function addUserFoods(food){
    return await apiPost('/food-list/postFoodList', food);
}

async function removeUserFood(foodArr){
    return await apiDelete('/food-list/deleteFoods', foodArr);
}

async function syncData() {
    return await apiGet('/sync/getSync', true);
}

export {
    getUserGoals, getUserConsumed, 
    setConsumed, setUserGoals, 
    getUserFoods, addUserFoods, removeUserFood, 
    getUserMeals, addUserMeals, removeUserMeal,
    removeConsumed, clearUserMeals,
    syncData
};