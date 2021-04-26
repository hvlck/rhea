import { build, append } from "../../../src";

const time = new Date();

const El = (i: number) => {
    const $el = build("div", String(i));
    return $el;
};

const iterations = 100000;

let items = new Array();
for (let i = 0; i < iterations; i++) {
    items.push(El(i + 1));
}

window.addEventListener("load", () => {
    const distance = iterations / 10;
    let i = 0;
    while (i < iterations) {
        let r = i;
        setTimeout(() => {
            append(document.body, ...items.slice(r, r + distance));
        }, 0);

        i += distance;
    }

    console.table({
        iterations,
        time: new Date().getTime() - time.getTime(),
    });
});
