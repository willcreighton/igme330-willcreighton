// Create TodoItem interface
interface TodoItem {
    id: number;
    title: string;
    status: TodoStatus;
    completedOn?: Date;
}

// Create TodoStatus enum, strongly typed
enum TodoStatus {
    Todo = "todo",
    InProgress = "in-progress",
    Done = "done",
}

// Strongly type todoItems array
const todoItems: TodoItem[] = [
    { id: 1, title: "Learn HTML", status: TodoStatus.Done, completedOn: new Date("2021-09-11") },
    { id: 2, title: "Learn TypeScript", status: TodoStatus.InProgress },
    { id: 3, title: "Write the best web app in the world", status: TodoStatus.Todo },
]

// Strongly type paramters and return values of `addTodoItem()` and `getNextId()` functions
function addTodoItem(todo: string): TodoItem {
    const id: number = getNextId(todoItems);

    const newTodo: TodoItem = {
        id,
        title: todo,
        status: TodoStatus.Todo,
    };

    todoItems.push(newTodo);

    return newTodo;
}
function getNextId(items: TodoItem[]): number {
    return items.reduce((max, x) => x.id > max ? x.id : max, 0) + 1;
}

const newTodo: TodoItem = addTodoItem("Buy lots of stuff with all the money we make from the app");

// Log results
console.log(JSON.stringify(newTodo));