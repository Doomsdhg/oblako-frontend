import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import { plainToInstance } from 'class-transformer';
import { TodosApiService } from 'src/app/services/todos-api.service';
import { Category } from './models/category.model';
import { Todo } from './models/todo.model';

@Component({
  selector: 'frnt-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryCardComponent {

  @Input()
  category!: Category;

  constructor(
    private todosApiService: TodosApiService,
    private changeDetectorRef: ChangeDetectorRef
    ){}

  public toggleTodoCompleted(todoId: String, todoIndex: number): void {
    this.todosApiService.toggleTodoCompleted(todoId)
    .subscribe((response: MutationResult<Todo>) => {
      this.category.todos[todoIndex] = plainToInstance(Todo, response.data);
      this.changeDetectorRef.detectChanges();
    });
  }
}
