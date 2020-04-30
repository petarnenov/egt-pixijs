import { loaders } from "pixi.js";

export default class ExtendedResource extends loaders.Loader.Resource {
  [key: string]: any;
  constructor(name: string, url: string, options?: loaders.LoaderOptions) {
    super(name, url, options);
  }
}
