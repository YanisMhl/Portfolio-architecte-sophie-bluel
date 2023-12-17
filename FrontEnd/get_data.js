import User from './user.js';

export async function getWork() {
    const data = await fetch("http://localhost:5678/api/works").then(response => response.json());
    return data;
}

export async function loginUser(userEmail, userPassword) {
    const userRaw = {
        email: userEmail,
        password: userPassword
    };
    const userData = JSON.stringify(userRaw);

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: userData
        });
        if (response.ok) {
            const data = await response.json();
            const user = new User(data.userId, data.token);
            return user;
        } else {
            const errorElement = document.querySelector(".error");
            //404 : utilisateur n'existe pas
            if (response.status === 404) {
                errorElement.innerHTML = "Cet utilisateur n'existe pas.";
            }

            //401 : mauvais mot de passe
            if (response.status === 401) {
                errorElement.innerHTML = "Mauvais mot de passe.";
            }
            throw new Error(`${response.status} : ${response.statusText}`);
        }
    } catch(err) {
        console.log(err);
    }
}