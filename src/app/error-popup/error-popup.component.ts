import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrl: './error-popup.component.scss'
})
export class ErrorPopupComponent implements OnInit {
  @Input() error: string;
  @Input() success: string;
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // this.authService.onError.subscribe(error => {
    //   console.log(error);
    //   this.error = error;
    // });
    // console.log(this.error);
  }
  onClose() {
    this.close.emit(false);
  }
}