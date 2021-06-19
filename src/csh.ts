// client-side hydration
import { Components } from "./rt/index";

export const hydrateFromString = (el?: HTMLElement | Element) => {
    if (el == undefined)
        el = document.body.querySelector("*[data-hyd]") as HTMLElement;

    Components.forEach(i => {
        // @ts-ignore
        const c = el.querySelector(`*[data-dyn="${i.fn.name.toLowerCase()}"]`);
        if (c) {
            c.replaceWith(i.fn());
        }
    });
};
