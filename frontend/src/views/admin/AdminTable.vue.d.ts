interface Column {
    key: string;
    label: string;
    component?: string;
    props?: (item: any) => any;
    format?: (value: any) => string;
}
interface Field {
    key: string;
    label: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
    hint?: string;
}
interface Props {
    title: string;
    columns: Column[];
    fields: Field[];
    loadData: () => Promise<any[]>;
    createItem: (data: any) => Promise<any>;
    updateItem: (id: string, data: any) => Promise<any>;
    deleteItem: (id: string) => Promise<void>;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
