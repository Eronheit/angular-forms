import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base-form',
  template: '<div></div>'
})
export abstract class BaseFormComponent implements OnInit {

  form!: FormGroup;

  constructor() { }

  ngOnInit() {
  }

  abstract submit():void;

  checkIsValidField(field: any) {
    return !this.form.get(field)?.valid && (this.form.get(field)?.touched || this.form.get(field)?.dirty);
  }

  checkValidationForm(formGroup: FormGroup | FormArray) {

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);

      control?.markAsDirty();
      control?.markAsTouched();

      if(control instanceof FormGroup || control instanceof FormArray) {
        this.checkValidationForm(control);
      }
    })
  }

  resetar() {
    this.form.reset();
  }

  onSubmit() {
    if(this.form.valid) {
      this.onSubmit();
    }
    else {
      this.checkValidationForm(this.form)
    }
  }
}
