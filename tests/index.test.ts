import {
    Component,
    Components,
    event,
    mount,
    register,
    render,
    hydrate,
} from "../src/rt";
import { build } from "../src/std";

import test from "ava";

const T = () => {
    return build("p");
};
register(T);
mount("/", () => T);

// component T is already registered
test("register() functions properly", t => {
    const Z = () => {
        const el = build("p");
        return el;
    };

    const s = register(Z);
    t.assert(s);
    //t.assert(Components.size > 0);
    t.is(Components.get("z")?.fn, Z);
    t.is(Components.size, 2);
});

test("mount() properly registers mount paths", () => {});
