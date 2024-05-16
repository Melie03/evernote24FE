import { Todo } from "./todo";
import { Tag } from "./tag";

export class TodoFactory {

    static empty(): Todo {
        return new Todo(
            0,
            '',
            '',
            new Date(),
            0,
            0,
            new Date(),
            new Date(),
            false,
            []
        );
    }

    static fromObject(rawTodo: any): Todo {
        return new Todo(
            rawTodo.id,
            rawTodo.title,
            rawTodo.description,
            typeof(rawTodo.due_date === 'string') ?
                new Date(rawTodo.due_date) : rawTodo.due_date,
            rawTodo.note_id,
            rawTodo.assigned_user_id,
            typeof(rawTodo.created_at === 'string') ?
                new Date(rawTodo.created_at) : rawTodo.created_at,
            typeof(rawTodo.updated_at === 'string') ?
                new Date(rawTodo.updated_at) : rawTodo.updated_at,
            rawTodo.completed,
            []
        );
    }
}
