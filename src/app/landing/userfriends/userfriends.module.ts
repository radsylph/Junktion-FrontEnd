import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserfriendsPageRoutingModule } from './userfriends-routing.module';

import { UserfriendsPage } from './userfriends.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserfriendsPageRoutingModule
  ],
  declarations: [UserfriendsPage]
})
export class UserfriendsPageModule {}
