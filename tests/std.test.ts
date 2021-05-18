import {
    append as a,
    build as b,
    ComponentEventType,
    event as e,
    head,
    mutate,
    lazy,
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

    t.is(nav.childElementCount, 3);
    t.is((nav.lastElementChild as HTMLElement).textContent, "More items");

    t.assert(nav instanceof HTMLElement);
    t.assert(nav.lastElementChild instanceof Element);
});

test("component event() subscriber and state works", t => {
    const EventButton: Component = () => {
        const st = { clicks: 0 };

        const el = b("button", "Clicks: " + st.clicks);
        e(
            el,
            "click",
            () => {
                mutate(el, { innerText: "Clicks: " + st.clicks++ });
            },
            {}
        );

        return el;
    };

    register(EventButton);
    mount("/", () => EventButton);

    // shim because no window.location.pathname :(
    render({}, true, "/");

    const btn = EventButton();
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

    head(
        b("link", { rel: "stylesheet", type: "text/css", href: "/index.css" })
    );

    t.is(document.head.children.length, 1);

    const el = document.head.firstElementChild;
    t.is(el?.getAttribute("href"), "/index.css");
});

test("mutate() successfully updates an element", t => {
    const R = () => {
        return b("h1", { textContent: "Test", data_test: "true" });
    };

    const el = R();

    t.is(el.textContent, "Test");
    t.is(el.dataset.test, "true");

    mutate(el, {
        textContent: "Changed",
        data_test: "false",
    });

    t.is(el.textContent, "Changed");
    t.is(el.dataset.test, "false");
});

test("mutate() successfully executes a function", t => {
    let n = 0;
    mutate(null, () => (n += 1));
    t.is(n, 1);

    // second test used as mutate() uses a monotomically-increasing number for storing function calls
    mutate(null, () => (n += 1));
    t.is(n, 2);
});

test("lazy() successfully lazy-loads a component", async t => {
    lazy("../../tests/lazy.js").then(r => {
        console.error(r);
        const $el = r();
        t.is($el.textContent, "Test");
    });
    /*    try {
        
        //        const T = await lazy("../../tests/lazy.js");
    } catch (err) {
        t.fail(err);
    }*/
});
