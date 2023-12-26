class User {
    constructor(id, token) {
        this.id = id;
        this.token = token;
    }

    displayInfo() {
        console.log(`id : ${this.id}\ntoken : ${this.token}`);
    }
}

export default User;