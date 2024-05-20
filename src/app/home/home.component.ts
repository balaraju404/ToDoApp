import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopUpService } from '../pop-up/pop-up.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  token = localStorage.getItem('token') || null;
  private user;
  private loggedInRecently = false;

  constructor(private router: Router, private popUpService: PopUpService, private authService: AuthService) { }

  ngOnInit(): void {
    if (!this.token) {
      this.router.navigate(['/auth']);
      return;
    }
    if (this.authService.isLoggedInRecently()) {
      this.user = this.authService.getUser();
      this.popUpService.successMsg.next(`Login Successfull!, Welcome ${this.user.user.name}`)
      this.authService.resetLoginStatus()
    }
  }
}
