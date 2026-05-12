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
        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if(!res.ok) {
            error.textContent = data.error || "Login failed.";
            return;
        }

        window.location.href = "/index.html";

    } catch(err) {
        error.textContent = "Could not connect to server.";
    }
});
