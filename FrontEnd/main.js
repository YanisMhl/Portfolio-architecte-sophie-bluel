import { getWork } from "./get_data.js";

const workData = await getWork();


//DYNAMIC GALLERY
const galleryElement = document.querySelector(".gallery");


for (let i = 0; i < workData.length; i++) {
    const figElement = document.createElement("figure");
    const imgElement = document.createElement("img");
    const captionElement = document.createElement("figcaption");
    imgElement.src = workData[i].imageUrl;
    imgElement.alt = workData[i].title;
    captionElement.innerHTML = workData[i].title;

    figElement.appendChild(imgElement);
    figElement.appendChild(captionElement);
    galleryElement.appendChild(figElement);
}



//FILTERS SELECTION UI
const filtersElement = document.querySelector(".filtres");
function getSelectedFilter(filters) {
    for (let i = 0; i < filters.length; i++) {
        if (filters[i].classList.contains("selected")) {
            return filters[i];
        }
    }
} 

let nbFiltres = filtersElement.children.length;
for (let i = 0; i < nbFiltres; i++) {
    filtersElement.children[i].addEventListener("click", (event) => {
        const selectedFilter = getSelectedFilter(filtersElement.children);
        selectedFilter.classList.remove("selected");
        event.currentTarget.classList.add("selected");
    });
}