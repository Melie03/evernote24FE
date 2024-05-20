import { Component } from '@angular/core';
import { EvernoteService } from '../shared/evernote.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoteListFactory } from '../shared/note-list-factory';
import { Tag } from '../shared/tag';
import { min } from 'rxjs';
import { NoteListFormErrorMessages } from './note-list-error-message';
import { AuthenticationService } from '../shared/authentication.service';
import { User } from '../shared/user';

@Component({
  selector: 'bs-note-list-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './note-list-form.component.html',
  styles: ``
})
export class NoteListFormComponent {
  noteListForm: FormGroup;
  noteList = NoteListFactory.empty();
  isUpdatingNoteList = false;
  errors: { [key: string]: string } = {};
  user: User | undefined;

  constructor(
    private fb: FormBuilder,
    private es: EvernoteService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService
  ) {
    this.noteListForm = this.fb.group({});
  }


  ngOnInit() {
    const noteListId = this.route.snapshot.params['noteListId'];
    if (noteListId) {
      this.isUpdatingNoteList = true;
      this.es.getNoteListById(noteListId).subscribe((list: any) => {
        this.noteList = list;
        this.auth.me().subscribe(res => {
          this.user = res;
          console.log(this.user);
          this.initNoteList();
        });
      });
    } else {
      this.auth.me().subscribe(res => {
        this.user = res;
        console.log(this.user);
        this.initNoteList();
      });
    }
    this.initNoteList();
  }

  /**
   * Initialisiert das Notizlisten-Formular und setzt die Form-Controls.
   */
  initNoteList() {
    this.noteListForm = this.fb.group({
      id: [this.noteList.id, Validators.required],
      name: [this.noteList.name, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      user_id: [this.noteList.user_id, Validators.required],
      created_at: [{ value: this.noteList.created_at?.toString().split("T")[0], disabled: true }],
      updated_at: [{ value: this.noteList.updated_at?.toString().split("T")[0], disabled: true }]
    });
    this.noteListForm.statusChanges.subscribe(() =>
      this.updateErrorMessage()
    );
  }

  /**
   * Aktualisiert die Fehlermeldungen für das Formular basierend auf den aktuellen Validierungsfehlern.
   */
  updateErrorMessage(): void {
    this.errors = {};
    for (const message of NoteListFormErrorMessages) {
      const control = this.noteListForm.get(message.forControl);
      console.log(control);
      if (control &&
        control.dirty &&
        control.invalid &&
        control.errors &&
        control.errors[message.forValidator] &&
        !this.errors[message.forControl]) {
        this.errors[message.forControl] = message.text;
      }
    }
  }

  /**
   * Übermittelt das Formular, erstellt oder aktualisiert die Notizliste und navigiert zurück zur Notizlistenübersicht.
   */
  submitForm() {
    const noteList = NoteListFactory.fromObject(this.noteListForm.value);
    if (this.isUpdatingNoteList) {
      this.es.updateNoteList(noteList.id, noteList).subscribe(res => {
        this.router.navigate(["../../../noteLists"], { relativeTo: this.route });
      });
    } else {
      if (this.user) {
        noteList.user_id = this.user.id;
      }
      this.es.createNoteList(noteList).subscribe(res => {
        this.noteList = NoteListFactory.empty();
        console.log(noteList);
        this.noteListForm.reset(NoteListFactory.empty());
        this.router.navigate(["../../noteLists"], { relativeTo: this.route });
      });
    }
  }
}
