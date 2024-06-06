import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Municipality } from '../../../data/models/municipality/municipality.interface';
import { MunicipalityService } from '../../../services/municipalityService/municipality.service';
import { RegionService } from '../../../services/regionService/region.service';
import { Region } from '../../../data/models/region/region.interface';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MunicipalityPut } from '../../../data/requestModels/municipality-put.interface';
import { MunicipalityPost } from '../../../data/requestModels/municipality-post.interface';

@Component({
  selector: 'app-municipality',
  templateUrl: './municipality.component.html',
  styleUrl: './municipality.component.css'
})
export class MunicipalityComponent implements OnInit {

  public dataSource: MatTableDataSource<Municipality>;
  public displayedColumns: string[];
  private municipalitiesToDisplay: Municipality[];

  constructor(private municipalityService: MunicipalityService, private regionService: RegionService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Municipality>();
    this.displayedColumns = ["id", "name", "region", "email", "isAdmin", "edit", "delete"];
    this.municipalitiesToDisplay = new Array<Municipality>;
  }

  ngOnInit(): void {
    this.refreshMunicipalities();
  }

  private refreshMunicipalities(): void{
    this.municipalityService.getAll().subscribe({
      next: (data) => {
        this.municipalitiesToDisplay = data;
        this.dataSource = new MatTableDataSource(this.municipalitiesToDisplay);
      },
      error(err) {
        console.log(err);
      },
    })
  }

  public create(): void{
    const dialogRef = this.dialog.open(EditMunicipalityDialog, {data:{id: -1, name : null, regionId: null, email: null, isAdmin: null}});
    dialogRef.afterClosed().subscribe( (result: Municipality | undefined) => {
      if(result != undefined){
        this.municipalitiesToDisplay.push(result);
        this.dataSource = new MatTableDataSource(this.municipalitiesToDisplay);
      }
    })
  }

  public edit(municipality: Municipality): void{
   const dialogRef = this.dialog.open(EditMunicipalityDialog, {data:municipality}) 
  }

  public delete(municipality: Municipality): void{
    const dialogRef = this.dialog.open(DeleteMunicipalityDialog, {data:municipality});
    dialogRef.afterClosed().subscribe( (result: true | undefined) => {
      if(result != undefined){
        this.municipalitiesToDisplay.splice(this.municipalitiesToDisplay.findIndex(item => item == municipality), 1);
        this.dataSource = new MatTableDataSource(this.municipalitiesToDisplay);
      }
    })
  }
}

@Component({
  selector: 'edit-municipality-dialog',
  templateUrl: 'edit-municipality-dialog.html',
})
export class EditMunicipalityDialog implements OnInit{

  public regionsToDisplay: Region[];
  public municipalityForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Municipality, private formBuilder: FormBuilder,public dialogRef: MatDialogRef<EditMunicipalityDialog>, 
                      private municipalityService: MunicipalityService, private regionService: RegionService) {
    this.regionsToDisplay = new Array<Region>;
    this.municipalityForm = this.formBuilder.group({
      name: new FormControl(data.name, Validators.required),
      regionId: new FormControl(data.regionId, Validators.required),
      email: new FormControl(data.email, [Validators.required, Validators.email]),
      isAdmin: new FormControl(data.isAdmin, Validators.required),
    });
  }
  ngOnInit(): void {
    this.refreshRegions();
  }

  private refreshRegions(): void{
    this.regionService.getAll().subscribe({
      next: (value) => {
        this.regionsToDisplay = value;
      },
      error(err) {
        console.log(err);
      },
    })
  }

  public createMunicipality(): void{
    const municipalityToCreate: MunicipalityPost ={
      name: this.municipalityForm.controls["name"].value,
      regionId: this.municipalityForm.controls["regionId"].value,
      email: this.municipalityForm.controls["email"].value,
      isAdmin: this.municipalityForm.controls["isAdmin"].value,
    };
    this.municipalityService.create(municipalityToCreate).subscribe({
      next: (data) => {
        this.dialogRef.close(data);
      },
      error(error) {
        console.log(error);
      },
    })
  }

  public updateMunicipality(): void{
    const municipalityToUpdate: MunicipalityPut ={
      id: this.data.id,
      name: this.municipalityForm.controls["name"].value,
      regionId: this.municipalityForm.controls["regionId"].value,
      email: this.municipalityForm.controls["email"].value,
      isAdmin: this.municipalityForm.controls["isAdmin"].value,
    };
    console.log(this.municipalityForm.controls["email"]);
    this.municipalityService.update(municipalityToUpdate).subscribe({
      next: () => {
        this.data.name = municipalityToUpdate.name;
        this.data.regionId = municipalityToUpdate.regionId;
        this.data.email = municipalityToUpdate.email;
        this.data.isAdmin = municipalityToUpdate.isAdmin;
        this.dialogRef.close();
      },
      error(error) {
        console.log(error);
      },
    })
  }
}

@Component({
  selector: 'delete-municipality-dialog',
  templateUrl: 'delete-municipality-dialog.html',
})
export class DeleteMunicipalityDialog implements OnInit{

  constructor(@Inject(MAT_DIALOG_DATA) public data: Municipality, public dialogRef: MatDialogRef<DeleteMunicipalityDialog>, private municipalityService: MunicipalityService) {

  }

  ngOnInit(): void {
    
  }

  public deleteMunicipality(): void{
    this.municipalityService.delete(this.data.id).subscribe({
      next: (data) => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.log(error);
      },
    })
  }
}