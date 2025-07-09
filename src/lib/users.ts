export type User = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  role: "User" | "Admin" | "Super Admin";
  totalPayments: number;
};

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Abel Teshome",
    email: "abel@chapa.test",
    active: true,
    role: "User",
    totalPayments: 2400,
  },
  {
    id: "u2",
    name: "Selam Tarekegn",
    email: "selam@chapa.test",
    active: false,
    role: "User",
    totalPayments: 1300,
  },
  {
    id: "u3",
    name: "Mikiyas Dagne",
    email: "miki@chapa.test",
    active: true,
    role: "Admin",
    totalPayments: 5100,
  },
  {
    id: "u4",
    name: "Yordanos Worku",
    email: "yorda@chapa.test",
    active: true,
    role: "Super Admin",
    totalPayments: 7200,
  },
];

