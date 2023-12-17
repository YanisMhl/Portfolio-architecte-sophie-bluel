import { loginUser } from "./get_data.js";

// const user = await loginUser("sophie.bluel@test.tld", "S0phie");

const formulaireConnexion = document.querySelector(".connexion-form");
formulaireConnexion.addEventListener("submit", async function(event) {
    event.preventDefault();
    const email = event.target.querySelector("[name=email]").value;
    const password = event.target.querySelector("[name=password]").value;
    try {
    const user = await loginUser(email, password);
    localStorage.setItem("user_token", user.token);
    localStorage.setItem("user_id", user.id);
    localStorage.setItem("is_connected", true);
    window.location.href = "../index.html";
    } catch(err) {
        console.log(err);
    }
});

