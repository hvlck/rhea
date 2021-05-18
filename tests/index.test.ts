import {
    Component,
    Components,
    event,
    mount,
    register,
    render,
    hydrate,
    Index,
    goTo,
} from "../src/rt";
import { build } from "../src/std";

import test from "ava";

const T = () => {
    return build("p");
};
register(T);
mount("/", () => T);

// component T is already registered
test("register() functions properly", t => {
    const Z = () => {
        const el = build("p");
        return el;
    };

    const s = register(Z);
    t.assert(s);
    //t.assert(Components.size > 0);
    t.is(Components.get("z")?.fn, Z);
    t.is(Components.size, 2);
});

test("mount() properly registers mount paths", t => {
    const Home = () => {
        return build("p", "Home");
    };
    register(Home);

    const Other = () => {
        return build("p", "Other");
    };
    register(Other);

    mount("/", () => Home);
    mount("/other", () => Other);

    t.assert(Index.get("/") != undefined);
    t.assert(Index.get("/other") != undefined);

    render({}, false, "/");
    const $el = document.body.querySelector("p");
    t.is($el?.textContent, "Home");

    render({}, true, "/other");
    const $el2 = document.body.querySelector("p");
    t.is($el2?.textContent, "Other");
});

// test("prerender config option successfully generates routes", () => {});

// test("cache config option successfully saves navigated pages", () => {});
