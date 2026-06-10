export class FoodItemPanel {
    constructor(data, callBacks = {}, gramOptions = false) {

        this.base_data = structuredClone(data); // NEVER changes
        this.data = structuredClone(data);      // working copy

        this.gramOptions = gramOptions;

        this.div = this.get_div();

        this.selected = false;
        this.callBacks = callBacks;

        this.handle_click_ref = null;
        this.handle_serving_input_ref = null;
        this.handle_serving_type_ref = null;

        this.serving_input = 1;
        this.serving_type = "servings";

        if (this.gramOptions) {
            this.set_up_events();
        }
    }

    delete() {

        if (this.handle_click_ref) {
            this.div.removeEventListener("click", this.handle_click_ref);
        }

        const servingInput = this.div?.querySelector(".serving-input");
        const servingDropdown = this.div?.querySelector(".serving-dropdown");

        if (servingInput && this.handle_serving_input_ref) {
            servingInput.removeEventListener("change", this.handle_serving_input_ref);
        }

        if (servingDropdown && this.handle_serving_type_ref) {
            servingDropdown.removeEventListener("change", this.handle_serving_type_ref);
        }

        this.div?.remove();
        this.div = null;
        this.data = null;
        this.base_data = null;
        this.callBacks = null;
    }

    get_div() {
        const div = document.createElement("div");

        div.classList.add("food-list-item");

        div.innerHTML = `
            <div class="added-food-name">${this.base_data.name}</div>

            <div class="added-food-info">
                ${this.base_data.calories}cal • 
                F:${this.base_data.fats}g • 
                C:${this.base_data.carbs}g • 
                P:${this.base_data.protein}g
            </div>

            ${this.gramOptions ? `
                <div class="food-actions">
                    <input
                        class="serving-input"
                        type="number"
                        value="1"
                        min="0"
                        step="0.25"
                    >

                    <select class="serving-dropdown">
                        <option value="servings">servings</option>
                        <option value="grams">grams</option>
                    </select>
                </div>
            ` : ""}

            <div class="selection-circle hidden">
                <span class="checkmark">✓</span>
            </div>
        `;

        return div;
    }

    #handle_click(div) {

        this.isSelected = !this.isSelected;

        div.classList.toggle("selected", this.isSelected);

        this.callBacks?.get_selected_food?.(this.data, this.isSelected);
    }

    activate_select_mode() {

        const circle = this.div.querySelector(".selection-circle.hidden");
        circle?.classList.remove("hidden");

        this.handle_click_ref = () => this.#handle_click(this.div);

        this.div.addEventListener("click", this.handle_click_ref);
    }

    deactivate_select_mode() {

        const circle = this.div.querySelector(".selection-circle");

        if (!this.isSelected) {
            this.div.classList.remove("selected");
        }

        circle?.classList.add("hidden");

        if (this.handle_click_ref) {
            this.div.removeEventListener("click", this.handle_click_ref);
        }
    }

    set_up_events() {

        const servingInput = this.div.querySelector(".serving-input");
        const servingDropdown = this.div.querySelector(".serving-dropdown");

        this.handle_serving_input_ref = (e) => {

            this.serving_input = Math.max(Number(e.target.value), 1);

            const { old_data, new_data } = this.get_new_macros();

            this.change_item_panel_info(new_data);

            this.dispatch_serving_change(old_data, new_data);
        };

        this.handle_serving_type_ref = (e) => {

            const old_type = this.serving_type;
            const new_type = e.target.value;

            if (new_type === "servings") {
                this.serving_input = 1;
                servingInput.value = 1;
            }

            if (new_type === "grams") {
                this.serving_input = this.base_data.grams;
                servingInput.value = this.base_data.grams;
            }

            this.serving_type = new_type;

            const { old_data, new_data } = this.get_new_macros();

            this.change_item_panel_info(new_data);

            this.dispatch_serving_change(old_data, new_data);
        };

        servingInput?.addEventListener("change", this.handle_serving_input_ref);
        servingDropdown?.addEventListener("change", this.handle_serving_type_ref);
    }

    dispatch_serving_change(old_data, new_data) {
        this.div.dispatchEvent(new CustomEvent("serving-change", {
            detail: { old_data, new_data },
            bubbles: true
        }));
    }

    get_new_macros() {

        const old_data = this.data;
        const new_data = structuredClone(this.base_data);

        const MACROS = ["calories", "fats", "carbs", "protein"];

        if (this.serving_type === "servings") {

            MACROS.forEach(macro => {
                new_data[macro] *= this.serving_input;
            });

            new_data['grams'] *= this.serving_input;
        } else if (this.serving_type === "grams") {

            const ratio = this.serving_input / this.base_data.grams;

            MACROS.forEach(macro => {
                new_data[macro] = Math.round(this.base_data[macro] * ratio);
            });

            new_data['grams'] = this.serving_input;
        }

        
        this.data = new_data;

        return { old_data, new_data };
    }

    change_item_panel_info(new_data) {

        this.div.querySelector(".added-food-info").innerHTML = `
            ${new_data.calories}cal • 
            F:${new_data.fats}g • 
            C:${new_data.carbs}g • 
            P:${new_data.protein}g
        `;
    }
}