import { Injectable } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Todo } from '../components/category-card/models/todo.model';
import { TOGGLE_TODO_COMPLETED } from '../graphql/graphql.mutations';

@Injectable({
  providedIn: 'root'
})
export class TodosApiService {

  constructor(private apollo: Apollo) {}

  public toggleTodoCompleted(todoId: String): Observable<MutationResult<Todo>>{
    return this.apollo.mutate<Todo>({
      mutation: TOGGLE_TODO_COMPLETED,
      variables: {
        todoId
      }
    })
  }
}
