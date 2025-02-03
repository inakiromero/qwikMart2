import { ComponentFixture, TestBed } from '@angular/core/testing';

import { registroVentasComponent } from './registo-ventas.component';

describe('RegistoVentasComponent', () => {
  let component: registroVentasComponent;
  let fixture: ComponentFixture<registroVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [registroVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(registroVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
