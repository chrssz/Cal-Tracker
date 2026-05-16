import { renderAll, init_events} from "./uiRender";

import { apiGet } from "./api";
async function checkAuth(){
    try {
       
        const response = await apiGet('/auth/check');
      
        if(response.error){
            window.location.href = '/login.html';
        }
        
    } catch(error) {
        window.location.href = '/login.html';
    }
}
document.addEventListener("DOMContentLoaded", () => {
    renderAll();
    init_events();
});

checkAuth();