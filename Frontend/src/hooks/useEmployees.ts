
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
// import { getStorageData, addToStorage, updateInStorage, deleteFromStorage } from '@/lib/localStorage';
// import { initializeMockData } from '@/lib/mockData';

export interface Employee {
  _id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  hire_date: string;
  salary?: number;
  status: 'active' | 'inactive' | 'on_leave';
  manager_id?: string;
  avatar_url?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  user_id?: string;
 manager?: string;
  missingDocs?: string[];
}


const API_URL = 'http://localhost:5000/api/users'; // replace with actual URL

export const useEmployees = () => {
  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch employees');
      return response.json();
    },
  });
};
export const useAvailableUsers = () => {
  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch employees');
      return response.json();
    },
  });
};





// export const useAvailableUsers = () => {
//   return useQuery({
//     queryKey: ['available-users'],
//     queryFn: async () => {
//       const res = await fetch("http://localhost:5000/api/users");
//       if (!res.ok) throw new Error("Failed to fetch available users");
//       return res.json();
//     },
//   });
// };

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
      });
      if (!response.ok) throw new Error('Failed to create employee');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create employee: ${error.message}`);
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Employee> & { id: string }) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT', // ya PATCH agar partial update ho
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error('Failed to update employee');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update employee: ${error.message}`);
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete employee');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete employee: ${error.message}`);
    },
  });
};
