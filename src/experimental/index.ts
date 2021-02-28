interface StateFunction {
    set: () => void;
    readonly state: Map<string, any>;
}

//const State: Map<string, StateFunction> = new Map();

const Components: Map<string, Function> = new Map();

const Index: Map<string, Set<string>> = new Map();

window.addEventListener("popstate", () => {
    emit(document.body, EventType.BeforePageChange);
    render(true);
    emit(document.body, EventType.AfterPageChange);
});

export const register = (name: string, element: Function) => {
    Components.set(name, element);
};

export const registerRoute = (paths: Set<string>, components: Set<string>) => {
    paths.forEach(i => {
        Index.set(i, components);
    });
};

const removeAll = (el: HTMLCollection) => {
    Array.from(el).forEach(i => i.remove());
};

export const navigate = (destination: URL) => {
    removeAll(document.body.children);
    window.history.pushState("", "", destination.pathname);
    render(true);
};

enum EventType {
    Render = "render",
    BeforePageChange = "before-page-change",
    AfterPageChange = "after-page-change",
}

const emit = (el: HTMLElement, event: EventType, detail?: Object) =>
    el.dispatchEvent(new CustomEvent(event.toString(), { detail }));

export const render = (prev = false) => {
    if (prev == true) removeAll(document.body.children);
    const components = Index.get(window.location.pathname);
    components?.forEach(i => {
        const cmp = Components.get(i);
        const el: HTMLElement = cmp?.call(null);

        if (el.nodeName == "A") {
            el.addEventListener("click", evt => {
                evt.preventDefault();
                if (evt.defaultPrevented == true) {
                    navigate(new URL((el as HTMLAnchorElement).href));
                }
            });
        }

        document.body.appendChild(el);
        emit(el, EventType.Render);
    });
};
