export default class Category {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    get categoryButton() {
        const btn = document.createElement("button");
        btn.classList.add("btn");
        btn.innerText = this.name;
        return btn;
    }
}