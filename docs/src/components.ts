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
    registerRoute,
    render,
    state as s,
} from "../../src/rt/index";

import marked from "marked";

const Idx = () => {
    h(b("title", { text: "index // rhea" }));
    const nav = b("nav", { class: "nav" });
    const home = b("a", {
        text: "Home",
        href: "/",
    });

    return a(
        nav,
        home,
        b("a", {
            text: "Source",
            href: "https://github.com/hvlck/rhea",
        })
    );
};

const idx: Set<string> = new Set();
idx.add("/").add("/about");
register(Idx);

const Docs = () => {
    const el = b("div");
    const content = b(
        "p",
        `
        Rhea makes it easy to write fast, reactive websites.
        `
    );

    return a(
        el,
        b("h1", "Rhea"),
        b("h2", "The micro rendering framework"),
        content
    );
};

register(Docs);
const docs: Set<RegExp> = new Set();
docs.add(/\/docs\/+./);

const docsComp: Set<Component> = new Set();
docsComp.add(Docs);
registerRoute(docs, docsComp);

const idxComponents: Set<Component> = new Set();
idxComponents.add(Idx).add(Docs);

registerRoute(idx, idxComponents);

window.addEventListener("load", () => render());
