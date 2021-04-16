import { Component, state, State, Components } from "../../src/rt/index";

/**
 * BroadcastChannel used for syncing by the extension.
 */
export const channel = new BroadcastChannel("rhea::sync_updates");

/**
 * Represents a component which is being synchronised by two or more tabs.
 * @param component The name of the component being synced
 * @param state The state of the component
 */
interface Update {
    component: string;
    state: any;
}

/**
 * List of all components currently in sync.
 */
export const InSync: string[] = [];

/**
 * Synchronises a component across tabs.
 * @param sync The component to synchronise
 * @returns If there is no state registered for the given component or the component is already being synchronised, returns false. Otherwise returns true if sync init was successful.
 */
export const sync = (sync: Component) => {
    const component = sync.name.toLowerCase();
    const st = State.get(component);
    if (!st || InSync.some(i => i == component)) return false;
    else {
        st.subscribe("rhea::sync_update_change", (state: any) => {
            channel.postMessage({ state, component });
        });

        InSync.push(component);
        return true;
    }
};

/**
 * Unsyncs a given component.
 * @param sync The component to unsynchronise.
 * @returns If the item is successfully removed, returns `true`; otherwise returns `false`
 */
export const unsync = (sync: Component) => {
    const component = sync.name.toLowerCase();
    const item = InSync.find(i => i == component);
    if (!item) return false;

    InSync.splice(InSync.indexOf(component), 1);
    return true;
};

channel.addEventListener("message", (message: MessageEvent<Update>) => {
    if (!message.isTrusted) return;

    const fn = Components.get(message.data.component);
    if (!fn) return;

    const st = state(fn.fn);
    st.set(message.data.state);
});
