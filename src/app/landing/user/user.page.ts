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
@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  constructor(private nav: NavController, private storage: Storage, private alert: AlertController, private user: UserServices) { }
  currentSegment = 'post';
  isPasswordModalOpen = false;
  token: string = '';
  ownerSession: string = '';
  profileAvatar: string = '';
  isModalOpen = false;
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
    this.newPass = '';
    this.newPassConfirm = '';
    await this.getProfilePicture();
    await this.getToken();
    await this.getUserInfo();
    await this.getUserPosts();
    await this.getUserFriends();
  }

  async getToken() {
    await Preferences
      .get({ key: 'token' })
      .then((token: any) => {
        this.token = token.value;
      });
    await Preferences.get({ key: 'ownerSession' }).then((session: any) => {
      this.ownerSession = session.value;
    }
    );
  }

  async getUserInfo() {
    console.log(this.token)
    const userInfo: any = await this.user.getUserInfo(this.token);

    this.userInfo = userInfo.user as UserInterface;
    console.log(this.userInfo);
  }

  async getUserPosts() {
    const posts: any = await this.user.getUserPosts(this.ownerSession, this.token);
    console.log(posts);
    this.userPosts = posts.existingPublications as PostInterface[];
    console.log(this.userPosts);
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
  async getUserFriends() {
    const friends: any = await this.user.getUserFriends(this.token, this.ownerSession);
    this.userFriends = friends.userFriends;

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

  async takePicture() {
    //console.log('take picture')
    try {
      console.log('take picture')
      if (Capacitor.getPlatform() != 'web') await Camera.requestPermissions();
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        width: 500,
      });
      console.log(image);
      this.userInfo.profilePicture = image.dataUrl ?? 'image';
      this.image2 = image;
      console.log(this.userInfo.profilePicture);
    } catch (error) {
      console.log(error);
    }
  }

  async uploadPicture(blob: any, imageData: any) {
    try {
      const currentDate = Date.now();
      const filePath = `profilePictures/${currentDate}.${imageData.format}`;
      const fileRef = ref(this.storage, filePath);
      const task = await uploadBytes(fileRef, blob);
      console.log('task: ', task);
      const url = getDownloadURL(fileRef);
      return url;
    } catch (error) {
      throw error;
    }
  }

  dataURLtoBlob(dataurl: string) {
    let arr = dataurl.split(','),
      match = arr[0].match(/:(.*?);/),
      mime = match ? match[1] : '',
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  async changePassword() {
    if (this.newPass !== this.newPassConfirm) {
      const alert = await this.alert.create({
        header: 'Password Error',
        message: 'Passwords do not match',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    if (this.newPass.length < 6) {
      const alert = await this.alert.create({
        header: 'Password Error',
        message: 'Password must be at least 6 characters long',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    if (this.newPass === "" || this.newPassConfirm === "") {
      const alert = await this.alert.create({
        header: 'Password Error',
        message: 'Password can not be empty',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    try {
      console.log(this.newPass)
      const newPassword = { newPassword: this.newPass };
      console.log(newPassword)
      const passwordChanged = await this.user.changePassword(newPassword, this.token);
      if (passwordChanged) {
        const alert = await this.alert.create({
          header: 'Password Changed',
          message: 'Your password has been changed',
          buttons: ['OK']
        });
        await alert.present();
      }
    } catch (error: any) {
      console.log(error.error);

    }
  }

  async editUser(userInfo: UserInterface) {
    console.log(userInfo);
    if (userInfo.name === "" || userInfo.lastname === "" || userInfo.username === "" || userInfo.email === "") {
      const alert = await this.alert.create({
        header: 'Error',
        message: 'Please fill all the fields',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    if (this.userInfo.profilePicture !== this.profileAvatar) {
      console.log("cambio la foto")
      if (this.userInfo.profilePicture != undefined) {
        const blob = this.dataURLtoBlob(this.userInfo.profilePicture);
        const url = await this.uploadPicture(blob, this.image2);
        console.log(url);
        this.userInfo.profilePicture = url;
        await Preferences.set({ key: 'ownerProfilePicture', value: url });
        this.profileAvatar = url;

      }
      const userEdited = await this.user.editUser(userInfo, this.token);
      if (userEdited) {
        const alert = await this.alert.create({
          header: 'User Edited',
          message: 'Your user has been edited',
          buttons: ['OK']
        });
        await alert.present();
      }

    } else {
      console.log("no cambio la foto")
      const userEdited = await this.user.editUser(userInfo, this.token);
      if (userEdited) {
        const alert = await this.alert.create({
          header: 'User Edited',
          message: 'Your user has been edited',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }

  async logOut() {
    await Preferences.remove({ key: 'token' });
    await Preferences.remove({ key: 'ownerSession' });
    await Preferences.remove({ key: 'ownerProfilePicture' });
    this.setOpen(false);
    const alert = await this.alert.create({
      header: 'Logged Out',
      message: 'You have been logged out',
      buttons: ['OK'],
    });
    await alert.present();

    this.nav.navigateRoot('/login');
  }

  async getProfilePicture() {
    const profilePicture = await Preferences.get({ key: 'ownerProfilePicture' });
    if (profilePicture.value) {
      this.profileAvatar = profilePicture.value as string;
    }
    console.log(this.profileAvatar);
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Yes',
      cssClass: 'alert-button-confirm',
    },
  ];

  changeSegment(event: any) {
    this.currentSegment = event.detail.value;
  }

  setPasswordModalOpen(open: boolean) {
    this.isPasswordModalOpen = open;
  }


}

