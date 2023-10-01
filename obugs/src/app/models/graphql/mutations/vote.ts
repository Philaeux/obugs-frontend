import { gql } from "apollo-angular";
import { OBugsError, VoteUpdate } from "../../models";
import { ObugsFragments } from "../fragments";


export const MUTATION_VOTE = gql`
    mutation Vote($subjectId: UUID!, $rating: Int!) {
        vote(subjectId: $subjectId, rating: $rating) {
            __typename
            ... on OBugsError {
                message
            }
            ... on VoteUpdate {
                ...VoteUpdateFragment
            }
        }
    }
    ${ObugsFragments.fragments.voteUpdate}
`
export interface MutationResponseVote {
    vote: OBugsError | VoteUpdate
}
