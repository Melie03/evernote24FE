export class ErrorMessage {
  constructor(
    public forControl: string,
    public forValidator: string,
    public text: string
  ) { }
}

export const NoteFormErrorMessages = [
  new ErrorMessage('id', 'required', 'Eine ID muss angegeben werden'),
  new ErrorMessage('title', 'required', 'Ein Titel muss angegeben werden'),
  new ErrorMessage('title', 'minlength', 'Der Titel muss mindestens 5 Zeichen lang sein'),
  new ErrorMessage('title', 'maxlength', 'Der Titel darf höchstens 50 Zeichen lang sein'),
  new ErrorMessage('description', 'required', 'Eine Beschreibung muss angegeben werden'),
  new ErrorMessage('description', 'minlength', 'Die Beschreibung muss mindestens 5 Zeichen lang sein'),
  new ErrorMessage('description', 'maxlength', 'Die Beschreibung darf höchstens 400 Zeichen lang sein'),
  new ErrorMessage('note_list_id', 'required', 'Eine Notizlisten-ID muss angegeben werden'),
  new ErrorMessage('value.title', 'required', 'Ein Titel muss angegeben werden'),
  new ErrorMessage('value.title', 'maxlength', 'Der Titel darf höchstens 15 Zeichen lang sein'),
  /*new ErrorMessage('description', 'required', 'Eine Beschreibung muss angegeben werden'),
  new ErrorMessage('description', 'minlength', 'Die Beschreibung muss mindestens 10 Zeichen lang sein'),
  new ErrorMessage('description', 'maxlength', 'Die Beschreibung darf höchstens 255 Zeichen lang sein'),
  new ErrorMessage('due_date', 'required', 'Ein Fälligkeitsdatum muss angegeben werden'),
  new ErrorMessage('assigned_user_id', 'required', 'Eine zugewiesene Benutzer-ID muss angegeben werden'),
  new ErrorMessage('completed', 'required', 'Der Status "Abgeschlossen" muss angegeben werden')*/
];
