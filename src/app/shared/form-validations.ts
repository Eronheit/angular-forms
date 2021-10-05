import { FormArray, FormControl } from '@angular/forms'
export class FormValidations {
  static requiredMinCheckbox(min = 1): any {
    const validator = (formArray: FormArray) => {
      /* const values = formArray.controls;

      let totalChecked = 0;

      for (let i = 0; i < values.length; i++) {
        if(values[i].value) totalChecked += 1;
      } */

      const totalChecked = formArray.controls
        .map(v => v.value)
        .reduce((acc, current) => current ? acc += 1 : acc, 0)

      return totalChecked >= min ? null : { required: true }
    }

    return validator;
  }

  static cepValidator(control: FormControl) {
    const cep = control.value;

    if(cep && cep !== '') {
      const validacep = /^[0-9]{8}$|^[0-9]{5}-[0-9]{3}$/;

      return validacep.test(cep) ? null : { cepInvalido: true }
    }

    return null;
  }
}
