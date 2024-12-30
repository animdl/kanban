import { List, ID } from "../types";

import TrashIcon from "./icons/TrashIcon";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    list: List;
    deleteList: (id: ID) => void;
}

function ListContainer(props: Props) {
    const { list, deleteList } = props;

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: list.id,
        data: {
            type: "list",
            list
        }
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
            <div {...attributes} {...listeners} className="card-title flex items-center justify-between h-16 p-2 cursor-grab">
                <div className="p-4">
                    {list.title}
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