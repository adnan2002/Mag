import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'crud-product',
    loadChildren: () => import('./crud-product/crud-product.module').then( m => m.CrudProductPageModule)
  },
  {
    path: 'tabs/home/product-detail/:id',
    loadChildren: () => import('./product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
  },
  {
    path: 'cartmodal',
    loadChildren: () => import('./cartmodal/cartmodal.module').then( m => m.CartmodalPageModule)
  },
  {
    path: 'forgotpassmodal',
    loadChildren: () => import('./forgotpassmodal/forgotpassmodal.module').then( m => m.ForgotpassmodalPageModule)
  },
  {
    path: 'tabs/profile/addresses',
    loadChildren: () => import('./addresses/addresses.module').then( m => m.AddressesPageModule)
  },
  {
    path: 'address-modal',
    loadChildren: () => import('./address-modal/address-modal.module').then( m => m.AddressModalPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then( m => m.CheckoutPageModule)
  },  {
    path: 'edit-address-guest',
    loadChildren: () => import('./edit-address-guest/edit-address-guest.module').then( m => m.EditAddressGuestPageModule)
  },
  {
    path: 'select-address',
    loadChildren: () => import('./select-address/select-address.module').then( m => m.SelectAddressPageModule)
  }







];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
