export class ErrorMessage {
  constructor(
    public forControl: string,
    public forValidator: string,
    public text: string
  ) { }
}

export const NoteListFormErrorMessages = [
  new ErrorMessage('id', 'required', 'Eine ID muss angegeben werden'),
  new ErrorMessage('name', 'required', 'Ein Name muss angegeben werden'),
  new ErrorMessage('name', 'minlength', 'Der Name muss mindestens 5 Zeichen lang sein'),
  new ErrorMessage('name', 'maxlength', 'Der Name darf höchstens 20 Zeichen lang sein'),
  new ErrorMessage('user_id', 'required', 'Eine Benutzer-ID muss angegeben werden'),
];
