// standard library utilities

import { redraw } from "../rt/index";

/**
 * A restrictive method of generating HTML elements for the b() function
 */
export enum ElementTag {
    H1 = "h1",
    H2 = "h2",
    H3 = "h3",
    H4 = "h4",
    H5 = "h5",
    H6 = "h6",
    P = "p",
    Img = "img",
    Canvas = "canvas",
    Script = "script",
    Link = "link",
    Title = "title",
    Meta = "meta",
    Div = "div",
    Input = "input",
    Button = "button",
    Label = "label",
    Select = "select",
    Option = "option",
    OptGroup = "optgroup",
    A = "a",
    Nav = "nav",
    Hr = "hr",
    Table = "table",
    Thead = "thead",
    Tbody = "tbody",
    Tr = "tr",
    Th = "th",
    Td = "td",
    Span = "span",
    Footer = "footer",
    Main = "main",
    B = "b",
    Em = "em",
    Del = "del",
    Mark = "mark",
    I = "i",
    Template = "template",
    Slot = "slot",
    Ul = "ul",
    Ol = "ol",
    Br = "br",
}

/**
 * scaffolding for easily creating an html element
 * @param type The type of HTML element to create
 * @param text Optional text of the HTML element
 * @param attributes - Attributes to apply to the HTML element
 */
export function build(
    type: ElementTag | string,
    attributes?: { [key: string]: string } | string,
    ...children: HTMLElement[]
) {
    let element = document.createElement(type.toString());
    if (attributes && typeof attributes == "string") {
        element.textContent = attributes;
    } else if (attributes && typeof attributes == "object" && attributes.text) {
        element.textContent = attributes.text;
    }

    if (typeof attributes == "object") {
        Object.keys(attributes).forEach(item => {
            if (element.hasAttribute(item) || item in element) {
                element.setAttribute(item, attributes[item]);
            } else if (item == "class") {
                element.classList.add(...attributes[item].split(" "));
            }
        });
    }

    if (children) {
        const frag = document.createDocumentFragment();
        children.forEach(el => frag.appendChild(el));
        element.appendChild(frag);
    }

    return element;
}

/**
 * Helper function to append children to parent.
 * @param parent Parent element to append children to
 * @param children Elements to append to parent
 */
export function append(parent: HTMLElement, ...children: HTMLElement[]) {
    const frag = document.createDocumentFragment();
    children.forEach(i => frag.appendChild(i));
    parent.appendChild(frag);
    return parent;
}

/**
 * Event types for components. A string can be passed, but this is a typed variant for better safety.
 * @param Click Click event
 */
export enum ComponentEventType {
    Click = "click",
    Keydown = "keydown",
    Keyup = "keyup",
    Keypress = "keypress",
    Focus = "focus",
    Blur = "blur",
    Input = "input",
    Change = "change",
    MouseOver = "mouseover",
    MouseEnter = "mouseenter",
    MouseExit = "mousexit",
    MouseLeave = "mouseleave",
}

/**
 *
 * @param el The element to bind the event to
 * @param evtType The type of event to listen for
 * @param evt The callback to perform when the event is triggered
 * @param rd Redraw - if set, the specified element will be redrawn. If the `el` parameter is a component, it will automatically be redrawn.
 */
export function event(
    el: HTMLElement,
    evtType: ComponentEventType | string,
    evt: (this: HTMLElement, ev: Event) => any,
    rd?: string
) {
    // todo: maybe pass state as third arg to evt.call()
    // also maybe return the result of the call to evt.call()
    // return of `false` could also denote that component doesn't need to update
    el.addEventListener(evtType, event => evt.call(el, event));
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
