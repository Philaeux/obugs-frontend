import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagChipComponent } from './tag-chip.component';

describe('TagChipComponent', () => {
  let component: TagChipComponent;
  let fixture: ComponentFixture<TagChipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TagChipComponent]
    });
    fixture = TestBed.createComponent(TagChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
