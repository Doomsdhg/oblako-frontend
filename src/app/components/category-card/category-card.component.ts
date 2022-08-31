import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import { plainToInstance } from 'class-transformer';
import { ToggleTodoCompletedResponse } from 'src/app/services/interfaces/toggle-todo-completed-response.interface';
import { TodosApiService } from 'src/app/services/todos-api.service';
import { Category } from './models/category.model';
import { Todo } from './models/todo.model';

@Component({
  selector: 'frnt-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryCardComponent implements OnInit {

  @Input()
  public category!: Category;

  constructor(
    private todosApiService: TodosApiService,
    private changeDetectorRef: ChangeDetectorRef
    ){}

    ngOnInit(): void {
      this.sortTodosAlphabetically();
      this.sortTodosByComplecity();
    }

  public toggleTodoCompleted(todoId: String, todoIndex: number): void {
    this.todosApiService.toggleTodoCompleted(todoId)
    .subscribe((response: MutationResult<ToggleTodoCompletedResponse>) => {
      this.category.todos[todoIndex] = plainToInstance(Todo, response.data!.toggleTodoCompleted);
      this.changeDetectorRef.detectChanges();
    });
  }

   private sortTodosByComplecity(): void{
    this.category.todos = this.category.todos
    .sort((firstTodo: Todo, secondTodo: Todo) => {
      const bothEquallyCompleted = firstTodo.isCompleted === secondTodo.isCompleted;
      const onlyFirstIsCompleted = firstTodo.isCompleted && !secondTodo.isCompleted;
      if (bothEquallyCompleted) return 0;
      else if (onlyFirstIsCompleted) return 1;
      else return -1;
    });
   } 

   private sortTodosAlphabetically(): void {
    this.category.todos = this.category.todos
    .sort((firstTodo: Todo, secondTodo: Todo) => {
      return firstTodo.text.localeCompare(secondTodo.text);
    })
   }
}
