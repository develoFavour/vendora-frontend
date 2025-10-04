import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

export default function CustomerProfilePage() {
	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="font-serif text-3xl font-bold">Profile Settings</h1>
				<p className="mt-2 text-muted-foreground">
					Manage your personal information and preferences
				</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Profile Picture */}
				<Card className="p-6">
					<h2 className="mb-4 font-semibold">Profile Picture</h2>
					<div className="flex flex-col items-center">
						<div className="relative">
							<Avatar className="h-32 w-32">
								<AvatarFallback className="bg-accent/10 text-accent text-3xl">
									SJ
								</AvatarFallback>
							</Avatar>
							<Button
								size="icon"
								className="absolute bottom-0 right-0 h-10 w-10 rounded-full"
							>
								<Camera className="h-5 w-5" />
							</Button>
						</div>
						<Button variant="outline" className="mt-4 bg-transparent">
							Change Photo
						</Button>
					</div>
				</Card>

				{/* Personal Information */}
				<Card className="p-6 lg:col-span-2">
					<h2 className="mb-4 font-semibold">Personal Information</h2>
					<div className="space-y-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="firstName">First Name</Label>
								<Input id="firstName" defaultValue="Sarah" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">Last Name</Label>
								<Input id="lastName" defaultValue="Johnson" />
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" defaultValue="sarah@example.com" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone">Phone Number</Label>
							<Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
						</div>

						<Button>Save Changes</Button>
					</div>
				</Card>
			</div>

			{/* Shipping Addresses */}
			<Card className="mt-6 p-6">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="font-semibold">Shipping Addresses</h2>
					<Button variant="outline" size="sm">
						Add Address
					</Button>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<Card className="border-2 border-primary p-4">
						<div className="mb-2 flex items-center justify-between">
							<span className="text-sm font-semibold">Home</span>
							<span className="text-xs text-primary">Default</span>
						</div>
						<p className="text-sm text-muted-foreground">
							123 Main Street
							<br />
							Apartment 4B
							<br />
							Portland, OR 97201
							<br />
							United States
						</p>
						<div className="mt-4 flex gap-2">
							<Button variant="ghost" size="sm">
								Edit
							</Button>
							<Button variant="ghost" size="sm">
								Remove
							</Button>
						</div>
					</Card>

					<Card className="border p-4">
						<div className="mb-2 flex items-center justify-between">
							<span className="text-sm font-semibold">Work</span>
						</div>
						<p className="text-sm text-muted-foreground">
							456 Business Ave
							<br />
							Suite 200
							<br />
							Portland, OR 97204
							<br />
							United States
						</p>
						<div className="mt-4 flex gap-2">
							<Button variant="ghost" size="sm">
								Edit
							</Button>
							<Button variant="ghost" size="sm">
								Remove
							</Button>
						</div>
					</Card>
				</div>
			</Card>
		</div>
	);
}
