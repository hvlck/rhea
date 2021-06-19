// server-side rendering

import { Component } from "./rt/index";

export const toString = (cmp: Component | Element | HTMLElement): string => {
    if (typeof cmp == "function") {
        const $el = cmp.call(null);
        $el.dataset.dyn = cmp.name.toLowerCase();
        $el.dataset.hyd = "true";

        return $el.innerHTML;
    } else {
        // @ts-ignore
        cmp.dataset.hyd = "true";
        return cmp.innerHTML;
    }
};
