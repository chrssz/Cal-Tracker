import { init_events} from "./uiRender";
import { apiGet, apiDelete } from "./api";
import { startSync } from "./sync";
async function checkAuth() {
    try {
        const res = await apiGet('/auth/check', true); 
        if(res.error) {
            
            console.log(`Response error: ${res.error}`); 
            window.location.href = '/login.html';
            return false;
        }
    } catch(err) {
        console.log(`Response caught error: ${err}`);
        window.location.href = '/login.html';
        return false;
    }

    return true;
}
document.addEventListener("DOMContentLoaded", async() => {
    const authenticated = await checkAuth();
    if(!authenticated) {
        return;
    }
    await startSync();
    init_events();
    
});


