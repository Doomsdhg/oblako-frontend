import { Injectable } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { CREATE_TODO_IN_EXISTING_CATEGORY, CREATE_TODO_IN_NEW_CATEGORY, TOGGLE_TODO_COMPLETED } from '../graphql/graphql.mutations';
import { ToggleTodoCompletedResponse } from './interfaces/toggle-todo-completed-response.interface';

@Injectable({
  providedIn: 'root'
})
export class TodosApiService {

  constructor(private apollo: Apollo) {}

  public toggleTodoCompleted(todoId: String): Observable<MutationResult<ToggleTodoCompletedResponse>>{
    return this.apollo.mutate<ToggleTodoCompletedResponse>({
      mutation: TOGGLE_TODO_COMPLETED,
      variables: {
        todoId
      }
    })
  }

  public createTodoInNewCategory(todoText: String, newCategoryName: String): Observable<MutationResult<any>> {
    return this.apollo.mutate({
      mutation: CREATE_TODO_IN_NEW_CATEGORY,
      variables: {
        todoText,
        categoryName: newCategoryName
      }
    })
  }

  public createTodoInExistingCategory(todoText: String, categoryId: String): Observable<MutationResult<any>> {
    return this.apollo.mutate({
      mutation: CREATE_TODO_IN_EXISTING_CATEGORY,
      variables: {
        todoText,
        categoryId
      }
    })
  }
}
