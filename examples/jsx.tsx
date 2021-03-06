import { Component, mount, register, render } from "../src/rt";
import * as Rhea from "../src/std/index";

export const T = () => {
    return (
        <div>
            <a href="/">Index</a>
            <a href="/about">About</a>
            <h1>Index</h1>
        </div>
    ) as HTMLElement;
};
register(T);

export const A = () => {
    return (
        <div>
            <h2>About</h2>
        </div>
    ) as HTMLElement;
};
register(A);

mount(new Set<Component>().add(T).add(A), "/about");
mount(new Set<Component>().add(T), "/");

render();
