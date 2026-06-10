import { ModalWindow } from "./modal-window";
import { renderBars } from "../scripts/progress";
import { setUserGoals } from "../scripts/user_info.js";
export class OptionsModal extends ModalWindow{
    constructor(){
        super();
    }
    get get_goals(){
        return JSON.parse(localStorage.getItem("goals"));
    }
    getCalorieGoals(){
        const goals = this.get_goals;
        return `
            <div class="calorie-goals">

                <div class="goal-row">
                    <label for="calories">Calories</label>
                    <input id="calories" type="number" placeholder="e.g. 2000" value="${goals["calories"]}">grams
                </div>

                <div class="goal-row">
                    <label for="fats">Fats</label>
                    <input id="fats" type="number" placeholder="e.g. 70g" value="${goals["fats"]}">grams
                </div>

                <div class="goal-row">
                    <label for="carbs">Carbs</label>
                    <input id="carbs" type="number" placeholder="e.g. 250g" value="${goals["carbs"]}">grams
                </div>

                <div class="goal-row">
                    <label for="protein">Protein</label>
                    <input id="protein" type="number" placeholder="e.g. 120g" value="${goals["protein"]}">grams
                </div>

            </div>
        `;
    }
    getContent(){
        return `
            <div class="modal-window-content">
                ${this.getCalorieGoals()}
            </div>

        `
       
    }
    getTitle(){
        return `
            Options
        `
    }
    
    getfooterContent(){
        return `
            <button id="save">Save</button>
        `;
    }
    async getNewGoals(){
        const inputs = this.div.querySelectorAll(".goal-row input");
        const new_goals = {calories: 0, fats: 0, carbs: 0, protein: 0};
        
        inputs.forEach(input=>{
            new_goals[input.id] = Number(input.value) || 0;
        })

        localStorage.setItem("goals", JSON.stringify(new_goals));
        
        await setUserGoals(new_goals);
    }
    setUpUniqueEvents(){

        this.div.querySelector("#save").addEventListener("click", async() =>{
            await this.getNewGoals();
            renderBars();
            this.turn_off();
        });
        
        const inputs = this.div.querySelectorAll(".goal-row input");
        inputs.forEach(input => {
            input.addEventListener("change", async(e) => {
                const save_btn = this.div.querySelector("#save").classList.add("active");
            });
        });

    }
}