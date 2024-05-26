import { gql } from "apollo-angular";
import { ApiError, OutputVote } from "../../models";
import { ObugsFragments } from "../fragments";


export const MUTATION_VOTE = gql`
    mutation Vote($subjectId: UUID!, $rating: Int!) {
        vote(subjectId: $subjectId, rating: $rating) {
            __typename
            ... on ApiError {
                message
            }
            ... on OutputVote {
                ...OutputVoteFragment
            }
        }
    }
    ${ObugsFragments.fragments.outputVote}
`
export interface MutationResponseVote {
    vote: ApiError | OutputVote
}
