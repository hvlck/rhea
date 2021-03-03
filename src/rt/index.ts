// rhea runtime manager
export type Component = () => HTMLElement;

/**
 * Wrapper over a state manipulator.
 */
interface StateFunction {
    set: (updated: any) => any;
    state: any;
}

/**
 * Global state object. Each key corresponds to a component. It is recommended that you don't set this directly and let
 * rhea manage it for you.
 */
export const State: Map<string, StateFunction> = new Map();

// possibly change signature so that to get state component would have to call s.call(Component, initialState)?
/**
 * Creates a new state or returns a previous state for a given component.
 * @param component The component to retreive state from
 * @param state The initial state structure
 */
export const state = (component: string, state: any = {}) => {
    const c = State.get(component);
    if (c) {
        return [c.state, c.set];
    } else {
        const s = <StateFunction>{
            component,
            state,
            set: function (updated: any) {
                s.state = updated;
                redraw(component);
                return s.state;
            },
        };
        State.set(component, s);
        return [s.state, s.set];
    }
};

/**
 * Components is a list of unique components and the functions that generate them.
 * The key is the function name; **these should be unique**.
 * The function is the function that generates a new HTMLElement; this should be in its return value.
 * It is recommended that you do not modify this directly.
 */
export const Components: Map<string, Component> = new Map();

/**
 * Index is the index of routes (based on window.location.pathname) and the corresponding list of components that it consists of.
 * The key is the route, and the value is the list of components the route is made of.
 * It is recommended that you do not modify this directly.
 */
export const Index: Map<string | RegExp, Set<string>> = new Map();

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
export const register = (element: Component) => {
    const n = element.name.toLowerCase();
    if (Components.get(n))
        throw Error(`component ${n} has already been defined!`);
    else {
        Components.set(element.name.toLowerCase(), element);
    }
};

/**
 * Registers components for a given route
 * @param paths The paths you want to register the components for
 * @param components The components you want to register on the path
 */
// maybe change return value to set, so that callers can do
// const indexRoute = registerRoute("/home").add("Nav").add("Content").add("Footer")
export const registerRoute = (
    paths: Set<string | RegExp>,
    components: Set<Component>
) => {
    // maps given components into their internal names, which is the function name in lowercase
    const s = Array.from(components).map(i => i.name?.toLowerCase());

    const cmp: Set<string> = new Set();
    s.forEach(i => cmp.add(i));
    paths.forEach(i => {
        Index.set(i, cmp);
    });

    return;
};

// removes all children from the given element
const removeAll = (el: HTMLCollection) => {
    requestAnimationFrame(() => {
        Array.from(el).forEach(i => i.remove());
    });
};

/**
 * Navigates and renders the given page.
 * @param destination The url to go to.
 * Note that you can easily create a new URL class by calling new URL(href), and substituting `href` for the destination,
 * such as one from an `<a>` element.
 */
export const navigate = (destination: URL) => {
    const old = window.location.pathname;
    const p = destination.pathname;
    window.history.pushState("", "", p);
    emit(document.body, EventType.Navigation, { old, next: p });
    render(true);
};

/**
 * Note that the render event will be scoped to the element is called on, while the before/after page change events
 * are called on `document.body`
 * @param Navigation Fired immediately after history.pushState() is called
 * @param Render The render event, called whenever a page is rendered.
 * @param GlobalRender Called on `document.body` whenever the page is changed and triggers a complete rerender.
 * @param BeforePageChange Called before a page is changed using the History API
 * @param AfterPageChange Called after a page is changed and rendered.
 */
export enum EventType {
    Navigation = "navigation",
    Render = "render",
    GlobalRender = "global-render",
    BeforePageChange = "before-page-change",
    AfterPageChange = "after-page-change",
}

// emits an event on the given element
const emit = (el: HTMLElement, event: EventType, detail?: Object) =>
    el.dispatchEvent(new CustomEvent(event.toString(), { detail }));

// helper function for binding `<a>` elements to prevent default navigation behaviour
export const goTo = (evt: Event, url: URL) => {
    evt.preventDefault();
    if (evt.defaultPrevented == true) {
        navigate(url);
        return true;
    }

    return false;
};

// shim for requestAnimationFrame
const ra = window.requestAnimationFrame;
window.requestAnimationFrame = (function () {
    return (
        ra ||
        window.webkitRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

/**
 * Returns a component list for the matching URL path. Note that exact string matches have higher precedence
 * than RegExp matches. A return of `false` indicates that there is no match.
 * @param destination The pathname to check for dynamic paths
 */
const path = (destination = window.location.pathname) => {
    const r = Array.from(Index)?.find(([i, s]) => {
        // exact matches will have precedence
        if (typeof i == "string" && i == destination) {
            return s;
        } else if (i instanceof RegExp && i.test(destination) == true) {
            return s;
        } else {
            return false;
        }
    });
    if (r && r[0]) return r[1];
    else {
        return false;
    }
};

/**
 * Renders all components.
 * @param prev Whether or not render is being called from a popstate event so that the DOM can be cleared. Do not set this parameter.
 */
// todo: figure out a way to diff components on current page and next page, so that same components will not be removed
export const render = (prev = true) => {
    if (prev) removeAll(document.body.children);

    const components = path();
    if (components == false)
        throw Error(`${window.location.pathname} is an invalid route`);

    let frag = new DocumentFragment();

    components?.forEach(i => {
        const cmp = Components.get(i);
        if (cmp) {
            frag.appendChild(hydrate(cmp, i));
            return;
        }
    });

    requestAnimationFrame(() => {
        document.body.append(frag);
        emit(document.body, EventType.GlobalRender);
    });

    return true;
};

/**
 * Generates and hydrates a given component
 * @param i The function to generate the component from
 * @param name Name of the component
 */
const hydrate = (i: Component, name: string) => {
    const el: HTMLElement = i?.call(null);

    const kids: HTMLElement[] = Array.from(el.children).map(
        el => el as HTMLElement
    );
    const hasLink = kids.filter(
        (kid: HTMLElement) =>
            kid instanceof HTMLAnchorElement &&
            kid.href &&
            new URL(kid.href).href.startsWith(window.location.href) == true &&
            new URL(kid.href).pathname.startsWith(window.location.pathname) ==
                true
    );

    if (hasLink.length >= 1) {
        hasLink.forEach(i =>
            i.addEventListener("click", evt =>
                goTo(evt, new URL((i as HTMLAnchorElement).href))
            )
        );
    }

    if (
        el instanceof HTMLAnchorElement &&
        el.href.startsWith(window.location.href) == true
    ) {
        el.addEventListener("click", evt =>
            goTo(evt, new URL((el as HTMLAnchorElement).href))
        );
    }

    el.dataset.component = name;
    return el;
};

/**
 * Re-renders a single component
 * @param component The component to redraw
 */
export const redraw = (component: string) => {
    const el = document.body.querySelector(`*[data-component="${component}"]`);
    const cmp = Components.get(component);
    if (el && cmp) {
        el.replaceWith(hydrate(cmp, component));
    }
};
