// Local sandbox for trying components while building them. Not shipped.
import "../src/index";

const app = document.querySelector<HTMLElement>("#app")!;
app.innerHTML = `<h1>fronty</h1><p>Playground is ready. Components show up here as they get built.</p>`;
