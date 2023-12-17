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
            console.log("Connexion réussie");
            const data = await response.json();
            const user = new User(data.userId, data.token);
            return user;
        } else {
            //404 : utilisateur n'existe pas
            //401 : mauvais mot de passe
            throw new Error(`${response.status} : ${response.statusText}`);
        }
    } catch(err) {
        console.log(err);
    }
}