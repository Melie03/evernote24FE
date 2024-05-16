import { Tag } from "./tag";
export { Tag } from "./tag";

export class TodoTag {
  constructor(
    public id: number,
    public title: string,
    public description:string,
    public due_date:Date,
    public note_id: number,
    public assigned_user_id: number,
    public created_at: Date,
    public updated_at: Date,
    public completed: boolean,
    public tags: any[]) { }
}
