import { Component, Input, OnInit } from '@angular/core';
import { EvernoteService } from '../shared/evernote.service';
import { Note, Tag } from '../shared/note';
import { Todo } from '../shared/todo';
import { NoteLists } from '../shared/note-lists';
import { ActivatedRoute, Router } from '@angular/router';
import { concat } from 'rxjs';
import { NoteTag } from '../shared/noteTag';
import { NoteTagFactory } from '../shared/noteTag-factory';

@Component({
  selector: 'bs-note',
  standalone: true,
  imports: [],
  templateUrl: './note.component.html',
  styles: ``
})
export class NoteComponent implements OnInit {
  notes: NoteTag[] = [];
  todos: Todo[] = [];
  id: number = 0;

  constructor(
    private es: EvernoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.id = params['listId'];
      this.loadNote();
    });

  }

  loadNote(): void {
    this.es.getNotesByListId(this.id).subscribe(
      (response: any) => {
        let notesRaw = response;
        for (let note of notesRaw) {
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
              let currentNote = NoteTagFactory.fromObject(note);
              currentNote.tags = tagResponse;
              this.notes.push(currentNote);
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
    this.router.navigate(['../../admin/' + this.id + '/note', noteId], { relativeTo: this.route });
  }
  addNote(){
    this.router.navigate(['../../admin/' + this.id + '/note'], { relativeTo: this.route });
  }
}
