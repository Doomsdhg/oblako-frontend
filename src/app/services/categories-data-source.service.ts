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
export class CategoriesDataSourceService implements OnDestroy {

  public categoriesSubject = new Subject<Category[]>();

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private categoriesApiService: CategoriesApiService,
  ){}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public loadCategories(): void {
    this.categoriesApiService.categoriesChanges
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response: FetchResult<GetCategoriesResponseData>) => {
        this.categoriesSubject.next(plainToInstance(Category, response.data!.categories));
      }
    );
  }
}