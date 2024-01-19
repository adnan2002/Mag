import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import {Swiper} from 'swiper';

import { FirebaseService } from '../firebase.service';

import {pipe, filter ,map, BehaviorSubject, Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  products$: Observable<any>;
  copyProducts$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  copyCount = 0;

  //temp
  collectionsArr:any = [];

  async ngOnInit() {
    this.collectionsArr = await this.firestore.getUniqueCollections();
    this.collectionsArr = this.collectionsArr.filter((item:any) => item.name !== 'sale' && item.name !== 'magnolia picks' && item.name !== 'shine from the inside out' );
  
    // Add 'All', 'sale', and 'magnolia picks' at the beginning of the array
    this.collectionsArr.unshift({name: 'All'}, {name: 'sale'}, {name: 'magnolia picks'});

  
    this.selectedCollection = this.collectionsArr[0].name;

}

capitalizeName(name: string): string {
  return name.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
  
  
  images = [
    "https://i-magnolia.com/cdn/shop/products/PHOTO-2021-01-07-09-08-12_1024x1024@2x.jpg?v=1624815992",
    "https://i-magnolia.com/cdn/shop/files/trop_1024x1024@2x.webp?v=1700254989",
    "https://i-magnolia.com/cdn/shop/files/cool1_1024x1024@2x.jpg?v=1701528552"
  ]
  // collections = ["All","Magnolia Picks", 'Skin Care', 'Make Up', 'Miniset', 'Tools', '$10 or Less']
  selectedCollection: string = "All";

  selectCollection(collection: string) {
    this.selectedCollection = collection;
  
    this.products$.subscribe((products: any[]) => {
      let filteredProducts;
  
      if (collection === 'All') {
        // If the selected collection is 'All', set copyProducts$ to all products
        filteredProducts = products;
      } else {
        // If the selected collection is not 'All', filter the products based on the selected collection
        filteredProducts = products.filter((product:any) => product.collections.includes(collection));
      }
  
      this.copyProducts$.next(filteredProducts);
      this.copyCount = filteredProducts.length;
    });
  }
  




  sort(){

  }

  filter(){
    
  }

  



  constructor(private firestore: FirebaseService) {

    this.products$ = this.firestore.getProducts().pipe(shareReplay(1));

    this.products$.subscribe((products:any) =>{
      this.copyProducts$.next(products);
      this.copyCount = products.length;
    });
  }



  }


