import { createRoot } from "react-dom/client";
import App from "./components/app/App";
import MarvelService from "./services/MarvelService";
import "./style/style.scss";

const marvelService = new MarvelService();

marvelService.getAllCharacters().then(res => res.data.results.forEach(element => console.log(element.name)));

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <App />

);
