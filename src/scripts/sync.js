import { renderAll} from "./uiRender.js";
import { updateHistoryUi } from "./food_history.js";
import { syncData } from "./user_info.js";
import { checkTrie } from "./trieRef.js";
const SYNC_INTERVAL = 5 * 60 * 1000;
let syncTimer = null;

async function sync() {
    try {
        checkTrie(JSON.parse(localStorage.getItem("food-list"))); //Populate trie before sync just in case rate limit is hit.
        const response = await syncData(); 
        if(!response || response.error) {
            stopSync(); 
            return;
        }
        
        localStorage.setItem("goals", JSON.stringify(response.goals));
        localStorage.setItem("consumed", JSON.stringify(response.consumed));
        localStorage.setItem("meals", JSON.stringify(response.meals));
        localStorage.setItem("food-list", JSON.stringify(response.food_list));

        checkTrie(JSON.parse(localStorage.getItem("food-list")));

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