import { getWork } from "./get_data.js";

const workData = await getWork();
console.log(workData);


/*
    DYNAMIC GALLERY
*/

//DOM
const galleryElement = document.querySelector(".gallery");

function updateGallery(data, gallery) {
    //reset galleryElement
    galleryElement.innerHTML = "";
    /*run through the work data and add the html needed*/
    for (let i = 0; i < data.length; i++) {
        const figElement = document.createElement("figure");
        const imgElement = document.createElement("img");
        const captionElement = document.createElement("figcaption");
        imgElement.src = data[i].imageUrl;
        imgElement.alt = data[i].title;
        captionElement.innerHTML = data[i].title;
    
        figElement.appendChild(imgElement);
        figElement.appendChild(captionElement);
        gallery.appendChild(figElement);
    }
}

updateGallery(workData, galleryElement);


/*
    FILTERS SELECTION
*/

//DOM
const filtersElement = document.querySelector(".filtres");

/*function: returns selected filter based of his class*/
function getSelectedFilter(filters) {
    for (let i = 0; i < filters.length; i++) {
        if (filters[i].classList.contains("selected")) {
            return filters[i];
        }
    }
} 

/*run through every button and check if they're clicked*/
let nbFiltres = filtersElement.children.length;
for (let i = 0; i < nbFiltres; i++) {
    filtersElement.children[i].addEventListener("click", (event) => {

        /* 
            UI: Remove the selected class from the previous selected button and add it to the new selected button  
        */
        const selectedFilter = getSelectedFilter(filtersElement.children);
        selectedFilter.classList.remove("selected");
        event.currentTarget.classList.add("selected");

        //DATABASE
        if (i !== 0) {
            const filteredData = workData.filter((work) => work.categoryId === i);
            updateGallery(filteredData, galleryElement);
        } else {
            updateGallery(workData, galleryElement);
        }
    });
} 

function switchAdmin(isAdmin) {
    const banner = document.querySelector(".admin-banner");
    const login = document.getElementById("login-btn");
    const logout = document.getElementById("logout-btn");
    const edit = document.querySelector(".admin-edit");
    const filters = document.querySelector(".filtres");

    banner.classList.toggle("hidden", !isAdmin);
    login.classList.toggle("hidden", isAdmin);
    logout.classList.toggle("hidden", !isAdmin);
    edit.classList.toggle("hidden", !isAdmin);
    filters.classList.toggle("hidden", isAdmin);
}

if (localStorage.getItem("is_connected") === "true") {
    switchAdmin(true);
}

const logout = document.getElementById("logout-btn");
logout.addEventListener("click", () => {
    switchAdmin(false);
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_token");
    localStorage.removeItem("is_connected");
});