import { getWork } from "./get_data.js";

const workData = await getWork();
console.log(workData);
//GET DOM
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