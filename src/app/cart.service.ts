import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, Subject, from, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartUpdate: Subject<void> = new Subject<void>();

  products$ = new BehaviorSubject<any[]>([]);


  async refreshCart(){
    const loading = await this.loadingController.create({
      spinner: 'dots',
    });
    loading.present();
    await this.storage.create();
    let keys = await this.storage.keys();
    let products = [];
    for (let key of keys) {
      let val = await this.storage.get(key);
      let product = await this.firebase.getProductById(key);
      if (Array.isArray(val)) {
        for (let item of val) {
          let variant = product.variants.find((variant:any) => variant.name === item.variant);
          let productDetails = {
            id: product.id,
            image: product.images[variant.index],
            new_price: variant.new_price,
            old_price: variant.old_price,
            variant_inventory: variant.inventory,
            vendor: product.vendor,
            title: product.title,
            quantity: item.quantity,
            variant: item.variant
          };
          products.push(productDetails);
        }
      } else {
        let productDetails = {
          id: product.id,
          image: product.images[0],
          new_price: product.new_price,
          vendor: product.vendor,
          inventory: product.inventory,
          old_price: product.old_price,
          title: product.title,
          quantity: val
        };
        products.push(productDetails);
      }
    }
    this.products$.next(products);

    await loading.dismiss();

  }

  constructor(private storage: Storage, private loadingController:LoadingController, private firebase:FirebaseService) { 
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
