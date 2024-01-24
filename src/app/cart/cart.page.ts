import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { FirebaseService } from '../firebase.service';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  products$ = new BehaviorSubject<any[]>([]);
  productsArr:any;
  disabled = false;

  constructor(private cartService:CartService, private firebase:FirebaseService, private storage:Storage) {
    
   }

   removeBracketsAndContent(input: string): string {
    return input.replace(/\[.*?\]/g, '');
}


  

  async ngOnInit() {
    
     this.cartService.refreshCart();
     this.cartService.initializeCart();
    this.products$ = this.cartService.products$;
    this.products$.subscribe((products:any) => {
      this.productsArr = products;
    })

    


  
  }

  async add(id:string, variantName?:string){
    let product = this.productsArr.find((val:any)=> val.id === id && val.variant === variantName);
    console.log(product)
    if(!product.variant){
      let new_quant = product.quantity + 1;
      if(new_quant <= product.inventory){
        product.quantity++;
        await this.storage.set(id, new_quant);
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
        }
      }
      if(product.quantity === product.variant_inventory){
        product.disabled = true;
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
    }else{
      product.disabled = false;
      await this.storage.remove(id);
      await this.ngOnInit();
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
      }else{
        localPros.splice(variantIndex, 1);
        if(localPros.length > 0){
          await this.storage.set(id, localPros);
        }else{
          await this.storage.remove(id);
        }
         this.ngOnInit();
      }
    }
  }


}



  

}
