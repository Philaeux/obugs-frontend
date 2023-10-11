import { gql } from "apollo-angular";
import { Software, SoftwareSuggestion } from "../../models";
import { ObugsFragments } from "../fragments";


export const QUERY_LIST_SOFTWARE = gql`
    query Softwares($search: String){
        softwares(search: $search) {
            ...SoftwareFragment
        }
    }
    ${ObugsFragments.fragments.software}
`
export interface QueryResponseListSoftware {
    softwares: Software[]
}

export const QUERY_LIST_SOFTWARE_SUGGESTIONS = gql`
    {
        softwareSuggestions {
            ...SoftwareSuggestionFragment
        }
    }
    ${ObugsFragments.fragments.softwareSuggestion}
`
export interface QueryResponseListSoftwareSuggestions {
    softwareSuggestions: SoftwareSuggestion[]
}
