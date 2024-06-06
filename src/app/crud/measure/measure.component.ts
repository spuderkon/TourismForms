import { Component, Inject, OnInit } from '@angular/core';
import { Measure } from '../../../data/models/measure/measure.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MeasureService } from '../../../services/measureService/measure.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { MeasurePut } from '../../../data/requestModels/measure-put.interface';
import { MeasurePost } from '../../../data/requestModels/measure-post.interface';

@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  styleUrl: './measure.component.css'
})
export class MeasureComponent implements OnInit {

  public dataSource: MatTableDataSource<Measure>;
  public displayedColumns: string[];
  public measuresToDisplay: Measure[];

  constructor(private measureService: MeasureService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Measure>();
    this.displayedColumns = ["id", "name", "edit", "delete"]
    this.measuresToDisplay = new Array<Measure>;
  }

  ngOnInit(): void {
    this.refreshMeasures();
  }

  private refreshMeasures(): void{
    this.measureService.getAll().subscribe({
      next: (value) => {
        this.measuresToDisplay = value;
        this.dataSource = new MatTableDataSource(this.measuresToDisplay);
      },
      error(err) {
        console.log(err);
      },
    })
  }

  public create(): void{
    const dialogRef = this.dialog.open(EditMeasureDialog, {data:{id: -1, name: ""}});
    dialogRef.afterClosed().subscribe( (result: Measure | undefined) => {
      if(result != undefined){
        this.measuresToDisplay.push(result);
        this.dataSource = new MatTableDataSource(this.measuresToDisplay);
      }
    })
  }

  public edit(measure: Measure): void{
    const dialogRef = this.dialog.open(EditMeasureDialog, {data:measure});
  }

  public delete(measure: Measure): void{
    const dialogRef = this.dialog.open(DeleteMeasureDialog, {data:measure});
    dialogRef.afterClosed().subscribe( (result: true | undefined) => {
      if(result != undefined){
        this.measuresToDisplay.splice(this.measuresToDisplay.findIndex(item => item == measure), 1);
        this.dataSource = new MatTableDataSource(this.measuresToDisplay);
      }
    })
  }
}

@Component({
  selector: 'edit-measure-dialog',
  templateUrl: 'edit-measure-dialog.html',
})
export class EditMeasureDialog implements OnInit {

  public measureName: FormControl;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Measure, public dialogRef: MatDialogRef<EditMeasureDialog>, private measureSerivce: MeasureService){
    this.measureName = new FormControl(this.data.name,Validators.required);
  }

  ngOnInit(): void {
    
  }

  public createMeasure(): void{
    const measureToCreate: MeasurePost = {name: this.measureName.value};
    this.measureSerivce.create(measureToCreate).subscribe({
      next: (data) => {
        this.dialogRef.close(data);
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  public updateMeasure(): void{
    const measureToUpdate: MeasurePut = {id: this.data.id, name: this.data.name};
    this.measureSerivce.update(measureToUpdate).subscribe({
      next: (data) => {
        this.data.name = this.measureName.value;
        this.dialogRef.close();
      },
      error: (error) => {
        console.log(error);
      },
    })
  }
}

@Component({
  selector: 'delete-measure-dialog',
  templateUrl: 'delete-measure-dialog.html',
})
export class DeleteMeasureDialog implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Measure, public dialogRef: MatDialogRef<EditMeasureDialog>, private measureSerivce: MeasureService){

  }

  ngOnInit(): void {
    
  }

  public deleteMeasure(): void{
    this.measureSerivce.delete(this.data.id).subscribe({
      next: (data) => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.log(error);
      },
    })
  }
}