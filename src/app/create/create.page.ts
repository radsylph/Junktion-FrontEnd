import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { UserServices } from '../services/user.service';
import { Preferences } from '@capacitor/preferences';
import { PostCreateInterface } from '../interfaces/create.post.interface';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  constructor(
    private user: UserServices,
    private alert: AlertController,
    private nav: NavController,

  ) { }

  createPost: PostCreateInterface = {
    title: '',
    content: '',
    image: '',
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
      image: '',
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
      // });
      const createPost = await this.user.createPost(this.createPost, this.token);
      console.log(createPost);
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
    }
  }

}
