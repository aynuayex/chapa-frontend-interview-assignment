export type Transaction = {
  id: string;
  userId: string;
  date: string;
  amount: number;
  type: "credit" | "debit";
  category: "Food" | "Bills" | "Shopping" | "Transport" | "Other";
  description: string;
};

export const mockTransactions: Transaction[] = [
  {
    id: "txn1",
    userId: "u1",
    date: "2025-07-01T13:30:00",
    amount: 250,
    type: "debit",
    category: "Food",
    description: "Lunch at Debonairs",
  },
  {
    id: "txn2",
    userId: "u1",
    date: "2025-07-03T10:15:00",
    amount: 120,
    type: "debit",
    category: "Transport",
    description: "Taxi ride",
  },
  {
    id: "txn3",
    userId: "u2",
    date: "2025-07-04T15:45:00",
    amount: 400,
    type: "debit",
    category: "Shopping",
    description: "Clothes",
  },
  {
    id: "txn4",
    userId: "u1",
    date: "2025-07-05T08:20:00",
    amount: 300,
    type: "debit",
    category: "Bills",
    description: "Electricity bill",
  },
  {
    id: "txn5",
    userId: "u2",
    date: "2025-07-06T18:00:00",
    amount: 1000,
    type: "credit",
    category: "Other",
    description: "Refund from vendor",
  },
];





// export type Transaction = {
//   id: string;
//   date: string;
//   amount: number;
//   type: 'credit' | 'debit';
//   category: 'Food' | 'Bills' | 'Shopping' | 'Transport' | 'Other';
//   description: string;
// };

// export const mockTransactions: Transaction[] = [
//   {
//     id: 'txn1',
//     date: '2025-07-01',
//     amount: 250,
//     type: 'debit',
//     category: 'Food',
//     description: 'Lunch at Debonairs',
//   },
//   {
//     id: 'txn2',
//     date: '2025-07-03',
//     amount: 120,
//     type: 'debit',
//     category: 'Transport',
//     description: 'Taxi ride',
//   },
//   {
//     id: 'txn3',
//     date: '2025-07-04',
//     amount: 400,
//     type: 'debit',
//     category: 'Shopping',
//     description: 'Clothes',
//   },
//   {
//     id: 'txn4',
//     date: '2025-07-05',
//     amount: 300,
//     type: 'debit',
//     category: 'Bills',
//     description: 'Electricity bill',
//   },
//   {
//     id: 'txn5',
//     date: '2025-07-06',
//     amount: 1000,
//     type: 'credit',
//     category: 'Other',
//     description: 'Refund from vendor',
//   },
// ];
