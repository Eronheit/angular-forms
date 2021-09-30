import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: '',
    email: ''
  }

  constructor() { }

  checkIsValidField(field: any) {
    return !field.valid && field.touched;
  }

  onSubmit(form: any){
    console.log(form)

    //console.log(this.usuario)
  }

  ngOnInit(): void {
  }

}
