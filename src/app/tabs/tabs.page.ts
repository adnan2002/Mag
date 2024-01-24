import { Component, OnInit, ViewChild} from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Observable, of, map, pipe, from, switchMap, forkJoin, startWith,NEVER, Subscription } from 'rxjs';
import { CartService } from '../cart.service';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  @ViewChild('myTabs') tabs: IonTabs | any;

  selectedTab = 'home'
  public cartItemCount: Observable<number> = NEVER.pipe(startWith(0));
  

  setCurrentTab() {
    this.selectedTab = this.tabs.getSelected();
  }

  
  

  constructor(private storage:Storage, private cartService: CartService) {
   }


  ngOnInit() {
    this.cartItemCount = this.cartService.getCartItemCount();
    this.cartService.initializeCart();
    
    
}




}