import { NoteListFactory } from './note-list-factory';

describe('NoteListFactory', () => {
  it('should create an instance', () => {
    expect(new NoteListFactory()).toBeTruthy();
  });
});
