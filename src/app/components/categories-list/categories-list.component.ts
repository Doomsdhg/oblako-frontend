import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { CategoriesApiService } from 'src/app/services/categories-api.service';
import { CategoriesDataSourceService } from 'src/app/services/categories-data-source.service';
import { Category } from '../category-card/models/category.model';

@Component({
  selector: 'frnt-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesListComponent implements OnInit {

  public categories?: Category[];

  constructor(
    private categoriesApiService: CategoriesApiService,
    private changeDetectorRef: ChangeDetectorRef,
    private categoriesDatasourceService: CategoriesDataSourceService
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  private getCategories(){
    this.categoriesDatasourceService.categoriesSubject.subscribe((updatedCategories: Category[]) => {
      this.categories = plainToInstance(Category, updatedCategories);
      this.changeDetectorRef.detectChanges();
    })
    this.categoriesDatasourceService.loadCategories();
  }
}
