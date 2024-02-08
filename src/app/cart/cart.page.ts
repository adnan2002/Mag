import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { FirebaseService } from '../firebase.service';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../cart.service';
import { ChangeDetectorRef } from '@angular/core';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  products$ = new BehaviorSubject<any[]>([]);
  productsArr:any;
  disabled = false;
  delivery:any;
  constructor(private nav:NavController,private cdr:ChangeDetectorRef,private cartService:CartService, private firebase:FirebaseService, private storage:Storage) {
    this.getDelivery();
   }

   removeBracketsAndContent(input: string): string {
    return input.replace(/\[.*?\]\s*-?/g, '');
}


async getDelivery(){
  this.delivery = await this.firebase.getDeliveryCharge();
}
getTotalPrice(): Observable<any> {
  return this.products$.pipe(
    map((products:any) => {
      const total = products.reduce((acc:number, product:any) => acc + (product.quantity * product.new_price), 0);
      return { total };
    })
  );
}


// getTotalPriceWithDelivery(): Observable<any> {
//   return this.products$.pipe(
//     map((products:any) => {
//       const total = products.reduce((acc:number, product:any) => acc + (product.quantity * product.new_price), 0);
//       const delivery:any = total >= this.delivery?.threshold ? 'Delivery Charge: Free Delivery' : `Delivery Charge: BHD ${this.delivery?.charge}`;
//       const grandTotal:any = total >= this.delivery?.threshold ? total : total + this.delivery?.charge;
//       return { delivery, grandTotal };
//     })
//   );
// }



  

  async ngOnInit() {
    
     this.cartService.refreshCart();
     this.cartService.initializeCart();
    this.products$ = this.cartService.products$;
    this.products$.subscribe((products:any) => {
      this.productsArr = products;
    })

  }

  async goToCheckout(){
    // const total = this.productsArr.reduce((acc: number, product: any) => acc + (product.quantity * product.new_price), 0);
    this.nav.navigateForward(`checkout`)
  }


// async clearCart(){
//     await this.storage.clear();
//     // this.cartService.initializeCart(); 
//     // this.cartService.cartItemCount.next(0);
//     this.ngOnInit();  // Reset the cart count
//      // Recalculate the cart item count
// }

async add(id:string, variantName?:string){
  let product = this.productsArr.find((val:any)=> val.id === id && val.variant === variantName);
  console.log(product)
  if(!product.variant){
    let new_quant = product.quantity + 1;
    if(new_quant <= product.inventory){
      product.quantity++;
      await this.storage.set(id, new_quant);
      this.cartService.cartItemCount.next(this.cartService.cartItemCount.value + 1);
    }else{
      product.disabled = true;
    }
    if(product.quantity === product.inventory){
      product.disabled = true;
    }
  }else if(product.variant){
    let localPros = await this.storage.get(product.id);
    let variantIndex = localPros.findIndex((val:any)=> val.variant === variantName);
    if(variantIndex !== -1){
      let variant = localPros[variantIndex];
      let new_quant = variant.quantity + 1;
      if(new_quant <= product.variant_inventory){
        variant.quantity++;
        product.quantity = variant.quantity;
        variant.disabled = new_quant > product.variant_inventory;
        await this.storage.set(id, localPros);
        this.cartService.cartItemCount.next(this.cartService.cartItemCount.value + 1);
      }
    }
    if(product.quantity === product.variant_inventory){
      product.disabled = true;
    }
  }
}

async delete(id:string, variantName?:string){
  let product = this.productsArr.find((val:any)=> val.id === id && val.variant === variantName);
  if(!product.variant){
    // Remove the product from storage
    await this.storage.remove(id);
    // Remove the product from productsArr
    this.productsArr = this.productsArr.filter((val:any) => val.id !== id);
    await this.ngOnInit();
  }else if(product.variant){
    let localPros = await this.storage.get(product.id);
    let variantIndex = localPros.findIndex((val:any)=> val.variant === variantName);
    if(variantIndex !== -1){
      // Remove the variant from localPros
      localPros.splice(variantIndex, 1);
      if(localPros.length > 0){
        // If there are other variants, update the storage
        await this.storage.set(id, localPros);
      }else{
        // If no more variants, remove the product from storage
        await this.storage.remove(id);
      }
      await this.ngOnInit();
    }
  }
}








async minus(id:string, variantName?:string){
  let product = this.productsArr.find((val:any)=> val.id === id && val.variant === variantName);
  if(!product.variant){
    let new_quant = product.quantity - 1;
    if(new_quant > 0){
      product.quantity--;
      await this.storage.set(id, new_quant);
      this.cartService.cartItemCount.next(this.cartService.cartItemCount.value - 1);
    }else{
      product.disabled = false;
      await this.storage.remove(id);
      await this.ngOnInit();
    }
    // Add this line to re-enable the add button
    if(new_quant < product.inventory){
      product.disabled = false;
    }
  }else if(product.variant){
    let localPros = await this.storage.get(product.id);
    let variantIndex = localPros.findIndex((val:any)=> val.variant === variantName);
    if(variantIndex !== -1){
      let variant = localPros[variantIndex];
      let new_quant = variant.quantity - 1;
      if(new_quant > 0){
        variant.quantity--;
        product.quantity = variant.quantity;
        await this.storage.set(id, localPros);
        this.cartService.cartItemCount.next(this.cartService.cartItemCount.value - 1);
      }else{
        localPros.splice(variantIndex, 1);
        if(localPros.length > 0){
          await this.storage.set(id, localPros);
        }else{
          await this.storage.remove(id);
        }
        this.cartService.cartItemCount.next(this.cartService.cartItemCount.value - 1);
         this.ngOnInit();
      }
      // Add this line to re-enable the add button
      if(new_quant < product.variant_inventory){
        product.disabled = false;
      }
    }
  }
}



  

}
