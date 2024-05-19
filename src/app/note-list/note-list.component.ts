import { Component, OnInit } from '@angular/core';
import { EvernoteService } from '../shared/evernote.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NoteComponent } from '../note/note.component';
import { AuthenticationService } from '../shared/authentication.service';
import { User } from '../shared/user';
import { Observable } from 'rxjs';
import { literal } from '@angular/compiler';

@Component({
  selector: 'bs-note-list',
  standalone: true,
  imports: [RouterLink, NoteComponent],
  templateUrl: './note-list.component.html'
})
export class NoteListComponent implements OnInit {
  noteLists: any[] = [];
  user: User | undefined;
  users: User[] = [];
  userSelectionMap: Map<number, string> = new Map<number, string>();
  userRemoveSelectionMap: Map<number, string> = new Map<number, string>();

  constructor(
    private evernoteService: EvernoteService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadNoteLists();
    this.evernoteService.getUsers().subscribe(res => {
      this.users = res;
    });

  }

  loadNoteLists(): void {
    this.auth.me().subscribe(res => {
      this.user = res;
      this.evernoteService.getNoteListsByUserId(this.user.id).subscribe(
        (response: any) => {
          this.noteLists = response;
        },
        (error: any) => {
          console.error('Fehler beim Laden der Notizlisten:', error);
        }
      );
    });
  }

  addList(): void {
    this.router.navigate(['../admin/noteList'], { relativeTo: this.route });
  }

  editList(listId: any): void {
    this.router.navigate(['../admin/noteList', listId], { relativeTo: this.route });
  }

  deleteNoteList(noteListId: number): void {
    this.evernoteService.deleteNoteList(noteListId).subscribe(
      (response: any) => {
        this.loadNoteLists();
      },
      (error: any) => {
        console.error('Fehler beim Löschen der Notizliste:', error);
      }
    );
  }

  shareList(listId: number): void {
    const selectedUserId = this.userSelectionMap.get(listId);
    if (selectedUserId) {
      console.log(`Trying to share list with listId: ${listId} and userId: ${selectedUserId}`);
      this.shareNoteList(listId, +selectedUserId).subscribe(
        (response: any) => {
          console.log('Liste erfolgreich geteilt:', response);
        },
        (error: any) => {
          console.error('Fehler beim Teilen der Liste:', error);
        }
      );
    } else {
      console.error('Kein Benutzer für die Liste ausgewählt.');
    }
  }

  selectedUserToShare(event: Event, listId: number): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedUserId = selectElement.value;
    if (this.noteLists.find(noteList => noteList.id === listId) && this.users.find(user => user.id === +selectedUserId)) {
      this.userSelectionMap.set(listId, selectedUserId);
    } else {
      console.error('Ungültige Liste oder Benutzer ID.');
    }
  }

  shareNoteList(listId: number, userId: number): Observable<any> {
    return this.evernoteService.shareNoteList(listId, userId);
  }

  removeFromList(listId: number): void {
    const selectedUserId = this.userRemoveSelectionMap.get(listId);
    console.log(listId)
    if (selectedUserId) {
      this.evernoteService.declineSharedList(listId, Number(selectedUserId)).subscribe();
    } else {
      console.error('Kein Benutzer für die Liste ausgewählt.');
    }
  }

  selectedUserToRemove(event: Event, listId: number): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedUserId = selectElement.value;
    if (this.noteLists.find(noteList => noteList.id === listId) && this.users.find(user => user.id === +selectedUserId)) {
      this.userRemoveSelectionMap.set(listId, selectedUserId);
    } else {
      console.error('Ungültige Liste oder Benutzer ID.');
    }
  }
}
