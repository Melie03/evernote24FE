import { TodoFactory } from './todo-factory';

describe('TodoFactory', () => {
  it('should create an instance', () => {
    expect(new TodoFactory()).toBeTruthy();
  });
});
