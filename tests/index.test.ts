import {
    Component,
    Components,
    event,
    mount,
    register,
    render,
    state,
    hydrate,
} from "../src/rt";
import { build } from "../src/std";
import "../src/testing";

import "jest";

const T = () => {
    return build("p");
};
register(T);
mount("/", () => T);

test("state() functions", function () {
    const r = render();
    let { st, set } = state(T, { clicks: 0 });
    expect(r).toBe(true);
    expect(st).toBeDefined();

    const el = hydrate(T);
    expect(el).not.toBeNull();
    el.addEventListener("click", () => {
        st = set({ clicks: st.clicks + 1 });

        expect(st.clicks).toBe(1);
        expect(st).not.toBeUndefined();
    });

    el.click();
    // @ts-expect-error
    expect(st.random).toBeUndefined();
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
