import bcrypt from 'bcryptjs';

export interface IUser {
  id: string;
  username: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'City Architect' | 'Agronomist' | 'Systems Operator' | 'Guest Overseer';
  createdAt: string;
}

// In-memory collection fallback for instant MongoDB-like document operations
const usersCollection: Map<string, IUser> = new Map();

// Helper to seed users with real bcrypt hashes
function seedUser(id: string, username: string, name: string, email: string, rawPassword: string, role: IUser['role']) {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(rawPassword, salt);
  const user: IUser = {
    id,
    username: username.toLowerCase(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
  };
  usersCollection.set(user.username, user);
  usersCollection.set(user.email, user);
}

// Seed default accounts
seedUser('usr-001', 'overseer', 'Chief Overseer', 'overseer@aeroagri.city', 'overseer123', 'City Architect');
seedUser('usr-002', 'agronomist', 'Lead Biosphere Agronomist', 'agronomist@aeroagri.city', 'agri2026password', 'Agronomist');
seedUser('usr-003', 'architect', 'Metropolitan Grid Architect', 'architect@aeroagri.city', 'smartcity2026', 'City Architect');
seedUser('usr-004', 'admin', 'Root Systems Operator', 'admin@aeroagri.city', 'admin123', 'Systems Operator');

export const UserModel = {
  async findByUsernameOrEmail(identifier: string): Promise<IUser | null> {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    return usersCollection.get(clean) || null;
  },

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findByUsernameOrEmail(email);
  },

  async findByUsername(username: string): Promise<IUser | null> {
    return this.findByUsernameOrEmail(username);
  },

  async create(userData: { username: string; name?: string; email?: string; password: string; role?: IUser['role'] }): Promise<IUser> {
    const cleanUsername = userData.username.trim().toLowerCase();
    const cleanEmail = (userData.email || `${cleanUsername}@aeroagri.city`).trim().toLowerCase();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);
    
    const newUser: IUser = {
      id: `usr-${Date.now()}`,
      username: cleanUsername,
      name: userData.name || userData.username,
      email: cleanEmail,
      passwordHash,
      role: userData.role || 'City Architect',
      createdAt: new Date().toISOString(),
    };
    
    usersCollection.set(cleanUsername, newUser);
    usersCollection.set(cleanEmail, newUser);
    return newUser;
  },

  async verifyPassword(candidatePassword: string, hash: string): Promise<boolean> {
    if (!candidatePassword || !hash) return false;
    return bcrypt.compare(candidatePassword, hash);
  },
};
