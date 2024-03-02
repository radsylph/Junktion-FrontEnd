import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendlyPageRoutingModule } from './friendly-routing.module';

import { FriendlyPage } from './friendly.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendlyPageRoutingModule
  ],
  declarations: [FriendlyPage]
})
export class FriendlyPageModule {}
