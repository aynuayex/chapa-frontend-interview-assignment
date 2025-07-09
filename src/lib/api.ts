import { mockUsers } from './users';
import { mockTransactions, Transaction } from './transactions';

export const fetchUserWalletBalance = () =>
  new Promise<number>((resolve) => {
    setTimeout(() => resolve(3200), 700);
  });

export const fetchUserTransactions = () =>
  new Promise<typeof mockTransactions>((resolve) => {
    setTimeout(() => resolve(mockTransactions), 1000);
  });

// export const submitTransaction = (form: any) =>
//   new Promise((resolve) => {
//     setTimeout(() => resolve({ success: true }), 1000);
//   });

let currentTransactions: Transaction[] = [...mockTransactions];

export const submitTransaction = (form: {
  amount: string;
  description: string;
  category: string;
}): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTransaction: Transaction = {
        id: `txn${currentTransactions.length + 1}`,
        date: new Date().toISOString(),
        amount: parseFloat(form.amount),
        type: "debit",
        category: form.category as Transaction["category"],
        description: form.description,
      };
      currentTransactions.push(newTransaction);
      resolve([...currentTransactions]);
    }, 800);
  });
};

  /**
 * Simulates an API call to fetch users.
 * In a real application, this would be replaced with an actual API request.
 */
export const fetchUsers = () => {
  // Simulate an API call
  return new Promise<typeof mockUsers>((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, 1000);
  });
};