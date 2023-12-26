import Category from "./category.js";

export default class Work {
    constructor(work) {
        this.id = work.id;
        this.title = work.title;
        this.imageUrl = work.imageUrl;
        this.categoryId = work.categoryId;
        this.userId = work.userId;
        this.category = new Category(work.category.id, work.category.name);
    };

    get workFigure() {
        const figElement = document.createElement("figure");
        const imgElement = document.createElement("img");
        const captionElement = document.createElement("figcaption");
        imgElement.src = this.imageUrl;
        imgElement.alt = this.title;
        captionElement.innerHTML = this.title;

        figElement.appendChild(imgElement);
        figElement.appendChild(captionElement);

        return figElement;
    }
}

