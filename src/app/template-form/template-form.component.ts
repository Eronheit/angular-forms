import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) { }

  checkIsValidField(field: any) {
    return !field.valid && field.touched;
  }

  consultaCEP(cep: string) {
    //Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {
      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;

       //Valida o formato do CEP.
       if(validacep.test(cep)) {
        this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe(
         (data:any) => console.log(data)
        )
       }
    }
  }

  onSubmit(form: any){
    console.log(form)

    //console.log(this.usuario)
  }

  ngOnInit(): void {
  }

}
