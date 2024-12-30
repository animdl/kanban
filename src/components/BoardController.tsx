import { useState } from "react";

import PlusIcon from "./icons/PlusIcon";
import { List, ID } from "../types";
import ListContainer from "./ListContainer";

function BoardController() {
    
    // stores the lists of the board and the function to update the lists
    // makes them of type List from the types file
    const [lists, setLists] = useState<List[]>([]);

    // function to add a new list
    function addNewList() {
        const newList: List = {
            id: generateId(),
            title: `List ${lists.length + 1}`,
        }
        setLists([...lists, newList]);
    }

    // function to generate a unique id
    function generateId() {
        return Date.now().toString();
    }

    function deleteList(id: ID) {
        setLists(lists.filter((list) => list.id !== id));
    }

    return (
        <div className="
            flex
            m-auto
            min-h-[calc(100vh-64px)]
            w-full
            items-center
            overflow-x-hidden
            overflow-y-hidden
            p-8">
            <div className="flex gap-4">
                {/* lists */}
                <div className="flex gap-4">
                    {lists.map((list) => (
                        <div>
                            <ListContainer list={list} deleteList={deleteList}/>
                        </div>
                    ))}
                </div>
                {/* button to add a new list */}
                <button className="
                    btn 
                    btn-outline
                    h-12
                    w-[300px]
                    min-w-[300px]
                    border-4
                    btn-primary"
                    onClick={() => {addNewList()}}>
                    {/* button content */}
                    <PlusIcon />
                    Add a List
                </button>
            </div>
        </div>
    );
}

export default BoardController;