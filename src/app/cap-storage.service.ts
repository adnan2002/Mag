import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class CapStorageService {

  private storageSub = new BehaviorSubject<string>('');

  watchStorage():Observable<any>{
    return this.storageSub.asObservable();
  }

  async setItem(key:string, data:any){
    await Preferences.set({
      key: key,
      value: JSON.stringify(data)
    });
    this.storageSub.next('changed');

  }


  constructor() { }
}
