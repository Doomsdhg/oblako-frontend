import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesDataSourceService } from 'src/app/services/categories-data-source.service';
import { AddTodoDialogComponent } from '../add-todo-dialog/add-todo-dialog.component';

@Component({
  selector: 'frnt-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private categoriesDataSource: CategoriesDataSourceService 
    ){}

  ngOnInit(): void {
  }

  openDialog(): void{
    this.dialog.open(AddTodoDialogComponent);
  }
}
