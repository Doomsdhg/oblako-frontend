import { gql } from 'apollo-angular';

export const CREATE_TODO_IN_NEW_CATEGORY = gql`
    mutation($categoryName: String!, $todoText: String!) {
        createTodo(input: {
           categoryName: $categoryName,
           text: $todoText
        }) {
           category: {
              id
              title
           }
           id
           text
           isCompleted
        }
      }
`;


