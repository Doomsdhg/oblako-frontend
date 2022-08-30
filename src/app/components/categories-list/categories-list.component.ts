import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { plainToInstance } from 'class-transformer';
import { CategoriesApiService } from 'src/app/services/categories-api.service';
import { GetCategoriesResponseData } from 'src/app/services/interfaces/categories-response.interface';
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
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscribeToCategoriesChanges();
  }

  private subscribeToCategoriesChanges(){
    this.categoriesApiService.categoriesChanges
    .subscribe((response: ApolloQueryResult<GetCategoriesResponseData>) => {
      this.categories = plainToInstance(Category, response.data.categories);
      this.changeDetectorRef.detectChanges();
    });
  }
}
