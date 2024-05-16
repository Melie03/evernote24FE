import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EvernoteService } from '../shared/evernote.service';
import { Todo } from '../shared/todo';
import { TodoFactory } from '../shared/todo-factory';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './todo-form.component.html',
  styles: [``]
})
export class TodoFormComponent implements OnInit {
todoForm: FormGroup = new FormGroup({});
todo = TodoFactory.empty();
isUpdatingTodo = false;
errors: { [key: string]: string } = {};

constructor(
  private fb: FormBuilder,
  private es : EvernoteService,
  private route: ActivatedRoute,
  private router: Router
) {
  this.todoForm = this.fb.group({});
 // this.tags = this.fb.array([]);
}

ngOnInit() {
  const todoId = this.route.snapshot.params['todoId'];
  if(todoId){
    this.isUpdatingTodo = true;
    this.es.getTodoById(todoId).subscribe((todo: any) =>{
      this.todo = todo;
      /*this.es.getTagsByTodoId(noteId).subscribe((tags: any) => {
        this.todoTags = tags;
        this.initTodo();
      });*/
      this.initTodo();
    });

  }
  this.initTodo();


}

  initTodo() {
    this.todoForm = this.fb.group({
      title: [this.todo.title, Validators.required],
      description: [this.todo.description,Validators.required],
      due_date: [{value: this.todo.due_date.toString().split("T")[0], disabled: false}, Validators.required],
      created_at: [{value: this.todo.created_at.toString().split("T")[0], disabled: true}],
      updated_at: [{value: this.todo.updated_at.toString().split("T")[0], disabled: true}],
      completed: [false]
    });
  }

  saveTodo() {

  }
  submitForm(){

  }
}
