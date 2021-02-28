import { a, b, ComponentEventType, e, ElementTag } from "./rt/util.js";
import { register, registerRoute, render } from "./rt/index.js";

const Index = () => {
    const nav = b(ElementTag.Nav);
    const home = b(ElementTag.A, "Home", {
        href: "/",
    });
    const abt = b(ElementTag.A, "About", {
        href: "/about",
    });

    e(home, ComponentEventType.Click, event => {
        console.log(event);
    });

    a(nav, [home, abt]);
    return nav;
};

const idx: Set<string> = new Set();
idx.add("/").add("/about");

register("a", Index);

const idxComponents: Set<string> = new Set();

idxComponents.add("a");

registerRoute(idx, idxComponents);

const About = () => {
    const nav = b(ElementTag.H1, "About");
    return nav;
};

const abt: Set<string> = new Set();
abt.add("/about");

register("about", About);

const abtComp: Set<string> = new Set();
abtComp.add("a").add("about");

registerRoute(abt, abtComp);

const Items = () => {
    const el = b(ElementTag.Div);
    fetch("https://jsonplaceholder.typicode.com/posts")
        .then(response => response.json())
        .then(json => {
            json.forEach((i: any) => {
                const d = b(ElementTag.Div);
                const id = b(ElementTag.P, i.id);
                const title = b(ElementTag.P, i.title);
                const completed = b(ElementTag.P, i.completed);

                a(d, [id, title, completed]);
                a(el, [d]);
            });
        });

    return el;
};

register("items", Items);

idxComponents.add("items");

window.addEventListener("load", () => render());
