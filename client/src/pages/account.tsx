import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield } from "lucide-react";

const mockUser = {
  id: "usr_001",
  fullName: "John Veteran",
  email: "john.veteran@email.com",
  memberSince: "January 2025",
  accountType: "Pro Member"
};

export default function Account() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4" data-testid="text-account-title">
          Account
        </h1>
        <p className="text-lg text-muted-foreground">
          Your profile and membership information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold" data-testid="text-user-name">{mockUser.fullName}</h2>
              <Badge variant="secondary" data-testid="badge-account-type">{mockUser.accountType}</Badge>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center gap-3" data-testid="row-email">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium" data-testid="text-user-email">{mockUser.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3" data-testid="row-member-since">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium" data-testid="text-member-since">{mockUser.memberSince}</p>
              </div>
            </div>

            <div className="flex items-center gap-3" data-testid="row-member-id">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Member ID</p>
                <p className="font-mono text-sm" data-testid="text-member-id">{mockUser.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
