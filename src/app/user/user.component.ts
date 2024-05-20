
import { Component, OnInit } from '@angular/core';
import { NoteLists, User } from '../shared/user';
import { EvernoteService } from '../shared/evernote.service'; // Import your service
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);
@Component({
  selector: 'bs-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styles: [`:host { display: block; padding: 20px; }`]
})
export class UserComponent implements OnInit {

  user: User = new User (0, '','','','',new Date, new Date,'',[]);
  pendingLists: NoteLists [] = [];

  constructor(
    private es: EvernoteService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.auth.me().subscribe({
      next: (user: User) => {
        this.user = user;
        this.getPendingLists();
      },
      error: (error: any) => {
        console.error('Error loading user:', error);
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  getPendingLists(){
    this.es.getAllPendingLists(this.user.id).subscribe(res =>{
      this.pendingLists = res;
    })
  }
  acceptList(listId: number){
    this.es.acceptSharedList(listId, this.user.id).subscribe(res =>{
      this.getPendingLists();
    })
  }

  declineList(listId: number){
    this.es.declineSharedList(listId, this.user.id).subscribe(res =>{
      this.getPendingLists();
    })
  }
}
