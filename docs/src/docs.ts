import { build as b, append as a } from "../../src/std/index";

export const Index = () => {
    const el = b("div");
    return a(
        el,
        b(
            "p",
            `Rhea makes it easy to write fast, reactive websites.
Rhea is also primarily feature-complete at this point. It makes a point of being minimal.
`
        ),
        b("h2", "Features"),
        a(
            b("ul"),
            b("li", "Size: 2.99 KB before gzipping"),
            b("li", "Simple and minimal API")
        )
    );
};

export const Components = () => {
    const el = b("div");
    return a(
        el,
        b("h2", "Components"),
        b("p", `Components are the basic building block of a rhea application.`)
    );
};

export const Runtime = () => {
    const el = b("div");
    return a(
        el,
        b("h2", "Runtime"),
        b("p", `Rhea's runtime is lightweight and simple.`)
    );
};

export const Router = () => {
    const el = b("div");
    return a(el, b("h2", "Router"), b("p", `Rhea is based on routes.`));
};

export const State = () => {
    const el = b("div");
    return a(
        el,
        b("h2", "State"),
        b(
            "p",
            `Rhea includes a state library for managing your application's whereabouts.`
        )
    );
};

export const Std = () => {
    const el = b("div");
    return a(
        el,
        b("h2", "Standard Library"),
        b("p", `A standard library is included for all your utility needs.`)
    );
};

export const Examples = () => {
    const el = b("div");
    return a(el, b("h2", "Examples"), b("p", `Examples of Rhea in action.`));
};

export const Testing = () => {
    const el = b("div");
    return a(el, b("h2", "Testing"), b("p", `Testing Rhea.`));
};

export const UnderTheHood = () => {
    const el = b("div");
    return a(
        el,
        b("h2", "Under the Hood"),
        b("p", `Implementing Rhea and improving performance.`)
    );
};
