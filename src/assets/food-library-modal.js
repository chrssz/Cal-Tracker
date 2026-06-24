import { ModalWindow } from "./modal-window";
import { FoodItemPanel } from "./food-item-panel";
import { FoodInputCard } from "./food-input-card";
import { apiDelete } from "../scripts/api";
import { addUserFoods, removeUserFood } from "../scripts/user_info";
import { getTrie } from "../scripts/trieRef";

export class FoodLibraryModal extends ModalWindow{
    constructor(){
        super();
        //this.panels is called in set up unique events
        this.foodList = JSON.parse(localStorage.getItem("food-list") || '[]');
        this.total = {calories: 0, fats: 0, carbs: 0, protein: 0}
        this.selected_foods = new Set();
        
    }

    #get_new_food_item = async(data) => {
        if(!data){
            return;
        }
        const empty_msg = this.div.querySelector(".modal-window-content");
        if(empty_msg.innerHTML === '<p class="history-empty">No Saved Foods</p>'){
            empty_msg.textContent = "";
        }
        //Callback Func, Data is a single food object
        this.foodList.push(data);
        
        const trie = getTrie();
        localStorage.setItem("food-list", JSON.stringify(this.foodList));
        trie.updateTrie(JSON.parse(localStorage.getItem("food-list")));
        const new_panel = new FoodItemPanel(data, {get_selected_food: this.#get_selected_food});

        const container = this.div.querySelector(".modal-window-content");

        if(container)  {
            container.appendChild(new_panel.div);
        }

        this.panels.push(new_panel);
        
        await addUserFoods(data);
    }
    #get_selected_food = (food, isAdd) =>{
        //CallBack Function returns a single food item; Total is in object {calories, fats, proteins, carbs}
        const sign = isAdd ? 1 : -1;

        const properties = ["calories", "fats", "carbs", "protein"];
      
        properties.forEach(property => {
            this.total[property] = Math.max(0, this.total[property] + (sign * food[property]));
            
        });

        if(isAdd){
            this.selected_foods.add(food);
        } else{
            this.selected_foods.delete(food);
        } 
        
        this.#update_ui_macros();
    }
    #update_ui_macros(){
        //Function to show UI visual feedback of selected foods macros
        const meal_total = this.div.querySelector(".meal-total-macros.food-list");

        meal_total.querySelector("#select-calories").textContent = this.total.calories;
        meal_total.querySelector("#select-fats").textContent = this.total.fats;
        meal_total.querySelector("#select-carbs").textContent = this.total.carbs;
        meal_total.querySelector("#select-protein").textContent = this.total.protein;

        if(this.selected_foods.size == 0){
            if(meal_total.classList.contains('active')){
                setTimeout(()=> {
                    meal_total.classList.remove("active");
                }, 5);

                return;
            }
        }
        setTimeout(()=> {
            meal_total.classList.add("active");
        }, 1.5);
        
    }
    getTitle(){
        return "Food Library";
    }
    get_header_extra(){
        return `
            <div class="modal-search-row">
                <div class="search-bar-wrap">
                    <span class="search-icon"></span>
                    <input class="search-bar" type="text" placeholder="Search your foods...">
                </div>
            </div>
        `;
    }
    getContent(){
        return `
            
            <div class="modal-window-content">
                <div class="search-results hidden">
                    
                </div>
            </div>
            
            <div class="meal-total-macros food-list hidden">
                <span>Calories: <span id="select-calories">0</span></span>
                <span> Fats: <span id="select-fats">0</span></span>
                <span> Carbs: <span id="select-carbs">0</span></span>
                <span> Protein: <span id="select-protein">0</span></span>
            </div>
        `;
    }

    getfooterContent(){
        return `
            <button id="delete">&#128465;</button>
            <button id="cancel" class= "active"> Cancel Selection</button>
            <button id="save" class = "active"> Save Selection</button>
            <button id="confirm">&#x2714;</button>
        `;
    }

    options_content(){
        //Every li MUST contain a data-*, required to correctly connect action events across inherited modal-windows.
        return `
            <ul>
                <li id="add-item-mode" data-action='add food item'> &#8853; Add Item </li>
                <li id="select-mode" data-action='set select mode'> Select Mode </li>
            </ul>
        `;
    }

    handle_action(action){
        const toDo = {
            "add food item": () => {
                const new_prompt = new FoodInputCard(this.#get_new_food_item);
                
            },

            "set select mode": () => {
                this.panels.forEach(p => {
                    p.activate_select_mode();
                });

                const action_div = this.menu?.querySelector('#select-mode');
                
                action_div.dataset.action ="unset select mode";
                action_div.textContent = " Exit select mode ";

                this.menu.querySelector("#add-item-mode").classList.add("hidden");

                this.div.querySelector("#cancel").classList.remove("active");
                this.div.querySelector("#save").classList.remove("active");

                this.div.querySelector("#delete").classList.add("active");
                this.div.querySelector("#confirm").classList.add("active");
                
            
            },
            
            "unset select mode" : ()=>{
                this.panels.forEach(p => {
                    p.deactivate_select_mode();
                });
                
                const action_div = this.menu?.querySelector('#select-mode');
            
                action_div.dataset.action ="set select mode";
                action_div.textContent = " Select mode ";

                this.menu.querySelector("#add-item-mode").classList.remove("hidden");

                this.div.querySelector("#delete").classList.remove("active");
                this.div.querySelector("#confirm").classList.remove("active");

                this.div.querySelector("#cancel").classList.add("active");
                this.div.querySelector("#save").classList.add("active");
            }
        }
        toDo[action]();
       
    }

    setUpUniqueEvents() {
        this.panels = [];
        const div = this.div;

        const container = div.querySelector('.modal-window-content');
        const food_list = JSON.parse(localStorage.getItem("food-list") || '[]');

        if(food_list.length === 0) {
            container.innerHTML = '<p class="history-empty">No Saved Foods</p>';
            return;
        }
    
        //Create food library panels
        food_list.forEach(food => {
            const panel = new FoodItemPanel(food, {get_selected_food: (f, add) => this.#get_selected_food(f, add)});
            container.appendChild(panel.div);  
            this.panels.push(panel);
        });
        //Buttons
        div.querySelector("#save").addEventListener("click", () => {
            const food_data = [];
            this.selected_foods.forEach(food =>{
                
                food_data.push(food);
            });
            
            const e = new CustomEvent('meal-update', {
                detail: {
                    total: this.total,
                    foods: food_data
                },
                bubbles:true
            });

            document.dispatchEvent(e);
            
            this.turn_off();
        });
        div.querySelector("#cancel").addEventListener("click", () =>{
            
            this.panels.forEach(panel => {
                panel.isSelected = false;
                panel.deactivate_select_mode();
            });
            
            this.selected_foods.clear();
            this.turn_off();
        });

        div.querySelector("#confirm").addEventListener("click", () => {
            this.handle_action("unset select mode");
        });
        div.querySelector('#delete').addEventListener("click", async() =>{
            const new_panels = [];
            const food_list_new = [];
            const to_remove = []; //Ids to remove
            const MACROS = ["calories", "fats", "carbs", "protein"];
            this.panels.forEach(p => {
                if(p.isSelected){
                    to_remove.push(p.base_data.id);
                    MACROS.forEach(macro => {
                        this.total[macro] = Math.max(this.total[macro] - p.base_data[macro], 0);
                    });
                    p.delete();
                } else{
                    new_panels.push(p);
                    food_list_new.push(p.data);
                }
            });
            
            localStorage.setItem("food-list", JSON.stringify(food_list_new));
            this.foodList = JSON.parse(localStorage.getItem("food-list") || '[]');
            this.panels = new_panels;
            this.selected_foods.clear();

            if(this.panels.length == 0){
                const empty_msg = this.div.querySelector(".modal-window-content");
                empty_msg.innerHTML = '<p class="history-empty">No Saved Foods</p>';
                
            }
            this.#update_ui_macros();
            await removeUserFood(to_remove);
        });

        div.querySelector(".search-bar").addEventListener("input", (e) =>{
            
            if(this.panels.size === 0){
                return;
            }

            const search_query = e.target.value;
            
            const trie = getTrie();
            const results = trie.getPrefix(search_query);
            const ui_display = div.querySelector(".search-results");

            const search_text = document.createElement("span");
            search_text.classList.add('search-results-title');
            search_text.innerHTML = "Search Results";

            ui_display.innerHTML = ''
            ui_display.classList.add("hidden");
            if(search_query === ''){
                const container = div.querySelector('.modal-window-content');

                this.panels.forEach(panel => {
                    container.appendChild(panel.div);
                });

                return;
            } 
            ui_display.appendChild(search_text);
            ui_display.classList.remove("hidden");
            if (results.size == 0){
                search_text.innerHTML = "No results.";
                return;
            }
            this.panels.forEach(panel => {
                if(results.has(panel.data.id)){
                    ui_display.appendChild(panel.div);
                }
            });
            

           
        });
    }
    turn_off(){
        this.resetState();
        super.turn_off();
    }
    resetState() {
        
        this.selected_foods.clear();
        this.total = { calories: 0, fats: 0, carbs: 0, protein: 0 };
        this.panels.forEach(p => p.isSelected = false);
        this.foodList = [];
    
    }
   
}