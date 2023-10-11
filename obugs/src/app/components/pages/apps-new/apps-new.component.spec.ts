import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsNewComponent } from './apps-new.component';

describe('AppsNewComponent', () => {
  let component: AppsNewComponent;
  let fixture: ComponentFixture<AppsNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppsNewComponent]
    });
    fixture = TestBed.createComponent(AppsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
