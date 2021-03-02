import {
    append as a,
    build as b,
    ComponentEventType,
    ElementTag,
    event as e,
    head as h,
} from "../src/std/index";
import {
    Component,
    redraw,
    register,
    registerRoute,
    render,
    state as s,
} from "../src/rt/index";

test("component register build() works", () => {
    const Heading: Component = () => {
        const el = b(ElementTag.H1, "This is a heading.", {
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
    expect(el.innerText).toBe("This is a heading.");

    expect(el).toBeInstanceOf(HTMLElement);
});

test("component register append() works", () => {
    const children = ["Home", "About", "Contact"];
    const Nav: Component = () => {
        const el = b(ElementTag.Nav);
        const kids = children.map(i => b(ElementTag.A, i));
        return a(el, ...kids);
    };

    const nav = Nav();

    const m = jest.fn(a);
    m(nav, b(ElementTag.A, "Links"), b(ElementTag.A, "More items"));

    expect(m).toHaveBeenCalled();
    expect(m).toReturn();
    expect(Nav).toBeDefined();

    expect(nav.children.length).toBe(5);
    expect((nav.lastElementChild as HTMLElement).innerText).toBe("More items");

    expect(nav).toBeInstanceOf(HTMLElement);
    expect(nav.lastElementChild).toBeInstanceOf(Element);
});

test("component event() subscriber and state works", () => {
    const Button: Component = () => {
        const [st, set] = s("button", { clicks: 0 });

        const el = b(ElementTag.Button, "Clicks: " + st.clicks);

        e(el, ComponentEventType.Click, () => {
            set({ clicks: st.clicks + 1 });
            redraw("button");
        });

        return el;
    };

    const idx: Set<string> = new Set();
    idx.add("/");
    register(Button);
    const idxComponents: Set<Component> = new Set();
    idxComponents.add(Button);

    const m = jest.fn(e);

    const btn = Button();
    let cb = 0;
    m(btn, ComponentEventType.Click, function () {
        cb += 1;
    });

    expect(m).toHaveBeenCalled();
    expect(m).toReturn();
    expect(Button).toBeDefined();

    btn.click();
    expect(btn.innerText).toBe("Clicks: 1");
    expect(cb).toBe(1);

    btn.click();
    expect(btn.innerText).toBe("Clicks: 2");
    expect(cb).toBe(2);
});
