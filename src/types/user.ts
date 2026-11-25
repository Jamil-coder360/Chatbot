export interface User {
  id: string;
  name: string;
  email: string;
  profile: string | null;
  location?: string | null;
  phoneNumber?: string | null;
  status: string;
}