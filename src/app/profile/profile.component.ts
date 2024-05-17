import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  token: any;
  isLoading: boolean = false;
  errorStatus: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.token = this.authService.getToken();
    if (!this.token) {
      this.router.navigate(['/auth']);
    }
  }

  onLogout() {
    this.isLoading = true;
    this.errorStatus = null; // Clear error status
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        this.errorStatus = 'Failed to logout'; // Update error status
        console.error('Logout error:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onLogoutAll() {
    this.isLoading = true;
    this.errorStatus = null; // Clear error status
    this.authService.logoutAll().subscribe({
      next: () => {
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        this.errorStatus = 'Failed to logout from all devices'; // Update error status
        console.error('Logout all error:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onUpdate() {
    this.router.navigate(['/update']);
  }

  onDelete() {
    this.isLoading = true;
    this.errorStatus = null; // Clear error status
    this.authService.deleteUser().subscribe({
      next: () => {
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        this.errorStatus = 'Failed to delete user'; // Update error status
        console.error('Delete user error:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
