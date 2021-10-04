import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EstadoBr } from '../shared/models/estadobr';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { DropdownService } from '../shared/services/dropdown.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  dataForm!: FormGroup;
  /* estados!: EstadoBr[]; */
  estados!: Observable<EstadoBr[]>;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService
  ) { }

  resetar() {
    this.dataForm.reset();
  }

  checkIsValidField(field: any) {
    return !this.dataForm.get(field)?.valid && (this.dataForm.get(field)?.touched || this.dataForm.get(field)?.dirty);
  }

  checkIsValidEmail(field: any) {
    return this.dataForm.get(field)?.errors?.email && this.dataForm.get(field)?.touched;
  }

  populaDadosForm(data: any) {
    this.dataForm.patchValue({
      endereco: {
        rua: data.logradouro,
        cep: data.cep,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf
      }
    })
  }

  consultaCEP() {
    let cep = this.dataForm.get('endereco.cep')?.value;

    if(cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)?.subscribe(
        data => this.populaDadosForm(data)
      );
    }
  }

  onSubmit(){
    if(this.dataForm.valid) {
      this.http.post('https://httpbin.org/post', JSON.stringify(this.dataForm.value)).subscribe(
        (data) => {
          console.log(data)
          //Reseta o form
          this.resetar();
        },
        (error) => {
          alert('erro')
        }
      )
    }
    else {
      this.checkValidationForm(this.dataForm)
    }
  }

  checkValidationForm(formGroup: FormGroup) {

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);

      control?.markAsDirty();

      if(control instanceof FormGroup) {
        this.checkValidationForm(control);
      }
    })
  }

  ngOnInit(): void {
   /*  this.dropdownService.getEstadosBr().subscribe(
      data => this.estados = data
    ) */

    this.estados = this.dropdownService.getEstadosBr();

    /* this.dataForm = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null),

      endereco: new FormGroup({
        cep: new FormControl(null)
      })
    });
 */
    this.dataForm = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      //Validators.pattern(" Regex")
      email: [null, [Validators.required, Validators.email]],

      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    })
  }

}
