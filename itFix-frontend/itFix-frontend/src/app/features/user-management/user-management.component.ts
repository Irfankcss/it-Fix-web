import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {AdminUser} from '../../interfaces/adminUser';
import {DatePipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-user-management',
  imports: [
    NgForOf,
    DatePipe
  ],
  standalone: true,
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})

export class UserManagementComponent implements OnInit {
  users: AdminUser[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  deleteUser(userId: string) {
    if (confirm('Jeste li sigurni da želite obrisati ovog korisnika?')) {
      this.authService.deleteUser(userId).subscribe(() => {
        this.users = this.users.filter(user => user.id !== userId);
      });
    }
  }
}
