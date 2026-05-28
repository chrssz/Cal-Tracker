import { renderAll, init_events} from "./uiRender";
import { clearUserMeals } from "./user_info";
import { apiGet, apiDelete } from "./api";
import { startSync } from "./sync";
async function checkAuth(){
    try {
       
        const response = await apiGet('/auth/check');
        
        if(response.error){
            window.location.href = '/login.html';
            return;
        }
        
    } catch(error) {
        window.location.href = '/login.html';
    }
}
document.addEventListener("DOMContentLoaded", () => {
    startSync();
    init_events();
    
});

checkAuth();


