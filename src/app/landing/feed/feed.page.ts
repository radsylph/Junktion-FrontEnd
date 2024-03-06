import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { UserServices } from '../../../app/services/user.service';
import { Preferences } from '@capacitor/preferences';
import { PostInterface } from '../../interfaces/post.interface';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  public Publications: PostInterface[] = [];
  public token: any = '';
  public ownerSession: any = '';
  //cosas delos likes
  //cosas del profile

  async ngOnInit() {
    await this.getToken();

    await this.getFeed(this.token);
    console.log("token:", this.token);
    console.log("ownerSession:", this.ownerSession);
  }


  async getToken() {
    await Preferences
      .get({ key: 'token' })
      .then((token: any) => {
        this.token = token.value;
      });
    await Preferences.get({ key: 'ownerSession' }).then((ownerSession: any) => {
      this.ownerSession = ownerSession.value;
    });
  }

  async deleteToken() {
    await Preferences.remove({
      key: 'token',
    }).then(async () => {
      await Preferences.remove({
        key: 'ownerSession',
      });
      const alert = await this.alert.create({
        header: 'Token Deleted',
        message: 'Your session has expired, logIn again',
        buttons: ['OK']
      });
      await alert.present();
      this.nav.navigateRoot('/login');
    }
    );
  };

  handleRefresh(event: any) {

    setTimeout(() => {
      // Any calls to load data go here
      console.log(this.token)
      console.log(this.ownerSession)
      this.getFeed(this.token);
      event.target.complete();
    }, 2000);
  }

  async giveLike(postId: string, token: string, postLikes: any) {
    console.log("like");
    console.log(this.token);

    try {
      const like: any = await this.user.likePost(postId, token);
      console.log(like)
      if (like.code == 201) {
        postLikes.likes++;
      } else {
        postLikes.likes--;
      }
      return like;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  constructor(private user: UserServices,
    private alert: AlertController,
    private nav: NavController,
    private sheet: ActionSheetController) {
  }


  async getFeed(token: any) {
    token = this.token;
    try {
      const Feed: any = await this.user.getFeedPosts(token)
      console.log(Feed);
      return this.Publications = Feed.publications;
    } catch (error) {
      console.log(error);
      return error
    }

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
                header: 'Delete tweet',
                message: 'Are you really sure you want to delete this ?',
                buttons: [
                  {
                    text: 'Yes',
                    handler: () => {
                      console.log("To do")
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
          handler: () => {
            console.log('Edit clicked');
            Preferences.set({ key: 'PublicationId', value: postId });

          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { },
        },
      ],
    });
    await actionSheetButtons.present();
  }

}
