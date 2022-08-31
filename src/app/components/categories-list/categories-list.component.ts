import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesDataSourceService } from 'src/app/services/categories-data-source.service';
import { Category } from '../category-card/models/category.model';

@Component({
  selector: 'frnt-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesListComponent implements OnInit, OnDestroy {

  public categories?: Category[];

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private categoriesDatasourceService: CategoriesDataSourceService
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.getCategories();
  }

  private getCategories(){
    this.categoriesDatasourceService.categoriesSubject
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((updatedCategories: Category[]) => {
      this.categories = plainToInstance(Category, updatedCategories);
      this.changeDetectorRef.detectChanges();
    })
    this.categoriesDatasourceService.loadCategories();
  }
}
