import {
    append as a,
    build as b,
    ComponentEventType,
    event as e,
    head,
    mutate,
} from "../src/std/index";
import { Component, redraw, register, mount, render } from "../src/rt/index";

import test from "ava";

test("component register build() works", t => {
    const Heading: Component = () => {
        const el = b("h1", {
            text: "This is a heading.",
            style: `background-color:red`,
            class: "test",
        });
        return el;
    };

    const el = Heading();
    t.is(el.className, "test");
    t.is(el.textContent, "This is a heading.");

    t.assert(el instanceof HTMLElement);
});

test("component register append() works", t => {
    const children = ["Home", "About", "Contact"];
    const Nav: Component = () => {
        const el = b("nav");
        const kids = children.map(i => b("a", i));
        return a(el, ...kids);
    };

    const nav = Nav();

    t.is(nav.children.length, 3);
    t.is((nav.lastElementChild as HTMLElement).textContent, "More items");

    t.assert(nav instanceof HTMLElement);
    t.assert(nav.lastElementChild instanceof Element);
});

test("component event() subscriber and state works", t => {
    const Button: Component = () => {
        const st = { clicks: 0 };

        const el = b("button", "Clicks: " + st.clicks);
        e(
            el,
            "click",
            () => {
                mutate(el, { innerText: "Clicks: " + st.clicks++ });
            },
            {},
            Button
        );

        return el;
    };

    register(Button);
    mount("/", () => Button);

    render();

    const btn = Button();
    let cb = 0;
    btn.addEventListener("click", () => {
        cb++;
    });

    btn.click();
    t.is(btn.textContent, "Clicks: 1");
    t.is(cb, 1);

    btn.click();
    t.is(btn.textContent, "Clicks: 2");
    t.is(cb, 2);
});

test("utility head() appends nodes successfully", t => {
    const len = document.head.children.length;
    head(b("title", "This is a test title"));

    t.is(document.title, "This is a test title");
    t.assert(
        document.title.length != null || document.title.length != undefined
    );
    t.is(document.head.children.length, len + 1);
});

test("utility head() replaces nodes successfully", t => {
    // normalisation since jest doesn't reset DOM between tests
    Array.from(document.head.children).forEach(i => i.remove());
    t.is(document.head.children.length, 0);

    // setup
    document.head.appendChild(
        b("link", { rel: "stylesheet", type: "text/css", href: "/index.css" })
    );

    t.is(document.head.children.length, 1);

    document.head.appendChild(
        b("link", { rel: "stylesheet", type: "text/css", href: "/index.css" })
    );

    t.is(document.head.children.length, 1);

    const el = document.head.firstElementChild;
    t.is(el?.getAttribute("href"), "/index.css");
});
