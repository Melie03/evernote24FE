import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EvernoteService } from '../shared/evernote.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteFactory } from '../shared/note-factory';
import { Tag } from '../shared/tag';
import { NoteTag } from '../shared/noteTag';
import { NoteTagFactory } from '../shared/noteTag-factory';
import { Todo } from '../shared/todo';
import { TodoFactory } from '../shared/todo-factory';
import { NoteFormErrorMessages } from './note-form-error-message';
import { User } from '../shared/user';


@Component({
  selector: 'bs-note-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './note-form.component.html',
  styles: ``
})
export class NoteFormComponent implements OnInit{
  noteForm : FormGroup;
  note = NoteFactory.empty();
  isUpdatingNote = false;
  errors: { [key: string]: string } = {};
  tags: FormArray;
  todos: FormArray;
  noteTags: Tag [] = [];
  noteListId: number = 0;
  noteTodos: Todo[] = [];
  sharedUsers: User[] = [];


  constructor(
    private fb: FormBuilder,
    private es : EvernoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.noteForm = this.fb.group({});
    this.tags = this.fb.array([]);
    this.todos = this.fb.array([]);
  }

  ngOnInit() {
    const noteId = this.route.snapshot.params['noteId'];
    this.noteListId = this.route.snapshot.params['noteListId'];
    if(noteId){
      this.isUpdatingNote = true;
      this.es.getNoteById(noteId).subscribe((note: any) =>{
        this.note = note;
        this.es.getTagsByNoteId(noteId).subscribe((tags: any) => {
          this.noteTags = tags;
          this.note.note_list_id = this.noteListId;
          this.es.getTodosByNoteId(noteId).subscribe((todos: any) => {
              this.noteTodos = todos;
            this.es.getUsersWhoShareLists(this.noteListId).subscribe((users: any) => {
              this.sharedUsers = users;
              this.initNote();
            });
          });
        });
      });
    }else{
      this.es.getUsersWhoShareLists(this.noteListId).subscribe((users: any) => {
        this.sharedUsers = users;
        this.initNote();
      });
    }
    this.note.note_list_id = this.noteListId;
      this.initNote();
  }

  initNote() {
    this.buildTagsArray();
    this.buildTodoArray();
    this.noteForm = this.fb.group({
      id: [this.note.id, Validators.required],
      title: [this.note.title, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      description: [this.note.description, [Validators.required, Validators.minLength(5), Validators.maxLength(400)]],
      note_list_id: [{value: this.note.note_list_id, disabled: true}],
      created_at: [{value: this.note.created_at.toString().split("T")[0], disabled: true}],
      updated_at: [{value: this.note.updated_at.toString().split("T")[0], disabled: true}],
      tags: this.tags,
      todos: this.todos
    });


    this.noteForm.statusChanges.subscribe(() =>
      this.updateErrorMessage()
    );

  }
    updateErrorMessage(): void {
    this.errors = {};
    for (const message of NoteFormErrorMessages) {
      const control = this.noteForm.get(message.forControl);
      if (control &&
        control.dirty &&
        control.invalid &&
        control.errors?.[message.forValidator] &&
        !this.errors[message.forControl]) {
        this.errors[message.forControl] = message.text;
      }
    }
  }

  buildTagsArray(): any {
    if (this.noteTags) {
      this.tags = this.fb.array([]);

      for (let tag of this.noteTags) {
        let fg = this.fb.group({
         tagName : new FormControl(tag.name)
        });
        this.tags.push(fg);
      }
    }
  }
  buildTodoArray(): any {
    if (this.todos) {
      this.todos = this.fb.array([]);

      for (let todo of  this.noteTodos) {
        let fg = this.fb.group({
          id : new FormControl(todo.id ,[ Validators.required]),
         title : new FormControl(todo.title,[ Validators.required, Validators.maxLength(15)]),
          description : new FormControl(todo.description,[Validators.required, Validators.maxLength(255), Validators.minLength(10)]),
          due_date : new FormControl(todo.due_date, [Validators.required]),
          note_id: new FormControl(this.note.id, [Validators.required]),
          assigned_user_id : new FormControl(todo.assigned_user_id),
          created_at: [{value: todo.created_at.toString().split("T")[0], disabled: true}],
          updated_at: [{value: todo.updated_at.toString().split("T")[0], disabled: true}],
          completed : new FormControl(todo.completed)
        });
        this.todos.push(fg);
      }

    }
  }
  submitForm() {
    console.log(this.noteForm.value);
    const note = NoteFactory.fromObject(this.noteForm.value);
    let tags = [];
    let todos : Todo [] = [];
    for(let tag of this.noteForm.value.tags){
      tags.push({name : tag.tagName});
    }
    for(let t of this.noteForm.value.todos){
      let todo = TodoFactory.fromObject(t);
      todo.note_id = note.id;
      if(todo.assigned_user_id == -1){
        todo.assigned_user_id = null;
      }
      todos.push(todo);
      console.log(todo);
    }
    let noteTags : NoteTag = NoteTagFactory.fromObject(note);
    noteTags.tags = tags;
    noteTags.note_list_id = this.noteListId;
    if (this.isUpdatingNote) {
      this.es.updateNote(note.id, noteTags).subscribe(res => {
        for(let t of todos){
          if(t.id == -1){
            this.es.createTodo(t).subscribe(res => {
              console.log(res);
            });
          } else {
            this.es.updateTodo(t.id, t).subscribe(res => {
              console.log(res);
            });
          }
        }
        for(let n of this.noteTodos){
          let found = false;
          for(let t of todos){
            if(n.id == t.id){
              found = true;
            }
          }
          if(!found){
            this.es.deleteTodo(n.id).subscribe(res => {
              console.log(res);
            });
          }
        }
        this.router.navigate(["../../../../noteLists", this.noteListId], {
          relativeTo: this.route
        });
      });
    } else {
      console.log(note);
      this.es.createNote(noteTags).subscribe(res => {
        for(let todo of todos){
          todo.note_id = res.id;
          this.es.createTodo(todo).subscribe(res => {
            console.log(res);
          });
        }
        this.note = NoteFactory.empty();
        this.noteForm.reset(NoteFactory.empty());
        this.router.navigate(["../../../noteLists", this.noteListId], { relativeTo: this.route });

      })
    }

  }
  addTagControl() {
    this.tags.push(this.fb.group({tagName: ''}));
  }


  deleteTag(tag: any){
    this.tags.removeAt(this.tags.controls.indexOf(tag));
  }

  addTodoControl() {
    this.todos.push(this.fb.group({
      id: -1,
      title: '',
      description: '',
      due_date: '',
      assigned_user_id: '',
      created_at: [{value: (new Date ()).toISOString().split("T")[0], disabled: true}],
          updated_at: [{value: (new Date ()).toISOString().split("T")[0], disabled: true}],
      completed: false
    }));
  }

  deleteTodo(todo: any) {
    const index = this.todos.controls.indexOf(todo);
    if (index !== -1) {
      this.todos.removeAt(index);
    }
  }

}
