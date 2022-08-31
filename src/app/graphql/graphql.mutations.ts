import { gql } from 'apollo-angular';

export const CREATE_TODO_IN_NEW_CATEGORY = gql`
   mutation($categoryName: String!, $todoText: String!) {
      createTodo(input: {
         categoryName: $categoryName,
         text: $todoText
      }) {
         category {
            id
            title
         }
         id
         text
         isCompleted
      }
   }
`;

export const CREATE_TODO_IN_EXISTING_CATEGORY = gql`
mutation($categoryId: String!, $todoText: String!) {
   createTodo(categoryId: $categoryId, input: {
      text: $todoText
   }) {
      category {
         id
         title
      }
      id
      text
      isCompleted
   }
}
`;

export const TOGGLE_TODO_COMPLETED = gql`
   mutation($todoId: String!) {
      toggleTodoCompleted(todoId: $todoId){
         id
         text
         isCompleted
      }
   }
`;

