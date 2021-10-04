import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';

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

  constructor(
    private http: HttpClient,
    private cepService: ConsultaCepService
  ) { }

  checkIsValidField(field: any) {
    return !field.valid && field.touched;
  }

  consultaCEP(cep: string, form: any) {
    //Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');

    if(cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)?.subscribe(
        data => this.populaDadosForm(data, form)
      );
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

    this.http.post('https://httpbin.org/post', JSON.stringify(form.value)).subscribe(
      (data) => console.log(data)
    )
  }

  ngOnInit(): void {
  }

}
