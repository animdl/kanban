import { useState } from "react";
import { ID, Task } from "../types";
import TrashIcon from "./icons/TrashIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    task: Task;
    deleteElement: (id: ID, elementType: string) => void;
    updateElement: (id: ID, newText: string, elementType: string) => void;
}

function TaskContainer(props: Props) {
    const { task, deleteElement, updateElement } = props;

    const [mouseOver, setMouseOver] = useState(false);

    const [editing, setEditing] = useState(false);

    const toggleEditing = () => {
        setEditing(!editing);
        setMouseOver(!mouseOver);
    };

    // dnd hooks
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: "task",
            task
        },
        disabled: editing
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };

    // if the task is being dragged, show a transparent task in its place
    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style} className="
                bg-base-300 
                h-24 
                min-h-24 
                flex 
                rounded-2xl 
                opacity-40 
                border-2 
                border-primary"/>
        );
    }

    return (
        <div ref={setNodeRef} style={style}>
            <div {...attributes} {...listeners} onDoubleClick={toggleEditing} onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)} className="
                bg-base-300
                text-primary
                p-2
                h-24
                min-h-24
                flex
                text-left
                justify-between
                rounded-2xl
                hover:ring-4
                hover:primary
                cursor-grab
                ">
                {!editing && 
                    <p className="m-auto h-[90%] w-full overflow-x-hidden overflow-y-auto whitespace-pre-wrap">{task.content}</p>
                }
                {editing &&
                    <textarea 
                        autoFocus
                        onBlur={toggleEditing}
                        onKeyDown={(e) => { if (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey)) toggleEditing() }}
                        className="textarea textarea-bordered text-primary h-full w-full resize-none"
                        value={task.content}
                        onChange={(e) => { updateElement(task.id, e.target.value, "task") }}
                    />
                }
                {/* only show delete button when the mouse is over the task */}
                {mouseOver && !editing &&
                    <button onClick={() => deleteElement(task.id, "task")} className="btn btn-outline btn-error p-3 m-2">
                        <TrashIcon />
                    </button>
                }
            </div>
        </div>
    );
}

export default TaskContainer;