import { a, b, ElementTag } from "./util.js";
import { register, registerRoute, render } from "./index.js";

const Index = () => {
    const nav = b(ElementTag.Nav);
    const el = b(ElementTag.A, "test", {
        href: "/about",
    });

    a(nav, [el]);
    return nav;
};

const idx: Set<string> = new Set();
idx.add("/");

register("a", Index);

const idxComponents: Set<string> = new Set();
idxComponents.add("a");
registerRoute(idx, idxComponents);

window.addEventListener("load", () => render());
