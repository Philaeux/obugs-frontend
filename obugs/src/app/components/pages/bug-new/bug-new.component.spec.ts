import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugNewComponent } from './bug-new.component';

describe('BugNewComponent', () => {
  let component: BugNewComponent;
  let fixture: ComponentFixture<BugNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BugNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
