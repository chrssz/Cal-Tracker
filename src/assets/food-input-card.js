
import { generateId } from "./helper/crypto";

export class FoodInputCard {
    constructor(callBack) {
        this.callBack = callBack;
        this.div = this.get_div();
        this.ai_handler_ref = null;
        this.save_food_input_handler = null;
        this.cancel_food_input_handler = null;

        this.init_events();
    }

    get_div() {
        const div = document.createElement("div");
        div.classList.add("food-input-card");
        div.innerHTML = `
            <span>New Food Item</span>

            <div class="input-grid">
                <div class="input-field full">
                    <div class="input-label">Name</div>
                    <input id="food-input-name" type="text" placeholder="e.g. Chicken breast" />
                </div>
            </div>

            <div class="divider"></div>

            <div class="input-grid">
                <div class="input-field">
                    <div class="input-label">Calories</div>
                    <input id="food-input-cals" type="number" placeholder="kcal" />
                </div>
                <div class="input-field">
                    <div class="input-label">Fats</div>
                    <input id="food-input-fats" type="number" placeholder="g" />
                </div>
                <div class="input-field">
                    <div class="input-label">Carbs</div>
                    <input id="food-input-carbs" type="number" placeholder="g" />
                </div>
                <div class="input-field">
                    <div class="input-label">Protein</div>
                    <input id="food-input-protein" type="number" placeholder="g" />
                </div>

                <div class="input-field">
                    <div class="input-label">Serving Size Grams</div>
                    <input id="food-input-serving" type="number" placeholder="g" />
                </div>
            </div>

            <div class="divider"></div>

            <button id="ai">✦ Analyze with AI</button>
            <div id="error-msg"></div>
            <div class="card-actions">
                <button id="cancel-food-input">Cancel</button>
                <button id="save-food-input">Save food</button>
            </div>
        `;
        
        return div;
    }
    #max(a, b=0){
        return Math.max(a, 0);
    }
    init_events() {
        this.save_food_input_handler = () => {
            const data = {
                id: generateId(),
                name: this.div.querySelector("#food-input-name").value,
                calories: this.#max(this.div.querySelector("#food-input-cals").value || 0),
                fats: this.#max(this.div.querySelector("#food-input-fats").value || 0),
                carbs: this.#max(this.div.querySelector("#food-input-carbs").value || 0),
                protein: this.#max(this.div.querySelector("#food-input-protein").value || 0),
                grams: this.#max(this.div.querySelector("#food-input-serving").value || 0)
            };

            //Call the callback with the data
            if (this.callBack) {
                this.callBack(data);
            }
            
            
            this.delete();
        }
        this.div.querySelector("#save-food-input").addEventListener("click", this.save_food_input_handler);

        this.cancel_food_input_handler = () => {
            if(this.callBack){
                this.callBack(null);
            }
            this.delete();
        }

        this.div.querySelector("#cancel-food-input").addEventListener("click", this.cancel_food_input_handler);

        this.ai_handler_ref = () =>{
            this.set_error("AI Features not available yet. Refactoring Code.");
        }

        this.div.querySelector("#ai").addEventListener("click",this.ai_handler_ref);
    }
    
    delete(){
        if(this.ai_handler_ref){
            document.removeEventListener("click", this.ai_handler_ref);
        }
        if(this.save_food_input_handler){
            document.removeEventListener("click", this.save_food_input_handler);
        }
        if(this.cancel_food_input_handler){
            document.removeEventListener("click", this.cancel_food_input_handler);
        }
        this.div.remove();
    }

    set_error(text){
        this.div.querySelector("#error-msg").innerHTML = text;
        setTimeout(()=>{
            this.div.querySelector("#error-msg").innerHTML = '';
        }, 7000);
    }
}