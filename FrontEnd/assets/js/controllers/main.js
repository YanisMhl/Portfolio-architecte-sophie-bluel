import Category from "../models/category.js";
import { getWork, getCategories, deleteWork } from "../services/get_data.js";

const workData = await getWork();
const categoriesData = await getCategories();

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
const addBtn = document.querySelector(".add-btn");
const modal = document.querySelector("dialog");
const modalContainer = document.querySelector(".modal-container");
const miniGallery = document.querySelector(".mini-gallery");
const title = document.createElement("h3");


editBtn.addEventListener("click", () => {
    modal.showModal();
    modalContainer.innerHTML = "";
    miniGallery.innerHTML = "";
    addBtn.innerHTML = "Ajouter une photo";

    title.innerHTML = "Galerie photo";
    modalContainer.appendChild(title);
    modalContainer.appendChild(miniGallery);
    workData.forEach(work => {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("modal-img-container");

        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid");
        trashIcon.classList.add("fa-trash-can");
        imgContainer.appendChild(trashIcon);

        trashIcon.addEventListener("click", async () => {
            console.log("cliqué !");
            try {
                const deletedWorkId = await deleteWork(work.id);
                //update l'affichage des work dans la modale
                miniGallery.removeChild(imgContainer);
                //update l'affichage des work dans la page home
                const newWorkData = workData.filter((newWork) => newWork.id !== work.id);
                updateGallery(newWorkData, galleryElement);

                console.log(deletedWorkId);
            } catch (error) {
                alert(error);
            }
        });

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.classList.add("modal-img");
        imgContainer.appendChild(img);

        miniGallery.appendChild(imgContainer);
    });
});

closeBtn.addEventListener("click", () => {
    modal.close();
});

addBtn.addEventListener("click", () => {
    modalContainer.innerHTML = "";
    addBtn.innerHTML = "valider";
    //new title
    title.innerHTML = "Ajout photo";
    modalContainer.appendChild(title);

    //Formulaire
    const photoForm = document.createElement("form");
    photoForm.classList.add("photo-form");
    photoForm.method = "post";
    photoForm.enctype = "multipart/form-data";

    //photo-container
    const photoContainer = document.createElement("div");
    photoContainer.classList.add("photo-container");

    //icône 
    const photoIcon = document.createElement("i");
    photoIcon.classList.add("fa-regular");
    photoIcon.classList.add("fa-image");
    photoIcon.classList.add("fa-5x");
    photoContainer.appendChild(photoIcon);

    //photo btn
/*     const photoBtn = document.createElement("button");
    photoBtn.classList.add("photo-btn");
    photoBtn.innerHTML = "+ Ajouter photo";
    photoForm.appendChild(photoBtn); */

    //file input
    const fileInput = document.createElement("input");
    fileInput.classList.add("file-input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.id = "file";
    fileInput.name = "file";
    photoContainer.appendChild(fileInput);

    fileInput.addEventListener("change", () => {
        const selectedFile = fileInput.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imagePreview = document.createElement("img");
                imagePreview.classList.add("image-preview");
                imagePreview.src = e.target.result;
                photoIcon.style.display = "none";
                fileInput.style.display = "none";
                photoInfo.style.display = "none";
                photoContainer.appendChild(imagePreview);
            };
            reader.readAsDataURL(selectedFile);
        }
    });

    //photo info
    const photoInfo = document.createElement("p");
    photoInfo.innerHTML = "jpg, png : 4mo max";
    photoContainer.appendChild(photoInfo);

    photoForm.appendChild(photoContainer);


    //Photo title
    const photoTitle = document.createElement("div");
    photoTitle.classList.add("photo-title");

    //label
    const photoTitleLabel = document.createElement("label");
    photoTitleLabel.classList.add("photo-form-label");
    photoTitleLabel.for = "titre";
    photoTitleLabel.innerHTML = "Titre ";
    photoTitle.appendChild(photoTitleLabel);

    //title input
    const photoTitleInput = document.createElement("input");
    photoTitleInput.classList.add("photo-form-input");
    photoTitleInput.type = "text";
    photoTitleInput.id = "titre";
    photoTitleInput.name = "titre";
    photoTitle.appendChild(photoTitleInput);

    photoForm.appendChild(photoTitle);

    //category 
    const photoCategory = document.createElement("div");
    photoCategory.classList.add("photo-category");

    //category label
    const photoCategoryLabel = document.createElement("label");
    photoCategoryLabel.classList.add("photo-form-label");
    photoCategoryLabel.for = "categorie";
    photoCategoryLabel.innerHTML = "Catégorie ";
    photoCategory.appendChild(photoCategoryLabel);

    //category select
    const photoCategorySelect = document.createElement("select");
    photoCategorySelect.classList.add("photo-form-input");
    photoCategorySelect.id = "categorie";
    photoCategorySelect.name = "categorie";
    categoriesData.forEach((cat) => {
        if (cat.id !== 0) {
            const categoryOption = document.createElement("option");
            categoryOption.value = cat.name.toLowerCase();
            categoryOption.innerHTML = cat.name;
            photoCategorySelect.appendChild(categoryOption);
        }
    });
    photoCategorySelect.selectedIndex = -1;

    photoCategory.appendChild(photoCategorySelect);
    photoForm.appendChild(photoCategory);

    console.log(modalContainer);
    const modalFooter = document.querySelector(".modal-footer");
    modalFooter.removeChild(addBtn);
    modal.removeChild(modalFooter);

    const validateBtn = document.createElement("button");
    validateBtn.innerHTML = "valider";
    validateBtn.type = "submit";
    validateBtn.classList.add("btn");
    modalFooter.appendChild(validateBtn);
    photoForm.appendChild(modalFooter);
    modalContainer.appendChild(photoForm);
    console.log(modalContainer);

    photoForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (fileInput.files.length === 0) {
            alert("Veiller sélectionner un fichier.");
        }

        if (photoTitleInput.value === "" || photoCategorySelect.value === "") {
            alert("Veiller remplir tous les champs du formulaire.");
        }
        const selectedFile = fileInput.files[0];
        console.log(selectedFile);
        console.log(`titre : ${photoTitleInput.value}\ncatégorie : ${photoCategorySelect.value}`);
    });
});