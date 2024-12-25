import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, createProduct, Product } from './model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiConfigComponent } from '../app/api-compoent/api-compoent.component';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Service {
  private apiUrlSubject = new BehaviorSubject<string | null>(null);
  private apiUrl$ = this.apiUrlSubject.asObservable();

  constructor(
    private http: HttpClient,
    private modalService: NzModalService
  ) {}

  async ensureApiConfigured() {
    if (!this.apiUrlSubject.value) {
      await this.showApiConfig();
    }
    if (!this.apiUrlSubject.value) {
      throw new Error('API URL is required to continue');
    }
    return this.apiUrlSubject.value;
  }
  private isApiConfigModalOpen = false;

  private async showApiConfig() {
    if (this.isApiConfigModalOpen) {
      return;
    }
    
    this.isApiConfigModalOpen = true;
  
    const modal = this.modalService.create({
      nzTitle: 'API Configuration',
      nzContent: ApiConfigComponent,
      nzFooter: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 500
    });
  
    const result = await firstValueFrom(modal.afterClose);
    if (result) {
      const url = result.endsWith('/') ? result : `${result}/`;
      this.apiUrlSubject.next(url);
    }
  
    this.isApiConfigModalOpen = false;
  }

  async getAllCategories() {
    const apiUrl = await this.ensureApiConfigured();
    return this.http.get<Category[]>(`${apiUrl}categories`);
  }

  async getProducts() {
    const apiUrl = await this.ensureApiConfigured();
    return this.http.get<Product[]>(`${apiUrl}products`);
  }

  private generateRandomId(): number {
    return Math.floor(Math.random() * 900) + 100;
  }

  async createProduct(category_id: number, product: createProduct) {
    const apiUrl = await this.ensureApiConfigured();
    const productWithId = {
      ...product,
      id: this.generateRandomId(),
    }
    return this.http.post<createProduct>(
      `${apiUrl}products?category=${category_id}`,
      productWithId
    );
  }

  async updateProduct(product_id: number, category: number, updateValue: Product) {
    const apiUrl = await this.ensureApiConfigured();
    const url = `${apiUrl}products/${product_id}?category=${category}`;
    return this.http.put<createProduct>(url, updateValue);
  }

  async getProduct(product_id: number, category: number) {
    const apiUrl = await this.ensureApiConfigured();
    const url = `${apiUrl}products/${product_id}?category=${category}`;
    return this.http.get<createProduct>(url);
  }

  async deleteProduct(product_id: number, category: number) {
    const apiUrl = await this.ensureApiConfigured();
    const url = `${apiUrl}products/${product_id}?category=${category}`;
    return this.http.delete(url);
  }
}