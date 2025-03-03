import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkNewComponent } from './park-new.component';

describe('ParkNewComponent', () => {
  let component: ParkNewComponent;
  let fixture: ComponentFixture<ParkNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
