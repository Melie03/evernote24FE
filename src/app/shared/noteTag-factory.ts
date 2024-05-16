import { Note } from "./note";
import { NoteTag } from "./noteTag";
import { Tag } from "./tag";

export class NoteTagFactory {

    static empty(): NoteTag {

        return new NoteTag(
            0,
            '',
            '',
            0,
            new Date(),
            new Date(),
            []
        );
    }

    static fromObject(rawNote: any): NoteTag {
        return new NoteTag(
            rawNote.id,
            rawNote.title,
            rawNote.description,
            rawNote.note_list_id,
            typeof(rawNote.created_at === 'string') ?
                new Date(rawNote.created_at) : rawNote.created_at,
            typeof(rawNote.updated_at === 'string') ?
                new Date(rawNote.updated_at) : rawNote.updated_at,
            []
        );
    }
}
