import { Tag } from "./tag";
export { Tag } from "./tag";

export class NoteTag {
  constructor(public id: number, public title: string, public description: string, public note_list_id: number, public created_at: Date, public updated_at: Date, public tags: any []) {}
}
