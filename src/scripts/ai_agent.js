import { apiPost_ai } from "./api";
import { add_input } from "./food_input";
let file = null;
function init_ai_agent_events() {
    init_upload_photo_button_event();
}
function set_loading(is_loading) {
    const btn = document.getElementById("submit-ai-request");
    const loading = document.getElementById("ai-loading");
    const response = document.getElementById("ai-response");
    if(is_loading) {
        btn.disabled = true;
        loading.classList.remove("hidden");
        response.innerHTML = "";
    } else {
        btn.disabled = false;
        loading.classList.add("hidden");
    }
}
function init_upload_photo_button_event() {
    const button = document.getElementById("upload-photo-btn");
    const cameraInput = document.getElementById("camera-input");
    const submitBtn = document.getElementById("submit-ai-request");
    button.addEventListener("click", () => {
        cameraInput.click();
    });
    cameraInput.addEventListener("change", async(event) => {
        const rawFile = event.target.files[0];
        if(!rawFile) {
            document.getElementById("uploaded-photo").src = "";
            return;
        }
        file = await resizeImage(rawFile, 800);
        const imageURL = URL.createObjectURL(file);
        document.getElementById("uploaded-photo").src = imageURL;
    });
    submitBtn.addEventListener("click", async() => {
        if(file === null) {
            set_error_message();
            document.getElementById("ai-response").innerHTML = "Please upload a photo first.";
            return;
        }
        await send_request();
    });
}
async function send_request() {
    const prompt = document.getElementById("meal-prompt");
    const html = document.getElementById("ai-response");
    set_loading(true);
    try {
        const response = await apiPost_ai("/ai/getMacros", file, prompt.value);
        if(!response) {
            html.innerHTML = response.error;
            set_error_message();
            return;
        }
        if(response.error ) {
            html.innerHTML = response.error;
            set_error_message();
            return;
        }
        set_success_message();
        html.innerHTML = `
            Meal Successfully Analyzed.
        `;
        response.meal.foods.forEach(item => {
            add_input(item, 0);
        });
        prompt.value = '';
        document.getElementById("uploaded-photo").src = "";
        file = null;
    } catch(err) {
        set_error_message();
        html.innerHTML = err;
    } finally {
        set_loading(false);
    }
}

function set_error_message(){
    const div = document.getElementById("ai-response");
    div.classList.remove('success');
    div.classList.add('error');
}

function set_success_message(){
    const div = document.getElementById("ai-response");
    div.classList.remove('error');
    div.classList.add('success');
}

async function resizeImage(file, maxWidth = 800) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const scale = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8);
        };
      };
    });
}       
export { init_ai_agent_events };