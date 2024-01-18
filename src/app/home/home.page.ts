import { Component, ViewChild, ElementRef } from '@angular/core';
import {Swiper} from 'swiper';

import { FirebaseService } from '../firebase.service';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  
  images = [
    "https://i-magnolia.com/cdn/shop/products/PHOTO-2021-01-07-09-08-12_1024x1024@2x.jpg?v=1624815992",
    "https://i-magnolia.com/cdn/shop/files/trop_1024x1024@2x.webp?v=1700254989",
    "https://i-magnolia.com/cdn/shop/files/cool1_1024x1024@2x.jpg?v=1701528552"
  ]
  categories = ["All","Magnolia Picks", 'Skin Car', 'Make Up', 'Miniset', 'Tools', '$10 or Less']
  selectedCategory: string = this.categories[0]; 

  selectCategory(category: string) {
    this.selectedCategory = category;
  }




  sort(){

  }

  filter(){
    
  }



  constructor() {


  }

}
