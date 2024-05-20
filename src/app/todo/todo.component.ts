import { Component, OnInit } from '@angular/core';
import { EvernoteService } from '../shared/evernote.service';
import { Tag, Todo } from '../shared/todo';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NoteTagFactory } from '../shared/noteTag-factory';
import { TodoTag } from '../shared/todo-tag';
import { TodoTagFactory } from '../shared/todoTag-factory ';

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
  selectedTagName: string = '';
  allTodos: TodoTag[] = [];
  tags: Tag[] = [];

  constructor(
    private es: EvernoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Initialisiert die Komponente, lädt die Todos und die Tags.
   */
  ngOnInit(): void {
    this.loadTodos();
    this.es.getTags().subscribe(res => {
      this.tags = res;
      console.log(this.tags);
    });
  }

  /**
   * Lädt die Todos ohne zugehörige Notiz und ihre Tags.
   */
  loadTodos(): void {
    this.todos = [];
    this.allTodos = [];
    this.es.getTodosWithoutNote().subscribe(
      (response: any) => {
        let todosRaw = response;
        for (let todo of todosRaw) {
          this.es.getTagsByTodoId(todo.id).subscribe(
            (tagResponse: any) => {
              let currentTodo = TodoTagFactory.fromObject(todo);
              currentTodo.tags = tagResponse;
              this.todos.push(currentTodo);
              this.allTodos.push(currentTodo);
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

  /**
   * Löscht ein Todo und lädt die Todos neu.
   */
  deleteTodo(todoId: number): void {
    this.es.deleteTodo(todoId).subscribe(
      (response: any) => {
        this.loadTodos();
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

  filter(): void {
    if (this.selectedTagName === '') {
      this.todos = this.allTodos;
      return;
    }
    this.todos = this.allTodos.filter(note => note.tags.some(tag => tag.name === this.selectedTagName));
  }

  selectedTagFilter(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement.value === '') {
      this.selectedTagName = '';
      return;
    }
    const selectedTagId = Number(selectElement.value);
    let selectedTag = this.tags.find(tag => tag.id === selectedTagId);
    if (selectedTag) {
      this.selectedTagName = selectedTag.name;
    } else {
      console.error('Ungültiger Tag.');
    }
  }
}
