import { deleteWork, uploadWork, getCategories, getWork } from "../services/get_data.js";
import { updateGallery } from "./main.js";

const closeBtn = document.querySelector(".close-btn");
const modal = document.querySelector("dialog");
const modalContainer = document.querySelector(".modal-container");
const photoForm = document.querySelector(".photo-form");
const modalHeader = document.querySelector(".modal-header");
const modalFooter = document.querySelector(".modal-footer");
const miniGallery = document.querySelector(".mini-gallery");
const fileInput = document.querySelector(".file-input");
const title = document.createElement("h3");
const addBtn = document.querySelector(".add-btn");
const validateBtn = document.querySelector(".ok-btn");
const galleryElement = document.querySelector(".gallery");

const categoriesData = await getCategories();
let workData = await getWork();


export function updateEditModal(workData, updateGallery) {
    modal.showModal();
    if (modal.children[modal.children.length - 1] !== modalFooter) {
        modal.appendChild(modalFooter);
    }
    modalContainer.innerHTML = "";
    miniGallery.innerHTML = "";

    //previous btn
    if (modalHeader.firstElementChild !== closeBtn) {
        modalHeader.removeChild(modalHeader.firstElementChild);
        modalHeader.style.justifyContent = "flex-end";
    }

    modalFooter.lastElementChild.innerHTML = "Ajouter une photo";
    modalFooter.lastElementChild.type = "";

    title.innerHTML = "Galerie photo";
    modalContainer.appendChild(title);
    modalContainer.appendChild(miniGallery);
    workData.forEach(work => {
        const { container, trashIcon, id } = work.workMini;
        trashIcon.addEventListener("click", async () => {
            try {
                await deleteWork(id);
                miniGallery.removeChild(container);
                workData = await getWork();
                updateGallery(workData, galleryElement);
            } catch (error) {
                alert(error);
            }
        });
        miniGallery.appendChild(container);
    });
    modalFooter.style.display = "flex";
}

closeBtn.addEventListener("click", () => {
    modal.close();
});

addBtn.addEventListener("click", (event) => {
    modalContainer.innerHTML = "";
    modalFooter.style.display = "none";
    validateBtn.disabled = true;
    fileInput.value = "";

    //previous button
    const previousBtn = document.createElement("i");
    previousBtn.classList.add("fa-solid");
    previousBtn.classList.add("fa-arrow-left");
    previousBtn.classList.add("fa-xl");
    previousBtn.classList.add("previous-btn");
    previousBtn.style.cursor = "pointer";
    modalHeader.prepend(previousBtn);
    modalHeader.style.justifyContent = "space-between";

    previousBtn.addEventListener("click", () => {
        updateEditModal(workData, updateGallery);
        fileInput.value = "";
    });

    //new title
    title.innerHTML = "Ajout photo";
    modalContainer.appendChild(title);

    //Formulaire
    photoForm.classList.remove("hidden");
    modalContainer.appendChild(photoForm);

    //remettre les éléments en display block une fois de retour sur la page
    const photoContainer = document.querySelector(".photo-container");
        for (const element of photoContainer.children) {
            if (element.nodeName === "IMG") {
                photoContainer.removeChild(element);
            }
            if (element.nodeName !== "INPUT" && element.nodeName !== "IMG") {
                element.style.display = "block";
            }
    }


    //photo btn
    const photoBtn = document.querySelector(".photo-btn");
    photoBtn.addEventListener("click", (event) => {
        event.preventDefault();
        fileInput.click();
    });


    //file input
    fileInput.addEventListener("change", () => {
        const selectedFile = fileInput.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imagePreview = document.createElement("img");
                imagePreview.classList.add("image-preview");
                imagePreview.src = e.target.result;
                for (const element of photoContainer.children) {
                    if (element.nodeName === "IMG") {
                        element.remove();
                    }
                    element.style.display = "none";
                }
                photoContainer.appendChild(imagePreview);
            };
            reader.readAsDataURL(selectedFile);
        }
    });

    //category select
    const photoCategorySelect = document.querySelector(".photo-category").lastElementChild;
    photoCategorySelect.innerHTML = "";
    categoriesData.forEach((cat) => {
        if (cat.id !== 0) {
            const categoryOption = cat.categoryOption;
            photoCategorySelect.appendChild(categoryOption);
        }
    });
    photoCategorySelect.selectedIndex = -1;

    const formFooter = document.querySelector(".form-footer");
    formFooter.classList.remove("hidden");
});

const photoTitleInput = document.querySelector(".photo-title input");
const photoCategorySelect = document.querySelector(".photo-category select");

function updateValidationButton() {
    if (fileInput.files.length !== 0 && photoTitleInput.value !== "" && photoCategorySelect.value !== "") {
        validateBtn.disabled = false;
    } else {
        validateBtn.disabled = true;
    }
}

fileInput.addEventListener("change", updateValidationButton);
photoTitleInput.addEventListener("input", updateValidationButton);
photoCategorySelect.addEventListener("change", updateValidationButton);

photoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (fileInput.files.length === 0) {
        alert("Veiller sélectionner un fichier.");
        return;
    } else if (photoTitleInput.value === "" || photoCategorySelect.value === "") {
        alert("Veiller remplir tous les champs du formulaire.");
        return;
    } else {
        console.log(validateBtn);
        console.log("plus validé");

    }
    const selectedFile = fileInput.files[0];
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("title", photoTitleInput.value);
    formData.append("category", parseInt(photoCategorySelect.value));
    try {
        const newWork = await uploadWork(formData);
        workData = await getWork();
        updateGallery(workData, galleryElement);
        modal.close();
    } catch (err) {
        alert(err);
    }
});