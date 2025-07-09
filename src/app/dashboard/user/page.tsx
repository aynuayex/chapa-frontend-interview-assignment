// app/dashboard/user/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  fetchUserTransactions,
  fetchUserWalletBalance,
  submitTransaction,
} from "@/lib/api";
import { Transaction } from "@/lib/transactions";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { MaterialReactTable } from "material-react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { NumericFormat } from "react-number-format";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#FF6384", "#36A2EB"];

export default function UserDashboard() {
const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [wallet, setWallet] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState({
    amount: "",
    description: "",
    category: "Other",
  });
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchUserWalletBalance().then(setWallet);
    fetchUserTransactions().then(setTransactions);
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    toast.loading("Processing transaction...");
    const result = await submitTransaction(form);
    if (result) {
    //   setTransactions(result);
      toast.success("Transaction submitted successfully!");
      setForm({ amount: "", description: "", category: "Other" });
      setIsDialogOpen(false);
    }
  };

  const spendingTransactions = transactions.filter((t) => t.type === "debit");
  const totalSpent = spendingTransactions.reduce((sum, t) => sum + t.amount, 0);

  const spendingByCategory = spendingTransactions.reduce((acc, txn) => {
    const isFiltered = filteredCategories.includes(txn.category);
    acc[txn.category] = (acc[txn.category] || 0) + (!isFiltered ? txn.amount : 0);
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(spendingByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const toggleCategory = (category: string) => {
    setFilteredCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Wallet & Spending Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Wallet Balance</p>
            <p className="text-2xl text-green-600 font-semibold">
              {wallet !== null ? (
                <NumericFormat
                  value={wallet}
                  displayType="text"
                  thousandSeparator
                  suffix=" ETB"
                />
              ) : (
                "Loading..."
              )}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Spent</p>
            <p className="text-2xl text-red-600 font-semibold">
              <NumericFormat
                value={totalSpent}
                displayType="text"
                thousandSeparator
                suffix=" ETB"
              />
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">By Category</p>
            <ul className="flex gap-x-3 text-sm">
              {Object.entries(spendingByCategory).map(([category, value]) => (
                <li
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`cursor-pointer ${
                    filteredCategories.includes(category) ? "line-through text-gray-400" : ""
                  }`}
                >
                  {category}:{" "}
                  <NumericFormat
                    value={value}
                    displayType="text"
                    thousandSeparator
                    suffix=" ETB"
                  />
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Charts</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:h-64 h-[580px] -mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout={isMobile ? "vertical" : "horizontal"}
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              {isMobile ? (
                <>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                </>
              ) : (
                <>
                  <XAxis dataKey="name" />
                  <YAxis />
                </>
              )}
              <Tooltip />
              {/* <Legend /> */}
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 70 : 100}
                innerRadius={isMobile ? 40 : 60}
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Recent Transactions</CardTitle>
          <Dialog  open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Transaction</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Transaction</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Amount"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  type="number"
                  required
                />
                <Input
                  placeholder="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Bills</option>
                  <option>Shopping</option>
                  <option>Other</option>
                </select>
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <MaterialReactTable
            columns={[
              {
                accessorKey: "date",
                header: "Date",
                Cell: ({ cell }) => {
                  const d = new Date(cell.getValue<string>());
                  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`;
                },
              },
              { accessorKey: "description", header: "Description" },
              { accessorKey: "category", header: "Category" },
              {
                accessorKey: "amount",
                header: "Amount (ETB)",
                Cell: ({ cell }) => (
                  <NumericFormat
                    value={cell.getValue<number>()}
                    displayType="text"
                    thousandSeparator
                    suffix=" ETB"
                  />
                ),
              },
              { accessorKey: "type", header: "Type" },
            ]}
            data={transactions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
