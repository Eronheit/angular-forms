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

  consultaCEP(cep: string, form: any) {
    //Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {
      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;

       //Valida o formato do CEP.
       if(validacep.test(cep)) {
        this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe(
         (data:any) => {
           console.log(data)
           this.populaDadosForm(data, form)
          }
        )
       }
    }
  }

  populaDadosForm(data: any, form: any) {
    console.log(form.value);

    form.form.patchValue({
       endereco: {
         cep: data.cep,
         rua: data.logradouro,
         complemento: data.complemento,
         bairro: data.bairro,
         cidade: data.localidade,
         estado: data.uf
       }
    });
  }

  onSubmit(form: any){
    console.log(form)

    //console.log(this.usuario)
  }

  ngOnInit(): void {
  }

}
