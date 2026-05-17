export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'officer' | 'farmer';
}

export interface Farmer {
  _id: string;
  user: User | string;
  aadhaarId: string;
  contactNumber: string;
  village: string;
  district: string;
  state: string;
  crops: string[];
  landSize: number;
  beneficiaryStatus: 'active' | 'inactive' | 'pending';
}

export interface AnalyticsData {
  totalFarmers: number;
  totalLandArea: number;
  applicationsByStatus: { _id: string; count: number }[];
  averageCropHealth: number;
}
