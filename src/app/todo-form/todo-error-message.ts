export class ErrorMessage {
  constructor(
    public forControl: string,
    public forValidator: string,
    public text: string
  ) { }
}

export const TodoFormErrorMessages = [
  new ErrorMessage('id', 'required', 'Eine ID muss angegeben werden'),
  new ErrorMessage('title', 'required', 'Ein Titel muss angegeben werden'),
  new ErrorMessage('title', 'maxlength', 'Der Titel darf höchstens 30 Zeichen lang sein'),
  new ErrorMessage('description', 'required', 'Eine Beschreibung muss angegeben werden'),
  new ErrorMessage('description', 'minlength', 'Die Beschreibung muss mindestens 10 Zeichen lang sein'),
  new ErrorMessage('description', 'maxlength', 'Die Beschreibung darf höchstens 255 Zeichen lang sein'),
  new ErrorMessage('due_date', 'required', 'Ein Fälligkeitsdatum muss angegeben werden'),
  new ErrorMessage('completed', 'required', 'Der Status "Abgeschlossen" muss angegeben werden')
];
