import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  dataForm!: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) { }

  resetar() {
    this.dataForm.reset();
  }

  checkIsValidField(field: any) {
    return !this.dataForm.get(field)?.valid && this.dataForm.get(field)?.touched;
  }

  checkIsValidEmail(field: any) {
    return this.dataForm.get(field)?.errors?.email && this.dataForm.get(field)?.touched;
  }

  onSubmit(){
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

  ngOnInit(): void {
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
