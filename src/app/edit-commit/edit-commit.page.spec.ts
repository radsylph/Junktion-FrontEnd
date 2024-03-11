import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCommitPage } from './edit-commit.page';

describe('EditCommitPage', () => {
  let component: EditCommitPage;
  let fixture: ComponentFixture<EditCommitPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditCommitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
