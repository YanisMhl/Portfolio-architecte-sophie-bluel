import Category from "../models/category.js";
import { getWork, getCategories } from "../services/get_data.js";

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
        login.href = "./login";
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
        switchAdmin(false);
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_token");
        localStorage.removeItem("is_connected");
    });
}

const editBtn = document.querySelector(".admin-edit");
const closeBtn = document.querySelector(".close-btn");
const addBtn = document.querySelector(".add-btn");
const modal = document.querySelector("dialog");
const miniGallery = document.querySelector(".mini-gallery");


editBtn.addEventListener("click", () => {
    modal.showModal();
    miniGallery.innerHTML = "";
    workData.forEach(work => {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("modal-img-container");

        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid");
        trashIcon.classList.add("fa-trash-can");
        imgContainer.appendChild(trashIcon);

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
    modal.innerHTML = "";
});