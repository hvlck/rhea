import { mount, mutate, register, render, update } from "../src/rt";
import * as Rhea from "../src/std/index";

const NotFound = () => {
    return <p>404 Not Found</p>;
};

const Layout = () => {
    const path = window.location.pathname;
    let page;
    switch (path) {
        case "/": {
            page = <Home />;
            break;
        }
        default: {
            page = <NotFound />;
            break;
        }
    }

    return <div>{page}</div>;
};

const state = { counter: 0 };

const Counter = () => {
    const counter = <input type="button" value={String(state.counter)} />;
    const op = {
        increment: () => {
            state.counter++;
            mutate(counter, { value: state.counter });
        },
        decrement: () => {
            state.counter--;
            mutate(counter, { value: state.counter });
        },
    };

    return (
        <div>
            <input type="button" value="-" onClick={op.decrement} />
            {counter}
            <input type="button" value="+" onClick={op.increment} />
        </div>
    );
};

export const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <Counter />
        </div>
    );
};

register(Layout, Home, Counter);

mount(/.+/, () => Layout);

render();
