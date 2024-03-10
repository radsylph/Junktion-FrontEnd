import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor() { }
  profileAvatar: string = '';
  ngOnInit() {
    this.getProfilePicture();
  }

  async getProfilePicture() {
    const profilePicture = await Preferences.get({ key: 'ownerProfilePicture' });
    if (profilePicture.value) {
      this.profileAvatar = profilePicture.value as string;
    }
    console.log(this.profileAvatar);
  }


}
