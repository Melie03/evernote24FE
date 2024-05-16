import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NoteListComponent } from './note-list/note-list.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'bs-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'evernote24';
  myValue: string = '';

}
