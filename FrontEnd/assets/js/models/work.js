import Category from "./category.js";

export default class Work {
    constructor(work) {
        this.id = work.id;
        this.title = work.title;
        this.imageUrl = work.imageUrl;
        this.categoryId = work.categoryId;
        this.userId = work.userId;
        if (work.category)
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

    get workMini() {
        const container = document.createElement("div");
        container.classList.add("modal-img-container");
        container.id = `work-mini-${this.id}`;

        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid");
        trashIcon.classList.add("fa-trash-can");

        const img = document.createElement("img");
        img.src = this.imageUrl;
        img.classList.add("modal-img");

        container.appendChild(trashIcon);
        container.appendChild(img);

        return { container, trashIcon, id: this.id };
    }
}

