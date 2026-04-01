import { renderBars } from "./progress.js";
import { init_form_events } from "./forms.js";
//Will render all components in document

function renderAll()
{
    renderDate();
    renderBars();
    
}
function init_events()
{
    init_form_events();
    init_options_event();
}

function renderDate()
{
    const num_to_months = {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December"
    }

    let p = document.getElementById("date");

    let todayDay = new Date();
    let month = num_to_months[todayDay.getMonth()];
    let day = todayDay.getDate();
    let year = todayDay.getFullYear();

    let manualDate = `${month} ${day}, ${year}`;

    p.innerHTML = manualDate;
}

function init_options_event(){
    const btn = document.getElementById("options-button");

    btn.addEventListener("click", () => {
        const options_window = document.getElementById("options-window");
        options_window.classList.add("open");
    });
}

export {renderAll, init_events};