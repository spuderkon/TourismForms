import { Component, OnInit } from '@angular/core';
import { FillMethodService } from '../../../services/fillMethodService/fill-method.service';
import { FillMethod } from '../../../data/models/fillMethod/fill-method.interface';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-fill-method',
  templateUrl: './fill-method.component.html',
  styleUrl: './fill-method.component.css'
})
export class FillMethodComponent implements OnInit{

  public dataSource: MatTableDataSource<FillMethod>;
  public displayedColumns: string[];

  constructor(private fillMethodService: FillMethodService) {
    this.dataSource = new MatTableDataSource<FillMethod>();
    this.displayedColumns = ["id", "name", "edit", "delete"]
  }

  ngOnInit(): void {
    this.refreshFillMethods();
  }

  private refreshFillMethods(): void{
    this.fillMethodService.getAll().subscribe({
      next: (value) => {
        this.dataSource = new MatTableDataSource(value);
      },
      error(err) {
        console.log(err);
      },
    })
  }
}
