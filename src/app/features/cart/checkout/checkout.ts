/**
 * Checkout Component
 * ------------------
 * Handles checkout operations including:
 * - Collecting and validating shipping details
 * - Processing multiple payment methods (credit card, PayPal, bank transfer)
 * - Calculating order totals and taxes
 * - Saving order data and clearing the cart
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/auth/auth';
import { Data } from '../../../core/services/data';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.html',
})
export class Checkout implements OnInit {
  // ===== Shipping Information =====
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  address: string = '';
  city: string = '';
  country: string = 'Egypt';
  postalCode: string = '';

  // ===== Payment Method Selection =====
  selectedPaymentMethod: string = 'credit-card';

  // Credit Card fields
  cardNumber: string = '';
  cardName: string = '';
  expiryDate: string = '';
  cvv: string = '';

  // PayPal fields
  paypalEmail: string = '';

  // Bank Transfer fields
  transferReference: string = '';
  transferDate: string = '';
  transferReceipt: File | null = null;

  // ===== Order Data =====
  cartItems: any[] = [];
  subtotal: number = 0;
  shipping: number = 15.0;
  tax: number = 0;
  total: number = 0;

  // ===== Validation =====
  shippingFormValid: boolean = false;
  submitted: boolean = false;

  constructor(
    private router: Router,
    private auth: Auth,
    private dataService: Data
  ) {}

  // Load cart details and calculate totals
  ngOnInit(): void {
    this.loadOrderSummary();
  }

  loadOrderSummary(): void {
    const cartProductInfo = this.dataService.getCartItems();

    cartProductInfo.forEach((item: any) => {
      this.dataService.getProductById(item.productId).subscribe({
        next: (data: any) => {
          this.cartItems.push({
            data,
            userId: this.auth.getCurrentUser()?.id,
            quantity: item.quantity,
          });
          this.calculateTotals();
        },
        error: (error: any) => console.log(error),
      });
    });
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      const price = item.data.price * (1 - item.data.discountPercentage / 100);
      return sum + price * item.quantity;
    }, 0);

    this.tax = this.subtotal * 0.14; // 14% VAT (Egypt)
    this.total = this.subtotal + this.shipping + this.tax;
  }

  validateShippingForm(): boolean {
    this.shippingFormValid =
      this.firstName.trim() &&
      this.lastName.trim() &&
      this.email.trim() &&
      this.phone.trim() &&
      this.address.trim() &&
      this.city.trim() &&
      this.country.trim()
        ? true
        : false;
    return this.shippingFormValid;
  }

  // ===== Payment Method Handling =====
  onPaymentMethodChange(method: string): void {
    this.selectedPaymentMethod = method;
    this.resetPaymentFields();
  }

  resetPaymentFields(): void {
    this.cardNumber = '';
    this.cardName = '';
    this.expiryDate = '';
    this.cvv = '';
    this.paypalEmail = '';
    this.transferReference = '';
    this.transferDate = '';
    this.transferReceipt = null;
  }

  formatCardNumber(): void {
    const value = this.cardNumber.replace(/\s/g, '');
    this.cardNumber = value.match(/.{1,4}/g)?.join(' ') || value;
  }

  formatExpiryDate(): void {
    const value = this.expiryDate.replace(/\D/g, '');
    this.expiryDate =
      value.length >= 2 ? value.slice(0, 2) + '/' + value.slice(2, 4) : value;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) this.transferReceipt = file;
  }

  // ===== Order Processing =====
  processOrder(): void {
    this.submitted = true;

    if (!this.validateShippingForm()) {
      alert('Please fill in all shipping information');
      return;
    }

    switch (this.selectedPaymentMethod) {
      case 'credit-card':
        this.processCreditCard();
        break;
      case 'paypal':
        this.processPayPal();
        break;
      case 'bank-transfer':
        this.processBankTransfer();
        break;
    }
  }

  // ===== Field Validation Helpers =====
  isFieldInvalid(fieldValue: string | null | undefined): boolean {
    return this.submitted && (!fieldValue || fieldValue.trim() === '');
  }

  isCardFieldInvalid(fieldValue: string | null | undefined): boolean {
    return (
      this.submitted &&
      this.selectedPaymentMethod === 'credit-card' &&
      (!fieldValue || fieldValue.trim() === '')
    );
  }

  isPaypalFieldInvalid(fieldValue: string | null | undefined): boolean {
    return (
      this.submitted &&
      this.selectedPaymentMethod === 'paypal' &&
      (!fieldValue || fieldValue.trim() === '')
    );
  }

  isBankFieldInvalid(fieldValue: string | null | undefined): boolean {
    return (
      this.submitted &&
      this.selectedPaymentMethod === 'bank-transfer' &&
      (!fieldValue || fieldValue.trim() === '')
    );
  }

  // ===== Payment Processing Methods =====
  processCreditCard(): void {
    if (!this.cardNumber || !this.cardName || !this.expiryDate || !this.cvv) {
      alert('Please fill in all credit card fields');
      return;
    }

    const orderId = 'ORD-' + Date.now();
    const userId = this.auth.getCurrentUser()?.id;
    const order = {
      orderId,
      userId,
      amount: this.total,
      date: new Date().toISOString(),
      paymentMethod: 'credit-card',
      shipping: this.getShippingData(),
    };

    this.dataService.saveOrder(order);
    this.router.navigate(['/order-confirmation']);
  }

  processPayPal(): void {
    if (!this.paypalEmail) {
      alert('Please enter your PayPal email');
      return;
    }

    const orderId = 'ORD-' + Date.now();
    const userId = this.auth.getCurrentUser()?.id;
    const order = {
      orderId,
      userId,
      amount: this.total,
      paypalEmail: this.paypalEmail,
      date: new Date().toISOString(),
      paymentMethod: 'paypal',
      shipping: this.getShippingData(),
    };

    this.dataService.saveOrder(order);
    alert('Redirecting to PayPal...');
    this.router.navigate(['/order-confirmation']);
  }

  processBankTransfer(): void {
    if (!this.transferReference || !this.transferDate) {
      alert('Please fill in all bank transfer fields');
      return;
    }

    const orderId = 'ORD-' + Date.now();
    const userId = this.auth.getCurrentUser()?.id;
    const order = {
      orderId,
      userId,
      amount: this.total,
      transferReference: this.transferReference,
      date: new Date().toISOString(),
      paymentMethod: 'bank-transfer',
      shipping: this.getShippingData(),
    };

    this.dataService.saveOrder(order);
    
    alert('Bank transfer details submitted! Awaiting verification.');
    this.router.navigate(['/order-confirmation']);
  }

  // ===== Helpers =====
  private getShippingData() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      address: this.address,
      city: this.city,
      country: this.country,
      postalCode: this.postalCode,
    };
  }

  backToCart(): void {
    this.router.navigate(['/cart']);
  }
}
