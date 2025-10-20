// checkout.component.ts - REFACTORED FOR REACTIVE APPROACH
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Products } from '../../../core/services/products.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.html',
})
export class CheckoutComponent implements OnInit, OnDestroy {
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
  submitted: boolean = false;

  // Subscription management
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private productsService: Products
  ) {}

  ngOnInit(): void {
    this.loadOrderSummary();
  }

  loadOrderSummary(): void {
    // Subscribe to cart changes (reactive!)
    this.productsService.cartProducts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cartProductInfo => {
        // Clear existing items
        this.cartItems = [];
        this.subtotal = 0;
        this.tax = 0;
        this.total = 0;

        if (cartProductInfo.length === 0) {
          // Cart is empty
          return;
        }

        // Fetch full product details for each cart item
        cartProductInfo.forEach((item: any) => {
          this.productsService.GetProductsById(item.prodId).subscribe({
            next: (data: any) => {
              // Check if item already exists (prevent duplicates)
              const existingIndex = this.cartItems.findIndex(ci => ci.data.id === data.id);
              
              if (existingIndex === -1) {
                // Add new item
                this.cartItems.push({
                  data,
                  userId: item.userId,
                  quantity: item.amount
                });
              } else {
                // Update existing item
                this.cartItems[existingIndex].quantity = item.amount;
              }

              this.calculateTotals();
            },
            error: (error: any) => console.log(error)
          });
        });
      });

    // Also subscribe to total updates
    this.productsService.totalSum$
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalSum => {
        // If cart component calculated a total, we can use it
        if (totalSum > 0 && this.cartItems.length > 0) {
          this.subtotal = totalSum;
          this.tax = this.subtotal * 0.14;
          this.total = this.subtotal + this.shipping + this.tax;
        }
      });
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      const price = item.data.price * (1 - item.data.discountPercentage / 100);
      return sum + (price * item.quantity);
    }, 0);

    this.tax = this.subtotal * 0.14; // 14% tax for Egypt
    this.total = this.subtotal + this.shipping + this.tax;
    
    // Round to 2 decimal places
    this.subtotal = Number(this.subtotal.toFixed(2));
    this.tax = Number(this.tax.toFixed(2));
    this.total = Number(this.total.toFixed(2));
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
    // Mark that the user attempted to submit
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

  // Helper methods for template validation
  isFieldInvalid(fieldValue: string | null | undefined): boolean {
    return this.submitted && (!fieldValue || fieldValue.toString().trim() === '');
  }

  isCardFieldInvalid(fieldValue: string | null | undefined): boolean {
    return this.submitted && this.selectedPaymentMethod === 'credit-card' && 
           (!fieldValue || fieldValue.toString().trim() === '');
  }

  isPaypalFieldInvalid(fieldValue: string | null | undefined): boolean {
    return this.submitted && this.selectedPaymentMethod === 'paypal' && 
           (!fieldValue || fieldValue.toString().trim() === '');
  }

  isBankFieldInvalid(fieldValue: string | null | undefined): boolean {
    return this.submitted && this.selectedPaymentMethod === 'bank-transfer' && 
           (!fieldValue || fieldValue.toString().trim() === '');
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

    // Save order and clear cart
    const orderId = 'ORD-' + Date.now();
    const userId = this.cartItems.length ? this.cartItems[0].userId : 1;
    
    this.productsService.SaveOrder({
      orderId,
      userId,
      amount: this.total,
      items: this.cartItems,
      shipping: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        address: this.address,
        city: this.city,
        country: this.country,
        postalCode: this.postalCode
      },
      paymentMethod: 'credit-card',
      date: new Date().toISOString()
    });

    // Clear cart (triggers reactive update)
    this.productsService.ClearCart();

    alert('Payment successful! ✅');
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

    // Save order
    const orderId = 'ORD-' + Date.now();
    const userId = this.cartItems.length ? this.cartItems[0].userId : 1;
    
    this.productsService.SaveOrder({
      orderId,
      userId,
      amount: this.total,
      items: this.cartItems,
      paymentMethod: 'paypal',
      paypalEmail: this.paypalEmail,
      date: new Date().toISOString()
    });

    // Simulate PayPal redirect
    alert('Redirecting to PayPal... 💙');
    // In real app: window.location.href = paypalRedirectUrl;
    
    this.productsService.ClearCart();
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

    // Save order for verification
    const orderId = 'ORD-' + Date.now();
    const userId = this.cartItems.length ? this.cartItems[0].userId : 1;
    
    this.productsService.SaveOrder({
      orderId,
      userId,
      amount: this.total,
      items: this.cartItems,
      paymentMethod: 'bank-transfer',
      transferReference: this.transferReference,
      transferDate: this.transferDate,
      date: new Date().toISOString()
    });

    // Clear cart
    this.productsService.ClearCart();

    alert('Bank transfer details submitted! Awaiting verification. 🏦');
    this.router.navigate(['/order-confirmation']);
  }

  backToCart(): void {
    this.router.navigate(['/cart']);
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}