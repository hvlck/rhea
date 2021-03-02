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
    state as s,
} from "./src/rt/index";

const Idx = () => {
    h(
        b(ElementTag.Title, { text: "index // rhea" }),
        b(ElementTag.Link, {
            href: "/dist/index.css",
            rel: "stylesheet",
            type: "text/css",
        })
    );
    const [st, set] = s("nav", { clicks: 0 });
    const nav = b(ElementTag.Nav, { class: "nav" });
    const home = b(ElementTag.A, {
        text: "Home",
        href: "/",
    });

    e(home, ComponentEventType.Click, () => {
        set({ clicks: st.clicks + 1 });
    });

    const abt = b(ElementTag.A, {
        text: "About",
        href: "/about",
    });

    const p = b(ElementTag.A, {
        text: "Page",
        href: "/page/" + Math.ceil(Math.random() * 40000),
    });

    return a(nav, home, abt, p, b(ElementTag.Br));
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
            json.forEach(
                (i: {
                    body: string;
                    userId: number;
                    title: string;
                    id: number;
                }) => {
                    const d = b(ElementTag.Div);
                    const id = b(ElementTag.P, i.id.toString());
                    const title = b(ElementTag.P, i.title);

                    a(d, id, title);
                    a(el, d);
                }
            );
        });

    return el;
};

register(Items);
idxComponents.add(Items);
registerRoute(idx, idxComponents);

const About = () => {
    const nav = b(ElementTag.H1, { text: "About" });
    h(
        b(ElementTag.Title, "about // rhea"),
        b(ElementTag.Link, {
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

const Page = () => {
    const el = b(ElementTag.H1, window.location.pathname.split("/page/")[1]);
    return el;
};

const etc: Set<string | RegExp> = new Set();
etc.add(/\/page\/.+/);
register(Page);

const etcComp: Set<Component> = new Set();
etcComp.add(Idx).add(Page);
registerRoute(etc, etcComp);

window.addEventListener("load", () => render());
