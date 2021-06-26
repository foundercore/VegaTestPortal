export class ButtonStyleAttributesModel{
    "background" : string = "";
    "border": string = "";
  constructor(background,border) {
    this.background = background;
    if(border==="none") this.border = "none"
    else this.border = "4px solid "+ border;
  }

}
