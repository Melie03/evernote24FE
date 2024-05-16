import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EvernoteService } from '../shared/evernote.service';
import { Tag, Todo } from '../shared/todo';
import { TodoFactory } from '../shared/todo-factory';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoTag } from '../shared/todo-tag';

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
todoTags: Tag [] = [];
tags: FormArray;

constructor(
  private fb: FormBuilder,
  private es : EvernoteService,
  private route: ActivatedRoute,
  private router: Router
) {
  this.todoForm = this.fb.group({});
 this.tags = this.fb.array([]);
}

ngOnInit() {
  const todoId = this.route.snapshot.params['todoId'];
  if(todoId){
    this.isUpdatingTodo = true;
    this.es.getTodoById(todoId).subscribe((todo: any) =>{
      this.todo = todo;
      this.es.getTagsByTodoId(todoId).subscribe((tags: any) => {
        this.todoTags = tags;
        this.initTodo();
      });
      this.initTodo();
    });

  }
  this.initTodo();
}

  initTodo() {
    this.buildTagsArray();
    this.todoForm = this.fb.group({
      id: [this.todo.id],
      title: [this.todo.title, Validators.required],
      description: [this.todo.description,Validators.required],
      due_date: [{value: this.todo.due_date.toString().split("T")[0], disabled: false}, Validators.required],
      created_at: [{value: this.todo.created_at.toString().split("T")[0], disabled: true}],
      updated_at: [{value: this.todo.updated_at.toString().split("T")[0], disabled: true}],
      completed: [false],
      tags: this.tags
    });
  }
  buildTagsArray(): any {
    if (this.todoTags) {
      this.tags = this.fb.array([]);

      for (let tag of this.todoTags) {
        let fg = this.fb.group({
         tagName : new FormControl(tag.name)
        });
        this.tags.push(fg);
      }
      if (this.todoTags.length == 0)
        this.addTagControl();
    }
  }
  addTagControl() {
    this.tags.push(this.fb.group({tagName: ''}));
  }

  deleteTag(tag: any){
    this.tags.removeAt(this.tags.controls.indexOf(tag));
  }
  submitForm(){
    console.log(this.todoForm.value);
    const todo = TodoFactory.fromObject(this.todoForm.value);
    let tags = [];
    for(let tag of this.todoForm.value.tags){
      tags.push({name : tag.tagName});
    }
    let todoTag : TodoTag = TodoFactory.fromObject(todo);
    todoTag.tags = tags;
    if (this.isUpdatingTodo) {
      this.es.updateTodo(todo.id, todoTag).subscribe(res => {
        this.router.navigate(["../../../todos"], {
          relativeTo: this.route
        });
      });


    } else {

      console.log(todo);
      this.es.createTodo(todoTag).subscribe(res => {
        this.todo = TodoFactory.empty();
        this.todoForm.reset(TodoFactory.empty());
        this.router.navigate(["../../todos"], { relativeTo: this.route });

      })
    }

  }
}
