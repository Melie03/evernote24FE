import { Component } from '@angular/core';
import { EvernoteService } from '../shared/evernote.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NoteListFactory } from '../shared/note-list-factory';
import { Tag } from '../shared/tag';

@Component({
  selector: 'bs-note-list-form',
  standalone: true,
  imports: [],
  templateUrl: './note-list-form.component.html',
  styles: ``
})
export class NoteListFormComponent {
  noteListForm : FormGroup;
  noteList = NoteListFactory.empty();
  isUpdatingNote = false;
  errors: { [key: string]: string } = {};
  notes: FormArray;
  todos: FormArray;


  constructor(
    private fb: FormBuilder,
    private es : EvernoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.noteListForm = this.fb.group({});
    this.notes = this.fb.array([]);
    this.todos = this.fb.array([]);
  }
  ngOnInit() {
    const noteListId = this.route.snapshot.params['noteListId'];
    if(noteListId){
      this.isUpdatingNote = true;
      this.es.getNoteById(noteListId).subscribe((note: any) =>{
        this.noteList = this.noteList;
            this.es.getNoteListById(noteListId).subscribe((tags: any) => {
             for(let note of notes){
                this.notes.push(this.fb.group(note));
             }
            });
            this.es.getTodosByNoteId(noteListId).subscribe((todos: any) => {
              for(let todo of todos){
                this.todos.push(this.fb.group(todo));
              }
            });

          });

        }
          this.initNoteList();
  }
  initNoteList() {
    throw new Error('Method not implemented.');
  }

  addNote(){
    this.router.navigate(['../../admin/noteList'], { relativeTo: this.route });
  }

}
