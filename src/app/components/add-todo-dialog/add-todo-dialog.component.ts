import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MutationResult } from 'apollo-angular';
import { CategoriesApiService } from 'src/app/services/categories-api.service';
import { GetCategoriesResponseData } from 'src/app/services/interfaces/categories-response.interface';
import { Category } from '../category-card/models/category.model';

@Component({
  selector: 'frnt-add-todo-dialog',
  templateUrl: './add-todo-dialog.component.html',
  styleUrls: ['./add-todo-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTodoDialogComponent implements OnInit {

  private _newCategorySelected: boolean = false;

  private _categories?: Category[];

  public formGroup = new FormGroup({
    categorySelect: new FormControl()
  });

  constructor(
    private dialogRef: MatDialogRef<AddTodoDialogComponent>,
    private categoriesApiService: CategoriesApiService,
    private changeDetectorRef: ChangeDetectorRef
    ) {}

  ngOnInit(): void {
    this.getCategories();
    this.subscribeToSelectChanges();
  }

  public get newCategorySelected(): boolean{
    return this._newCategorySelected;
  }

  public set newCategorySelected(value: boolean){
    this._newCategorySelected = value;
  }

  public get categories(): Category[]{
    return this._categories || [];
  }

  public set categories(value: Category[]){
    this._categories = value || [];
  }

  private getCategories(): void {
    this.categoriesApiService.getCategoriesWithoutTodos()
    .subscribe((response: MutationResult<GetCategoriesResponseData>) => {
      this.categories = response.data!.categories;
    });
  }

  private subscribeToSelectChanges(): void {
    this.formGroup.controls.categorySelect.valueChanges
    .subscribe((value) => {
      if (value === 'new') {
        this.newCategorySelected = true;
      } else {
        this.newCategorySelected = false;
      }
    });
  }

  private displayNewCategoryAddingForm(): void {
    this.newCategorySelected = true;
    console.log(this.newCategorySelected);
    this.changeDetectorRef.detectChanges();
  }

  private hideNewCategoryAddingForm(): void {
    this.newCategorySelected = false;
    console.log(this.newCategorySelected);
    this.changeDetectorRef.detectChanges();
  }
}
