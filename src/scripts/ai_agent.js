
import { apiPost_ai } from "./api";
import { add_input } from "./food_input";
let file = null;

function init_ai_gent_events(){
    init_upload_photo_button_event();
}

function init_upload_photo_button_event(){
    
    const button = document.getElementById("upload-photo-btn");
    const cameraInput = document.getElementById("camera-input");
    const submitBtn = document.getElementById("submit-ai-request");
    
    button.addEventListener("click", ()=>{
        cameraInput.click();
    });

    //Event when user snaps a photo
    cameraInput.addEventListener("change", async(event) => {
        file = event.target.files[0];
    
        if(!file){
            console.log("Error processing file ");
            document.getElementById("uploaded-photo").alt = "Error Uploading photo";
            return;
        }

        const imageURL = URL.createObjectURL(file);
        //Update uploaded photo
        document.getElementById("uploaded-photo").src = imageURL;
        
    });

    //submitBtn Event
    submitBtn.addEventListener("click", async() => {
        if(file === null){
            const html = document.getElementById("ai-response");
            html.innerHTML = "Error submitting Response";
            const prompt = document.getElementById("meal-prompt").value = '';
            return;
        }

        await send_request();
        
    });

    
}

async function send_request(){
    console.log("Making api request");
    const prompt = document.getElementById("meal-prompt")

    const html = document.getElementById("ai-response");
    const response = await apiPost_ai("/ai/getMacros", file, prompt.value);
    if(!response){
        return;
    }
    console.log(response);
    html.innerHTML = `
                        Meal: 
                        Calories: ${response.meal.calories}, 
                        Fats: ${response.meal.fats}
                        Carbs: ${response.meal.carbs}
                        Protein: ${response.meal.protein}
                        
                        `;
    
    response.meal.foods.forEach(item => {
        add_input(item, 0);
    });
    prompt.value = '';
    document.getElementById("uploaded-photo").src = "";

    
}

export { init_ai_gent_events }