import {
    Component,
    Components,
    event,
    mount,
    register,
    render,
    state,
} from "../src/rt";
import { build } from "../src/std";

import "jest";

global.requestAnimationFrame = function (fn: Function) {
    fn(1);
    return 0;
};

const T = () => {
    const [st, set] = state(T, { clicks: 0 });
    const el = build("p");
    event(el, "click", () => set({ clicks: st.clicks + 1 }));

    return el;
};
register(T);
mount(new Set<Component>().add(T), "/");

test("state() functions", () => {
    const [st, set] = state(T);

    const r = render();
    expect(r).toBe(true);

    const el = document.body.querySelector("*[data-component]") as HTMLElement;
    expect(el).not.toBeNull();
    el.click();

    expect(st.clicks).toBe(1);
    expect(st).not.toBeNull();
    expect(st.random).toBeNull();
});

// component T is already registered
test("register() functions properly", () => {
    const Z = () => {
        const el = build("p");
        return el;
    };

    const s = register(Z);
    expect(s).toBe(true);
    expect(Components.get("z")).toBe(Z);
    expect(Components.size).toBe(2);
});

test("mount() properly registers mount paths", () => {});
