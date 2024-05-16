import { NoteFactory } from './note-factory';

describe('NoteFactory', () => {
  it('should create an instance', () => {
    expect(new NoteFactory()).toBeTruthy();
  });
});
