import { Component, OnInit } from '@angular/core';
import { EvernoteService } from '../shared/evernote.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NoteComponent } from '../note/note.component';

@Component({
  selector: 'bs-note-list',
  standalone: true,
  imports: [RouterLink , NoteComponent],
  templateUrl: './note-list.component.html'
})
 export class NoteListComponent implements OnInit {
    noteLists: any[] = [];

    constructor(private evernoteService: EvernoteService,
      private route: ActivatedRoute,
      private router: Router
    ) { }

    ngOnInit(): void {
      this.loadNoteLists();
    }

    loadNoteLists(): void {
      this.evernoteService.getNoteListsByUserId(1).subscribe(
        (response: any) => {
          this.noteLists = response;
          console.log(response)
        },
        (error: any) => {
          console.error('Fehler beim Laden der Notizlisten:', error);
        }
      );
    }
    addList(){
      this.router.navigate(['../admin/noteList'], { relativeTo: this.route });
    }
    editList(listId: any){
      this.router.navigate(['../admin/noteList', listId], { relativeTo: this.route });
    }
    deleteNoteList(noteListId: number){
      this.evernoteService.deleteNoteList(noteListId).subscribe(
        (response: any) => {
          this.loadNoteLists();
        },
        (error: any) => {
          console.error('Fehler beim Löschen der Notizliste:', error);
        }
      );
    }
}
