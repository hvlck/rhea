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
}

/**
 * scaffolding for easily creating an html element
 * @param type The type of HTML element to create
 * @param text Optional text of the HTML element
 * @param attributes - Attributes to apply to the HTML element
 */
export function b(
    type: ElementTag,
    text?: string,
    attributes?: { [key: string]: string },
    children?: HTMLElement[]
) {
    let element = document.createElement(type.toString());
    element.innerText = text || "";
    if (attributes) {
        Object.keys(attributes).forEach(item => {
            if (element.hasAttribute(item) || item in element) {
                element.setAttribute(item, attributes[item]);
            }
        });
    }
    if (children) {
        children.forEach(i => element.appendChild(i));
    }
    return element;
}

export function a(parent: HTMLElement, children: HTMLElement[]) {
    children.forEach(i => parent.appendChild(i));
    return parent;
}
