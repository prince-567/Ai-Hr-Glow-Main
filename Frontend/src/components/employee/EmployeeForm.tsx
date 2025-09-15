import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateEmployee, useUpdateEmployee, useAvailableUsers, type Employee } from "@/hooks/useEmployees";
import { EmployeeDocumentUpload } from "./EmployeeDocumentUpload";
import { X, User, Link } from "lucide-react";

interface EmployeeFormProps {
  employee?: Employee | null;
  onClose: () => void;
}

const EmployeeForm = ({ employee, onClose }: EmployeeFormProps) => {
  console.log('data',employee)
  const [formData, setFormData] = useState({
    _id:"",
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    hire_date: '',
    salary: '',
    status: 'active' as 'active' | 'inactive' | 'on_leave',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    avatar_url: '',
    user_id: ''
  });

  const [documents, setDocuments] = useState<File[]>([]);

  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const { data: availableUsers = [], isLoading: usersLoading } = useAvailableUsers();

  useEffect(() => {
    if (employee) {
      setFormData({
        _id:employee._id,
        employee_id: employee.employee_id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone || '',
        department: employee.department,
        position: employee.position,
        hire_date: employee.hire_date,
        salary: employee.salary?.toString() || '',
        status: employee.status,
        address: employee.address || '',
        emergency_contact: employee.emergency_contact || '',
        emergency_phone: employee.emergency_phone || '',
        avatar_url: employee.avatar_url || '',
        user_id: employee.user_id || ''
      });
    console.log('add',handleSubmit);

    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form Data before submit:", formData);

  const employeeData: any = {
  ...formData,
  salary: formData.salary ? parseFloat(formData.salary) : undefined,
  user_id: formData.user_id === 'no_assignment' ? undefined : formData.user_id || undefined
};

// ✅ Agar naya employee create ho raha hai to _id mat bhejo
if (!employee?._id) {
  delete employeeData._id;
}

  console.log('👉 Sending employeeData:', employeeData); // ✅ ab sahi data console me dikhega

    // TODO: Handle document upload to storage
    if (documents.length > 0) {
      console.log('Documents to upload:', documents);
      // Here you would upload documents to Supabase Storage
    }

    if (employee) {
      updateEmployee.mutate({ id: employee._id, ...employeeData }, {
        onSuccess: () => onClose()
      });
    } else {
      createEmployee.mutate(employeeData, {
        onSuccess: () => onClose()
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentsChange = (newDocuments: File[]) => {
    setDocuments(newDocuments);
  };

  const selectedUser = availableUsers.find(user => user.id === formData.user_id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </CardTitle>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarImage src={formData.avatar_url} />
                <AvatarFallback>
                  {formData.first_name[0]}{formData.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="avatar_url">Profile Picture URL</Label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            {/* User Account Assignment Section */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Link className="w-5 h-5 text-blue-600" />
                <Label className="text-blue-800 font-medium">Link User Account</Label>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Assign this employee to an existing user account for login access and data synchronization.
              </p>
              
              <div className="space-y-3">
                <Label htmlFor="user_id">Select User Account (Optional)</Label>
                <Select 
                  value={formData.user_id || 'no_assignment'} 
                  onValueChange={(value) => handleSelectChange('user_id', value)}
                  disabled={usersLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={usersLoading ? "Loading users..." : "Select a user account"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_assignment">No user assignment</SelectItem>
                    {availableUsers.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{user.first_name} {user.last_name} ({user.email})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedUser && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                    ✓ This employee will be linked to: {selectedUser.first_name} {selectedUser.last_name} ({selectedUser.email})
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employee_id">Employee ID *</Label>
                <Input
                  id="employee_id"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="department">Department </Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Position </Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="hire_date">Hire Date </Label>
                <Input
                  id="hire_date"
                  name="hire_date"
                  type="date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="50000"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
              />
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="emergency_phone">Emergency Phone</Label>
                <Input
                  id="emergency_phone"
                  name="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Document Upload Section */}
            <EmployeeDocumentUpload 
              onDocumentsChange={handleDocumentsChange}
            />

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-6">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createEmployee.isPending || updateEmployee.isPending}
              >
                {employee ? 'Update Employee' : 'Create Employee'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeForm;
