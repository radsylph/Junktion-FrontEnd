
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router, NavigationEnd, Route } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { UserServices } from '../../../app/services/user.service';
import { Preferences } from '@capacitor/preferences';
import { PostInterface } from '../../interfaces/post.interface';
import { ChangeDetectorRef } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { FriendRequestInterface } from 'src/app/interfaces/friendRequest.interface';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  items: any = [];
  friendRequest: FriendRequestInterface[] = [];
  token: string = '';
  ownerSession: string = '';
  constructor(private user: UserServices,
    private alert: AlertController,
    private nav: NavController,
    private sheet: ActionSheetController,
    private router: Router) {

  };


  async acceptFriendRequest(id: string) {
    await this.user.acceptFriendRequest(id, this.token);
    this.getFriendRequest();
  }

  async rejectFriendRequest(id: string) {
    await this.user.rejectFriendRequest(id, this.token);
    this.getFriendRequest();
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

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.getFriendRequest();
      event.target.complete();
    }, 2000);
  }
  async ngOnInit() {
    await this.getToken();
    await this.getFriendRequest();
    this.generateItems();

  }

  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i < 50; i++) {
      this.items.push(`Item ${count + i}`);
    }
  }

  async getFriendRequest() {
    const request: any = await this.user.getFriendRequests(this.token);
    //console.log(request.friendsRequest);
    this.friendRequest = request.friendsRequest;
    console.log(this.friendRequest);

  }

  onIonInfinite(ev: any) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
