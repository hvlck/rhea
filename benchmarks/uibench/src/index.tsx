import { build, append } from "@rhea.ts/core";

const Cell = (props: string) => {
    const el = build("td", {
        data_text: props,
        text: props,
        class: "TableCell",
    });

    return el;
};

const Row = (data: TableItemState) => {
    const act = data.active ? " active" : "";

    const el = build("tr", {
        class: "TableRow" + act,
        data_id: data.id.toString(),
    });

    const els = [];
    for (let i = 0; i < data.props.length; i++) {
        els.push(Cell(data.props[i]));
    }

    return append(el, ...els);
};

const Table = (data: TableState) => {
    const el = build("table", { class: "Table" });
    const items = data.items;

    const els = [];
    for (let i = 0; i < items.length; i++) {
        els.push(Row(items[i]));
    }

    return append(el, ...els);
};

const AnimBox = (props: AnimBoxState) => {
    return build("div", {
        class: "AnimBox",
        data_id: props.id.toString(),
        style:
            `border-radius:${props.time % 10}px;` +
            `background:rgba(0,0,0,${0.5 + (props.time % 10) / 10})`,
    });
};

const Anim = (props: AnimState) => {
    const items = props.items;
    const el = build("div", { class: "Anim" });

    const els = [];
    for (let i = 0; i < items.length; i++) {
        els.push(AnimBox(items[i]));
    }

    return append(el, ...els);
};

const TreeLeaf = (props: TreeNodeState) => {
    return build("li", { class: "TreeLeaf", text: props.id.toString() });
};

const TreeNode = (props: TreeNodeState): HTMLElement => {
    const el = build("ul", { class: "TreeNode" });
    const k = props.children;
    const els = [];
    for (let i = 0; i < k.length; i++) {
        const n = k[i];
        els.push(n.container ? TreeNode(n) : TreeLeaf(n));
    }

    return append(el, ...els);
};

const Tree = (props: TreeState) => {
    return append(build("div", { class: "Tree" }), TreeNode(props.root));
};

const Main = (data: AppState) => {
    const l = data && data.location;

    const el = build("div", { class: "Main" });
    if (l === "table") {
        append(el, Table(data.table));
    } else if (l === "anim") {
        append(el, Anim(data.anim));
    } else if (l === "tree") {
        append(el, Tree(data.tree));
    }

    return el;
};

uibench.init("Rhea", "0.0.2");

function handleClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).className === "TableCell") {
        e.preventDefault();
        e.stopPropagation();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const a = document.querySelector("#App");

    const container = a as HTMLElement;
    uibench.run(
        state => {
            container.appendChild(Main(state));

            if (state.location === "table") {
                const cells = container.querySelectorAll(".TableCell");
                for (let i = 0; i < cells.length; i++) {
                    (cells[i] as HTMLTableCellElement).onclick = handleClick;
                }
            }
        },
        samples => {
            document.body.innerHTML =
                "<pre>" + JSON.stringify(samples, null, " ") + "</pre>";
        }
    );
});
