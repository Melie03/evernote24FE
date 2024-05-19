import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvernoteService {
  private baseUrl = 'http://evernote.s2110456013.student.kwmhgb.at/api';

  constructor(private http: HttpClient) { }

  // NoteLists Endpoints
  getNoteLists(): Observable<any> {
    return this.http.get(`${this.baseUrl}/noteLists`);
  }

  getNoteListById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/noteLists/${id}`);
  }

  getNoteListsByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/noteLists/user/${userId}`);
  }

  getNotesByListId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/noteLists/${id}/notes`);
  }

  createNoteList(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/noteLists`, data);
  }

  updateNoteList(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/noteLists/${id}`, data);
  }

  shareNoteList(listId: number, userId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/noteLists/${listId}/share/${userId}`, null);
  }

  acceptSharedList(listId: number, userId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/noteLists/${listId}/share/${userId}/accept`, null);
  }

  declineSharedList(listId: number, userId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/noteLists/${listId}/share/${userId}/decline`, null);
  }

  deleteNoteList(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/noteLists/${id}`);
  }

  getSharedListsByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/noteLists/shared/${userId}`);
  }

  getAllPendingLists(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/noteLists/shared/${userId}/pending`);
  }

  getUsersWhoShareLists(listId:number):Observable <any>{
    return this.http.get(`${this.baseUrl}/noteLists/${listId}/shared`)
  }

  // Notes Endpoints
  getNotes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/notes`);
  }

  getNoteById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/notes/${id}`);
  }

  getTodosByNoteId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/notes/${id}/todos`);
  }

  getTagsByNoteId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/notes/${id}/tags`);
  }

  createNote(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/notes`, data);
  }

  updateNote(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/notes/${id}`, data);
  }

  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/notes/${id}`);
  }


  // Todos Endpoints
  getTodos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/todos`);
  }

  getTodoById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/todos/${id}`);
  }

  createTodo(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/todos`, data);
  }

  updateTodo(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/todos/${id}`, data);
  }

  deleteTodo(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/todos/${id}`);
  }

  getTodosWithoutNote(): Observable<any> {
    return this.http.get(`${this.baseUrl}/todosw`);
  }
  getTagsByTodoId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/todos/${id}/tags`);
  }
  // Tags Endpoints
  getTags(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tags`);
  }

  getTagById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/tags/${id}`);
  }

  createTag(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tags`, data);
  }

  updateTag(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/tags/${id}`, data);
  }

  deleteTag(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tags/${id}`);
  }

  // Users Endpoints
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${id}`);
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, data);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }
}
