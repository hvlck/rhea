import {
    append as a,
    build as b,
    ComponentEventType,
    ElementTag,
    event as e,
} from "./rt/util.js";
import { redraw, register, registerRoute, render, s } from "./rt/index.js";

const Index = () => {
    const state = s("nav", { clicks: 0 });
    const nav = b(ElementTag.Nav);
    const home = b(ElementTag.A, "Home", {
        href: "/",
    });

    e(home, ComponentEventType.Click, () => {
        state.set({ clicks: state.state.clicks + 1 });
        redraw("a");
    });

    const t = b(ElementTag.P, "Clicks: " + state.state.clicks);
    const abt = b(ElementTag.A, "About", {
        href: "/about",
    });

    a(nav, [home, abt, t]);
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
