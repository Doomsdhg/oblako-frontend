import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MutationResult } from 'apollo-angular';
import { CategoriesApiService } from 'src/app/services/categories-api.service';
import { CategoriesDataSourceService } from 'src/app/services/categories-data-source.service';
import { GetCategoriesResponseData } from 'src/app/services/interfaces/categories-response.interface';
import { TodosApiService } from 'src/app/services/todos-api.service';
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

  public formGroup!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddTodoDialogComponent>,
    private categoriesApiService: CategoriesApiService,
    private todosApiService: TodosApiService,
    private changeDetectorRef: ChangeDetectorRef,
    private categoriesDataSource: CategoriesDataSourceService
    ) {}

  ngOnInit(): void {
    this.getCategories();
    this.buildForms();
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

  public get newCategoryValidators(): ValidatorFn[] | null{
    return this.newCategorySelected ? [Validators.required] : null;
  }

  public get todoTextInput(): String {
    return this.formGroup.get('todoText')!.value;
  }

  public get newCategoryTitleInput(): String {
    return this.formGroup.get('newCategoryTitle')!.value;
  }

  public get selectedCategoryId(): String {
    return this.formGroup.get('categorySelect')!.value;
  }

  public closeDialogWithoutRefreshing(): void {
    this.dialogRef.close();
  }

  public handleCreateTodoClick(): void {
    if (this.newCategorySelected){
      this.createTodoInNewCategory()
    } else {
      this.createTodoInExistingCategory()
    }
  }

  public closeDialogWithRefreshing(): void {
    this.categoriesDataSource.loadCategories();
    this.dialogRef.close();
  }

  private createTodoInNewCategory(): void {
    this.todosApiService.createTodoInNewCategory(this.todoTextInput, this.newCategoryTitleInput)
    .subscribe(() => {
      this.closeDialogWithRefreshing();
    })
  }

  private createTodoInExistingCategory(): void {
    this.todosApiService.createTodoInExistingCategory(this.todoTextInput, this.selectedCategoryId)
    .subscribe(() => {
      this.closeDialogWithRefreshing();
    })
  }

  private buildForms(): void {
    this.formGroup = new FormGroup({
      todoText: new FormControl<String>('', [Validators.required]),
      categorySelect: new FormControl<String>('', [Validators.required]),
      newCategoryTitle: new FormControl<String>('', this.newCategoryValidators)
    });
  }

  private getCategories(): void {
    this.categoriesApiService.getCategoriesWithoutTodos()
    .subscribe((response: MutationResult<GetCategoriesResponseData>) => {
      this.categories = response.data!.categories;
    });
  }

  private subscribeToSelectChanges(): void {
    this.formGroup.get('categorySelect')!.valueChanges
    .subscribe((value: String) => {
      if (value === 'new') {
        this.displayNewCategoryAddingForm();
      } else {
        this.hideNewCategoryAddingForm();
      }
    });
  }

  private displayNewCategoryAddingForm(): void {
    this.newCategorySelected = true;
  }

  private hideNewCategoryAddingForm(): void {
    this.newCategorySelected = false;
  }
}
