import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FriendlyPage } from './friendly.page';

describe('FriendlyPage', () => {
  let component: FriendlyPage;
  let fixture: ComponentFixture<FriendlyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FriendlyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
