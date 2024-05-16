import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EvernoteService } from '../shared/evernote.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteFactory } from '../shared/note-factory';
import { Tag } from '../shared/tag';
import { NoteTag } from '../shared/noteTag';
import { NoteTagFactory } from '../shared/noteTag-factory';


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
          this.initNote();
        });
        this.es.getTodosByNoteId(noteId).subscribe((todos: any) => {
          for(let todo of todos){
            this.todos.push(this.fb.group(todo));
          }
        });

      });

    }
    this.note.note_list_id = this.noteListId;
      this.initNote();


  }

  initNote() {
    this.buildTagsArray();
    this.noteForm = this.fb.group({
      id: [this.note.id, Validators.required],
      title: [this.note.title, Validators.required],
      description: [this.note.description, Validators.required],
      note_list_id: [{value: this.note.note_list_id, disabled: true}],
      created_at: [{value: this.note.created_at.toString().split("T")[0], disabled: true}],
      updated_at: [{value: this.note.updated_at.toString().split("T")[0], disabled: true}],
      tags: this.tags
    });


    this.noteForm.statusChanges.subscribe(() =>
      this.updateErrorMessage()
    );

  }
  updateErrorMessage(): void {
   /* this.errors = {};
    for (const message of NoteFactory.validationMessages) {
      const control = this.noteForm.get(message.forControl);
      if (control &&
          control.dirty &&
          control.invalid &&
          control.errors[message.forValidator] &&
          !this.errors[message.forControl]) {
        this.errors[message.forControl] = message.text;
      }
    }*/
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
      if (this.noteTags.length == 0)
        this.addTagControl();
    }
  }

  submitForm() {
    console.log(this.noteForm.value);
    const note = NoteFactory.fromObject(this.noteForm.value);
    let tags = [];
    for(let tag of this.noteForm.value.tags){
      tags.push({name : tag.tagName});
    }
    let noteTags : NoteTag = NoteTagFactory.fromObject(note);
    noteTags.tags = tags;
    noteTags.note_list_id = this.noteListId;
    if (this.isUpdatingNote) {
      this.es.updateNote(note.id, noteTags).subscribe(res => {
        this.router.navigate(["../../../../noteLists", this.noteListId], {
          relativeTo: this.route
        });
      });


    } else {

      console.log(note);
      this.es.createNote(noteTags).subscribe(res => {
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
}
