import { renderAll, init_events} from "./uiRender";
import { clearUserMeals } from "./user_info";
import { apiGet, apiDelete } from "./api";

async function checkAuth(){
    try {
       
        const response = await apiGet('/auth/check');
      
        if(response.error){
            window.location.href = '/login.html';
        }

        await cleanUserMeals();
        
    } catch(error) {
        window.location.href = '/login.html';
    }
}
document.addEventListener("DOMContentLoaded", () => {
    renderAll();
    init_events();
});

checkAuth();