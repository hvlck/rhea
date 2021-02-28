import { Component, register, registerRoute, render } from "../../src/rt/index";
import { build as b, ElementTag as El } from "../../src/std/index";

const Nav = () => {
    const nav = b(El.Nav);

    return nav;
};

const idx = new Set<string>().add("/examples/hn/");
register(Nav);

const Items = () => {
    const el = b(El.Ul);
    return el;
};

register(Items);

const idxComponents: Set<Component> = new Set();
idxComponents.add(Nav).add(Items);

registerRoute(idx, idxComponents);
window.addEventListener("load", () => render());
