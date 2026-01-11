import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, AlertTriangle, Trash2 } from "lucide-react";
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

const mockBilling = {
  status: "Active",
  plan: "Pro Plan",
  nextBillingDate: "February 1, 2025",
  amount: "$29.99/month"
};

export default function Billing() {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between" data-testid="row-status">
              <span className="text-muted-foreground">Status</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50" data-testid="badge-status">
                <CheckCircle className="w-3 h-3 mr-1" />
                {mockBilling.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between" data-testid="row-plan">
              <span className="text-muted-foreground">Current Plan</span>
              <span className="font-medium" data-testid="text-plan">{mockBilling.plan}</span>
            </div>

            <div className="flex items-center justify-between" data-testid="row-amount">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium" data-testid="text-amount">{mockBilling.amount}</span>
            </div>

            <div className="flex items-center justify-between" data-testid="row-next-billing">
              <span className="text-muted-foreground">Next Billing Date</span>
              <span className="font-medium" data-testid="text-next-billing">{mockBilling.nextBillingDate}</span>
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
