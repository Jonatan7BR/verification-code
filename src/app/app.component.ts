import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
      digits: this.formBuilder.array(
        Array.from({ length: 6 }, () => this.formBuilder.group({
          digit: new FormControl('', digitValidator)
        })
      ))
    });
    this.enableOrDisableInputs();

    this.codeToCopy = `${Math.floor(Math.random() * 1e+6)}`.padStart(6, '0');
  }

  get digits(): FormArray {
    return this.codeForm.get('digits') as FormArray;
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
      this.digits.at(i).get('digit')?.setValue(chars[j]);
    }

    this.enableOrDisableInputs();
    this.digitInputs.get(pasteEnd - 1)?.nativeElement.focus();
  }

  verifyCode(): void {
    const code = this.digits.getRawValue().map(d => d.digit).join('');
    if (code === this.codeToCopy) {
      alert('Code is correct');
    } else {
      alert('Code is wrong');
    }
  }

  private enableOrDisableInputs(): void {
    for (let i = 1; i <= 5; i++) {
      const current = this.digits.at(i).get('digit');
      const previous = this.digits.at(i - 1).get('digit');
      if (previous?.value) {
        current?.enable();
      } else {
        current?.setValue('');
        current?.disable();
      }
    }
  }
}
