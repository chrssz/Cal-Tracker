import { apiGet } from "./api.js";
import { renderAll } from "./uiRender.js";
import { updateHistoryUi } from "./food_history.js";

const SYNC_INTERVAL = 5 * 60 * 1000;
let syncTimer = null;

async function sync() {
    try {
        const response = await apiGet('/sync/getSync', true); 
        if(!response || response.error) {
            stopSync(); 
            return;
        }

        localStorage.setItem("goals", JSON.stringify(response.goals));
        localStorage.setItem("consumed", JSON.stringify(response.consumed));
        localStorage.setItem("meals", JSON.stringify(response.meals));
        localStorage.setItem("food-list", JSON.stringify(response.food_list));

        renderAll();
        updateHistoryUi();

        console.log('Synced at', new Date().toLocaleTimeString());
    } catch(err) {
        console.log(err);
    }
}

function stopSync() {
    if(syncTimer) {
        clearInterval(syncTimer);
        syncTimer = null;
    }
}

async function startSync() {
    await sync();                              
    syncTimer = setInterval(sync, SYNC_INTERVAL);  
}

window.addEventListener('unauthorized', () => {
    stopSync();
});

export { startSync };