import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { GET_CATEGORIES_WITH_TODOS } from '../graphql/graphql.queries';
import { CategoriesResponseData } from './categories-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesApiService {

  constructor(private apollo: Apollo) {}

  public get categoriesChanges(): Observable<ApolloQueryResult<CategoriesResponseData>>{
    return this.apollo.watchQuery<CategoriesResponseData>({
      query: GET_CATEGORIES_WITH_TODOS
    }).valueChanges;
  }
}
