import { Component, Input, OnInit } from '@angular/core';
import { EvernoteService } from '../shared/evernote.service';
import { Note, Tag } from '../shared/note';
import { Todo } from '../shared/todo';
import { NoteLists } from '../shared/note-lists';
import { ActivatedRoute, Router } from '@angular/router';
import { concat } from 'rxjs';

@Component({
  selector: 'bs-note',
  standalone: true,
  imports: [],
  templateUrl: './note.component.html',
  styles: ``
})
export class NoteComponent implements OnInit {
  notes: Note[] = [];
  todos: Todo[] = [];
  id: number = 0;
  tags: Tag[] = [];
  noteTags: Tag [] = [];

  constructor(
    private es: EvernoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const noteId = this.route.snapshot.params['noteId'];
    this.route.params.subscribe(params => {
      this.id = params['listId'];
      this.es.getTagsByNoteId(noteId).subscribe((tags: any) => {
        this.noteTags = tags;
        this.loadNote();
      });
      this.loadNote();
    });

  }

  loadNote(): void {
    this.es.getNotesByListId(this.id).subscribe(
      (response: any) => {
        this.notes = response;
        for (let note of this.notes) {
          this.es.getTodosByNoteId(note.id).subscribe(
            (todoResponse: any) => {
              this.todos = this.todos.concat(todoResponse);
            },
            (error: any) => {
              console.error('Fehler beim Laden der Todos:', error);
            }
          );


          this.es.getTagsByNoteId(note.id).subscribe(
            (tagResponse: any) => {
              this.noteTags = this.noteTags.concat(tagResponse);
              console.log(this.noteTags)
            },
            (error: any) => {
              console.error('Fehler beim Laden der Tags:', error);
            }
          );
        }
        console.log(response);
      },
      (error: any) => {
        console.error('Fehler beim Laden der Notizlisten:', error);
      }
    );
  }


  deleteNote(noteId: number): void {
    this.es.deleteNote(noteId).subscribe(
      (response: any) => {
        this.loadNote();
        console.log(response);
      },
      (error: any) => {
        console.error('Fehler beim Löschen der Notiz:', error);
      }
    );
  }
  editNote(noteId: number): void {
    this.router.navigate(['../../admin/note', noteId], { relativeTo: this.route });
  }
  addNote(){
    this.router.navigate(['../../admin/note'], { relativeTo: this.route });
  }
}
