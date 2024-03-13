import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { UserServices } from 'src/app/services/user.service';
import { UserInterface } from 'src/app/interfaces/user.interface';
import { PostInterface } from 'src/app/interfaces/post.interface';
import { Capacitor } from '@capacitor/core';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'app-userfriends',
  templateUrl: './userfriends.page.html',
  styleUrls: ['./userfriends.page.scss'],
})
export class UserfriendsPage implements OnInit, ViewDidEnter {


  constructor(private nav: NavController, private storage: Storage, private alert: AlertController, private user: UserServices) { }
  currentSegment = 'post';
  //isPasswordModalOpen = false;
  token: string = '';
  userId: string = '';
  profileAvatar: string = '';
  isModalOpen = false;
  status = '';
  userInfo: UserInterface = {
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    repeat_password: '',
    profilePicture: 'image.png',
    myFriends: 0,
  };
  userPosts: PostInterface[] = [];
  newPass: string = '';
  newPassConfirm: string = '';
  userFriends: any[] = [];

  image: any = '';
  image2: any = "";

  async ngOnInit() {
    this.userInfo = {
      name: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      repeat_password: '',
      myFriends: 0,
      profilePicture: 'image.png',
    };
    await this.getToken();
    await this.getUserInfo();
    await this.getUserPosts();
    await this.getUserFriends();
  }

  async ionViewDidEnter() {
    await this.ngOnInit();
  }

  async goBack() {
    await this.nav.navigateBack('/landing/feed');
  }

  handleRefresh(event: any) {
    setTimeout(async () => {
      console.log("test");
      await this.getUserInfo();
      await this.getUserPosts();
      await this.getUserFriends();
      event.target.complete();
    }, 2000);
  }

  async goToPublication(postId: string) {
    await Preferences.set({ key: 'PublicationId', value: postId });
    console.log('PublicationId:', postId);
    await this.nav.navigateRoot('/landing/details');
  }

  async sendFriendRequest() {
    const friendRequest = await this.user.sendFriendRequest(this.userId, this.token);
    console.log(friendRequest);
    await this.getUserInfo();
  }

  async getToken() {
    await Preferences
      .get({ key: 'token' })
      .then((token: any) => {
        this.token = token.value;
      });
    await Preferences.get({ key: 'userId' }).then((session: any) => {
      this.userId = session.value;
    }
    );
  }

  async getUserPosts() {
    const posts: any = await this.user.getUserPosts(this.userId, this.token);
    console.log(posts);
    this.userPosts = posts.existingPublications as PostInterface[];
    console.log(this.userPosts);
  }

  async getUserFriends() {
    const friends: any = await this.user.getUserFriends(this.token, this.userId);
    this.userFriends = friends.userFriends;

  }

  async deleteFriend(friendShipId: string) {
    const alert = await this.alert.create({
      header: 'Delete Friend',
      message: 'Are you sure you want to delete this friend?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Yes',
          handler: async () => {
            await this.user.deleteUserFriend(this.token, friendShipId);
            await this.getUserFriends();
          },
        },
      ],
    });
    await alert.present();
  }

  async getUserInfo() {
    console.log(this.token);
    const userInfo: any = await this.user.getAnotherUserInfo(this.token, this.userId);
    this.userInfo = userInfo.user as UserInterface;
    this.status = userInfo.status;
  }

  changeSegment(event: any) {
    this.currentSegment = event.detail.value;
  }
}
