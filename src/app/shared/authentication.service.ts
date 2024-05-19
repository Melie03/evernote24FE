import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { jwtDecode } from "jwt-decode";
import { Observable, catchError, retry, throwError } from 'rxjs';
import { User } from './user';
interface Token {
  exp: number;
  user: {
    id: string;
  };
}
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private api: string =
    'http://evernote.s2110456013.student.kwmhgb.at/api/auth';
  constructor(private http: HttpClient) { }
  login(email: string, password: string) {
    return this.http.post(`${this.api}/login`, {
      email: email,
      password: password
    });
  }
  public getCurrentUserId() {
    return Number.parseInt(<string>sessionStorage.getItem("userId"));
  }
  public setSessionStorage(token: string) {
    console.log("Storing token");
    console.log(jwtDecode(token));
    const decodedToken = jwtDecode(token) as Token;
    console.log(decodedToken);
    console.log(decodedToken.user.id);
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("userId", decodedToken.user.id);
  }
  logout() {
    this.http.post(`${this.api}/logout`, {});
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    console.log("logged out");
  }
  public isLoggedIn() {
    if (sessionStorage.getItem("token")) {
      let token: string = <string>sessionStorage.getItem("token");
      console.log(jwtDecode(token));
      const decodedToken = jwtDecode(token) as Token;
      let expirationDate: Date = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      if (expirationDate < new Date()) {
        console.log("token expired");
        sessionStorage.removeItem("token");
        return false;
      }
      return true;
    } else {
      return false;
    }
  }
  isLoggedOut() {
    return !this.isLoggedIn();
  }

  me():Observable<User>{
    return this.http.get<User>(`${this.api}/me`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }
  private errorHandler(error:Error | any):Observable<any>{
    return throwError(error);
  }
}
