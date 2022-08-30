import { gql } from 'apollo-angular';

export const GET_CATEGORIES_WITH_TODOS = gql`
   query {
      categories {
         id
         title
         todos {
            id
            text
            isCompleted
           }
        }
     }
`;


