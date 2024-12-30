import { useState } from "react";
import { List, ID } from "../types";

import TrashIcon from "./icons/TrashIcon";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    list: List;
    deleteList: (id: ID) => void;
    updateList: (id: ID, title: string) => void;
}

function ListContainer(props: Props) {
    const { list, deleteList, updateList } = props;

    const [editing, setEditing] = useState(false);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: list.id,
        data: {
            type: "list",
            list
        },
        disabled: editing
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };

    // if the card is being dragged, show a transparent card in its place
    if (isDragging) {
        return(
            <div ref={setNodeRef} style={style} className="card bg-base-300 h-[500px] max-h-[500px] w-[300px] min-w-[300px] flex flex-col rounded-none opacity-40 border-2 border-primary"></div>
        );
    }

    return (
        <div ref={setNodeRef} style={style} className="
            card
            bg-base-300
            h-[500px] 
            max-h-[500px] 
            w-[300px] 
            min-w-[300px]
            flex
            flex-col
            rounded-none
            ">
            {/* card header */}
            <div {...attributes} {...listeners} onClick={() => { setEditing(true) }} className="card-title flex items-center justify-between h-16 p-2 cursor-grab">
                <div className="p-4">
                    {!editing && list.title}
                    {editing && (
                        <input
                            autoFocus
                            onBlur={() => { setEditing(false) }}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") { setEditing(false) } }}
                            type="text"
                            className="input input-bordered input-primary w-[180px]"
                            value={list.title}
                            onChange={(e) => { updateList(list.id, e.target.value) }}
                        />
                    )}
                </div>
                <button className="btn btn-outline btn-error" onClick={() => { deleteList(list.id) }}>
                    <TrashIcon />
                </button>
            </div>
            {/* card body */}
            <div className="card-body">
                content body
            </div>
            {/* card footer */}
            <div className="">
                footer
            </div>
        </div>
    );
}

export default ListContainer;