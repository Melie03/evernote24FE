import { NoteLists } from './note-lists';

export class NoteListFactory {
  static empty(): NoteLists {
    return new NoteLists(0, '', 0, new Date(), new Date(), []);
  }

  static fromObject(rawNoteList: {
    id: number;
    name: string;
    user_id: number;
    created_at: Date | string;
    updated_at: Date | string;
    notes: any[];
  }): NoteLists {
    return new NoteLists(
      rawNoteList.id,
      rawNoteList.name,
      rawNoteList.user_id,
      new Date(rawNoteList.created_at),
      new Date(rawNoteList.updated_at),
      rawNoteList.notes
    );
  }
}
