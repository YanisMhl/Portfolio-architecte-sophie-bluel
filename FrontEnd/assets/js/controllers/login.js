import { loginUser } from "../services/get_data.js";

// const user = await loginUser("sophie.bluel@test.tld", "S0phie");

const formulaireConnexion = document.querySelector(".connexion-form");
formulaireConnexion.addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = event.target.querySelector("[name=email]").value;
    const password = event.target.querySelector("[name=password]").value;

    const errorElement = document.querySelector(".error");
    //Check si email conforme
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email) && password.length !== 0) {
        try {
            const user = await loginUser(email, password);
            localStorage.setItem("user_token", user.token);
            localStorage.setItem("user_id", user.id);
            localStorage.setItem("is_connected", true);
            window.location.href = "../index.html";
        } catch (err) {
            errorElement.innerHTML = "Mauvais email ou mot de passe.";
            errorElement.classList.remove("hidden");
        }
    } else {
        errorElement.classList.remove("hidden");
        if (!emailRegex.test(email)) {
            errorElement.innerHTML = "email au mauvais format.";
        } else {
            errorElement.innerHTML = "mot de passe non renseigné.";
        }
    }
});

