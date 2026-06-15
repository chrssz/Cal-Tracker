import { ModalWindow } from "./modal-window.js";
import { apiPost_ai } from "../scripts/api.js";

export class AiAnalyzerModal extends ModalWindow {

    constructor(on_confirm) {
        super();
        this.on_confirm = on_confirm;  // callback to pass foods back
        this.photos = [];              // max 3 File/Blob objects
        this.food_response = [];             // detected foods from AI
        this.meal_response = [];
    }

    getTitle() { return "AI Analyzer"; }

    getContent() {
        return `
            <div class="modal-window-content ai-analyzer">

                <div class="ai-photo-label">Photos <span class="ai-photo-count">0 / 3</span></div>
                <div class="ai-photo-slots">
                    <button class="ai-photo-add" id="ai-add-photo">
                        <span class="ai-plus">+</span>
                        <span class="ai-plus-label">Add Photo</span>
                    </button>
                </div>
                <input type="file" id="ai-camera-input" accept="image/*" style="display:none">

              
                <div class="ai-divider"></div>

                <div class="ai-prompt-label">Description <span class="ai-optional">(optional)</span></div>
                <textarea
                    id="ai-prompt"
                    class="ai-prompt-input"
                    placeholder="e.g. Grilled chicken with rice and vegetables..."
                    rows="2"
                ></textarea>

                <button id="ai-analyze-btn">
                    ✦ Analyze with AI
                </button>

               
                <div id="ai-loading" class="ai-loading hidden">
                    <div class="ai-loading-label">Analyzing your meal...</div>
                    <div class="ai-loading-track">
                        <div class="ai-loading-bar"></div>
                    </div>
                </div>

                <div id="ai-response" class="ai-response"></div>

            
                <div id="ai-results" class="ai-results hidden">
                    <div class="ai-results-label">Detected Foods</div>
                    <div id="ai-results-list" class="ai-results-list"></div>
                </div>

            </div>
        `;
    }

    getfooterContent() {
        return `
            <button id="delete">&#128465;</button>
            <button id="cancel">Cancel</button>
            <button id="save">Save</button>
            <button id="confirm">&#x2714;</button>
        `;
    }

    setUpUniqueEvents() {
        const div = this.div;

        // add photo button
        div.querySelector('#ai-add-photo').addEventListener('click', () => {
            div.querySelector('#ai-camera-input').click();
        });

        // file input change
        div.querySelector('#ai-camera-input').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if(!file || this.photos.length >= 3) return;

            const resized = await this.#resize_image(file, 800);
            this.photos.push(resized);
            this.#render_photo_slots();
            e.target.value = '';  
        });

        div.querySelector('#ai-analyze-btn').addEventListener('click', async () => {
            await this.#send_request();
        });

        div.querySelector('#cancel').addEventListener('click', () => {
            this.turn_off();
        });

        // footer save 
        div.querySelector('#save').addEventListener('click', () => {
            if(this.meal_response.length === 0) return;
            if(this.on_confirm) this.on_confirm(this.meal_response);
            this.turn_off();
        });

        
        div.querySelector('#delete').addEventListener('click', () => {
            this.#reset();
        });

        
        div.querySelector('#cancel').classList.add('active');
        
    }

    #render_photo_slots() {
        const div = this.div;
        const slots = div.querySelector('.ai-photo-slots');
        const count = div.querySelector('.ai-photo-count');

        count.textContent = `${this.photos.length} / 3`;

        // clear existing previews (keep the add button)
        slots.querySelectorAll('.ai-photo-slot').forEach(s => s.remove());

    
        this.photos.forEach((blob, i) => {
            const url = URL.createObjectURL(blob);
            const slot = document.createElement('div');
            slot.classList.add('ai-photo-slot');
            slot.innerHTML = `
                <img src="${url}" class="ai-photo-preview" alt="meal photo ${i+1}">
                <button class="ai-photo-remove" data-index="${i}">×</button>
            `;
            slot.querySelector('.ai-photo-remove').addEventListener('click', () => {
                this.photos.splice(i, 1);
                this.#render_photo_slots();
            });
            slots.insertBefore(slot, slots.querySelector('#ai-add-photo'));
        });

        // hide add button if at max
        const add_btn = slots.querySelector('#ai-add-photo');
        add_btn.style.display = this.photos.length >= 3 ? 'none' : 'flex';
    }

    async #send_request() {
        if(this.photos.length === 0) {
            this.#set_response('Please add at least one photo.', 'error');
            return;
        }

        const prompt = this.div.querySelector('#ai-prompt').value;
        this.#set_loading(true);

        try {
            
            const response = await apiPost_ai('/ai/getMacros', this.photos, prompt);

            if(!response || response.error) {
                this.#set_response(response?.error || 'Something went wrong.', 'error');
                return;
            }

            this.food_response = response.foods;
            this.meal_response = response.meal; //The meal is just the cumaltive total of all foods.
            
            this.#render_results();
            this.#set_response('Meal analyzed successfully.', 'success');

            
            this.div.querySelector('#save').classList.add('active');

        } catch(err) {
            this.#set_response(`Could not connect. Please try again. ${err}`, 'error');
        } finally {
            this.#set_loading(false);
        }
    }

    #render_results() {
        const list = this.div.querySelector('#ai-results-list');
        const container = this.div.querySelector('#ai-results');

        list.innerHTML = '';
        container.classList.remove('hidden');
        
        this.food_response.forEach(food => {
            const card = document.createElement('div');
            card.classList.add('ai-result-card');
            card.innerHTML = `
                <div class="ai-result-name">${food.name}</div>
                <div class="food-macros-row">
                    <span class="macro-pill">${food.calories}cal</span>
                    <span class="macro-pill">F ${food.fats}g</span>
                    <span class="macro-pill">C ${food.carbs}g</span>
                    <span class="macro-pill">P ${food.protein}g</span>
                </div>
            `;
            list.appendChild(card);
        });
    }

    #set_loading(is_loading) {
        const loading = this.div.querySelector('#ai-loading');
        const btn = this.div.querySelector('#ai-analyze-btn');
        if(is_loading) {
            loading.classList.remove('hidden');
            btn.disabled = true;
            btn.style.opacity = '0.5';
        } else {
            loading.classList.add('hidden');
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    }

    #set_response(msg, type) {
        const el = this.div.querySelector('#ai-response');
        el.textContent = msg;
        el.className = `ai-response ${type}`;
    }

    #reset() {
        this.photos = [];
        this.results = [];
        this.#render_photo_slots();
        this.div.querySelector('#ai-prompt').value = '';
        this.div.querySelector('#ai-results').classList.add('hidden');
        this.div.querySelector('#ai-response').textContent = '';
        this.div.querySelector('#ai-response').className = 'ai-response';
        
        this.div.querySelector('#save').classList.remove('active');
    }

    async #resize_image(file, maxWidth = 800) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const scale = Math.min(1, maxWidth / img.width);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8);
                };
            };
        });
    }
    options_content(){
        return '';
    }
    turn_off() {
        this.#reset();
        super.turn_off();
    }
}