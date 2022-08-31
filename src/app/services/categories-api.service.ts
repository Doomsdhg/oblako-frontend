import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { GET_CATEGORIES_WITHOUT_TODOS, GET_CATEGORIES_WITH_TODOS } from '../graphql/graphql.queries';
import { GetCategoriesResponseData } from './interfaces/categories-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesApiService {

  constructor(private apollo: Apollo) {}

  public get categoriesChanges(): Observable<FetchResult<GetCategoriesResponseData>>{
    return this.apollo.subscribe<GetCategoriesResponseData>({
      query: GET_CATEGORIES_WITH_TODOS
    });
  }

  public getCategoriesWithoutTodos(): Observable<MutationResult<GetCategoriesResponseData>> {
    return this.apollo.query<GetCategoriesResponseData>({
      query: GET_CATEGORIES_WITHOUT_TODOS
    });
  }
}
