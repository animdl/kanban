import { useState } from "react";
import { List, ID, Task } from "../types";

import TrashIcon from "./icons/TrashIcon";
import GrabIcon from "./icons/GrabIcon";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlusIcon from "./icons/PlusIcon";
import TaskContainer from "./TaskContainer";

// props for the ListContainer component
interface Props {
    list: List;
    deleteElement: (id: ID, elementType: string) => void;
    updateElement: (id: ID, newText: string, elementType: string) => void;
    createTask: (listId: ID) => void;
    tasks: Task[];
}

function ListContainer(props: Props) {
    // accept the props
    const { list, deleteElement, updateElement, createTask, tasks } = props;

    // stores whether the list is being edited
    const [editing, setEditing] = useState(false);

    // dnd hooks
    // the useSortable hook is used to transfer data to the dnd context
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: list.id,
        data: {
            type: "list",
            list
        },
        disabled: editing
    });

    // 
    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };

    // if the card is being dragged, show a transparent card in its place
    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style} className="card bg-base-300 h-[500px] max-h-[500px] w-[300px] min-w-[300px] flex flex-col rounded-none opacity-40 border-2 border-primary"></div>
        );
    }

    return (
        <div ref={setNodeRef} style={style} className="
            card
            bg-base-200
            h-[500px] 
            max-h-[500px] 
            w-[300px] 
            min-w-[300px]
            flex
            flex-col
            rounded-none
            ">
            {/* card header */}
            <div onDoubleClick={() => { setEditing(true) }} className="
                card-title 
                flex 
                items-center 
                justify-between 
                h-16 
                p-4 
                ">
                {/* grab icon */}
                <div {...attributes} {...listeners} className="cursor-grab">
                    <GrabIcon />
                </div>
                {/* list title */}
                <div className="">
                    {!editing && list.title}
                    {editing && (
                        <input
                            autoFocus
                            onBlur={() => { setEditing(false) }}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") { setEditing(false) } }}
                            type="text"
                            className="input input-bordered input-primary w-[180px]"
                            value={list.title}
                            onChange={(e) => { updateElement(list.id, e.target.value, "list") }}
                        />
                    )}
                </div>
                {/* delete button */}
                    <button className="btn btn-outline btn-error p-3" onClick={() => { deleteElement(list.id, "list") }}>
                        <TrashIcon />
                    </button>
            </div>

            {/* card body */}
            <div className="card-body flex flex-grow gap-4 p-4 overflow-x-hidden overflow-y-auto">
                {tasks.map((task) => (
                    <TaskContainer key={task.id} task={task} deleteElement={deleteElement} updateElement={updateElement} />
                ))}
            </div>

            {/* card footer */}
            <div className="">
                {/* add task button */}
                <button className="btn btn-outline flex gap-2 w-[300px] min-w-[300px] btn-primary" onClick={() => { createTask(list.id); }}>
                    <PlusIcon />
                    Add a Task
                </button>
            </div>
        </div>
    );
}

export default ListContainer;