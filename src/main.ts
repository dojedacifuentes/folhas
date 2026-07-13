import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/typography.css";
import "./styles/scenes.css";
import "./styles/interactions.css";
import "./styles/characters.css";
import "./styles/weather.css";
import "./styles/responsive.css";

import { AppController } from "./app/AppController";

const root = document.querySelector<HTMLElement>("#app");
if (root) {
  new AppController(root).start();
}

const syncVisibility = () => {
  document.documentElement.classList.toggle("page-hidden", document.hidden);
};
document.addEventListener("visibilitychange", syncVisibility);
syncVisibility();
