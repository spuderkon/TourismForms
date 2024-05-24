import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Municipality } from '../../../data/models/municipality/municipality.interface';
import { MunicipalityService } from '../../../services/municipalityService/municipality.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormService } from '../../../services/formService/form.service';
import { Form } from '../../../data/models/form/form.interface';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent implements OnInit{

  public forms: Form[];

  constructor(public dialog: MatDialog, private formService:FormService){
    this.forms = new Array<Form>;
  }

  ngOnInit(): void {
    this.refreshAllForms();
  }

  public openSelectMunicipalityDialog(){
    const dialog = this.dialog.open(SelectMunicipalityDialog);
  }

  private refreshAllForms(): void{
    this.formService.getAll()
    .subscribe({
      next: (data) => {
        this.forms = data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}

@Component({
  selector: 'select-municipality-dialog',
  templateUrl: 'select-municipality-dialog.html',
})
export class SelectMunicipalityDialog implements OnInit {

  public dataSource: MatTableDataSource<Municipality>;
  public displayedColumns: string[];
  public disableSelect = new FormControl(false);

  constructor(private municipalityService: MunicipalityService) {
    this.dataSource = new MatTableDataSource<Municipality>;
    this.displayedColumns = ["Select","Name", "RegionId"]
    
  }

  ngOnInit(): void {
    this.refreshAllMunicipality();
  }

  public refreshAllMunicipality(): void{
    this.municipalityService.getAll()
      .subscribe({
        next: (data) => {
          this.dataSource = new MatTableDataSource(data);
        },
        error: (error) => {
          console.log(error);
        }
      })
  }
}