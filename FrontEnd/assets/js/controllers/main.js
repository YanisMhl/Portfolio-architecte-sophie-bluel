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
            console.log(selectedFilter);
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
    console.log("it's here !");
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
            try {
                const deletedWorkId = await deleteWork();
                console.log(deletedWorkId);
            } catch (error) {
                alert(error);
            }
        });

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.classList.add("modal-img");
        imgContainer.appendChild(img);

        console.log(imgContainer);
        miniGallery.appendChild(imgContainer);
    });
});

closeBtn.addEventListener("click", () => {
    modal.close();
});

addBtn.addEventListener("click", () => {
    //reset modal container
    modalContainer.innerHTML = "";

    //new title
    title.innerHTML = "Ajout photo";
    modalContainer.appendChild(title);

    //PHOTO
    const photoContainer = document.createElement("div");
    photoContainer.classList.add("photo-container");

    const photoIcon = document.createElement("i");
    photoIcon.classList.add("fa-regular");
    photoIcon.classList.add("fa-image");
    photoIcon.classList.add("fa-5x");
    photoContainer.appendChild(photoIcon);

    const photoBtn = document.createElement("button");
    photoBtn.classList.add("photo-btn");
    photoBtn.innerHTML = "+ Ajouter photo";
    photoContainer.appendChild(photoBtn);

    const photoInfo = document.createElement("p");
    photoInfo.innerHTML = "jpg, png : 4mo max";
    photoContainer.appendChild(photoInfo);

    modalContainer.appendChild(photoContainer);

    /* FORMULAIRE */

    const photoForm = document.createElement("form");
    photoForm.classList.add("photo-form");
    photoForm.action = "#";
    photoForm.method = "post";

    //TITRE
    const photoTitle = document.createElement("div");
    photoTitle.classList.add("photo-title");

    //label
    const photoTitleLabel = document.createElement("label");
    photoTitleLabel.classList.add("photo-form-label");
    photoTitleLabel.for = "titre";
    photoTitleLabel.innerHTML = "Titre ";
    photoTitle.appendChild(photoTitleLabel);

    //input
    const photoTitleInput = document.createElement("input");
    photoTitleInput.classList.add("photo-form-input");
    photoTitleInput.type = "text";
    photoTitleInput.id = "titre";
    photoTitleInput.name = "titre";
    photoTitle.appendChild(photoTitleInput);

    photoForm.appendChild(photoTitle);

    //CATEGORIE
    const photoCategory = document.createElement("div");
    photoCategory.classList.add("photo-category");

    //label
    const photoCategoryLabel = document.createElement("label");
    photoCategoryLabel.classList.add("photo-form-label");
    photoCategoryLabel.for = "categorie";
    photoCategoryLabel.innerHTML = "Catégorie ";
    photoCategory.appendChild(photoCategoryLabel);

    //select
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

    modalContainer.appendChild(photoForm);
});
