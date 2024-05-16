import { Routes } from '@angular/router';
import {NoteComponent,} from "./note/note.component";
import {NoteListComponent} from "./note-list/note-list.component";
import { TodoComponent } from './todo/todo.component';
import { UserComponent } from './user/user.component';
import { NoteFormComponent } from './note-form/note-form.component';
import { TodoFormComponent } from './todo-form/todo-form.component';

export const routes: Routes = [
{ path: '', redirectTo: 'noteLists', pathMatch: 'full' },
{ path: 'noteLists', component: NoteListComponent },
{ path: 'noteLists/:listId', component: NoteComponent },
{ path: 'todos', component: TodoComponent },
{ path: 'users', component: UserComponent},
{path:'admin/note/:noteId', component: NoteFormComponent},
{path:'admin/note', component: NoteFormComponent},
{path:'admin/todo/:todoId', component: TodoFormComponent},
{path:'admin/todo', component: TodoFormComponent},
{path:'admin/noteList/:noteListId', component: TodoFormComponent},
{path:'admin/noteList', component: TodoFormComponent}
];
