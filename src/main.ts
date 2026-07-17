import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/typography.css";
import "./styles/scenes.css";
import "./styles/interactions.css";
import "./styles/characters.css";
import "./styles/weather.css";
import "./styles/pixel.css";
import "./styles/gestures.css";
import "./styles/responsive.css";
import "./styles/atmosphere.css";

import { AppController } from "./app/AppController";
import { initAtmosphere } from "./app/atmosphere";

const root = document.querySelector<HTMLElement>("#app");
if (root) {
  new AppController(root).start();
  initAtmosphere();
}

const syncVisibility = () => {
  document.documentElement.classList.toggle("page-hidden", document.hidden);
};
document.addEventListener("visibilitychange", syncVisibility);
syncVisibility();
