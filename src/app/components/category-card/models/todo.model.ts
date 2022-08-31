import { Category } from "./category.model";

export class Todo {
    id!: string;
    text!: string;
    isCompleted!: boolean;
    categoryId!: String;
    category!: Category;
}
