import { Note } from "./note";
export { Note } from "./note";
export class NoteLists {
  constructor(
    public id:number,
    public name: string,
    public user_id: number,
    public created_at: Date,
    public updated_at: Date,
    public notes: Note[]
  ){}
}
