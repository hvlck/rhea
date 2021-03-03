import { Component, register, mount, render } from "../../src/rt/index";
import { build as b } from "../../src/std/index";

const Nav = () => {
    const nav = b("nav");

    return nav;
};

register(Nav);

const Items = () => {
    const el = b("ul");
    return el;
};

register(Items);

const idxComponents: Set<Component> = new Set();
idxComponents.add(Nav).add(Items);

mount(idxComponents, "/examples/hn/");
window.addEventListener("load", () => render());
