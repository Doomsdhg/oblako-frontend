import { Injectable, OnDestroy } from '@angular/core';
import { ApolloQueryResult, FetchResult } from '@apollo/client/core';
import { plainToInstance } from 'class-transformer';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Category } from '../components/category-card/models/category.model';
import { Todo } from '../components/category-card/models/todo.model';
import { CategoriesApiService } from './categories-api.service';
import { GetCategoriesResponseData } from './interfaces/categories-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesDataSourceService {

  public categoriesSubject = new Subject<Category[]>();

  constructor(
    private categoriesApiService: CategoriesApiService,
  ){}

  public loadCategories(): void {
    this.categoriesApiService.categoriesChanges
    .subscribe((response: FetchResult<GetCategoriesResponseData>) => {
        this.categoriesSubject.next(plainToInstance(Category, response.data!.categories));
      }
    );
  }
}