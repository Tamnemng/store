import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { Category, createProduct, Product } from '../services/model';
import { Service } from '../services/services';
import { NzMessageService } from 'ng-zorro-antd/message';
@Injectable({
  providedIn: 'root'
})
export class Store {
  //filter cmm hieu
  filter_id: number | undefined = undefined;
  setFilter(id: number | undefined) {
    this.filter_id = id;
    this.loadProducts();
  }
  // State
  private readonly _categories = new BehaviorSubject<Category[]>([]);
  readonly categories$ = this._categories.asObservable();
  private readonly _products = new BehaviorSubject<Product[]>([]);
  readonly products$ = this._products.asObservable();
  private readonly _product = new BehaviorSubject<createProduct | null>(null);
  readonly product$ = this._product.asObservable();

  // Loading states
  private readonly _categoriesLoading = new BehaviorSubject<boolean>(false);
  readonly categoriesLoading$ = this._categoriesLoading.asObservable();
  private readonly _productsLoading = new BehaviorSubject<boolean>(false);
  readonly productsLoading$ = this._productsLoading.asObservable();
  private readonly _productLoading = new BehaviorSubject<boolean>(false);
  readonly productLoading$ = this._productLoading.asObservable();

  // Error states
  private readonly _error = new BehaviorSubject<string | null>(null);
  readonly error$ = this._error.asObservable();
  
  constructor(
    private service: Service,
    private message: NzMessageService
  ) {}

  async loadCategories() {
    try {
      this._categoriesLoading.next(true);
      this._error.next(null);
      const response = await this.service.getAllCategories();
      const categories = await lastValueFrom(response);
      this._categories.next(categories);
    } catch (error) {
      this.message.error(`Failed to load categories`);
    } finally {
      this._categoriesLoading.next(false);
    }
  }

  async loadProducts() {
    try {
      this._productsLoading.next(true);
      this._error.next(null);
      const response = await this.service.getProducts(this.filter_id);
      const products = await lastValueFrom(response);
      this._products.next(products);
    } catch (error) {
      this.message.error(`Failed to load products`);
    } finally {
      this._productsLoading.next(false);
    }
  }

  async getProduct(id: number, category: number) {
    try {
      this._productLoading.next(true);
      this._error.next(null);
      
      const response = await this.service.getProduct(id, category);
      const product = await lastValueFrom(response);
      this._product.next(product);
    } catch (error) {
      this.message.error(`Failed to load product`);
    } finally {
      this._productLoading.next(false);
    }
  }

  async createProduct(category_id: number, product: createProduct) {
    try {
      this._productsLoading.next(true);
      this._error.next(null);
      const response = await this.service.createProduct(category_id, product);
      await lastValueFrom(response);
      await this.loadProducts();
    } catch (error) {
      this.message.error(`Failed to create product`);
    } finally {
      this.message.success(`Create product Successfully`);
      this._productsLoading.next(false);
    }
  }

  async updateProduct(product_id: number, category: number, updateValue: Product) {
    try {
      this._productsLoading.next(true);
      this._error.next(null);
      
      const response = await this.service.updateProduct(product_id, category, updateValue);
      await lastValueFrom(response);
      await this.loadProducts();
    } catch (error) {
      this.message.error(`Failed to update product`);
    } finally {
      this.message.success(`Create update Successfully`);
      this._productsLoading.next(false);
    }
  }

  async deleteProduct(id: number, category: number) {
    try {
      this._productsLoading.next(true);
      this._error.next(null);
      await this.service.deleteProduct(id, category);
      await this.loadProducts();
    } catch (error) {
      this.message.error(`Failed to delete product`);
    } finally {
      this.message.success(`Delete Successfully`);
      this._productsLoading.next(false);
    }
  }

  get allCategories(): Category[] {
    return this._categories.getValue();
  }

  get allProducts(): Product[] {
    return this._products.getValue();
  }

  clearError() {
    this._error.next(null);
  }
}