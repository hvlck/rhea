import { Component, register, mount, render } from "../../src/rt/index";
import { event, build, mutate, append } from "../../src/std/index";

const Nav = () => {
    const nav = build("nav");
    return nav;
};

register(Nav);

const Items = () => {
    const el = build("ul");

    return append(el);
};

register(Items);

const Main = () => {
    return append(build("div"), Nav(), Items());
};

register(Main);

mount("/examples/todomvc/", () => {
    return Main;
});

window.addEventListener("DOMContentLoaded", () => render());
