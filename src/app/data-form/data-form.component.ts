import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  onSubmit(){
    this.http.post('https://httpbin.org/post', JSON.stringify(this.dataForm.value)).subscribe(
      (data) => console.log(data)
    )
  }

  ngOnInit(): void {
    /* this.dataForm = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null)
    }); */

    this.dataForm = this.formBuilder.group({
      nome: [null],
      email: [null]
    })
  }

}
