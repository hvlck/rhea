import { build as b, append as a } from "../../src/std/index";

// todo: rewrite in tsx

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
            b(
                "li",
                "Size: 1.9kB minified + gzipped (",
                b(
                    "a",
                    {
                        href: "https://bundlephobia.com/result?p=@rhea.ts/core",
                    },
                    "view on bundlephobia"
                ),
                b("span", ")")
            ),
            b("li", "Simple and minimal API"),
            b(
                "li",
                "Blazing fast for all your performance needs (",
                b("a", { href: "" }, "benchmarks"),
                b("span", ")")
            )
        ),
        b(
            "p",
            "Please note that this site is just for getting a quick overview of Rhea, and is not the complete documentation. ",
            b(
                "a",
                {
                    href: "https://github.com/hvlck/rhea/tree/main/docs/index.md",
                },
                "The complete documentation can be found here."
            )
        ),
        b(
            "nav",
            "",
            b("a"),
            b("a", { href: "/runtime", text: "Next: Runtime" })
        )
    );
};

export const Components = () => {
    const el = b("div");
    return a(
        el,
        b("h2", "Components"),
        b(
            "p",
            `Components are the basic building block of a rhea application.`,
            a(
                b("p", `Every function that returns an `),
                b("a", {
                    text: "HTMLElement",
                    href: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement",
                }),
                b("span", " is considered a Component.")
            )
        ),
        a(
            b("div"),
            b(
                "code",
                `const Component = () => build('h1', 'This element was created using the build() helper function');
register(Component) // registers the component in rhea's component list`
            ),
            b("br"),
            b(
                "code",
                "// returns <h1>This element was created using the build() helper function</h1>"
            )
        ),
        b(
            "p",
            "",
            a(
                b("p", "Rhea's "),
                b("a", { text: "standard library", href: "/std" }),
                b(
                    "span",
                    " comes with a helper function to generate HTML elements to return."
                )
            )
        ),
        b(
            "nav",
            "",
            b("a", { href: "/runtime", text: "Previous: Runtime" }),
            b("a", { href: "/router", text: "Next: Router" })
        )
    );
};

export const Runtime = () => {
    const el = b("div");
    return a(
        el,
        b("h2", "Runtime"),
        b(
            "p",
            `Rhea's runtime is lightweight and simple. It consists of three parts: `
        ),
        a(
            b("ul"),
            b(
                "li",
                "",
                b("a", { href: "/components", text: "Components" }),
                b("span", " - for managing elements and interactivity")
            ),
            b(
                "li",
                "",
                b("a", { href: "/router", text: "Router" }),
                b(
                    "span",
                    " - for managing how your application works on different URLs"
                )
            ),
            b(
                "li",
                "",
                b("a", { href: "/state", text: "State" }),
                b("span", " - for managing your application's state")
            )
        ),
        b(
            "nav",
            "",
            b("a", { href: "/", text: "Previous: Home" }),
            b("a", { href: "/components", text: "Next: Components" })
        )
    );
};

export const Router = () => {
    const el = b("div");
    return a(
        el,
        b("h2", "Router"),
        b(
            "p",
            `Rhea is based on routes (it uses location.pathname internally). Routes are registered using the `,
            a(b("span"), b("kbd", "mount()"), b("span", " method")),
            b(
                "span",
                " which registers the provided components for the given route. When rendering, components are drawn in the order that they're passed to when calling the method."
            )
        ),
        b(
            "nav",
            "",
            b("a", { href: "/components", text: "Previous: Components" }),
            b("a", { href: "/state", text: "Next: State" })
        )
    );
};

export const Std = () => {
    const el = b("div");
    return a(
        el,
        b("h2", "Standard Library"),
        b("p", `A standard library is included for all your utility needs.`),
        b(
            "nav",
            "",
            b("a", { href: "/state", text: "Previous: State" }),
            b("a", { href: "/examples", text: "Next: Examples" })
        )
    );
};

export const Examples = () => {
    const el = b("div");
    return a(
        el,
        b("h2", "Examples"),
        b("p", `Examples of Rhea in action.`),
        b(
            "nav",
            "",
            b("a", { href: "/std", text: "Previous: Standard Library" }),
            b("a", { href: "/testing", text: "Next: Testing" })
        )
    );
};

export const Contrib = () => {
    const el = b("div");
    return a(
        el,
        b("h2", "Contrib"),
        b("p", `Rhea contribution libraries.`),
        b(
            "ul",
            {},
            b(
                "li",
                {},
                b("a", {
                    href: "https://npmjs.com/@rhea.ts/pwa",
                    text: "PWA",
                }),
                " - for making Progressive Web Applications (PWAs) using Rhea"
            ),
            b(
                "li",
                {},
                b("a", {
                    href: "https://npmjs.com/@rhea.ts/sync",
                    text: "Sync",
                }),
                " - for synchronising data between tabs"
            )
        ),
        b(
            "nav",
            "",
            b("a", { href: "/std", text: "Previous: Standard Library" }),
            b("a", { href: "/testing", text: "Next: Testing" })
        )
    );
};

export const Testing = () => {
    const el = b("div");
    return a(
        el,
        b("h2", "Testing"),
        b("p", `Testing Rhea.`),
        b(
            "nav",
            "",
            b("a", { href: "/examples", text: "Previous: Examples" }),
            b("a", { href: "/under-the-hood", text: "Next: Under the Hood" })
        )
    );
};

export const UnderTheHood = () => {
    const el = b("div");
    return a(
        el,
        b("h2", "Under the Hood"),
        b("p", `Implementing Rhea and improving performance.`)
    );
};
