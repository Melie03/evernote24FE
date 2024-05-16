// user.component.ts
import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { EvernoteService } from '../shared/evernote.service'; // Import your service
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'bs-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styles: [`:host { display: block; padding: 20px; }`]
})
export class UserComponent implements OnInit {

  userId: number = 1;
  user: User | undefined;

  constructor(
    private es: EvernoteService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.es.getUserById(this.userId).subscribe({
      next: (user: User) => {
        this.user = user;
      },
      error: (error: any) => {
        console.error('Error loading user:', error);
      }
    });
  }

  logout(): void {
    console.log('Logout functionality to be implemented');
  }
}
