import { toString } from "../src/ssr";

import test from "ava";
import { build } from "../src";

test("ssr successfully converts a component to a string", t => {
    const T = () => {
        return build("h1", "Test");
    };

    t.is(toString(T), "<h1 data-dyn='t' data-hyd='true'>Test</h1>");
});
