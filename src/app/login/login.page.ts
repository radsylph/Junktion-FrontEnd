import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { UserServices } from '../services/user.service';
import { Preferences } from '@capacitor/preferences';

import { existingUser } from '../interfaces/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private nav: NavController,
    private user: UserServices
  ) { }
  User: existingUser = {
    email: "",
    password: ""
  }


  ngOnInit() {
    this.getToken();
    this.User = {
      email: "",
      password: ""
    };
  }

  async setToken(token: string, ownerSession: string, ownerProfilePicture: string) {
    await Preferences.set({
      key: 'token',
      value: token,
    });
    await Preferences.set({
      key: 'ownerSession',
      value: ownerSession,
    });
    await Preferences.set({
      key: "ownerProfilePicture",
      value: ownerProfilePicture,
    });
    this.nav.navigateForward('/landing/feed');
  }

  async getToken() {
    const token = await Preferences.get({ key: 'token' });
    if (token.value) {
      this.nav.navigateForward('/landing/feed');
    }
  }

  async login() {
    if (this.User.email == "" || this.User.password == "") {
      const alert = await this.alert.create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: 'Please fill all the fields',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
    try {
      const loginUser: any = await this.user.loginUser(this.User);
      const alert = await this.alert.create({
        header: 'Success',
        message: 'User registered successfully',
        buttons: ['OK']
      });
      await alert.present();
      console.log(loginUser)
      await this.setToken(loginUser.token, loginUser.user._id, loginUser.user.profilePicture);
    } catch (error: any) {
      console.log(error);
      const alert = await this.alert.create({
        header: 'Error',
        message: error.error.message,
        buttons: ['OK']
      });
      await alert.present();
    }

  }

}
