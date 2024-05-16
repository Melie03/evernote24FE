import { NoteLists } from "./note-lists";
export { NoteLists } from "./note-lists";

export class User {
  constructor(
    public id: number,
    public first_name: string,
    public last_name: string,
    public email: string,
    public password: string,
    public created_at: Date,
    public updated_at: Date,
    public lists: NoteLists[]
  ) {}
}
