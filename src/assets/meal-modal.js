import { ModalWindow } from "./modal-window";
import { FoodLibraryModal } from "./food-library-modal";
import { generateId } from "./helper/crypto.js";
import { FoodItemPanel } from "./food-item-panel.js";
import { set_Consumed } from "../scripts/progress.js";
import { addUserMeals } from "../scripts/user_info.js";
import { updateHistoryUi } from "../scripts/food_history.js";

export class MealModal extends ModalWindow{
    constructor(){
        super();
        this.total = {calories: 0, fats: 0, carbs: 0, protein: 0};
        this.panels = [];
        this.mealUpdate_handler_ref = null;
        this.servingSizeChange_handler_ref = null
    }
   
    #update_ui(){
        const total = this.div.querySelector(".meal-total-macros");
        
        total.querySelector("#meal-calories").textContent = this.total.calories;
        total.querySelector("#meal-fats").textContent = this.total.fats;
        total.querySelector("#meal-carbs").textContent = this.total.carbs;
        total.querySelector("#meal-protein").textContent = this.total.protein;

    }
    #draw_panels(){
        const content = this.div.querySelector(".modal-window-content");
        
        this.panels.forEach(p => {
            content.prepend(p.div);
        });
    }
    getTitle(){
        return "Log Meal";
    }
    getContent(){
        return `
            <div class="meal-name-input">
                <input id = "meal_name" value="" placeholder="Meal Name" type="text"></input>
            </div>

            <div class="modal-window-content">
                <button id=add-food-btn>&#43; Add Food</button>
            </div>

            <div class="meal-total-macros">
                <span>Calories: <span id="meal-calories">0</span></span>
                <span> Fats: <span id="meal-fats">0</span></span>
                <span> Carbs: <span id="meal-carbs">0</span></span>
                <span> Protein: <span id="meal-protein">0</span></span>
            </div>
        `;

    }
    getfooterContent(){
        return `
            <button id="delete">&#128465;</button>
            <button id="cancel" class="active">Cancel</button>
            <button id="save" class ="active">Save</button>
            <button id="confirm">&#x2714;</button>
        `;
    }
    options_content(){
        //Every li MUST contain a data-*, required to correctly connect action events across inherited modal-windows.
        return `
            <ul>
                <li id="select-mode" data-action='set select mode'> Select Mode </li>
            </ul>
        `;
    }

    handle_action(action){
        const toDo = {
            "set select mode": () => {
                this.panels.forEach(p => {
                    p.activate_select_mode();
                });

                const action_div = this.menu?.querySelector('#select-mode');
                
                action_div.dataset.action ="unset select mode";
                action_div.textContent = " Exit select mode ";

                this.div.querySelector("#cancel").classList.remove("active");
                this.div.querySelector("#save").classList.remove("active");

                this.div?.querySelector("#delete").classList.add("active");
                this.div?.querySelector("#confirm").classList.add("active");
                
            },
            
            "unset select mode" : ()=>{
                this.panels.forEach(p => {
                    p.isSelected = false;
                    p.deactivate_select_mode();
                    
                });

                const action_div = this.menu?.querySelector('#select-mode');
            
                action_div.dataset.action ="set select mode";
                action_div.textContent = " Select mode ";


                this.div.querySelector("#delete").classList.remove("active");
                this.div.querySelector("#confirm").classList.remove("active");

                this.div.querySelector("#cancel").classList.add("active");
                this.div.querySelector("#save").classList.add("active");
            }
        }

        toDo[action]();
           
    }

    setUpUniqueEvents(){
        const div = this.div;
        //Set up events
        div.querySelector("#add-food-btn").addEventListener("click", () =>{
            const food_library = new FoodLibraryModal();
            food_library.turn_on();
        });
        div.querySelector("#save").addEventListener("click", async() => {
            await set_Consumed(this.total);
            const user_meals = JSON.parse(localStorage.getItem("meals") || "[]");

            const MACROS = ["calories", "fats", "carbs", "protein"];
            const foods = [];

            this.panels.forEach(panel => {
                foods.push(panel.data);
            });

            const meal_object = {
                name: this.div.querySelector("#meal_name").value || "Meal",
                foods: foods,
                meal_id: generateId() 
            }; 
            MACROS.forEach(element => {
                meal_object[element] = this.total[element];
            });
           
            user_meals.push(meal_object);
            localStorage.setItem("meals", JSON.stringify(user_meals));

            updateHistoryUi();

            await addUserMeals(meal_object);
            this.turn_off();
        });
        div.querySelector("#cancel").addEventListener("click", () => {
            this.turn_off();
        });
        div.querySelector("#confirm").addEventListener("click", () => {
            this.handle_action("unset select mode");
        });
        div.querySelector("#delete").addEventListener("click", () => {
            const new_total = {calories:0, fats: 0, carbs: 0, protein: 0};
            const new_panels = [];
            this.panels.forEach(p => {
                if(p.isSelected){
                    p.delete();
                } else {
                    new_panels.push(p);
                    const attr = ["calories", "fats", "carbs", "protein"];
                    attr.forEach(key => {
                        new_total[key] += p.data[key];
                    });
                }
            });
   
            this.total = new_total;
            this.panels = new_panels;
            this.#update_ui();
            
        });
        //Listener to listen for food data being passed into current meal instance
        this.mealUpdate_handler_ref = (event) => {
            event.detail.foods.forEach(data => {
                this.panels.push(new FoodItemPanel(data, {}, true));
            });

            const total = event.detail.total;

            const MACROS = ["calories", "fats", "carbs", "protein"];

            MACROS.forEach(i => {
                this.total[i] += total[i];
            });
            this.#draw_panels(div);
            this.#update_ui();
        };
        this.servingSizeChange_handler_ref = (event) =>{
            const old_data = event.detail.old_data;
            const new_data = event.detail.new_data;

            const MACROS = ["calories", "fats", "carbs", "protein"];

            MACROS.forEach(macro => {
                this.total[macro] -= old_data[macro];
                this.total[macro] += new_data[macro];
            });

            this.#update_ui();
        };
        document.addEventListener('meal-update', this.mealUpdate_handler_ref);
        document.addEventListener('serving-change', this.servingSizeChange_handler_ref);
        this.servingSizeChange_handler_ref = (event) =>{
            //Helper function
            function add_macro(data, add=true) {
                const attr = ["calories", "fats", "carbs", "protein"];
                toAdd = add ? 1 : -1;
            
                attr.forEach(at => {
                    this.total[attr] = this.total[attr] + (toAdd * data[attr]);
                });
            }
            const old_macros = event.detail.old;
            const new_macros = event.detail.new;

            const attr = ["calories", "fats", "carbs", "protein"];

            add_macro(old_macros, false);
            add_macro(new_macros);

            this.#update_ui();
        }
     
    }
    
    turn_off(){
        document.removeEventListener('serving-change', this.servingSizeChange_handler_ref);
        document.removeEventListener('meal-update', this.mealUpdate_handler_ref);
        super.turn_off();
    }


    
}