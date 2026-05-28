import { apiGet } from "./api.js";
import { renderAll } from "./uiRender.js";
import { updateHistoryUi } from "./food_history.js";
let SYNC_INTERVAL = 5 * 60 * 1000;

async function sync(){
    try
    {
        const response = await apiGet('/sync/getSync');
        if(!response){
            return;
        }
        localStorage.setItem("goals", JSON.stringify(response.goals));
        localStorage.setItem("consumed", JSON.stringify(response.consumed));
        localStorage.setItem("meals", JSON.stringify(response.meals));
        localStorage.setItem("food-list", JSON.stringify(response.food_list));

        renderAll();
        updateHistoryUi();

        console.log('Synced at', new Date().toLocaleTimeString());
    } catch(err){
        
        console.log(err);
    }

}

function startSync() {
    sync();
    setInterval(sync, SYNC_INTERVAL);
}

export { startSync };