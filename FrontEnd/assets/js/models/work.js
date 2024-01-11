import Category from "./category.js";
import { deleteWork } from "../services/get_data.js";

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

     workMini(mini_gallery, data, updateFunction, gallery) {
        const container = document.createElement("div");
        container.classList.add("modal-img-container");

        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid");
        trashIcon.classList.add("fa-trash-can");

        trashIcon.addEventListener("click", async () => {
            try {
                const deletedWorkId = await deleteWork(this.id);
                mini_gallery.removeChild(container);

                const newWorkData = data.filter((newWork) => newWork.id !== this.id);
                updateFunction(newWorkData, gallery);
            } catch(error) {
                alert(error);
            }
        });

       const img = document.createElement("img");
       img.src = this.imageUrl;
       img.classList.add("modal-img");
       
       container.appendChild(trashIcon);
       container.appendChild(img);

        return container;
    }
}

