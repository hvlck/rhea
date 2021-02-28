import {
    append as a,
    build as b,
    ComponentEventType,
    ElementTag,
    event as e,
} from "./rt/util.js";
import { redraw, register, registerRoute, render, s } from "./rt/index.js";

const Index = () => {
    const [st, set] = s("nav", { clicks: 0 });
    const nav = b(ElementTag.Nav);
    const home = b(ElementTag.A, "Home", {
        href: "/",
    });

    e(home, ComponentEventType.Click, () => {
        set({ clicks: st.clicks + 1 });
        redraw("a");
    });

    const t = b(ElementTag.P, "Clicks: " + st.clicks);
    const abt = b(ElementTag.A, "About", {
        href: "/about",
    });

    return a(nav, [home, abt, t]);
};

const idx: Set<string> = new Set();
idx.add("/").add("/about");
register(Index);

const idxComponents: Set<Function> = new Set();
idxComponents.add(Index);

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

register(Items);
idxComponents.add(Items);
registerRoute(idx, idxComponents);

const About = () => {
    const nav = b(ElementTag.H1, "About");
    return nav;
};

const abt: Set<string> = new Set();
abt.add("/about");
register(About);

const abtComp: Set<Function> = new Set();
abtComp.add(Index).add(About);
registerRoute(abt, abtComp);

window.addEventListener("load", () => render());
