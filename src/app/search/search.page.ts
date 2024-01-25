import { Component, OnInit } from '@angular/core';
import { NavController , IonSearchbar} from '@ionic/angular';
import { ViewChild, AfterViewInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, AfterViewInit {
  products: any[] = [];
  searchResults: any[] = [];
  searchInput: string = '';

  constructor(private nav: NavController, private firebase: FirebaseService) { }

  @ViewChild('searchbar', {static: false}) searchbar ?: IonSearchbar;

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchbar?.setFocus();
    }, 150);
  }

  ngOnInit() {
    this.firebase.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  goBack(){
    this.nav.back();
  }  

  goToProductDetail(productId: string){
    this.nav.navigateForward(`tabs/home/product-detail/${productId}`);
  }

  removeBracketsAndContent(input: string): string {
    return input.replace(/\[.*?\]\s*-?/g, '');
}


search(ev: any){
  this.searchInput = ev.target.value;
  if (this.searchInput && this.searchInput.trim() !== '') {
    this.searchResults = this.products.filter((product) => {
      return (product.title.toLowerCase().indexOf(this.searchInput.toLowerCase()) > -1) || 
             (product.vendor.toLowerCase().indexOf(this.searchInput.toLowerCase()) > -1);
    })
  } else {
    this.searchResults = [];
  }
}


}

