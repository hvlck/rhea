import { Component, redraw } from "./index";

/**
 * StateFunction represents an object that can be used to store your application's current state.
 * @param set Sets a new state for the object
 * @param component The component the state is assigned to; this is used for automatic redrawing
 * @param st The actual state object. **DO NOT SET THIS DIRECTLY, IT WILL THROW AN ERROR**
 * @param lock Locks the state, preventing modification and extension.
 * @param clear Clears the state.
 * @param unlcok Unlcocks the state.
 * @param subscribe Subscribes to updates to the object.
 * @param subscribers This is an internal map that keeps track of all subscribers to the state.
 */
interface StateFunction<T extends Object> {
    set: (updated: T, redraw?: boolean) => T;
    component: string;
    st: T;
    lock: () => void;
    clear: () => void;
    unlock: () => void;
    subscribe: (
        name: string,
        cb: Function | Set<Component>
    ) => StateFunction<T>;
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
 * @param state The initial state structure. Note that this **must** be passed when first calling state() for a given component, but should not be called when getting the state for the same component again
 */
// todo: figure out why updating set() doesn't update the `st` value in the same object
/*export*/ const state = <T extends Object>(
    cmp: Component,
    state?: T
): StateFunction<T> => {
    let component: string = cmp.name.toLowerCase();

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
            subscribe: (
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
            set: (newState: Object, rd = true) => {
                st.st = Object.assign({}, newState) as T;
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
