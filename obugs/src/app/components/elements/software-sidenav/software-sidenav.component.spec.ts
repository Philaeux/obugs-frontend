import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareSidenavComponent } from './software-sidenav.component';

describe('SoftwareSidenavComponent', () => {
  let component: SoftwareSidenavComponent;
  let fixture: ComponentFixture<SoftwareSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoftwareSidenavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoftwareSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
