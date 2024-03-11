import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserfriendsPage } from './userfriends.page';

describe('UserfriendsPage', () => {
  let component: UserfriendsPage;
  let fixture: ComponentFixture<UserfriendsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserfriendsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
