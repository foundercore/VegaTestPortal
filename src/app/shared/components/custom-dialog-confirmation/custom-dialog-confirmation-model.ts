export class CustomDialogConfirmationModel {
  constructor(
    public title: string,
    public message: string,
    public primarybtnText?: string,
    public secondarybtnText?: string
  ) {}
}
