import Category from "../models/category.js";
import Work from "../models/work.js";
import { getWork, getCategories, uploadWork } from "../services/get_data.js";

const workData = await getWork();
const categoriesData = await getCategories();

//UTILS
function newElement(type, classnames, attributes = {}) {
    const result = document.createElement(type);
    if (classnames) {
        if (typeof(classnames) === "string") {
            result.classList.add(classnames);
        }
        else {
            for (let i = 0; i < classnames.length; i++) {
                result.classList.add(classnames[i]);
            }
        }
    }
    for (const [key, value] of Object.entries(attributes)) {
        result[key] = value;
    }
    return result;
}

/*
    DYNAMIC GALLERY
*/

//DOM
const galleryElement = document.querySelector(".gallery");
const filtersElement = document.querySelector(".filtres");

function updateGallery(data, gallery) {
    //reset galleryElement
    galleryElement.innerHTML = "";
    /*run through the work data and add the html needed*/
    for (let i = 0; i < data.length; i++) {
        gallery.appendChild(data[i].workFigure);
    }
}

//ajouter le bouton tous à categoriesData
categoriesData.unshift(new Category(0, "Tous"));
function updateCategories(data, filters) {
    for (const category of data) {
        const categoryButton = category.categoryButton;
        if (category.id === 0) {
            categoryButton.classList.add("selected");
        }
        filters.appendChild(categoryButton);
        categoryButton.addEventListener("click", (event) => {
            const selectedFilter = document.querySelector(".selected");
            selectedFilter.classList.remove("selected");
            event.currentTarget.classList.add("selected");
    
            //DATABASE
            if (category.id !== 0) {
                const filteredData = workData.filter((work) => work.categoryId === category.id);
                updateGallery(filteredData, galleryElement);
            } else {
                updateGallery(workData, galleryElement);
            }
        });
    }
}

updateGallery(workData, galleryElement);
updateCategories(categoriesData, filtersElement);


function switchAdmin(isAdmin) {
    const login = document.getElementById("login-btn");
    if (isAdmin) {
        login.innerHTML = "logout";
    } else {
        login.innerHTML = "login";
    }
    const banner = document.querySelector(".admin-banner");
    const edit = document.querySelector(".admin-edit");
    const filters = document.querySelector(".filtres");

    banner.classList.toggle("hidden", !isAdmin);
    edit.classList.toggle("hidden", !isAdmin);
    filters.classList.toggle("hidden", isAdmin);
}

const login = document.getElementById("login-btn");
if (localStorage.getItem("is_connected") === "true") {
    switchAdmin(true);
    login.addEventListener("click", () => {
        // switchAdmin(false);
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_token");
        localStorage.removeItem("is_connected");
        window.location.reload();
    });
}

const editBtn = document.querySelector(".admin-edit");
const closeBtn = document.querySelector(".close-btn");
const modal = document.querySelector("dialog");
const modalContainer = document.querySelector(".modal-container");
const photoForm = document.querySelector(".photo-form");
const modalHeader = document.querySelector(".modal-header");
const modalFooter = document.querySelector(".modal-footer");
const miniGallery = document.querySelector(".mini-gallery");
const fileInput = document.querySelector(".file-input");
const title = document.createElement("h3");

function updateEditModal() {
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
        const miniWork = work.workMini(miniGallery, workData, updateGallery, galleryElement);
        miniGallery.appendChild(miniWork);
    });
}

editBtn.addEventListener("click", () => {
    updateEditModal();
});

closeBtn.addEventListener("click", () => {
    modal.close();
    fileInput.value = "";
});

const addBtn = document.querySelector(".add-btn");

addBtn.addEventListener("click", (event) => {
    event.preventDefault();
    modalContainer.innerHTML = "";
    addBtn.innerHTML = "valider";

    //previous button
    const previousBtn = newElement("i", ["fa-solid", "fa-arrow-left", "fa-xl", "previous-btn"]);
    previousBtn.style.cursor = "pointer";
    modalHeader.prepend(previousBtn);
    modalHeader.style.justifyContent = "space-between";

    previousBtn.addEventListener("click", () => {
        updateEditModal();
    });

    //new title
    title.innerHTML = "Ajout photo";
    modalContainer.appendChild(title);

    //Formulaire
    photoForm.classList.remove("hidden");
    modalContainer.appendChild(photoForm);

    //remettre les éléments en display block une fois de retour sur la page
    const photoContainer = document.querySelector(".photo-container");
    if (photoContainer.lastElementChild.nodeName === "IMG") {
        for (const element of photoContainer.children) {
            if (element.nodeName === "IMG") {
                console.log("image !");
                photoContainer.removeChild(element);
            }
            if (element.nodeName !== "INPUT" && element.nodeName !== "IMG") {
            element.style.display = "block";
            }
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
        console.log(fileInput);
        const selectedFile = fileInput.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imagePreview = newElement("img", ["image-preview"], {src: e.target.result});
                for (const element of photoContainer.children) {
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
    console.log(modal);
    if (modal.lastElementChild.classList.contains("modal-footer")) {
        modal.removeChild(modalFooter);
        addBtn.type = "submit";
        photoForm.appendChild(modalFooter);
    }


    photoForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (fileInput.files.length === 0) {
            alert("Veiller sélectionner un fichier.");
            return ;
        }
        const photoTitleInput = document.querySelector(".photo-title input");
        const photoCategorySelect = document.querySelector(".photo-category select");
        if (photoTitleInput.value === "" || photoCategorySelect.value === "") {
            alert("Veiller remplir tous les champs du formulaire.");
            return ;
        }
        const selectedFile = fileInput.files[0];
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("title", photoTitleInput.value);
        formData.append("category", photoCategorySelect.value);
        try {
             uploadWork(formData);
        } catch (err) {
            console.log(err);
        }
        // const reader = new FileReader();
        // reader.onload = (e) => {
        //     const workUrl = e.target.result;
        //     let newWork = {
        //         //id: workData[workData.length - 1].id + 1,
        //         title: photoTitleInput.value,
        //         imageUrl: workUrl,
        //         categoryId: photoCategorySelect.selectedIndex + 1
        //        // userId: localStorage.getItem("user_id"),
        //     };
        //     console.log(newWork);
        //     uploadWork(newWork);
        // }
        // reader.readAsDataURL(selectedFile);
    });
});