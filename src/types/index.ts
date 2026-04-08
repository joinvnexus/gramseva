// src/types/index.ts

export interface User {
  id: string;
  phone: string;
  name: string;
  village: string;
  ward: number;
  role: 'USER' | 'PROVIDER' | 'ADMIN';
  verified: boolean;
  rating: number;
  createdAt: Date;
}

export interface Service {
  id: string;
  userId: string;
  user?: User;
  category: 'ELECTRICIAN' | 'PLUMBER' | 'MECHANIC' | 'DOCTOR' | 'TUTOR' | 'OTHER';
  description: string;
  hourlyRate: number;
  rating: number;
  isAvailable: boolean;
  createdAt: Date;
}

export interface Report {
  id: string;
  userId: string;
  user?: User;
  problemType: 'ROAD' | 'WATER' | 'ELECTRICITY' | 'OTHER';
  description: string;
  imageUrl?: string;
  lat?: number;
  lng?: number;
  status: 'PENDING' | 'PROCESSING' | 'RESOLVED';
  upVotes: number;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}