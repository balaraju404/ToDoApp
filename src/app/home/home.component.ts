import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  token = localStorage.getItem('token') || null;
  constructor(private router: Router) { }

  ngOnInit(): void {
    if (!this.token) {
      this.router.navigate(['/auth']);
    }
  }
}
