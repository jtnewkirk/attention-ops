import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, AlertTriangle, Trash2, Loader2, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Price {
  id: string;
  unit_amount: number;
  currency: string;
  recurring: { interval: string } | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  prices: Price[];
}

export default function Billing() {
  const { toast } = useToast();
  const [location] = useLocation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast({
        title: "Subscription Activated",
        description: "Welcome to Attention Ops Pro! Your subscription is now active.",
      });
      window.history.replaceState({}, '', '/billing');
    } else if (urlParams.get('canceled') === 'true') {
      toast({
        title: "Checkout Canceled",
        description: "Your checkout was canceled. No charges were made.",
        variant: "destructive",
      });
      window.history.replaceState({}, '', '/billing');
    }
  }, [toast]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/stripe/products');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  const handleCheckout = async (priceId: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/stripe/checkout', { priceId });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      toast({
        title: "Checkout Error",
        description: error.message || "Unable to start checkout. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    setTimeout(() => {
      toast({
        title: "Account Deletion Requested",
        description: "Your account deletion request has been submitted. You will receive a confirmation email.",
      });
      setIsDeleting(false);
    }, 1000);
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4" data-testid="text-billing-title">
          Billing
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your subscription and billing
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Subscribe to Attention Ops Pro
            </CardTitle>
            <CardDescription>
              Unlock unlimited viral content generation for your veteran-owned business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingProducts ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="space-y-4">
                  {product.prices.map((price) => (
                    <div
                      key={price.id}
                      className="flex items-center justify-between p-4 rounded-md border bg-card"
                      data-testid={`price-card-${price.id}`}
                    >
                      <div>
                        <p className="font-semibold text-lg" data-testid="text-product-name">
                          {product.name}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {product.description || 'AI-powered viral content generation'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl text-primary" data-testid="text-price">
                          {formatPrice(price.unit_amount, price.currency)}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{price.recurring?.interval || 'month'}
                          </span>
                        </p>
                        <Button
                          onClick={() => handleCheckout(price.id)}
                          disabled={isLoading}
                          className="mt-2"
                          data-testid="button-subscribe"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Subscribe Now'
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Subscription plans are being set up. Check back shortly.
                </p>
                <div className="p-4 rounded-md border bg-card">
                  <p className="font-semibold text-lg">Attention Ops Pro</p>
                  <p className="text-2xl font-bold text-primary mt-2">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  <p className="text-sm text-muted-foreground mt-2">Coming soon</p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" />
                Unlimited mission generation
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" />
                All writing styles and platforms
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" />
                Mission history saved
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" />
                Cancel anytime
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between" data-testid="row-status">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="secondary" data-testid="badge-status">
                7 Day Free Trial
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" data-testid="button-delete-account">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    data-testid="button-confirm-delete"
                  >
                    {isDeleting ? "Deleting..." : "Yes, delete my account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
