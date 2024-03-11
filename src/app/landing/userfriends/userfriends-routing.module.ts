import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserfriendsPage } from './userfriends.page';

const routes: Routes = [
  {
    path: '',
    component: UserfriendsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserfriendsPageRoutingModule {}
