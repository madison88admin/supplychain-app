# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication for your Supply Chain Management System.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Your React application running

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `supply-chain-app` (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in your project root:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace the placeholder values with your actual Supabase credentials

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase-schema.sql` into the editor
3. Click "Run" to execute the SQL commands

This will create:
- `user_profiles` table with proper relationships
- Row Level Security (RLS) policies
- Triggers for automatic user profile creation
- Sample data for testing

## Step 5: Configure Authentication Settings

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:

### Site URL
- Set to `http://localhost:5173` for development
- Set to your production URL for production

### Redirect URLs
Add these URLs:
- `http://localhost:5173/login`
- `http://localhost:5173/signup`
- `http://localhost:5173/`

### Email Templates (Optional)
You can customize the email templates for:
- Confirm signup
- Reset password
- Magic link

## Step 6: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:5173/login`

3. Try creating a new account using the signup form

4. Test logging in with the created account

## Step 7: Create Test Users (Optional)

You can create test users directly in Supabase:

1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Enter user details:
   - Email: `admin@madison88.com`
   - Password: `admin123`
   - User metadata:
     ```json
     {
       "name": "Sample Admin User",
       "role": "Admin",
       "department": "IT"
     }
     ```

## Step 8: Production Deployment

When deploying to production:

1. Update your environment variables with production Supabase credentials
2. Update the Site URL and Redirect URLs in Supabase dashboard
3. Consider enabling additional security features:
   - Email confirmation requirement
   - Phone number verification
   - Two-factor authentication

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check that your environment variables are correctly set
   - Ensure you're using the `anon` key, not the `service_role` key

2. **"User not found" error**
   - Make sure the user exists in Supabase Auth
   - Check that the user profile was created in the `user_profiles` table

3. **"Row Level Security" errors**
   - Ensure RLS policies are properly configured
   - Check that the user has the correct role permissions

4. **Environment variables not loading**
   - Restart your development server after adding `.env.local`
   - Ensure the file is in the project root directory

### Debug Mode

To enable debug logging, add this to your `.env.local`:
```
VITE_SUPABASE_DEBUG=true
```

## Security Best Practices

1. **Never commit your `.env.local` file** - it's already in `.gitignore`
2. **Use environment variables** for all sensitive configuration
3. **Enable Row Level Security** on all tables
4. **Regularly rotate API keys** in production
5. **Monitor authentication logs** in Supabase dashboard
6. **Implement proper error handling** in your application

## Additional Features

Once basic authentication is working, you can add:

1. **Password Reset**: Users can reset their passwords via email
2. **Email Verification**: Require email confirmation for new accounts
3. **Social Login**: Add Google, GitHub, or other OAuth providers
4. **Multi-factor Authentication**: Add SMS or TOTP-based 2FA
5. **Session Management**: Implement session timeouts and refresh tokens

## Support

If you encounter issues:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the [Supabase Community](https://github.com/supabase/supabase/discussions)
3. Check the browser console for detailed error messages
4. Verify your database schema matches the provided SQL

## Files Modified/Created

- `src/lib/supabase.ts` - Supabase client configuration
- `src/contexts/UserContext.tsx` - Updated to use Supabase auth
- `src/pages/Login.tsx` - Updated to use Supabase login
- `src/pages/Signup.tsx` - New signup component
- `src/App.tsx` - Added signup route
- `supabase-schema.sql` - Database schema
- `env.example` - Environment variables template
- `SUPABASE_SETUP.md` - This setup guide 