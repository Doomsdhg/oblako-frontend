import { Category } from "./category.model";

export class Todo {
    id!: String;
    text!: String;
    isCompleted!: boolean;
    categoryId!: String;
    category!: Category;
}
