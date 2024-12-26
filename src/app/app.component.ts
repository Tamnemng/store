import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { HttpClientModule } from '@angular/common/http';
import { Store } from './app.component.store';
import { Service } from '../services/services';
import { Observable } from 'rxjs';
import { Category, Product } from '../services/model';
import { NzMessageService } from 'ng-zorro-antd/message';
const NzModules = [
  NzCollapseModule,
  NzIconModule,
  NzDividerModule,
  NzButtonModule,
  NzGridModule,
  NzFormModule,
  NzSelectModule,
  NzDatePickerModule,
  NzInputModule,
  NzToolTipModule,
  NzSwitchModule,
  NzCheckboxModule,
  NzModalModule,
  NzSpaceModule,
  NzSpinModule,
  NzAlertModule,
  NzInputNumberModule,
  NzTagModule,
  NzDrawerModule,
  NzToolTipModule,
  NzRadioModule,
  NzResultModule,
  NzCardModule,
  NzStepsModule,
  NzTableModule,
  NzAvatarModule,
  HttpClientModule,
  ReactiveFormsModule,
  FormsModule
];

const categoryMapping: { [key: number]: number } = {
  1: 1, // shirt
  2: 2, // paint
  3: 3  // dress
};


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, ...NzModules],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Store, Service]
})
export class AppComponent implements OnInit {
  selectedCategory: number = 0;
  isEdit: boolean = false;
  drawerVisible = false;
  categories$: Observable<Category[]>;
  products$: Observable<Product[]>;
  categoriesLoading$: Observable<boolean>;
  productsLoading$: Observable<boolean>;
  productLoading$: Observable<boolean>;
  productForm: FormGroup;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.categories$ = this.store.categories$;
    this.products$ = this.store.products$;
    this.categoriesLoading$ = this.store.categoriesLoading$;
    this.productsLoading$ = this.store.productsLoading$;
    this.productLoading$ = this.store.productLoading$;
    this.productForm = this.fb.group({
      id: [null],
      brand: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: ['', [Validators.required]],
      name: ['', [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      size: ['', [Validators.required]],
      category: ['', [Validators.required]]
    });
  }

  async applyFilter(): Promise<void> {
    try {
      if (this.selectedCategory === 0) {
        await this.store.loadProducts();
      } else {
        await this.store.setFilter(this.selectedCategory === 0 ? undefined : this.selectedCategory);
        await this.store.loadProducts();
      }
    } catch (error) {
      this.message.error('Failed to apply filter');
    }
  }

  openDrawer(): void {
    this.productForm.reset();
    this.drawerVisible = true;
  }

  async onEdit(productId: number, categoryId: number): Promise<void> {
    try {
      this.isEdit = true;
      await this.store.getProduct(productId, categoryId);
      this.store.product$.subscribe((product) => {
        if (product) {
          this.productForm.patchValue({
            id: product.id,
            brand: product.brand,
            description: product.description,
            image: product.image,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            size: product.size,
            category: product.product_category_id.toString()
          });
          this.drawerVisible = true;
        }
      });
    } catch (error) {
      console.error('Error loading product for edit:', error);
    }
  }
  

  closeDrawer(): void {
    this.drawerVisible = false;
  }

  // In your component
  async submitForm(): Promise<void> {
    if (this.productForm.valid) {
      try {
        const categoryId = Number(this.productForm.get('category')?.value);
        const productId = this.productForm.get('id')?.value;
        const productData = { ...this.productForm.value };
        delete productData.category;
        if (!productId) {
          await this.store.createProduct(categoryId, productData);
        } else {
          await this.store.updateProduct(productId, categoryId, productData);
        }
        
        this.closeDrawer();
        await this.store.loadProducts();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    } else {
      Object.values(this.productForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  async delete(id: number, category: number): Promise<void> {
    try {
      await this.store.deleteProduct(id, category);
      await this.store.loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.store.loadProducts();
      await this.store.loadCategories();
      this.message.success(`Load API Successfully`);
    } catch (error) {
      this.message.error(`Failed to load API`);
    }
  }
}