export declare global {
    export declare namespace JSX {
        export interface IntrinsicElements {
            [name: string]: { [prop: string]: boolean | string | number };
        }

        export interface Element {}
        export interface HTMLElement {}
    }
}
