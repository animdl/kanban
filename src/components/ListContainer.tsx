import { List, ID } from "../types";

import TrashIcon from "./icons/TrashIcon";

interface Props {
    list: List;
    deleteList: (id: ID) => void;
}

function ListContainer(props: Props) {
    const { list, deleteList } = props;

    return (
        <div className="
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
            <div className="card-title flex items-center justify-between h-16 p-2 cursor-grab">
                <div className="p-4">
                    { list.title }
                </div>
                <button className="btn btn-outline btn-error" onClick={() => {deleteList(list.id)}}>    
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