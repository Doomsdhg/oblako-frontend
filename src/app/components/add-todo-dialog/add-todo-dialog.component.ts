import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MutationResult } from 'apollo-angular';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesApiService } from '../../services/categories-api.service';
import { CategoriesDataSourceService } from '../../services/categories-data-source.service';
import { GetCategoriesResponseData } from '../../services/interfaces/categories-response.interface';
import { TodosApiService } from '../../services/todos-api.service';
import { Category } from '../category-card/models/category.model';
import { AddTodoDialogConstants } from './add-todo-dialog.constants';

@Component({
  selector: 'frnt-add-todo-dialog',
  templateUrl: './add-todo-dialog.component.html',
  styleUrls: ['./add-todo-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTodoDialogComponent implements OnInit, OnDestroy {

  public formGroup!: FormGroup;

  private _newCategorySelected: boolean = false;

  private _categories?: Category[];

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<AddTodoDialogComponent>,
    private categoriesApiService: CategoriesApiService,
    private todosApiService: TodosApiService,
    private categoriesDataSource: CategoriesDataSourceService
    ) {}

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

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
    return this.formGroup.get(AddTodoDialogConstants.FORM_CONTROL_ACCESSORS.TODO_TEXT)!.value;
  }

  public get newCategoryTitleInput(): String {
    return this.formGroup.get(AddTodoDialogConstants.FORM_CONTROL_ACCESSORS.NEW_CATEGORY_TITLE)!.value;
  }

  public get selectedCategoryId(): String {
    return this.formGroup.get(AddTodoDialogConstants.FORM_CONTROL_ACCESSORS.CATEGORY_SELECT)!.value;
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

  public identifyCategory(index: number, category: Category): Category {
    return category; 
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
    this.formGroup.get(AddTodoDialogConstants.FORM_CONTROL_ACCESSORS.CATEGORY_SELECT)!.valueChanges
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((value: String) => {
      if (value === AddTodoDialogConstants.VALUES.NEW_CATEGORY_VALUE) {
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
