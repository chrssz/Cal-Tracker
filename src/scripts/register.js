import { apiGet, apiPost } from "./api";

// Render date
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const now = new Date();
document.getElementById("date").textContent = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

document.getElementById("register-btn").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirm  = document.getElementById("confirm-password").value;
    const error    = document.getElementById("auth-error");
    const success  = document.getElementById("auth-success");

    error.textContent = "";
    success.textContent = "";

    if(!username || !password || !confirm) {
        error.textContent = "Please fill in all fields.";
        return;
    }

    if(password !== confirm) {
        error.textContent = "Passwords do not match.";
        return;
    }

    try {
        const data = {username, password};
       
        const response = await apiPost('/auth/register', data);
        
        if(response.error) {
            error.textContent = response.error || "Registration failed.";
            return;
        }

        success.textContent = "Account created! Redirecting to login...";
        setTimeout(() => {
            window.location.href = "/login.html";
        }, 1500);

    } catch(err) {
        error.textContent = "Could not connect to server.";
    }
});
