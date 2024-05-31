// Import statements
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { PopUpService } from '../pop-up/pop-up.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // Properties
  token: any;
  user: any;
  image: string;
  isLoading = false;
  errorStatus: string | null = null;
  editMode = false;
  passwordChangeMode = false;

  private imageData;

  // Constructor
  constructor(
    private authService: AuthService,
    private router: Router,
    private popUpService: PopUpService
  ) { }

  // Lifecycle hook
  ngOnInit(): void {
    this.initProfile();
  }

  // Methods
  private initProfile(): void {
    this.isLoading = true;
    this.token = this.authService.getToken();
    if (!this.token) {
      this.router.navigate(['/auth']);
      return;
    }
    this.authService.getUser().subscribe(
      (res) => {
        this.user = res;
        this.isLoading = false;
        this.getProfile();
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  onCloseDialogBox() {
    this.editMode = false;
  }

  onClose(): void {
    this.errorStatus = null;
  }

  onEdit(): void {
    this.editMode = true;
  }

  onUpdate(): void {
    this.editMode = false;
  }

  onChangePassword(): void {
    this.passwordChangeMode = !this.passwordChangeMode;
  }

  onUpdatePassword(form: NgForm): void {
    const { password, password2 } = form.value;
    if (!form.valid) {
      this.errorStatus = 'Fill all fields';
      return;
    }
    if (password !== password2) {
      this.errorStatus = 'Passwords do not match';
      return;
    }

    if (!confirm('Are you sure you want to update your password?')) {
      return;
    }

    const user = { password: password };
    this.authService.updateUser(user).subscribe(
      () => {
        this.popUpService.successMsg.next('Password updated successfully');
        this.passwordChangeMode = false;
      },
      (error) => {
        console.log(error);
        this.errorStatus = error.error.message;
      }
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const formData: FormData = new FormData();
    formData.append('avatar', file, file.name);

    this.imageData = formData
  }

  uploadProfile() {
    if (!this.imageData) {
      this.errorStatus = 'Upload a Image';
      return;
    }
    if(!confirm('Do you want to Change Avatar ?')){
      return;
    }

    this.isLoading = true;
    this.errorStatus = null;
    this.authService.uploadAvatar(this.imageData).subscribe(
      () => {
        this.isLoading = false;
        this.popUpService.successMsg.next('Avatar uploaded');
        this.imageData = null;
        this.getProfile();
      },
      (error) => {
        console.log('Avatar upload error:', error);
        this.isLoading = false;
        this.errorStatus = error.error.error;
      }
    );
  }

  getProfile(): void {
    this.isLoading = true;
    const id = this.user._id;
    this.authService.getAvatar(id).subscribe(
      (res: any) => {
        this.image = 'data:image/jpg;base64,' + res;
        this.isLoading = false;
      },
      (error) => {
        console.error('Get avatar error:', error);
        this.isLoading = false;
        this.errorStatus = 'Failed load Avatar';
      }
    );
  }

  onLogout(): void {
    if (!confirm('Are you sure you want to logout?')) {
      return;
    }

    this.authService.logout().subscribe(
      () => {
        this.router.navigate(['/auth']);
        this.popUpService.successMsg.next('User Logouted!');
      },
      (error) => {
        console.error('Logout error:', error);
        this.errorStatus = 'Failed to logout';
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onLogoutAll(): void {
    if (!confirm('Are you sure you want to logout all sessions?')) {
      return;
    }

    this.authService.logoutAll().subscribe(
      () => {
        this.router.navigate(['/auth']);
        this.popUpService.successMsg.next('All Active Sessions Logouted!');
      },
      (error) => {
        console.error('Logout all error:', error);
        this.errorStatus = 'Failed to logout from all devices';
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onDelete(): void {
    if (!confirm('Are you sure you want to delete permanently?')) {
      return;
    }

    this.authService.deleteUser().subscribe(
      () => {
        this.router.navigate(['/auth']);
        this.popUpService.successMsg.next('User Deleted!');
      },
      (error) => {
        console.error('Delete user error:', error);
        this.errorStatus = 'Failed to delete user';
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
