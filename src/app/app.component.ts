import { formatNumber } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
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

  @ViewChildren('digitInputs') digitInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    const digitValidator = [
      Validators.required,
      Validators.maxLength(1),
      Validators.pattern(/\d/)
    ];

    this.codeForm = this.formBuilder.group({
      digit0: new FormControl('', digitValidator),
      digit1: new FormControl('', digitValidator),
      digit2: new FormControl('', digitValidator),
      digit3: new FormControl('', digitValidator),
      digit4: new FormControl('', digitValidator),
      digit5: new FormControl('', digitValidator)
    });
    this.enableOrDisableInputs();

    this.codeToCopy = `${Math.floor(Math.random() * 1e+6)}`.padStart(6, '0');
  }

  focusNext(event: Event, index: number): void {
    this.enableOrDisableInputs();
    if ((event.target as HTMLInputElement).value) {
      this.digitInputs.get(index + 1)?.nativeElement.focus();
    }
  }

  fillFromClipboard(event: ClipboardEvent, index: number): void {
    const pastedText = event.clipboardData?.getData('text').trim();
    if (!pastedText || !/^\d{1,6}$/.test(pastedText)) {
      return;
    }

    const chars = [...pastedText];
    const pasteStart = Math.min(index, 6 - chars.length);
    const pasteEnd = pasteStart + Math.min(6, chars.length);

    for (let i = pasteStart, j = 0; i < pasteEnd; i++, j++) {
      this.codeForm.get(`digit${i}`)?.setValue(chars[j]);
    }
    
    this.enableOrDisableInputs();
    this.digitInputs.get(pasteEnd - 1)?.nativeElement.focus();
  }

  private enableOrDisableInputs(): void {
    Array.from({ length: 5 }, (_, i) => i + 1).forEach(i => {
      const current = this.codeForm.get(`digit${i}`);
      const previous = this.codeForm.get(`digit${i - 1}`);
      if (previous?.value) {
        current?.enable();
      } else {
        current?.setValue('');
        current?.disable();
      }
    });
  }
}
