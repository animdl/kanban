import { useMemo, useState } from "react";

import PlusIcon from "./icons/PlusIcon";
import { List, ID } from "../types";
import ListContainer from "./ListContainer";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

function BoardController() {
    
    // stores the lists of the board and the function to update the lists
    // makes them of type List from the types file
    const [lists, setLists] = useState<List[]>([]);

    // stores the ids of the lists
    // useMemo is used to cache the list of ids between re-renders
    const listIDs = useMemo(() => lists.map((list) => list.id), [lists]);

    // stores the list that is currently being dragged
    const [activeList, setActiveList] = useState<List | null>(null);

    // sets the activation distance of the onDragStart event
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 10
        }
    }));

    // ---------

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

    // function to update the title of a list
    function updateList(id: ID, title: string) {
        setLists(lists.map((list) => {
            if (list.id === id) {
                return { ...list, title };
            }
            return list;
        }));
    }

    // function to delete a list
    // this function is passed to the ListContainer component
    function deleteList(id: ID) {
        setLists(lists.filter((list) => list.id !== id));
    }

    // function to handle the drag start event
    // if the dragged item is a list, set activeList to the list
    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "list") {
            setActiveList(event.active.data.current.list);
            return;
        }
    }

    // function to handle the drag end event
    // used to persist the order of the lists after the drag
    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setLists((lists) => {
                const oldIndex = lists.findIndex((list) => list.id === active.id);
                const newIndex = lists.findIndex((list) => list.id === over?.id);
                return arrayMove(lists, oldIndex, newIndex);
            });
        }
    }

    return (
        <div className="
            flex
            m-auto
            min-h-[calc(100vh-64px)]
            w-full
            items-center
            overflow-y-hidden
            p-8">
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors}>
                <div className="flex gap-4">
                    {/* display the lists */}
                    <div className="flex gap-4">
                        <SortableContext items={listIDs}>
                            {lists.map((list) => (
                                <div>
                                    <ListContainer key={list.id} list={list} deleteList={deleteList} updateList={updateList} />
                                </div>
                            ))}
                        </SortableContext>
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
                
                {/* drag overlay appears when a list is being dragged */}
                {createPortal(
                    <DragOverlay>
                        {activeList && (
                            <ListContainer list={activeList} deleteList={deleteList} updateList={updateList}/>
                        )}
                    </DragOverlay>, document.body
                )}
            </DndContext>
        </div>
    );
}

export default BoardController;