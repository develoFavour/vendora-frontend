// Base onboarding page structure with routing and flow management
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/lib/onboarding-context';
import { OnboardingLayout } from '@/components/onboarding';
import { SuccessAnimation } from '@/components/onboarding';
import { Card, CardContent } from '@/components/ui/card';
import { Store, ShoppingBag } from 'lucide-react';

// Step Components for Customer Flow
import { CustomerWelcome, CustomerInterests, CustomerPreferences, CustomerProfile } from '@/components/onboarding/customer';

// Step Components for Vendor Flow
import { VendorWelcome, VendorBusinessType, VendorCategories, VendorBusinessDetails, VendorStoreSetup, VendorVerification } from '@/components/onboarding/vendor';

// Define all possible steps for both flows
const CUSTOMER_STEPS = [
  { id: 'welcome', title: 'Welcome', component: CustomerWelcome },
  { id: 'interests', title: 'Interests', component: CustomerInterests },
  { id: 'preferences', title: 'Preferences', component: CustomerPreferences },
  { id: 'profile', title: 'Profile', component: CustomerProfile },
];

const VENDOR_STEPS = [
  { id: 'welcome', title: 'Welcome', component: VendorWelcome },
  { id: 'business-type', title: 'Business Type', component: VendorBusinessType },
  { id: 'categories', title: 'Categories', component: VendorCategories },
  { id: 'business-details', title: 'Business Details', component: VendorBusinessDetails },
  { id: 'store-setup', title: 'Store Setup', component: VendorStoreSetup },
  { id: 'verification', title: 'Verification', component: VendorVerification },
];

// Completion Component
function OnboardingComplete() {
  const { state, getAllFormData } = useOnboarding();
  const router = useRouter();

  const formData = getAllFormData();
  const isVendor = state.userRole === 'vendor';

  const handleComplete = async () => {
    try {
      // Here you would typically submit the onboarding data to your backend
      console.log('Onboarding data:', formData);

      // For now, just redirect to the main app
      router.push(isVendor ? '/vendor/dashboard' : '/marketplace');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <div className="text-center space-y-6">
      <SuccessAnimation
        title={`Welcome to Vendora${isVendor ? ', Vendor!' : '!'}`}
        description={
          isVendor
            ? "Your store setup is complete! You're ready to start selling."
            : "Your profile is set up! Start discovering amazing products."
        }
        onContinue={handleComplete}
      />

      <Card className={`max-w-md mx-auto ${isVendor ? 'bg-terracotta-50/50 border-terracotta-200' : 'bg-sage-50/50 border-sage-200'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4">
            {isVendor ? (
              <Store className="w-8 h-8 text-terracotta-600" />
            ) : (
              <ShoppingBag className="w-8 h-8 text-sage-600" />
            )}
          </div>

          <h3 className="font-semibold mb-2">
            {isVendor ? 'Next Steps for Vendors' : 'What\'s Next?'}
          </h3>

          <div className="text-sm text-muted-foreground space-y-2">
            {isVendor ? (
              <>
                <p>• Add your first products to your store</p>
                <p>• Set up payment processing</p>
                <p>• Customize your store policies</p>
                <p>• Start promoting your products</p>
              </>
            ) : (
              <>
                <p>• Browse products from verified vendors</p>
                <p>• Save items to your wishlist</p>
                <p>• Follow your favorite sellers</p>
                <p>• Make your first purchase</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OnboardingPage() {
  const { state } = useOnboarding();
  const router = useRouter();

  // Check if onboarding is complete
  const isComplete = state.currentStep >= (state.userRole === 'vendor' ? VENDOR_STEPS.length : CUSTOMER_STEPS.length);

  // Redirect if no role selected
  useEffect(() => {
    if (!state.userRole) {
      router.push('/onboarding/role-selection');
      return;
    }
  }, [state.userRole, router]);

  if (!state.userRole) {
    return null; // Will redirect via useEffect
  }

  // Show completion screen if onboarding is done
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage/5 via-background to-terracotta/5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <OnboardingComplete />
          </div>
        </div>
      </div>
    );
  }

  // Get current steps based on role
  const currentSteps = state.userRole === 'vendor' ? VENDOR_STEPS : CUSTOMER_STEPS;

  const currentStepData = currentSteps[state.currentStep];
  const CurrentStepComponent = currentStepData?.component;

  if (!CurrentStepComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Step not found</h2>
          <p className="text-muted-foreground">Please restart the onboarding process.</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingLayout
      steps={currentSteps}
      title={`Welcome to Vendora${state.userRole === 'vendor' ? ' Vendor' : ''}`}
      description={
        state.userRole === 'vendor'
          ? "Let's set up your store and get you ready to start selling"
          : "Let's personalize your shopping experience"
      }
    >
      <CurrentStepComponent />
    </OnboardingLayout>
  );
}
