import {
    append as a,
    build as b,
    ComponentEventType,
    event as e,
    head as h,
} from "../../src/std/index";
import {
    Components,
    Component,
    redraw,
    register,
    mount,
    render,
    state as s,
} from "../../src/rt/index";

import {
    Components as Cmp,
    Index,
    Runtime,
    Router,
    State,
    Std,
    Examples,
    Testing,
    UnderTheHood,
} from "./docs";

const Toc = () => {
    const toc = b("div");
    return a(
        toc,
        b("a", { text: "Runtime", href: "/runtime" }),
        b("a", { text: "Components", href: "/components" }),
        b("a", { text: "Router", href: "/router" }),
        b("a", { text: "State", href: "/state" }),
        b("a", { text: "Standard Library", href: "/std" }),
        b("a", { text: "Examples", href: "/examples" }),
        b("a", { text: "Testing", href: "/testing" }),
        b("a", { text: "Under the Hood", href: "/under-the-hood" })
    );
};

const Nav = () => {
    h(b("title", { text: "index // rhea" }));
    const nav = b("nav", { class: "nav" });
    const home = b("a", {
        text: "Home",
        href: "/",
    });

    return a(
        nav,
        home,
        Toc(),
        b("a", {
            text: "Source",
            href: "https://github.com/hvlck/rhea",
        })
    );
};

const nav: Set<string> = new Set();
register(Nav);

const Docs = () => {
    const el = b("div");
    let content: HTMLElement;
    switch (window.location.pathname) {
        case "/": {
            content = Index();
            break;
        }
        case "/components": {
            content = Cmp();
            break;
        }
        case "/runtime": {
            content = Runtime();
            break;
        }
        case "/router": {
            content = Router();
            break;
        }
        case "/state": {
            content = State();
            break;
        }
        case "/std": {
            content = Std();
            break;
        }
        case "/examples": {
            content = Examples();
            break;
        }
        case "/testing": {
            content = Testing();
            break;
        }
        case "/under-the-hood": {
            content = UnderTheHood();
            break;
        }
        default: {
            content = b("p", "Not Found");
        }
    }

    h(
        b(
            "title",
            `${
                window.location.pathname.slice(1) != ""
                    ? window.location.pathname.slice(1)
                    : "index"
            } // rhea`
        )
    );

    return a(
        el,
        b("h1", "Rhea"),
        b("p", "The micro rendering framework"),
        a(b("div", { id: "content" }), content)
    );
};

register(Docs);

const docsComp: Set<Component> = new Set();
docsComp.add(Nav).add(Docs);
mount(docsComp, /\/+./);

const navComponents: Set<Component> = new Set();
navComponents.add(Nav).add(Docs);

mount(navComponents, "/")
    .add("/")
    .add("/components")
    .add("/runtime")
    .add("/router")
    .add("/state");

window.addEventListener("load", () => render());
document.body.addEventListener("global-render", () => {}, { once: true });
