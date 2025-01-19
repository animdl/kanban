import { useMemo, useState } from "react";

import PlusIcon from "./icons/PlusIcon";
import { List, ID, Task } from "../types";
import ListContainer from "./ListContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskContainer from "./TaskContainer";

function BoardController() {

    // stores the lists of the board and the function to update the lists
    // makes them of type List from the types file
    const [lists, setLists] = useState<List[]>([]);

    // stores the ids of the lists
    // useMemo is used to cache the list of ids between re-renders
    const listIDs = useMemo(() => lists.map((list) => list.id), [lists]);

    // stores all the tasks within the board
    // makes them of type task from the types file
    const [tasks, setTasks] = useState<Task[]>([]);

    // stores the list that is currently being dragged
    const [activeList, setActiveList] = useState<List | null>(null);

    // stores the task that is currently being dragged
    const [activeTask, setActiveTask] = useState<Task | null>(null);

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

    // function to create a new task
    function createTask(listId: ID) {
        const newTask: Task = {
            id: generateId(),
            listId,
            content: `Task ${tasks.length + 1}`,
        }
        setTasks([...tasks, newTask]);
    }

    // function to generate a unique id
    function generateId() {
        return Date.now().toString();
    }

    // function to update the title of a list or task
    function updateElement(id: ID, newText: string, elementType: string) {
        if (elementType === "list") {
            setLists(lists.map((list) => {
                if (list.id === id) {
                    return { ...list, newText };
                }
                return list;
            }));
        } else if (elementType === "task") {
            setTasks(tasks.map((task) => {
                if (task.id === id) {
                    return { ...task, content: newText };
                }
                return task;
            }))
        }
    }

    // function to delete a task or list
    // this function is passed to the TaskContainer component
    function deleteElement(id: ID, elementType: string) {
        if (elementType === "task") {
            setTasks(tasks.filter((task) => task.id !== id));
        } else if (elementType === "list") {
            setLists(lists.filter((list) => list.id !== id));

            // delete the tasks that belong to the deleted list
            setTasks(tasks.filter((task) => task.listId !== id));
        }
    }

    // ---------

    // function to handle the drag start event
    // if the dragged item is a list, set activeList to the list
    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "list") {
            setActiveList(event.active.data.current.list);
            return;
        } else if (event.active.data.current?.type === "task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    // function to handle the drag over event
    // used when a draggable item is being dragged over a sortable container
    function onDragOver(event: DragOverEvent) {
        // active is the item that is currently being dragged
        const { active, over } = event;

        // if the active item is a task and the over item is a task:
        // then arrayMove is used to move the task in the tasks array
        if (active.data.current?.type === "task" && over?.data.current?.type === "task") {
            setTasks((tasks) => {
                const oldIndex = tasks.findIndex((task) => task.id === active.id);
                const newIndex = tasks.findIndex((task) => task.id === over.id);

                tasks[oldIndex].listId = tasks[newIndex].listId;

                return arrayMove(tasks, oldIndex, newIndex);
            });
        }
       
        // if the active item is over a list
        // place the task in the list
        if (active.data.current?.type === "task" && over?.data.current?.type === "list") {
            // then arrayMove is used to move the list in the lists array
            setTasks((tasks) => {
                const oldIndex = tasks.findIndex((task) => task.id === active.id);

                tasks[oldIndex].listId = over.id;

                return arrayMove(tasks, oldIndex, oldIndex);
            });
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

        setActiveList(null);
        setActiveTask(null);
    }

    return (
        <div className="
            flex
            m-auto
            min-h-[calc(100vh-64px)]
            w-full
            items-center
            overflow-x-auto
            overflow-y-hidden
            p-8">
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} sensors={sensors}>
                <div className="flex gap-4">
                    {/* display the lists */}
                    <div className="flex gap-4">
                        <SortableContext items={listIDs}>
                            {lists.map((list) => (
                                <div>
                                    <ListContainer key={list.id} list={list} deleteElement={deleteElement} updateElement={updateElement} createTask={createTask} tasks={tasks.filter((task) => task.listId === list.id)} />
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
                        onClick={() => { addNewList() }}>
                        {/* button content */}
                        <PlusIcon />
                        Add a List
                    </button>
                </div>

                {/* drag overlay appears when a list is being dragged */}
                {createPortal(
                    <DragOverlay>
                        {activeList && (
                            <ListContainer list={activeList} deleteElement={deleteElement} updateElement={updateElement} createTask={createTask} tasks={tasks.filter((task) => task.listId === activeList.id)} />
                        )}
                        {activeTask && (
                            <TaskContainer task={activeTask} deleteElement={deleteElement} updateElement={updateElement} />
                        )}
                    </DragOverlay>, document.body
                )}
            </DndContext>
        </div>
    );
}

export default BoardController;