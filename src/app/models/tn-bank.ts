import { TnMonHoc } from "./tn-mon-hoc";

export interface TnBank {
    id?: number;
    name: string;
    subject_id: number;
    slug: string;
    desc: string;
    status: number;
    user_id: number;
    name_subject: string;
    parent_id?: number;
    ordering?: number;
    type?: string;
    subject?: TnMonHoc;
}
