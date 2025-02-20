import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmacion-dialogo',
  templateUrl: './confirmacion-dialogo.component.html',
  styleUrls: ['./confirmacion-dialogo.component.css']
})
export class ConfirmacionDialogoComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmacionDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }
  ) {}

  cancelar(): void {
    this.dialogRef.close(false);
  }

  confirmar(): void {
    this.dialogRef.close(true);
  }
}