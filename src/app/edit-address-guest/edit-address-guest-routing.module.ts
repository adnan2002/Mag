import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditAddressGuestPage } from './edit-address-guest.page';

const routes: Routes = [
  {
    path: '',
    component: EditAddressGuestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditAddressGuestPageRoutingModule {}
