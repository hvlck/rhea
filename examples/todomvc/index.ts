import { Component, register, registerRoute, render } from "../../src/rt/index";
import { build as b } from "../../src/std/index";

const Nav = () => {
    const nav = b("nav");

    return nav;
};

const idx = new Set<string>().add("/examples/hn/");
register(Nav);

const Items = () => {
    const el = b("ul");
    return el;
};

register(Items);

const idxComponents: Set<Component> = new Set();
idxComponents.add(Nav).add(Items);

registerRoute(idx, idxComponents);
window.addEventListener("load", () => render());
