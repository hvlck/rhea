import {
    append as a,
    build as b,
    ComponentEventType,
    event as e,
    head,
} from "../src/std/index";
import {
    Component,
    redraw,
    register,
    mount,
    render,
    state as s,
} from "../src/rt/index";

test("component register build() works", () => {
    const Heading: Component = () => {
        const el = b("h1", {
            text: "This is a heading.",
            style: `background-color:red`,
            class: "test",
        });
        return el;
    };
    const m = jest.fn(Heading);
    m(); // has to call m() at least once

    expect(m).toHaveBeenCalled();
    expect(m).toReturn();
    expect(Heading).toBeDefined();

    const el = Heading();
    expect(el.className).toBe("test");
    expect(el.textContent).toBe("This is a heading.");

    expect(el).toBeInstanceOf(HTMLElement);
});

test("component register append() works", () => {
    const children = ["Home", "About", "Contact"];
    const Nav: Component = () => {
        const el = b("nav");
        const kids = children.map(i => b("a", i));
        return a(el, ...kids);
    };

    const nav = Nav();

    const m = jest.fn(() => a(nav, b("a", "Links"), b("a", "More items")));
    m();

    expect(m).toHaveBeenCalled();
    expect(m).toReturn();
    expect(Nav).toBeDefined();

    expect(nav.children.length).toBe(5);
    expect((nav.lastElementChild as HTMLElement).textContent).toBe(
        "More items"
    );

    expect(nav).toBeInstanceOf(HTMLElement);
    expect(nav.lastElementChild).toBeInstanceOf(Element);
});

// test is broken for now as JSDOM doesn't support requestAnimationFrame
test("component event() subscriber and state works", () => {
    const Button: Component = () => {
        const [st, set] = s("button", { clicks: 0 });

        const el = b("button", "Clicks: " + st.clicks);
        e(el, ComponentEventType.Click, function () {
            set({ clicks: st.clicks + 1 });
            redraw("button");
        });

        return el;
    };

    register(Button);

    const idxComponents: Set<Component> = new Set();
    idxComponents.add(Button);
    mount(idxComponents, "/");
    // shim for JSDom as it doesn't support requestAnimationFrame

    render();

    const m = jest.fn(e);

    const btn = Button();
    let cb = 0;
    m(btn, "click", () => {
        cb += 1;
    });

    expect(m).toHaveBeenCalled();
    expect(m).toReturn();
    expect(Button).toBeDefined();

    btn.click();
    expect(btn.textContent).toBe("Clicks: 1");
    expect(cb).toBe(1);

    btn.click();
    expect(btn.textContent).toBe("Clicks: 2");
    expect(cb).toBe(2);
});

test("utility head() appends nodes successfully", () => {
    const len = document.head.children.length;
    head(b("title", "This is a test title"));

    expect(document.title).toBe("This is a test title");
    expect(document.title).toBeDefined();
    expect(document.head.children.length).toBe(len + 1);
});

test("utility head() replaces nodes successfully", () => {
    expect(document.head.children.length).toBe(0);

    // setup
    document.head.appendChild(
        b("link", { rel: "stylesheet", type: "text/css", href: "/index.css" })
    );

    expect(document.head.children.length).toBe(1);

    document.head.appendChild(
        b("link", { rel: "stylesheet", type: "text/css", href: "/index.css" })
    );

    expect(document.head.children.length).toBe(1);

    const el = document.head.firstElementChild;
    expect(el?.getAttribute("href")).toBe("/index.css");
});
