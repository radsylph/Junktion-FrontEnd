import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { UserServices } from '../services/user.service';
import { Preferences } from '@capacitor/preferences';
import { PostCreateInterface } from '../interfaces/create.post.interface';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  constructor(
    private user: UserServices,
    private alert: AlertController,
    private nav: NavController,

  ) { }

  createPost: PostCreateInterface = {
    title: '',
    content: '',
    images: [],
  };
  token: string = "";

  async getToken() {
    const token = await Preferences
      .get({ key: 'token' })
      .then((token: any) => {
        this.token = token.value;
      });
  }

  ngOnInit() {
    this.getToken();
    this.createPost = {
      title: '',
      content: '',
      images: [],
    };

  }

  async createNewPost() {
    if (this.createPost.title === "" || this.createPost.content === "") {
      const alert = await this.alert.create({
        header: 'Error',
        message: 'You must fill all the fields',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    try {
      // await this.user.createPost(this.createPost, this.token)?.subscribe(res => {
      //   console.log(res);


      const alert = await this.alert.create({
        header: 'Success',
        message: 'Post created',
        buttons: ['OK']
      });
      await alert.present();
      this.nav.navigateForward('/landing/feed');

    } catch (error) {
      const alert = await this.alert.create({
        header: 'Error',
        message: 'Post not created',
        buttons: ['OK']
      });
      await alert.present();
      console.log(error)
    }
  }
}
