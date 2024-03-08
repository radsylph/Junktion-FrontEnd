import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserServices } from './services/user.service';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, CommonModule, HttpClientModule, provideFirebaseApp(() => initializeApp({ "projectId": "junktion-effaa", "appId": "1:875702451775:web:5f9ca39d880593e3d7428a", "storageBucket": "junktion-effaa.appspot.com", "apiKey": "YOUR_API_KEY", "authDomain": "junktion-effaa.firebaseapp.com", "messagingSenderId": "875702451775", "measurementId": "G-WE2B7VCZZF" })), provideStorage(() => getStorage())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, UserServices],
  bootstrap: [AppComponent],
})
export class AppModule { }
