import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })

export class PopUpService {
    errorMsg = new BehaviorSubject<any>(null)
    successMsg = new BehaviorSubject<any>(null)
}