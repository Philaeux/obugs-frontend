import { gql } from "apollo-angular";
import { Software } from "../../models";
import { ObugsFragments } from "../fragments";


export const QUERY_LIST_SOFTWARE = gql`
    {
        softwares{
            ...SoftwareFragment
        }
    }
    ${ObugsFragments.fragments.software}
`
export interface QueryResponseListSoftware {
    softwares: Software[]
}
