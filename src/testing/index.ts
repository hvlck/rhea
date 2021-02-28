// rhea testing framework
import { Component } from "../rt/index";

interface Test {
    click: (el: Component, fn: Function) => void;
    state: (shouldBe: any) => boolean;
    props: (
        property: any,
        newProps: Map<string, string>,
        deep: boolean
    ) => boolean;
}

const Test = () => {
    const t = {
        click: () => {},
        state: () => {},
        props: () => {},
    };

    return t;
};

const t = <T>(name: string, fn: (testing: Test) => void) => {};

export default t;
