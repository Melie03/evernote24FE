import { Component, Input, LOCALE_ID, OnInit } from '@angular/core';
import { EvernoteService } from '../shared/evernote.service';
import { Note, Tag } from '../shared/note';
import { Todo } from '../shared/todo';
import { NoteLists } from '../shared/note-lists';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteTag } from '../shared/noteTag';
import { NoteTagFactory } from '../shared/noteTag-factory';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);
@Component({
  selector: 'bs-note',
  standalone: true,
  imports: [
    CommonModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
  templateUrl: './note.component.html',
  styles: ``
})
export class NoteComponent implements OnInit {

  notes: NoteTag[] = [];
  todos: Todo[] = [];
  id: number = 0;
  tags: Tag[] = [];
  selectedTagName: string = '';
  allNotes: NoteTag[] = [];

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
      this.es.getTags().subscribe(res => {
        this.tags = res;
        console.log(this.tags);
      });
    });
  }

  /**
   * Lädt die Notizen und deren zugehörige Todos und Tags basierend auf der List-ID.
   * Verarbeitet die Antworten und aktualisiert die lokale Notiz- und Todo-Liste.
   */
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
              this.allNotes.push(currentNote);
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
    // Löscht eine Notiz und lädt danach die Notizliste neu
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

  addNote() {
    this.router.navigate(['../../admin/' + this.id + '/note'], { relativeTo: this.route });
  }

  filter() {
    // Filtert die Notizen basierend auf dem ausgewählten Tag
    if (this.selectedTagName === '') {
      this.notes = this.allNotes;
      return;
    }
    this.notes = this.allNotes.filter(note => note.tags.some(tag => tag.name === this.selectedTagName));
  }

  selectedTagFilter(event: Event) {
    // Aktualisiert den Filter-Tag basierend auf der Auswahl aus einem Dropdown-Menü
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement.value == '') {
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
