"use client";

import { useEffect, useState } from "react";
import { mockTransactions, Transaction } from "@/lib/transactions";
import { mockUsers, User } from "@/lib/users";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#FF6384", "#36A2EB"];

export default function SuperAdminDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "" });

  useEffect(() => {
    setUsers(mockUsers);
    setTransactions(mockTransactions);
    setIsMobile(window.innerWidth < 768);
  }, []);

  const toggleUserActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
    toast.success("User status updated!");
  };

  const userTotals = users.map((user) => {
    const total = transactions
      .filter((t) => t.userId === user.id && t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: user.name, total, id: user.id };
  });

  const sortedTopUsers = [...userTotals]
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const toggleUser = (name: string) => {
    setFilteredUsers((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const totalPayments = transactions.reduce(
    (sum, t) => (t.type === "debit" ? sum + t.amount : sum),
    0
  );

  const activeUsersCount = users.filter((u) => u.active).length;
  const totalUsersCount = users.length;

  const handleAddAdmin = () => {
    const newUser: User = {
      id: `u${users.length + 1}`,
      name: newAdmin.name,
      email: newAdmin.email,
      role: "Admin",
      active: true,
      totalPayments: 0,
    };
    setUsers([...users, newUser]);
    setNewAdmin({ name: "", email: "" });
    setIsDialogOpen(false);
    toast.success("Admin added successfully");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>System Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Total Payments</p>
            <p className="text-2xl text-red-600 font-semibold">
              <NumericFormat
                value={totalPayments}
                displayType="text"
                thousandSeparator
                suffix=" ETB"
              />
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Users</p>
            <p className="text-2xl text-green-600 font-semibold">
              {activeUsersCount}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-2xl text-blue-600 font-semibold">
              {totalUsersCount}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Spending Charts</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:h-64 h-[480px] -mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout={isMobile ? "vertical" : "horizontal"}
              data={sortedTopUsers.map(({ name, total }) => ({
                name,
                value: filteredUsers.includes(name) ? 0 : total,
              }))}
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
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <div className="flex flex-col md:flex-row gap-4 w-full h-full">
            <ResponsiveContainer width="70%" height={isMobile ? 300 : 250}>
              <PieChart>
                <Pie
                  data={sortedTopUsers.map((d) => ({
                    ...d,
                    value: filteredUsers.includes(d.name) ? 0 : d.total,
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? 70 : 100}
                  innerRadius={isMobile ? 40 : 60}
                  dataKey="value"
                  label
                >
                  {sortedTopUsers.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <ul className="text-sm space-y-1 overflow-auto max-h-[250px]">
              {sortedTopUsers.map(({ name, total }) => (
                <li
                  key={name}
                  onClick={() => toggleUser(name)}
                  className={`cursor-pointer ${
                    filteredUsers.includes(name)
                      ? "line-through text-gray-400"
                      : ""
                  }`}
                >
                  {name}:{" "}
                  <NumericFormat
                    value={total}
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

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Users List & Payment Summary</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Admin</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Name"
                  value={newAdmin.name}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Email"
                  value={newAdmin.email}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, email: e.target.value })
                  }
                />
                <Button className="w-full" onClick={handleAddAdmin}>
                  Submit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <MaterialReactTable
            columns={[
              { accessorKey: "name", header: "Name" },
              { accessorKey: "email", header: "Email" },
              { accessorKey: "role", header: "Role" },
              {
                accessorKey: "active",
                header: "Status",
                Cell: ({ cell }) => (
                  <span
                    className={`font-semibold ${
                      cell.getValue<boolean>()
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {cell.getValue<boolean>() ? "Active" : "Inactive"}
                  </span>
                ),
              },
              {
                accessorKey: "total",
                header: "Total Spent",
                Cell: ({ cell }) => (
                  <NumericFormat
                    value={cell.getValue<number>()}
                    displayType="text"
                    thousandSeparator
                    suffix=" ETB"
                  />
                ),
              },
              {
                id: "actions",
                header: "Action",
                Cell: ({ row }) => (
                  <Button
                    onClick={() => toggleUserActive(row.original.id)}
                    variant="outline"
                  >
                    {row.original.active ? "Deactivate" : "Activate"}
                  </Button>
                ),
              },
            ]}
            data={users.map((u) => ({
              ...u,
              total: userTotals.find((x) => x.id === u.id)?.total || 0,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
