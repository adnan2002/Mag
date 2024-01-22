import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, Subject, from, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartUpdate: Subject<void> = new Subject<void>();

  constructor(private storage: Storage) { 
    this.init();

  }

  getCartItemCount(): Observable<number> {
    return this.cartUpdate.pipe(
      switchMap(() => this.calculateCartItemCount())
    );
  }

  calculateCartItemCount(): Observable<number> {
    return from(this.storage.keys()).pipe(
      switchMap((keys: string[]) => {
        return forkJoin(
          keys.map(key => this.storage.get(key))
        );
      }),
      map((values: any[]) => {
        let count = 0;
        for (let value of values) {
          if (Array.isArray(value)) {
            count += value.length;
          } else {
            count += 1;
          }
        }
        return count;
      })
    );
  }

  async init(){
    await this.storage.create();
    this.cartUpdate.next();
  }

  initializeCart() {
    this.cartUpdate.next();
  }
}
