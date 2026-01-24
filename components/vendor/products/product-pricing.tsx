"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductStore } from "@/stores/product-store";

export function ProductPricing() {
	const { data, updateData } = useProductStore();

	const calculateProfit = () => {
		const price = parseFloat(data.salePrice || data.price || "0");
		const cost = parseFloat(data.costPrice || "0");
		if (price && cost) {
			const profit = price - cost;
			const margin = (profit / price) * 100;
			return { profit: profit.toFixed(2), margin: margin.toFixed(1) };
		}
		return null;
	};

	const profitInfo = calculateProfit();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Pricing</CardTitle>
				<CardDescription>
					Set your product pricing and tax rates.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-6">
				<div className="grid grid-cols-2 gap-4">
					<div className="grid gap-3">
						<Label htmlFor="price">Base Price</Label>
						<div className="relative">
							<span className="absolute left-3 top-2.5 text-muted-foreground">
								$
							</span>
							<Input
								id="price"
								type="number"
								placeholder="0.00"
								className="pl-7"
								value={data.price}
								onChange={(e) => updateData({ price: e.target.value })}
							/>
						</div>
					</div>
					<div className="grid gap-3">
						<Label htmlFor="sale-price">Sale Price</Label>
						<div className="relative">
							<span className="absolute left-3 top-2.5 text-muted-foreground">
								$
							</span>
							<Input
								id="sale-price"
								type="number"
								placeholder="0.00"
								className="pl-7"
								value={data.salePrice}
								onChange={(e) => updateData({ salePrice: e.target.value })}
							/>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div className="grid gap-3">
						<Label htmlFor="cost-price">Cost per Item</Label>
						<div className="relative">
							<span className="absolute left-3 top-2.5 text-muted-foreground">
								$
							</span>
							<Input
								id="cost-price"
								type="number"
								placeholder="0.00"
								className="pl-7"
								value={data.costPrice}
								onChange={(e) => updateData({ costPrice: e.target.value })}
							/>
						</div>
						<p className="text-[0.8rem] text-muted-foreground">
							Customers won&apos;t see this.
						</p>
					</div>
					<div className="grid gap-3">
						<Label htmlFor="tax-rate">Tax Rate (%)</Label>
						<Input
							id="tax-rate"
							type="number"
							placeholder="0"
							value={data.taxRate}
							onChange={(e) => updateData({ taxRate: e.target.value })}
						/>
					</div>
				</div>

				{profitInfo && (
					<div className="rounded-md bg-muted/40 p-4 flex items-center justify-between text-sm">
						<div>
							<span className="text-muted-foreground">Estimated Profit:</span>
							<span className="ml-2 font-medium text-green-600 dark:text-green-400">
								${profitInfo.profit}
							</span>
						</div>
						<div>
							<span className="text-muted-foreground">Margin:</span>
							<span className="ml-2 font-medium">{profitInfo.margin}%</span>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
