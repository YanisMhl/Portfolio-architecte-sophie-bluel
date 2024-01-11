import User from '../models/user.js';
import Work from '../models/work.js';
import Category from '../models/category.js';


export async function getWork() {
    const data = await fetch("http://localhost:5678/api/works").then(response => response.json());
    
    return data.map((work) => new Work(work));
}

export async function deleteWork(id) {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
            "Content-Type": "application/json"
        }
    });
    if (response.ok === true) {
        return id;
    } else {
        throw "Une erreur est survenue lors de la suppression du travail.";
    }
}

//fonction pour upload le work
export async function uploadWork(work) {
    console.log("on y est");
    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("user_token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(work)
        });
    } catch(err) {
        throw err;
    }
}

export async function getCategories() {
    const data = await fetch("http://localhost:5678/api/categories").then(response => response.json());
    
    return data.map((category) => new Category(category.id, category.name));
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
            throw new Error(response.status);
        }
    } catch(err) {
        throw err;
    }
}

