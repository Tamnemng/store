// api-config.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-api-config',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="submitForm()">
      <h2>API Configuration</h2>
      <div class="mb-4">
        <label>API URL</label>
        <input nz-input formControlName="apiUrl" placeholder="https://your-api-url/" />
        <div *ngIf="form.get('apiUrl')?.errors?.['pattern'] && form.get('apiUrl')?.touched" class="text-red-500 text-sm mt-1">
          Please enter a valid URL
        </div>
      </div>
      <div class="flex justify-end gap-2" style="margin-top: 10px;">
        <button nz-button nzType="primary" [disabled]="!form.valid" type="submit">
          Save
        </button>
      </div>
    </form>
  `
})
export class ApiConfigComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef
  ) {
    this.form = this.fb.group({
      apiUrl: ['', [
        Validators.required,
        Validators.pattern('https?://.+')
      ]]
    });
  }

  submitForm() {
    if (this.form.valid) {
      this.modalRef.close(this.form.value.apiUrl);
    }
  }

  cancel() {
    this.modalRef.close();
  }
}