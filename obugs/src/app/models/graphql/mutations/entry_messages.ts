import { gql } from "apollo-angular";
import { Error } from "../../models";

export const MUTATION_DELETE_MESSAGE = gql`
    mutation DeleteMessage($messageId: UUID!) {
        deleteMessage(messageId: $messageId){
            __typename
            ... on Error {
                message
            }
            ... on MessageDeleteSuccess {
                success
            }
        }
    }
`
export interface MessageDeleteSuccess {
    __typename: "MessageDeleteSuccess"
    success: boolean;
}
export interface MutationResponseDeleteMessage {
    deleteMessage: Error | MessageDeleteSuccess
}
