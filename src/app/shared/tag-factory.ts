import { Tag } from "./tag";

export class TagFactory {

    static empty(): Tag {
        return new Tag(
            0,
            '',
            new Date(),
            new Date()
        );
    }

    static fromObject(rawTag: any): Tag {
        return new Tag(
            rawTag.id,
            rawTag.name,
            typeof(rawTag.created_at === 'string') ?
                new Date(rawTag.created_at) : rawTag.created_at,
            typeof(rawTag.updated_at === 'string') ?
                new Date(rawTag.updated_at) : rawTag.updated_at
        );
    }
}
