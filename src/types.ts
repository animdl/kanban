export type ID = string | number;

export type List = {
    id: ID;
    title: string;
    //tasks: Tasks[];
};

export type Task = {
    id: ID;
    title: string;
    description: string;
    listId: ID;
};