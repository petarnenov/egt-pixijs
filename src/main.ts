import Animal from "./Animal";

const a = new Animal("Koa");


a.onPush(()=>console.log(a.name))