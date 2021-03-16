// somewhat hacky because I wanted to see if this worked quickly
const l = async u => await import(u);

const init = async () => {
    const { render, mount, register, build, state, event } = await l(
        "../../../dist/src/rt/index.js"
    );

    const { sync, channel } = await l("../../../dist/contrib/sync/index.js");

    console.error(channel);
    const Index = () => {
        const st = state(Index, { clicks: 0 });
        //        st.set({ clicks: st.st.clicks + 1 });
        const el = build("h1", "Clicks: " + st.st.clicks);
        event(el, "click", () => st.set({ clicks: st.st.clicks + 1 }));

        sync(Index);
        return el;
    };

    register(Index);

    mount("/contrib/sync/demo/", () => Index);
    render();
};

init();
