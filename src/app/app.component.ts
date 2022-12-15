import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'verification-code';

  codeToCopy = '';
  codeForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    const digitValidator = [
      Validators.required,
      Validators.maxLength(1),
      Validators.pattern(/\d/)
    ];

    this.codeForm = this.formBuilder.group({
      digit1: new FormControl('', digitValidator),
      digit2: new FormControl('', digitValidator),
      digit3: new FormControl('', digitValidator),
      digit4: new FormControl('', digitValidator),
      digit5: new FormControl('', digitValidator),
      digit6: new FormControl('', digitValidator)
    });

    this.codeToCopy = `${Math.floor(Math.random() * 1E+6)}`.padStart(6, '0');
  }
}
