import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppManageComponent } from './app-manage.component';

describe('AppManageComponent', () => {
  let component: AppManageComponent;
  let fixture: ComponentFixture<AppManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppManageComponent]
    });
    fixture = TestBed.createComponent(AppManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
