import { Routes } from '@angular/router';
import {NoteComponent,} from "./note/note.component";
import {NoteListComponent} from "./note-list/note-list.component";
import { TodoComponent } from './todo/todo.component';
import { UserComponent } from './user/user.component';
import { NoteFormComponent } from './note-form/note-form.component';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { NoteListFormComponent } from './note-list-form/note-list-form.component';
import { LoginComponent } from './login/login.component';
import { canSeeOwnContentGuard } from './can-see-own-content.guard';

export const routes: Routes = [
{ path: '', redirectTo: 'noteLists', pathMatch: 'full' },
{ path: 'noteLists', component: NoteListComponent, canActivate:[canSeeOwnContentGuard]},
{ path: 'noteLists/:listId', component: NoteComponent , canActivate:[canSeeOwnContentGuard]},
{ path: 'todos', component: TodoComponent, canActivate:[canSeeOwnContentGuard] },
{ path: 'user', component: UserComponent, canActivate:[canSeeOwnContentGuard]},
{path:'admin/:noteListId/note/:noteId', component: NoteFormComponent, canActivate:[canSeeOwnContentGuard]},
{path:'admin/:noteListId/note', component: NoteFormComponent, canActivate:[canSeeOwnContentGuard]},
{path:'admin/todo/:todoId', component: TodoFormComponent, canActivate:[canSeeOwnContentGuard]},
{path:'admin/todo', component: TodoFormComponent, canActivate:[canSeeOwnContentGuard]},
{path:'admin/noteList/:noteListId', component: NoteListFormComponent, canActivate:[canSeeOwnContentGuard]},
{path:'admin/noteList', component: NoteListFormComponent, canActivate:[canSeeOwnContentGuard]},
{path:'login', component: LoginComponent}
];
