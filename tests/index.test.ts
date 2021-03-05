import {
    Component,
    Components,
    mount,
    register,
    render,
    state,
} from "../src/rt";
import { build } from "../src/std";

// broken as JSDOM doesn't support requestAnimationFrame()
test("state() functions", () => {
    const T = () => {
        const el = build("p");
        return el;
    };
    register(T);
    mount(new Set<Component>().add(T), "/");
    render();

    const [st, set] = state("t", { clicks: 0 });
    const s = () => set({ clicks: st.clicks + 1 });

    s();
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
