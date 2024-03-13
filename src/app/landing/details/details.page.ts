import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { UserServices } from '../../../app/services/user.service';
import { Preferences } from '@capacitor/preferences';
import { ViewDidEnter, ViewWillEnter } from '@ionic/angular';
import { PostInterface } from '../../interfaces/post.interface';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit, ViewWillEnter {

  constructor(private user: UserServices,
    private alert: AlertController,
    private nav: NavController,
    private sheet: ActionSheetController) { }


  token: string = '';
  ownerSession: string = '';
  postId: string = '';
  items: any = [];
  postInfo: any;
  test: PostInterface[] = [];
  comments: any = [];

  async getToken() {
    await Preferences
      .get({ key: 'token' })
      .then((token: any) => {
        this.token = token.value;
      });
    await Preferences.get({ key: 'ownerSession' }).then((ownerSession: any) => {
      this.ownerSession = ownerSession.value;
    });
    await Preferences.get({ key: 'PublicationId' }).then((postId: any) => {
      this.postId = postId.value;
    })
  }

  async getComments() {
    try {
      const comments: any = await this.user.getComments(this.token, this.postId);
      //hacer la logica de los likes de los comentarios
      const likes: any = await this.user.getLikedComments(this.token, this.postId);
      console.log(likes);
      console.log(comments);
      this.comments = comments.comments;
    } catch (error) {
      console.log(error);
    }
  }

  async ionViewWillEnter() {
    await this.getToken();
    await this.getPostInfo();
    await this.getComments();
  }

  async getPostInfo() {
    try {
      const postInfo: any = await this.user.getPublicationInfo(this.token, this.postId);
      console.log(postInfo)
      this.postInfo = postInfo.publication;
      console.log(this.postInfo);
    } catch (error) {
      console.log(error);
    }
  }



  async ngOnInit() {
    // this.comments = [];
    // this.postInfo = {};
    await this.getToken();
    await this.getPostInfo();
    await this.getComments();

  }

  async goBack() {
    await this.nav.navigateBack('/landing/feed');
  }

  async publicationOptions(postId: string) {
    console.log(postId);
    const actionSheetButtons = await this.sheet.create({
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.alert
              .create({
                header: 'Delete publication',
                message: 'Are you really sure you want to delete this ?',
                buttons: [
                  {
                    text: 'Yes',
                    handler: async () => {
                      await this.deletePublication(postId);

                    },
                  },
                  {
                    text: 'No',
                    handler: () => { },
                  },
                ],
              })
              .then((alert) => alert.present());
          },
        },
        {
          text: 'Edit',
          role: 'modification',
          handler: async () => {
            console.log('Edit clicked');
            await Preferences.set({ key: 'PublicationId', value: postId });
            console.log('PublicationId:', postId);
            await this.nav.navigateForward('/edit-commit');
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          },
        },
      ],
    });
    await actionSheetButtons.present();
  }

  async commentOptions(commentId: string) {
    console.log(commentId);
    const actionSheetButtons = await this.sheet.create({
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.alert
              .create({
                header: 'Delete Comment',
                message: 'Are you really sure you want to delete this ?',
                buttons: [
                  {
                    text: 'Yes',
                    handler: async () => {
                      await this.deleteComment(commentId);

                    },
                  },
                  {
                    text: 'No',
                    handler: () => { },
                  },
                ],
              })
              .then((alert) => alert.present());
          },
        },
        {
          text: 'Edit',
          role: 'modification',
          handler: async () => {
            console.log('Edit clicked');
            await Preferences.set({ key: 'PublicationId', value: commentId });
            console.log('PublicationId:', commentId);
            await this.nav.navigateForward('/edit-commit');
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          },
        },
      ],
    });
    await actionSheetButtons.present();
  }

  async deletePublication(postId: any) {
    try {
      const deleted: any = await this.user.deletePost(postId, this.token);
      console.log('Response from server:', deleted);
      await this.nav.navigateBack('/landing/feed');
      return deleted;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async deleteComment(commentId: string) {
    try {
      const deleted: any = await this.user.deleteComment(this.token, commentId);
      console.log('Response from server:', deleted);
      await this.getComments();
      return deleted;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async giveLike(postId: string, token: string, publication: any) {
    try {
      const like: any = await this.user.likePost(postId, token);
      console.log('Response from server:', like);
      if (like.code == 201) {
        publication.likes++;
        publication.isLiked = true;
      } else {
        publication.likes--;
        publication.isLiked = false;
      }
      console.log(publication)
      return like;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async makeComment(postId: string) {
    await Preferences.set({ key: 'PublicationId', value: postId });
    console.log('PublicationId:', postId);
    await this.nav.navigateForward('/edit');
  }

  async goToComment(postId: string) {
    await Preferences.set({ key: 'PublicationId', value: postId });
    console.log('PublicationId:', postId);
    await this.ngOnInit();
  }

}
