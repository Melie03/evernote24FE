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
      private activatedRoute: ActivatedRoute,
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

}
