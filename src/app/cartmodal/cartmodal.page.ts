import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-cartmodal',
  templateUrl: './cartmodal.page.html',
  styleUrls: ['./cartmodal.page.scss'],
})
export class CartmodalPage implements OnInit {

  products$ = new BehaviorSubject<any[]>([]);

  constructor(private nav:NavController,private loadingController: LoadingController,private modalController: ModalController, private storage:Storage, private firebase:FirebaseService) { }

  async ngOnInit() {
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
      console.log(product)
      if (Array.isArray(val)) {
        for (let item of val) {
          let variant = product.variants.find((variant:any) => variant.name === item.variant);
          let productDetails = {
            id: product.id,
            image: product.images[variant.index],
            new_price: variant.new_price,
            old_price: variant.old_price,
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

  dismissModal(){
    this.modalController.dismiss();
  }

  async deleteProduct(id:string, variant?:string){
    let val = await this.storage.get(id);
    if (Array.isArray(val)) {
        // If the value is an array, find the index of the variant to be deleted
        let index = val.findIndex((item:any) => item.variant === variant);
        if (index !== -1) {
            // If the variant is found, remove it from the array
            val.splice(index, 1);
            if (val.length > 0) {
                // If there are still variants left, update the storage
                await this.storage.set(id, val);
            } else {
                // If no variants are left, remove the key from the storage
                await this.storage.remove(id);
            }
        }
    } else {
        // If the value is not an array, simply remove the key from the storage
        await this.storage.remove(id);
    }
    // Refresh the products
    this.ngOnInit();
}

goTo(id:String){
  this.dismissModal();
  this.nav.navigateForward('/tabs/home/product-detail/'+id);

}




}
