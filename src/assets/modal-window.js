export class ModalWindow{
    constructor(){
        this.menu = null; //Keep the menu persistent
        this.div = this.get_div();
        this.setUpDefaultEvents();
        this.setUpUniqueEvents();
    }

    get_div(){
        const div = document.createElement('div');
        div.classList.add('modal-window');
        
        div.innerHTML = `
            <header>
              <button id="go-back">&#8592;</button>
              <span>${this.getTitle()}</span>
              <button id="options">&#9776;</button>
            </header>
            
            
            ${this.getContent()}
           
            <footer>
                ${this.getfooterContent()}
            </footer>
        `;
        
        return div;
    }
   
    getTitle(){
        return "Template Title";
    }
    getContent(){
        return `
            <div class="modal-window-content">
            </div>
        `;
    }
    getfooterContent(){
        return `
            <button id="delete">&#128465;</button>
            <button id="cancel">Cancel</button>
            <button id="save">Save</button>
            <button id="confirm">&#x2714;</button>
        `;
    }
    delete_div(){
        this.div.remove();
    }
    #bind_click_outside_event(menu){
        const outside_click = (e) => {
                if(!menu.contains(e.target)) {  // clicked outside menu
                    menu.remove();
                    document.removeEventListener("click", outside_click);  // cleanup
                }
            };
            setTimeout(() => {
                document.addEventListener("click", outside_click);
            }, 0);
        
        return;
    }
    
    options_menu() {
        
        if(this.menu){
            this.#bind_click_outside_event(this.menu);
            return this.menu;
        }
        this.menu = document.createElement("div");
        this.menu.classList.add("options-menu");
        this.menu.innerHTML = this.options_content();

        this.menu.querySelectorAll('li').forEach(li => {
            li.addEventListener("click", () => {
                const action = li.dataset.action;
                this.handle_action(action);
                
            });
        });

        this.#bind_click_outside_event(this.menu);

        return this.menu;
    }
    options_content(){
        //Every li MUST contain a data-*, required to correctly connect action events across inherited modal-windows.
        return `
            <ul>
                <li data-action='someAction'> use options_content() to change </li>
            </ul>
        `;
    }
    handle_action(action){

        console.log(`Handling ${action}`);
    }
    setUpDefaultEvents(){
        const div = this.div;
        //Sets up the default events such as the back button, and hamburger symbol
        div.querySelector(`#go-back`).addEventListener("click", () =>{
            this.turn_off();
        });

        div.querySelector('#options').addEventListener("click", () => {
            //See if menu is on already
            const dom_menu = div.querySelector(".options-menu");
            if(dom_menu){
                //Close it
                this.menu.remove();
                return;
            }
            div.appendChild(this.options_menu());
        });
    }
    setUpUniqueEvents(){
        return;
    }
    turn_on() {
        document.body.appendChild(this.div);  // append to DOM
    
        setTimeout(() => {
            //So the animation can play
            this.div.classList.add('open');  
        }, 50);

        document.body.classList.add('modal-open');

        document.getElementById('background-fade').classList.add('open');
    }

    turn_off() {
        this.div.classList.remove('open');
       
        this.div.classList.add('closing-back');
      
       
        document.body.classList.remove('modal-open');
        document.getElementById('background-fade').classList.remove('open');
    
        setTimeout(() => {
            this.div.remove();  // ← remove from DOM after animation
        }, 400);
    }


}