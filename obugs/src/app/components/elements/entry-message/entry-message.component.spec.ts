import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryMessageComponent } from './entry-message.component';

describe('EntryMessageComponent', () => {
  let component: EntryMessageComponent;
  let fixture: ComponentFixture<EntryMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntryMessageComponent]
    });
    fixture = TestBed.createComponent(EntryMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
