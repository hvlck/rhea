// standard library utilities
import {
    Component,
    goTo,
    hydrate,
    redraw,
    requestAnimationFrame,
} from "../rt/index";

type ElementName =
    | "div"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p"
    | "b"
    | "i"
    | "em"
    | "mark"
    | "sup"
    | "sub"
    | "blockquote"
    | "cite"
    | "title"
    | "meta"
    | "link"
    | "script"
    | "table"
    | "thead"
    | "th"
    | "tbody"
    | "tr"
    | "td"
    | "img"
    | "video"
    | "nav";

/**
 * scaffolding for easily creating an html element
 * @param type The type of HTML element to create
 * @param text Optional text of the HTML element
 * @param attributes - Attributes to apply to the HTML element
 */
// todo: bind <a> elements to navigate()?
// maybe return a souped-up HTMLElement, have custom methods for before/after change and DOM events
export function build(
    type: ElementName | string | Component,
    attributes?: { [key: string]: string } | string,
    ...children: (HTMLElement | Element | string | Component)[]
) {
    let element: HTMLElement;
    if (typeof type == "function") {
        // will this lead to errors when calling state?
        element = hydrate(type);
    } else {
        element = document.createElement(type);
    }

    if (attributes && typeof attributes == "string") {
        element.textContent = attributes;
    } else if (attributes && typeof attributes == "object" && attributes.text) {
        element.textContent = attributes.text;
    }

    if (typeof attributes == "object" && attributes != null) {
        Object.keys(attributes).forEach(item => {
            if (item == "text") return;
            if (element.hasAttribute(item) || item in element) {
                element.setAttribute(item, attributes[item]);
            } else if (item == "class") {
                element.classList.add(...attributes[item].split(" "));
            } else if (item.startsWith("data_")) {
                element.dataset[item.replace("data_", "")] = attributes[item];
            }
        });
    }

    let kids: HTMLElement[] | Element[] | string[];
    if (children && typeof children[0] == "function") {
        kids = (children as Component[]).map((i: Component) => {
            return i.call(null);
        });
    } else {
        kids = children as HTMLElement[] | Element[] | string[];
    }

    if (children.length >= 1) append(element, ...kids);

    return element;
}

// number of elements in a batch writer
// anything more than 100 tanks performance
const NUMBER_OF_BATCHES = 25;

/**
 * Helper function to append children to parent.
 * @param parent Parent element to append children to
 * @param children Elements to append to parent
 */
export function append(
    parent: HTMLElement,
    ...children: (HTMLElement | Element | string)[]
) {
    const write = (kids: (HTMLElement | Element | string)[]) => {
        const frag = document.createDocumentFragment();
        kids.forEach((i: HTMLElement | Element | string) => {
            let el;
            if (
                i instanceof HTMLElement &&
                i instanceof HTMLAnchorElement &&
                i.href
            ) {
                const url = new URL(i.href);
                if (url.origin.startsWith(window.location.origin) == true) {
                    i.addEventListener("click", evt => {
                        if (i.dataset.bound) return;
                        i.dataset.bound = "true";
                        goTo(evt, url);
                    });
                }
            } else if (typeof i == "string") {
                el = document.createTextNode(i);
            }

            if (el != undefined) {
                frag.appendChild(el);
            } else {
                frag.appendChild(i as HTMLElement);
            }
        });
        requestAnimationFrame(() => {
            parent.appendChild(frag);
        });
    };

    if (children.length >= 250) {
        const distance = children.length / NUMBER_OF_BATCHES;
        let i = 0;

        while (i < children.length) {
            const r = i;
            setTimeout(() => write(children.slice(r, r + distance)), 0);
            i += distance;
        }
    } else {
        setTimeout(() => write(children), 0);
    }

    return parent;
}

/**
 * Event types for components. A string can be passed, but this is a typed variant for better safety.
 * @param Click Click event
 */
export type ComponentEventType =
    | "click"
    | "keydown"
    | "keyup"
    | "keypress"
    | "focus"
    | "blur"
    | "input"
    | "change"
    | "mouseover"
    | "mouseenter"
    | "mousexit"
    | "mouseleave";

/**
 * subscribes an element to the given event, and calls the passed callback when the event fires
 * @param el The element to bind the event to
 * @param evtType The type of event to listen for
 * @param evt The callback to perform when the event is triggered
 * @param rd Redraw - if set, the specified element will be redrawn. If the `el` parameter is a component, it will automatically be redrawn.
 */
// todo: better event delegation
export function event(
    el: HTMLElement,
    evtType: ComponentEventType | string,
    evt: (this: HTMLElement, ev: Event) => any,
    opts?: boolean | AddEventListenerOptions,
    rd?: Component
) {
    // todo: maybe pass state as third arg to evt.call()
    // also maybe return the result of the call to evt.call()
    // return of `false` could also denote that component doesn't need to update
    el.addEventListener(
        evtType,
        event => {
            evt.call(el, event);
        },
        opts
    );

    // may remove this call to redraw() in the future, redraw() is already called in state()
    if (el.dataset.component) {
        redraw(el.dataset.component);
        return;
    }

    if (rd) {
        redraw(rd);
    }
}

/**
 * Updates the document's `head` with the provided elements. Note that the first similar element
 * @param el The document.head elements to update
 */
// todo: better head diffing
export function head(...el: HTMLHeadElement[]) {
    el.forEach(i => {
        let selector = "";
        if (i.hasAttribute("title")) {
            selector = "title";
        } else if (i.hasAttribute("name")) {
            selector = "name";
        } else if (i.hasAttribute("href")) {
            selector = "href";
        }

        let attr = "";
        if (selector.length >= 1) {
            attr = `[${selector}="${i.getAttribute(selector)}"]`;
        }

        document.head
            .querySelector(`${i.nodeName.toLowerCase()}${attr}`)
            ?.remove();

        document.head.appendChild(i);
    });
}

type CoercibleElementProperty = string | undefined | boolean | any;

// this is a very simplistic mutation queue API based on Wilson Page's `fastdom`
// https://github.com/wilsonpage/fastdom

const batches: Map<
    HTMLElement | number,
    { [key: string]: CoercibleElementProperty } | Function
> = new Map();
let mutationQueued = false;

export function mutate(
    element: HTMLElement | null,
    props: { [key: string]: CoercibleElementProperty } | Function
) {
    let el = element == null ? Math.ceil(Math.random() * 40000) : element;
    batches.set(el, props);
    enqueue();
}

function enqueue() {
    if (mutationQueued == false) {
        mutationQueued = true;
        requestAnimationFrame(() => {
            for (const [el, fn] of batches) {
                if (el instanceof HTMLElement) {
                    const props = Object.entries(fn);
                    if (props.length >= 1) {
                        for (const [key, value] of props) {
                            if (typeof value == "object") {
                                for (const [prop, v] of Object.entries(value)) {
                                    el[key][prop] = v;
                                }
                            } else {
                                el[key] = value;
                            }
                        }
                    } else if (typeof fn == "function") {
                        fn.call(null, el);
                    }
                } else if (typeof el == "number" && typeof fn == "function") {
                    fn.call(null);
                }

                batches.delete(el);
            }
        });
        mutationQueued = false;
    }
}

export const lazy = (src: string): Promise<Component> => {
    return import(src).then(imports => {
        return imports.default;
    });
};
