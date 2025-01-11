export type ID = string | number;

export type List = {
    id: ID;
    title: string;
};

export type Task = {
    id: ID;
    listId: ID;
    content: string;
};