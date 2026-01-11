import { getUncachableStripeClient } from './stripeClient';

async function seedProducts() {
  const stripe = await getUncachableStripeClient();

  console.log('Checking for existing Attention Ops subscription product...');
  
  const existingProducts = await stripe.products.search({
    query: "name:'Attention Ops Pro'"
  });

  if (existingProducts.data.length > 0) {
    console.log('Attention Ops Pro product already exists:', existingProducts.data[0].id);
    
    const prices = await stripe.prices.list({
      product: existingProducts.data[0].id,
      active: true
    });
    
    if (prices.data.length > 0) {
      console.log('Price already exists:', prices.data[0].id);
      return;
    }
  }

  console.log('Creating Attention Ops Pro subscription product...');
  
  const product = await stripe.products.create({
    name: 'Attention Ops Pro',
    description: 'Monthly subscription for AI-powered viral content generation for veteran entrepreneurs',
    metadata: {
      app: 'attention-ops',
      type: 'subscription'
    }
  });

  console.log('Created product:', product.id);

  const monthlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 999,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: {
      plan: 'monthly'
    }
  });

  console.log('Created monthly price ($9.99/month):', monthlyPrice.id);
  console.log('Setup complete!');
}

seedProducts().catch(console.error);
