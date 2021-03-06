import { build, render, append } from "@rhea.ts/core";

const Cell = (props: string) => {
    const el = build("td", {
        data_text: props,
        text: props,
        class: "TableCell",
    });

    return el;
};

function renderTableCell(props: string): string {
    return `<td class="TableCell" data-text="${props}">${props}</td>`;
}

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

function renderTableRow(data: TableItemState): string {
    const props = data.props;
    const active = data.active ? " active" : "";

    let result = `<tr class="TableRow${active}" data-id="${data.id}">`;

    result += renderTableCell("#" + data.id);
    for (let i = 0; i < props.length; i++) {
        result += renderTableCell(props[i]);
    }

    return result + `</tr>`;
}

interface TableState {
    items: Array<TableItemState>;
}

const Table = (data: TableState) => {
    const el = build("table", { class: "Table" });
    const items = data.items;

    const els = [];
    for (let i = 0; i < items.length; i++) {
        els.push(Row(items[i]));
    }

    return append(el, ...els);
};

function renderTable(data: TableState): string {
    const items = data.items;

    let result = `<table class="Table"><tbody>`;

    for (let i = 0; i < items.length; i++) {
        result += renderTableRow(items[i]);
    }

    return result + `</tbody></table>`;
}

interface AnimBoxState {
    id: number;
    time: number;
}

const AnimBox = (props: AnimBoxState) => {
    return build("div", {
        class: "AnimBox",
        data_id: props.id.toString(),
        style:
            `border-radius:${props.time % 10}px;` +
            `background:rgba(0,0,0,${0.5 + (props.time % 10) / 10})`,
    });
};

function renderAnimBox(props: AnimBoxState): string {
    const style =
        `border-radius:${props.time % 10}px;` +
        `background:rgba(0,0,0,${0.5 + (props.time % 10) / 10})`;

    return `<div class="AnimBox" style="${style}" data-id="${props.id}"></div>`;
}

interface AnimState {
    items: Array<AnimBoxState>;
}

const Anim = (props: AnimState) => {
    const items = props.items;
    const el = build("div", { class: "Anim" });

    const els = [];
    for (let i = 0; i < items.length; i++) {
        els.push(AnimBox(items[i]));
    }

    return append(el, ...els);
};

function renderAnim(props: AnimState): string {
    const items = props.items;

    let result = `<div class="Anim">`;
    for (let i = 0; i < items.length; i++) {
        result += renderAnimBox(items[i]);
    }

    return result + `</div>`;
}

interface TreeNodeState {
    id: number;
    container: boolean;
    children: Array<TreeNodeState>;
}

const TreeLeaf = (props: TreeNodeState) => {
    return build("li", { class: "TreeLeaf", text: props.id.toString() });
};

function renderTreeLeaf(props: TreeNodeState): string {
    return `<li class="TreeLeaf">${props.id}</li>`;
}

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

function renderTreeNode(data: TreeNodeState): string {
    let result = `<ul class="TreeNode">`;
    for (let i = 0; i < data.children.length; i++) {
        const n = data.children[i];
        result += n.container ? renderTreeNode(n) : renderTreeLeaf(n);
    }
    return (result += `</ul>`);
}

interface TreeState {
    root: TreeNodeState;
}

const Tree = (props: TreeState) => {
    return append(build("div", { class: "Tree" }), TreeNode(props.root));
};

function renderTree(props: TreeState): string {
    return `<div class="Tree">${renderTreeNode(props.root)}</div>`;
}

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

function renderMain(data: AppState): string {
    const location = data && data.location;

    let result = `<div class="Main">`;
    if (location === "table") {
        result += renderTable(data.table);
    } else if (location === "anim") {
        result += renderAnim(data.anim);
    } else if (location === "tree") {
        result += renderTree(data.tree);
    }
    return result + `</div>`;
}

//@ts-ignore
uibench.init("rhea", "0.0.2");

function handleClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).className === "TableCell") {
        console.log(
            "Click",
            (e.target as HTMLElement).getAttribute("data-text")
        );
        e.preventDefault();
        e.stopPropagation();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const a = document.querySelector("#App");

    uibench.run(
        state => {
            let container = a as HTMLElement;
            container.innerHTML = renderMain(state);
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
