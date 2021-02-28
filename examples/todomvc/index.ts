import { register, registerRoute, render } from "../../src/rt/index.js";
import { build as b, ElementTag as El } from "../../src/rt/util.js";

const Nav = () => {
    const nav = b(El.Nav);

    return nav;
};

const idx = new Set<string>().add("/examples/hn/");
register("nav", Nav);

const Items = async () => {
    const el = b(El.Ul);
    return el;
};

register("items", Items);

const idxComponents: Set<string> = new Set();
idxComponents.add("nav").add("items");

registerRoute(idx, idxComponents);
window.addEventListener("load", () => render());
