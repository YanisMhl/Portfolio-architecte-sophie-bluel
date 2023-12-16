import { getWork } from "./get_data.js";

const workData = await getWork();

//GET DOM
const galleryElement = document.querySelector(".gallery");
