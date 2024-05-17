import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  token = localStorage.getItem('token') || null;

  constructor(private authservice: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authservice.tokenSubject.subscribe((token) => {
      this.token = token;
    })
  }
}
