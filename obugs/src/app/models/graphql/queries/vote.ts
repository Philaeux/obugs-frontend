import { gql } from "apollo-angular";
import { Vote } from "../../models";
import { ObugsFragments } from "../fragments";


export const QUERY_MY_VOTE = gql`
    query VoteMy($subjectId: UUID!) {
        voteMy(subjectId: $subjectId) {
            ...VoteFragment
        }
    }
    ${ObugsFragments.fragments.vote}
`;
export interface QueryResponseMyVote {
    voteMy: Vote;
}
