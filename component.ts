import {
    append as a,
    build as b,
    ComponentEventType,
    ElementTag,
    event as e,
    head as h,
} from "./src/std/index";
import {
    Components,
    Component,
    redraw,
    register,
    registerRoute,
    render,
    s,
} from "./src/rt/index";

const Idx = () => {
    h(
        b(ElementTag.Title, "index // rhea"),
        b(ElementTag.Link, "", {
            href: "/dist/index.css",
            rel: "stylesheet",
            type: "text/css",
        })
    );
    const [st, set] = s("nav", { clicks: 0 });
    const nav = b(ElementTag.Nav, "", { class: "nav" });
    const home = b(ElementTag.A, "Home", {
        href: "/",
    });

    e(home, ComponentEventType.Click, () => {
        set({ clicks: st.clicks + 1 });
    });

    const t = b(ElementTag.P, "Clicks: " + st.clicks);
    const abt = b(ElementTag.A, "About", {
        href: "/about",
    });

    return a(nav, home, abt, t);
};

const idx: Set<string> = new Set();
idx.add("/").add("/about");
register(Idx);

const idxComponents: Set<Component> = new Set();
idxComponents.add(Idx);

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

                a(d, id, title, completed);
                a(el, d);
            });
        });

    return el;
};

register(Items);
idxComponents.add(Items);
registerRoute(idx, idxComponents);

const About = () => {
    const nav = b(ElementTag.H1, "About");
    h(
        b(ElementTag.Title, "about // rhea"),
        b(ElementTag.Link, "", {
            href: "/dist/about.css",
            rel: "stylesheet",
            type: "text/css",
        })
    );
    return nav;
};

const abt: Set<string> = new Set();
abt.add("/about");
register(About);

const abtComp: Set<Component> = new Set();
abtComp.add(Idx).add(About);
registerRoute(abt, abtComp);

window.addEventListener("load", () => render());
