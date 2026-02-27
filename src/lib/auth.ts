import { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDatabase from './mongodb';
import User from '@/models/User';
import UserProgress from '@/models/UserProgress';
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
  interface User {
    id: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectToDatabase();

          // Find user by email
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            return null;
          }

          // Check if password matches
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) {
            return null;
          }

          // Update last login time
          user.lastLogin = new Date();
          await user.save();

          // Update user progress for login activity
          let userProgress = await UserProgress.findOne({ userId: user._id });

          if (!userProgress) {
            // Create progress record if it doesn't exist
            userProgress = await UserProgress.create({
              userId: user._id,
              activities: [{
                type: 'login',
                points: 5,
                details: 'Daily login',
              }],
            });
          } else {
            // Add login activity and update streak
            userProgress.updateStreak();
            userProgress.addPoints(5, 'login', 'Daily login');
            await userProgress.save();
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.profileImage,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Helper function to get the current session on the server
export async function getServerAuthSession() {
  return await getServerSession(authOptions);
}