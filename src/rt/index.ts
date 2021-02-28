interface StateFunction {
    set: () => void;
    readonly state: Map<string, any>;
}

//const State: Map<string, StateFunction> = new Map();

/**
 * Components is a list of unique components and the functions that generate them.
 * The key is the function name; **these should be unique**.
 * The function is the function that generates a new HTMLElement; this should be in its return value.
 */
const Components: Map<string, Function> = new Map();

/**
 * Index is the index of routes (based on window.location.pathname) and the corresponding list of components that it consists of.
 * The key is the route, and the value is the list of components the route is made of.
 */
const Index: Map<string, Set<string>> = new Map();

/**
 * Re-renders items whenever the user uses the browser's forward/back buttons
 */
window.addEventListener("popstate", () => {
    emit(document.body, EventType.BeforePageChange);
    render(true);
    emit(document.body, EventType.AfterPageChange);
});

/**
 * Registers a component with the given name
 * @param name The name of the component - note that this must be unique for all components. If there is one component on `/` named `Nav`
 * and a different component on `/about` also named `Nav`, their names will conflict. You can circumvent this by prefixing
 * the name with the route, e.g. `/:nav` and `/about:nav`
 * @param element The function that returns an HTMLElement
 */
export const register = (name: string, element: Function) => {
    Components.set(name, element);
};

/**
 * Registers components for a given route
 * @param paths The paths you want to register the components for
 * @param components The components you want to register on the path
 */
export const registerRoute = (paths: Set<string>, components: Set<string>) => {
    paths.forEach(i => {
        Index.set(i, components);
    });
};

// removes all children from the given element
const removeAll = (el: HTMLCollection) => {
    Array.from(el).forEach(i => i.remove());
};

/**
 * Navigates and renders the given page.
 * @param destination The url to go to.
 * Note that you can easily create a new URL class by calling new URL(href), and substituting `href` for the destination,
 * such as one from an `<a>` element.
 */
export const navigate = (destination: URL) => {
    removeAll(document.body.children);
    window.history.pushState("", "", destination.pathname);
    render(true);
};

/**
 * Note that the render event will be scoped to the element is called on, while the before/after page change events
 * are called on `document.body`
 * @param Render The render event, called whenever a page is rendered.
 * @param BeforePageChange Called before a page is changed using the History API
 * @param AfterPageChange Called after a page is changed and rendered.
 */
export enum EventType {
    Render = "render",
    BeforePageChange = "before-page-change",
    AfterPageChange = "after-page-change",
}

// emits an event on the given element
const emit = (el: HTMLElement, event: EventType, detail?: Object) =>
    el.dispatchEvent(new CustomEvent(event.toString(), { detail }));

// helper function for binding `<a>` elements to prevent default navigation behaviour
const goTo = (evt: Event, url: URL) => {
    evt.preventDefault();
    if (url.pathname == window.location.pathname) return false;
    if (evt.defaultPrevented == true) {
        navigate(url);
        return true;
    }
};

/**
 * Renders all components.
 * @param prev Whether or not render is being called from a popstate event so that the DOM can be cleared. Do not set this parameter.
 */
export const render = (prev = false) => {
    if (prev == true) removeAll(document.body.children);

    const components = Index.get(window.location.pathname);

    components?.forEach(i => {
        const cmp = Components.get(i);
        if (cmp) {
            const el = r(cmp, i);
            document.body.appendChild(el);
            emit(el, EventType.Render);
        }
    });
};

const r = (i: Function, name: string) => {
    const el: HTMLElement = i?.call(null);

    const kids = Array.from(el.children);
    const hasLink = kids.filter(kid => kid.nodeName == "A");

    if (hasLink.length >= 1) {
        hasLink.forEach(i =>
            i.addEventListener("click", evt =>
                goTo(evt, new URL((i as HTMLAnchorElement).href))
            )
        );
    }

    if (el.nodeName == "A") {
        el.addEventListener("click", evt =>
            goTo(evt, new URL((el as HTMLAnchorElement).href))
        );
    }

    el.dataset.component = name;
    return el;
};

export const redraw = (component: string) => {
    const el = document.body.querySelector(`*[data-component="${component}"]`);
    const cmp = Components.get(component);
    if (el && cmp) {
        el.replaceWith(r(cmp, component));
    }
};
