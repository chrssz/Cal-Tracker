import { apiPost } from "./api";
// Render date
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const now = new Date();

document.getElementById("date").textContent = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

document.getElementById("login-btn").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const error = document.getElementById("auth-error");

    error.textContent = "";

    if(!username || !password) {
        error.textContent = "Please fill in all fields.";
        return;
    }

    try {
        console.log("Attempting login");
        const res = await apiPost('/auth/login', {username, password});
        console.log(res);
        if(res.error) {
            error.textContent = data.error || "Login failed.";
            return;
        }

        window.location.href = "/index.html";

    } catch(err) {
        error.textContent = "Could not connect to server.";
    }
});
