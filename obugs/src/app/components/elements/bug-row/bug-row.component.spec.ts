import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugRowComponent } from './bug-row.component';

describe('BugRowComponent', () => {
  let component: BugRowComponent;
  let fixture: ComponentFixture<BugRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BugRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
