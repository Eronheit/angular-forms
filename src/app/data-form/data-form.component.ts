import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { empty, Observable } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { FormValidations } from '../shared/form-validations';
import { EstadoBr } from '../shared/models/estadobr';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { DropdownService } from '../shared/services/dropdown.service';
import { VerificaEmailService } from './services/verifica-email.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {

  /* form!: FormGroup; */
  /* estados!: EstadoBr[]; */
  estados!: Observable<EstadoBr[]>;
  cargos!: any[];
  tecnologias!: any[];

  newsletterOp!: any[];

  frameworks = ["Angular", "React", "Vue", "Sencha"];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    private verificaEmailService: VerificaEmailService
  ) {
    super();
  }

  checkIsValidEmail(field: any) {
    return this.form.get(field)?.errors?.email && this.form.get(field)?.touched;
  }

  populaDadosForm(data: any) {
    this.form.patchValue({
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
    let cep = this.form.get('endereco.cep')?.value;

    if(cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)?.subscribe(
        data => this.populaDadosForm(data)
      );
    }
  }

  setarCargo() {
    const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' }

    this.form.get('cargo')?.setValue(cargo)
  }

  setarTecnologias() {
    this.form.get('tecnologias')?.setValue(['java', 'javascript', 'php']);
  }

  compararCargos(obj1: any, obj2: any) {
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2;
  }

  buildFrameworks() {
    const values = this.frameworks.map(v => new FormControl(false))

    return this.formBuilder.array(values, FormValidations.requiredMinCheckbox(1));

    /* return this.formBuilder.array([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
      new FormControl(false)
    ]) */
  }

  getFrameworksControls() {
    return this.form.get('frameworks') ? (<FormArray>this.form.get('frameworks')).controls : null;
  }

  validarEmail(formControl: FormControl) {
    return this.verificaEmailService.verificarEmail(formControl.value).pipe(
      map(emailExists => emailExists ? { emailInvalido: true } : null)
    )
  }

  submit() {
    let valueSubmit = Object.assign({}, this.form.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks.map((v: any, i: any) => v ? this.frameworks[i] : null).filter((v: any) => v !== null)
    });

    this.http.post('https://httpbin.org/post', JSON.stringify(valueSubmit)).subscribe(
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
    this.verificaEmailService.verificarEmail('email@email.com').subscribe();

   /*  this.dropdownService.getEstadosBr().subscribe(
      data => this.estados = data
    ) */

    this.estados = this.dropdownService.getEstadosBr();

    this.cargos = this.dropdownService.getCargos();

    this.tecnologias =  this.dropdownService.getTecnologias();

    this.newsletterOp = this.dropdownService.getNewsletter()

    /* this.form = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null),

      endereco: new FormGroup({
        cep: new FormControl(null)
      })
    });
 */
    this.form = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
      //Validators.pattern(" Regex")
      email: [null, [Validators.required, Validators.email], [this.validarEmail.bind(this)]],
      confirmEmail: [null, FormValidations.equalsTo('email')],

      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidations.cepValidator]],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      }),

      cargo: [null],
      tecnologias: [null],

      newsletter: ['s'],

      termos: [null, Validators.requiredTrue],

      frameworks: this.buildFrameworks()
    });

    this.form.get('endereco.cep')?.statusChanges
      .pipe(
        distinctUntilChanged(),
        tap(value => console.log('status CEP:', value)),
        switchMap(status => status === 'VALID' ?
          this.cepService.consultaCEP(this.form.get('endereco.cep')?.value)
          : empty()
        )
      ).subscribe(dados => dados ? this.populaDadosForm(dados) : {});
  }

}
