import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MutationResult } from 'apollo-angular';
import { Subject, takeUntil } from 'rxjs';
import { NotifyService } from 'src/app/services/notify.service';
import { Constants } from 'src/app/services/notify.service.constants';
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

  private static readonly REQUIRED_VALIDATION_MESSAGE = 'Требуется заполнить все поля'; 

  private _newCategorySelected: boolean = false;

  private _categories?: Category[];

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<AddTodoDialogComponent>,
    private categoriesApiService: CategoriesApiService,
    private todosApiService: TodosApiService,
    private categoriesDataSource: CategoriesDataSourceService,
    private notifyService: NotifyService,
    private changeDetectorRef: ChangeDetectorRef
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
    return this.newCategorySelected ? [this.customRequiredValidator] : null;
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

  private get customRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const empty = !Boolean(control.value);
      return empty ? {required: AddTodoDialogComponent.REQUIRED_VALIDATION_MESSAGE} : null;
    };
  }

  public closeDialogWithoutRefreshing(): void {
    this.dialogRef.close();
  }

  public handleCreateTodoClick(): void {
    console.log(this.formGroup);
    if (this.formGroup.invalid) {
      this.getFormValidationErrors();
    } else if (this.newCategorySelected){
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

  private addNewCategoryValidators(): void {
    this.formGroup.get(AddTodoDialogConstants.FORM_CONTROL_ACCESSORS.NEW_CATEGORY_TITLE)?.addValidators(this.customRequiredValidator);
    this.formGroup.get(AddTodoDialogConstants.FORM_CONTROL_ACCESSORS.NEW_CATEGORY_TITLE)?.updateValueAndValidity();
  }

  private removeNewCategoryValidators(): void {
    this.formGroup.get(AddTodoDialogConstants.FORM_CONTROL_ACCESSORS.NEW_CATEGORY_TITLE)?.removeValidators(this.customRequiredValidator);
    this.formGroup.get(AddTodoDialogConstants.FORM_CONTROL_ACCESSORS.NEW_CATEGORY_TITLE)?.updateValueAndValidity();
  }

  private showErrors(errorsArray: string[]): void {
    errorsArray.forEach((error) => {
      this.notifyService.showMessage(error, Constants.MESSAGE_TYPES.ERROR);
    })
  }

  private getFormValidationErrors() {
    Object.keys(this.formGroup.controls).forEach(key => {
      const controlErrors: ValidationErrors | null = this.formGroup.get(key)!.errors;
      if (controlErrors !== null) {
        this.showErrors(Object.values(controlErrors))
      }
    });
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
      todoText: new FormControl<String>('', [this.customRequiredValidator]),
      categorySelect: new FormControl<String>('', [this.customRequiredValidator]),
      newCategoryTitle: new FormControl<String>('')
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
    this.addNewCategoryValidators();
  }

  private hideNewCategoryAddingForm(): void {
    this.newCategorySelected = false;
    this.removeNewCategoryValidators();
  }
}
