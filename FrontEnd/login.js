import { loginUser } from "./get_data.js";

// const user = await loginUser("sophie.bluel@test.tld", "S0phie");

const formulaireConnexion = document.querySelector(".connexion-form");
console.log(formulaireConnexion);
formulaireConnexion.addEventListener("submit", async function(event) {
    event.preventDefault();
    const email = event.target.querySelector("[name=email]").value;
    const password = event.target.querySelector("[name=password]").value;
    const user = await loginUser(email, password);
    console.log(user);
});

