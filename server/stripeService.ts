import { getUncachableStripeClient } from './stripeClient';

export class StripeService {
  async createCustomer(email: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.customers.create({
      email,
    });
  }

  async createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string, customerEmail?: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
    });
  }

  async createCustomerPortalSession(customerId: string, returnUrl: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }
}

export const stripeService = new StripeService();
