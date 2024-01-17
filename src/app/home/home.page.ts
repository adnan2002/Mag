import { Component } from '@angular/core';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  categories = ["All","Magnolia Picks", 'Skin Car', 'Make Up', 'Miniset', 'Tools', '$10 or Less']
  selectedCategory: string = this.categories[0]; 

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  sort(){

  }

  filter(){
    
  }

  constructor() {}

}
