import { Component, OnInit } from '@angular/core';
import { EvernoteService } from '../shared/evernote.service';
import { Todo } from '../shared/todo';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NoteTagFactory } from '../shared/noteTag-factory';
import { TodoTagFactory } from '../shared/todoTag-factory ';
import { TodoTag } from '../shared/todo-tag';

@Component({
  selector: 'bs-todo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo.component.html',
  styles: ``
})
export class TodoComponent implements OnInit {
  todos: TodoTag[] = [];
  id: number = 0;

  constructor(
    private es: EvernoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.es.getTodosWithoutNote().subscribe(
      (response: any) => {
        let todossRaw = response;
        for(let todo of todossRaw){
          this.es.getTagsByTodoId(todo.id).subscribe(
            (tagResponse: any) => {
              let currentTodo = TodoTagFactory.fromObject(todo);
              currentTodo.tags = tagResponse;
              this.todos.push(currentTodo);
            },
            (error: any) => {
              console.error('Fehler beim Laden der Tags:', error);
            }
          );
        }
      },
      (error: any) => {
        console.error('Fehler beim Laden der Todos:', error);
      }
    );
  }

  deleteTodo(todoId: number): void {
    this.es.deleteTodo(todoId).subscribe(
      (response: any) => {
        this.loadTodos();
        console.log(response);
      },
      (error: any) => {
        console.error('Fehler beim Löschen des Todos:', error);
      }
    );
  }

  editTodo(todoId: number): void {
    this.router.navigate(['../admin/todo', todoId], { relativeTo: this.route });
  }
  createTodo(): void {
    this.router.navigate(['../admin/todo'], { relativeTo: this.route });
  }
}
