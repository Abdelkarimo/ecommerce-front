import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/auth/auth';
import { Data } from '../../../core/services/data';


@Component({
  
  selector: 'app-checkout',
  imports: [FormsModule,CommonModule],
  templateUrl: './checkout.html',
})
export class Checkout implements OnInit {
  // Shipping Information
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  address: string = '';
  city: string = '';
  country: string = 'Egypt';
  postalCode: string = '';

  // Payment Method Selection
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

  // Order data
  cartItems: any[] = [];
  subtotal: number = 0;
  shipping: number = 15.00;
  tax: number = 0;
  total: number = 0;

  // Validation
  shippingFormValid: boolean = false;
  // track whether user attempted to submit the form
  submitted: boolean = false;

  constructor(
    private router: Router,
    private auth: Auth,
    private dataService: Data
  ) {}

  ngOnInit(): void {
    this.loadOrderSummary();
  }

  loadOrderSummary(): void {
    // Get cart products from auth service
    const cartProductInfo = this.dataService.getCartItems();
    
    // Fetch full product details
    cartProductInfo.forEach((item: any) => {
      this.dataService.getProductById(item.productId).subscribe({
        next: (data: any) => {
          this.cartItems.push({
            data,
            userId: this.auth.getCurrentUser()?.id,
            quantity: item.quantity
          });
          this.calculateTotals();
        },
        error: (error:any) => console.log(error)
      });
    });
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      const price = item.data.price * (1 - item.data.discountPercentage / 100);
      return sum + (price * item.quantity);
    }, 0);

    this.tax = this.subtotal * 0.14; // 14% tax for Egypt
    this.total = this.subtotal + this.shipping + this.tax;
  }

  validateShippingForm(): boolean {
    this.shippingFormValid = 
      this.firstName.trim() !== '' &&
      this.lastName.trim() !== '' &&
      this.email.trim() !== '' &&
      this.phone.trim() !== '' &&
      this.address.trim() !== '' &&
      this.city.trim() !== '' &&
      this.country.trim() !== '';
    
    return this.shippingFormValid;
  }

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
    // Auto-format card number with spaces
    let value = this.cardNumber.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.cardNumber = formattedValue;
  }

  formatExpiryDate(): void {
    // Auto-format expiry date MM/YY
    let value = this.expiryDate.replace(/\D/g, '');
    if (value.length >= 2) {
      this.expiryDate = value.slice(0, 2) + '/' + value.slice(2, 4);
    } else {
      this.expiryDate = value;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.transferReceipt = file;
    }
  }

  processOrder(): void {
    // mark that the user attempted to submit so template can show warnings
    this.submitted = true;

    // Validate shipping information first
    if (!this.validateShippingForm()) {
      alert('Please fill in all shipping information');
      return;
    }

    // Process payment based on selected method
    if (this.selectedPaymentMethod === 'credit-card') {
      this.processCreditCard();
    } else if (this.selectedPaymentMethod === 'paypal') {
      this.processPayPal();
    } else if (this.selectedPaymentMethod === 'bank-transfer') {
      this.processBankTransfer();
    }
  }

  // Helper methods used by template to determine if a specific field should show a warning
  isFieldInvalid(fieldValue: string | null | undefined): boolean {
    return this.submitted && (!fieldValue || fieldValue.toString().trim() === '');
  }

  // Payment-specific checks
  isCardFieldInvalid(fieldValue: string | null | undefined): boolean {
    return this.submitted && this.selectedPaymentMethod === 'credit-card' && (!fieldValue || fieldValue.toString().trim() === '');
  }

  isPaypalFieldInvalid(fieldValue: string | null | undefined): boolean {
    return this.submitted && this.selectedPaymentMethod === 'paypal' && (!fieldValue || fieldValue.toString().trim() === '');
  }

  isBankFieldInvalid(fieldValue: string | null | undefined): boolean {
    return this.submitted && this.selectedPaymentMethod === 'bank-transfer' && (!fieldValue || fieldValue.toString().trim() === '');
  }

  processCreditCard(): void {
    // Validate credit card fields
    if (!this.cardNumber || !this.cardName || !this.expiryDate || !this.cvv) {
      alert('Please fill in all credit card fields');
      return;
    }

    // Here you would integrate with Stripe
    console.log('Processing credit card payment:', {
      cardNumber: this.cardNumber,
      cardName: this.cardName,
      expiryDate: this.expiryDate,
      cvv: this.cvv,
      amount: this.total,
      shipping: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        address: this.address,
        city: this.city,
        country: this.country,
        postalCode: this.postalCode
      }
    });

    // Clear cart and save order
    const orderId = 'ORD-' + Date.now();
    const userId = this.auth.getCurrentUser()?.id;
    // Save order using Data service
    const order = { 
      orderId, 
      userId, 
      amount: this.total, 
      date: new Date().toISOString(),
      paymentMethod: 'credit-card',
      shipping: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        address: this.address,
        city: this.city,
        country: this.country,
        postalCode: this.postalCode
      }
    };
    this.dataService.saveOrder(order);
    this.dataService.clearCart();

    // Navigate to confirmation
    this.router.navigate(['/order-confirmation']);
  }

  processPayPal(): void {
    if (!this.paypalEmail) {
      alert('Please enter your PayPal email');
      return;
    }

    console.log('Redirecting to PayPal:', {
      email: this.paypalEmail,
      amount: this.total
    });

    // Save order for PayPal processing
    const orderId = 'ORD-' + Date.now();
    const userId = this.auth.getCurrentUser()?.id;
    const order = { 
      orderId, 
      userId, 
      amount: this.total, 
      paypalEmail: this.paypalEmail,
      date: new Date().toISOString(),
      paymentMethod: 'paypal',
      shipping: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        address: this.address,
        city: this.city,
        country: this.country,
        postalCode: this.postalCode
      }
    };
    this.dataService.saveOrder(order);
    this.dataService.clearCart();

    // Simulate PayPal redirect
    alert('Redirecting to PayPal... 💙');
    // In real app: window.location.href = paypalRedirectUrl;
    this.router.navigate(['/order-confirmation']);
  }

  processBankTransfer(): void {
    if (!this.transferReference || !this.transferDate) {
      alert('Please fill in all bank transfer fields');
      return;
    }

    console.log('Processing bank transfer:', {
      reference: this.transferReference,
      date: this.transferDate,
      receipt: this.transferReceipt?.name,
      amount: this.total
    });

    // Save order for verification and clear cart
    const orderId = 'ORD-' + Date.now();
    const userId = this.auth.getCurrentUser()?.id;
    const order = { 
      orderId, 
      userId, 
      amount: this.total, 
      transferReference: this.transferReference, 
      date: new Date().toISOString(),
      paymentMethod: 'bank-transfer',
      shipping: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        address: this.address,
        city: this.city,
        country: this.country,
        postalCode: this.postalCode
      }
    };
    this.dataService.saveOrder(order);
    this.dataService.clearCart();

    alert('Bank transfer details submitted! Awaiting verification. 🏦');
    this.router.navigate(['/order-confirmation']);
  }

  backToCart(): void {
    this.router.navigate(['/cart']);
  }
}