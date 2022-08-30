import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { GET_CATEGORIES_WITHOUT_TODOS, GET_CATEGORIES_WITH_TODOS } from '../graphql/graphql.queries';
import { GetCategoriesResponseData } from './interfaces/categories-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesApiService {

  constructor(private apollo: Apollo) {}

  public get categoriesChanges(): Observable<ApolloQueryResult<GetCategoriesResponseData>>{
    return this.apollo.watchQuery<GetCategoriesResponseData>({
      query: GET_CATEGORIES_WITH_TODOS
    }).valueChanges;
  }

  public getCategoriesWithoutTodos(): Observable<MutationResult<GetCategoriesResponseData>> {
    return this.apollo.mutate<GetCategoriesResponseData>({
      mutation: GET_CATEGORIES_WITHOUT_TODOS
    });
  }
}
