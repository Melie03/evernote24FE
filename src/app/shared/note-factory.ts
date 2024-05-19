import { Note } from "./note";
import { Tag } from "./tag";

export class NoteFactory {

    static empty(): Note {

        return new Note(
            0,
            '',
            '',
            0,
            new Date(),
            new Date(),
            ''
        );
    }

    static fromObject(rawNote: any): Note {
        return new Note(
            rawNote.id,
            rawNote.title,
            rawNote.description,
            rawNote.note_list_id,
            typeof(rawNote.created_at === 'string') ?
                new Date(rawNote.created_at) : rawNote.created_at,
            typeof(rawNote.updated_at === 'string') ?
                new Date(rawNote.updated_at) : rawNote.updated_at,
                rawNote.img

        );
    }
}
