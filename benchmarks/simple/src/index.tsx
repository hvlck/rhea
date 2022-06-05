import { build, append, mutate, mount, register, render } from "../../../src";

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

    const time = new Date();

    let i = 0;
    while (i < iterations) {
        let r = i;
        setTimeout(() => append(document.body, ...items.slice(r, r + distance)), 0);
        i += distance;
    }

    console.table({
        iterations,
        time_ms: new Date().getTime() - time.getTime(),
    });

    setTimeout(() => {
        const mutationTime = new Date();
        let t = 0;
        while (t < iterations) {
            let r = t;
            setTimeout(() =>
                items
                    .slice(r, r + distance)
                    .forEach(i => mutate(i, { innerText: Number(i.innerText) + 1 }))
            );

            t += distance;
        }

        console.table({
            iterations,
            mutation_time_ms: new Date().getTime() - mutationTime.getTime(),
        });
    }, 1000);
});
