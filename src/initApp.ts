import { Application } from "pixi.js";
export function initApp() {
  const app = new Application({
    antialias: true,
    resolution: 1,
  });
  document.body.appendChild(app.view);
  return app;
}
export function destroyApp(app: Application) {
  document.body.removeChild(app.view);
  app.destroy();
}

export const width = 800;
export const height = 600;
export const delayDemo = 3000;
