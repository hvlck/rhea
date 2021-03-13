// rhea runtime
export type Component = () => HTMLElement;

interface StateFunction<T extends Object> {
    set: (updated: T) => T;
    component: string;
    st: T;
    lock: () => void;
    clear: () => void;
    unlock: () => void;
    updated: (name: string, cb: Function | Set<Component>) => StateFunction<T>;
    subscribers: Map<string, Function>;
}

/**
 * Global state object. Each key corresponds to a component. It is recommended that you don't set this directly and let
 * rhea manage it for you.
 */
export const State: Map<string, StateFunction<any>> = new Map();

// possibly change signature so that to get state component would have to call s.call(Component, initialState)?
/**
 * Creates a new state or returns a previous state for a given component.
 * @param component The component to retreive state from
 * @param state The initial state structure
 */
export const state = <T extends Object>(
    component: string | Component,
    state?: T
): StateFunction<T> => {
    if (typeof component == "function") {
        component = component.name.toLowerCase();
    }

    const c = State.get(component);
    if (c) {
        return c;
    } else if (state != undefined) {
        const st: StateFunction<T> = {
            component,
            st: {
                set(prop: string) {
                    throw Error(
                        `do not set state values on components directly! you tried to set property ${prop} on component ${component}`
                    );
                },
                ...state,
            },
            lock: () => {
                st.st = Object.freeze(st.st);
            },
            clear: () => {
                Object.keys(st.st).forEach(i => delete st.st[i]);
            },
            unlock: () => {
                JSON.parse(JSON.stringify(state));
                return st;
            },
            subscribers: new Map(),
            updated: (
                name: string,
                cb: Function | Set<Component> | Component
            ) => {
                if (typeof cb == "function") st.subscribers.set(name, cb);
                else {
                    st.subscribers.set(name, () =>
                        cb.forEach(cmp => redraw(cmp))
                    );
                }

                return st;
            },
            set: (state: T, rd = true) => {
                st.st = Object.assign({}, state);
                st.subscribers.forEach(i => i.call(null, st.st));

                if (rd == true) redraw(component);

                State.set(st.component, st);
                return st.st;
            },
        };

        State.set(component, st);
        return st;
    } else if (state == undefined && !c) {
        throw Error(
            `no initial state defined when initialising state for ${component}`
        );
    } else {
        throw Error("failed to provide necessary arguments in calling state()");
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
export const register = (...elements: Component[]) => {
    return elements
        .map(element => {
            const n = element.name.toLowerCase();
            if (Components.get(n)) {
                throw Error(`component ${n} has already been defined!`);
            } else {
                Components.set(element.name.toLowerCase(), element);
                return true;
            }
        })
        .some(i => (i == false ? false : true));
};

/**
 * Registers components for a given route
 * @param route The paths you want to register the component for
 * @param page The components you want to register on the path
 */
export const mount = <T extends { [key: string]: any }>(
    route: string | RegExp,
    page: (state?: T) => Component
) => {
    Index.set(route, new Set<string>().add(page.call(null).name.toLowerCase()));
    return true;
};

// removes all children from the given element
const removeAll = (el: HTMLCollection) => {
    window.requestAnimationFrame(() => {
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
    if (p != old) window.history.pushState("", "", p);

    emit(document.body, EventType.Navigation, {
        old,
        next: p,
    });
    render(true);
};

/**
 * Note that the render event will be scoped to the element is called on, while the before/after page change events
 * are called on `document.body`
 * @param Initialized Fired when a component is initialised for the first time; note that this is called on `document.body` and its `event.detail` object contains a `component` key
 * @param Navigation Fired immediately after history.pushState() is called
 * @param Render The render event, called whenever a page is rendered.
 * @param Redraw Fired on a component when that component has been redrawn
 * @param GlobalRender Called on `document.body` whenever the page is changed and triggers a complete rerender.
 * @param BeforePageChange Called before a page is changed using the History API
 * @param AfterPageChange Called after a page is changed and rendered.
 */
export enum EventType {
    Initialized = "initialized",
    Navigation = "navigation",
    Render = "render",
    Redraw = "redraw",
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
        throw Error(`${window.location.pathname} is not a registered route`);

    let frag = new DocumentFragment();

    components?.forEach(i => {
        const cmp = Components.get(i);
        if (cmp) {
            frag.appendChild(hydrate(cmp));
            return;
        } else {
            throw Error(
                `component ${i} is not registered in the component registry`
            );
        }
    });

    window.requestAnimationFrame(() => {
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
const hydrate = (i: Component) => {
    const el: HTMLElement = i?.call(null);
    emit(document.body, EventType.Initialized, {
        component: i.name.toLowerCase(),
    });

    const kids: HTMLElement[] = Array.from(el.children).map(
        el => el as HTMLElement
    );
    const hasLink = kids.filter(
        (kid: HTMLElement) =>
            kid instanceof HTMLAnchorElement &&
            kid.href &&
            new URL(kid.href).origin.startsWith(window.location.origin) == true
    );

    if (hasLink.length >= 1) {
        hasLink.forEach(i =>
            i.addEventListener("click", evt => {
                if (i.dataset.bound) return;
                i.dataset.bound = "true";
                goTo(evt, new URL((i as HTMLAnchorElement).href));
            })
        );
    }

    if (
        el instanceof HTMLAnchorElement &&
        new URL(el.href).origin.startsWith(window.location.origin) == true
    ) {
        el.addEventListener("click", evt => {
            if (el.dataset.bound) return;
            el.dataset.bound = "true";
            goTo(evt, new URL((el as HTMLAnchorElement).href));
        });
    }

    el.dataset.component = i.name.toLowerCase();
    return el;
};

/**
 * Re-renders a single component
 * @param component The component to redraw
 */
export const redraw = (component: string | Component) => {
    const el = document.body.querySelector(`*[data-component="${component}"]`);
    if (typeof component == "function") {
        component = component.name.toLowerCase();
    }
    const cmp = Components.get(component);
    if (el && cmp) {
        el.replaceWith(hydrate(cmp));
        emit(el as HTMLElement, EventType.Redraw);
    } else if (cmp && !el) {
        throw Error(
            `component ${component} registered but is not present in body`
        );
    } else {
        throw Error(
            `failed to get component ${component}, does not exist in body`
        );
    }
};

export * from "../std/index";
