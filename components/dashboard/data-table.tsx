"use client";

import type React from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Column<T> {
	header: string;
	accessor: keyof T | ((row: T) => React.ReactNode);
	className?: string;
}

interface DataTableProps<T> {
	data: T[];
	columns: Column<T>[];
	searchPlaceholder?: string;
	onSearch?: (query: string) => void;
	actions?: React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
	data,
	columns,
	searchPlaceholder = "Search...",
	onSearch,
	actions,
}: DataTableProps<T>) {
	return (
		<>
			{/* Search Bar */}
			{(onSearch || actions) && (
				<Card className="mb-6 p-4">
					<div className="flex gap-4">
						{onSearch && (
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder={searchPlaceholder}
									className="pl-10"
									onChange={(e) => onSearch(e.target.value)}
								/>
							</div>
						)}
						{actions}
					</div>
				</Card>
			)}

			{/* Table */}
			<Card>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b border-border bg-muted/50">
							<tr>
								{columns.map((column, index) => (
									<th
										key={index}
										className="px-6 py-4 text-left text-sm font-semibold"
									>
										{column.header}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{data.map((row) => (
								<tr key={row.id} className="hover:bg-muted/50">
									{columns.map((column, index) => (
										<td
											key={index}
											className={`px-6 py-4 ${column.className || ""}`}
										>
											{typeof column.accessor === "function"
												? column.accessor(row)
												: String(row[column.accessor])}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
		</>
	);
}
