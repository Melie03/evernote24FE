import { Component, OnInit } from '@angular/core';
import { EvernoteService } from '../shared/evernote.service';
import { Todo } from '../shared/todo';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bs-todo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo.component.html',
  styles: ``
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];

  constructor(
    private evernoteService: EvernoteService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.evernoteService.getTodosWithoutNote().subscribe(
      (response: any) => {
        this.todos = response;
        console.log(response);
      },
      (error: any) => {
        console.error('Fehler beim Laden der Todos:', error);
      }
    );
  }

  deleteTodo(todoId: number): void {
    this.evernoteService.deleteTodo(todoId).subscribe(
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
    this.router.navigate(['../admin/todo', todoId], { relativeTo: this.activatedRoute });
  }
  createTodo(): void {
    this.router.navigate(['../admin/todo'], { relativeTo: this.activatedRoute });
  }
}
