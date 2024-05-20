import { Component, OnInit, OnDestroy } from '@angular/core';
import { PopUpService } from './pop-up.service';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent implements OnInit, OnDestroy {
  error: string | null = null;
  success: string | null = null;
  sec: number = 3;
  timeOutID: any;

  constructor(private popUpService: PopUpService) { }

  ngOnInit() {
    this.popUpService.errorMsg.subscribe((error) => {
      clearTimeout(this.timeOutID)
      this.success = null;
      this.error = error;
    });
    this.popUpService.successMsg.subscribe((success) => {
      clearTimeout(this.timeOutID)
      this.error = null;
      this.success = success;
      this.startCountDown();
    });
  }

  startCountDown() {
    clearTimeout(this.timeOutID);
    this.timeOutID = setTimeout(() => {
      this.hide();
    }, this.sec * 1000);
  }

  hide() {
    clearTimeout(this.timeOutID)
    this.error = null;
    this.success = null;
  }

  ngOnDestroy() {
    clearTimeout(this.timeOutID);
    this.popUpService.errorMsg.next(null);
    this.popUpService.successMsg.next(null);
  }
}
