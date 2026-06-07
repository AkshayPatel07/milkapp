# Environment Variables Setup Guide

## Overview

This app requires environment variables for Supabase, authentication, and SMS configuration. Login won't work in production without proper `.env.production` setup.

## Quick Start

1. **Copy `.env.example` to `.env.production`** in your production deployment environment
2. **Fill in all required values** (marked with ⚠️ below)
3. **Deploy** - your login system should now work

## Required Environment Variables

### ⚠️ Supabase Configuration (Critical - Login won't work without these)

These variables connect to your Supabase database:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to find these:**
1. Go to [Supabase Console](https://app.supabase.com)
2. Select your project
3. Go to **Settings > API** (left sidebar)
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### ⚠️ Authentication Secret (Critical - Login won't work without this)

This variable signs session tokens:

```env
APP_AUTH_SECRET=your-secure-random-string-here
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

Copy the output to `APP_AUTH_SECRET`.

### NODE_ENV

Always set to `production` in production:

```env
NODE_ENV=production
```

## Optional Environment Variables

### OTP Configuration

Controls OTP (One-Time Password) behavior:

```env
APP_OTP_LENGTH=6                      # 4-8 digits
APP_OTP_EXPIRES_MINUTES=5             # 1-30 minutes
APP_OTP_DEV_MODE=false                # Never true in production!
APP_OTP_SMS_TEMPLATE=Your OTP is {otp}. It expires in {minutes} minutes.
```

### SMS Provider Configuration

Choose how to send OTP SMS:

#### Option 1: Console (Testing Only - Do NOT use in production)
```env
APP_SMS_PROVIDER=console
```
OTPs will be printed to console/logs instead of sent via SMS.

#### Option 2: Twilio (Recommended for Production)
```env
APP_SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token-here
TWILIO_FROM=+1234567890
# OR use messaging service:
TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Get Twilio credentials:**
1. Create account at https://www.twilio.com
2. Go to Console at https://console.twilio.com
3. Copy Account SID and Auth Token
4. Buy a phone number and add it to TWILIO_FROM
5. (Optional) Create a Messaging Service and add SID to TWILIO_MESSAGING_SERVICE_SID

#### Option 3: 2Factor.in
```env
APP_SMS_PROVIDER=2factor
TWOFACTOR_BASE_URL=https://2factor.in/API/V1
TWOFACTOR_API_KEY=your-api-key
TWOFACTOR_OTP_TEMPLATE=your-template-id
TWOFACTOR_MODE=autogen
```

## Environment Variable Files

### `.env.production`
✅ Use this file in production deployments  
⚠️ **Must be present for login to work**

### `.env.local`
✅ Use this for local development  
❌ Should NOT be committed to git  
📝 Already has default dev values

### `.env.example`
📖 Template/reference file  
❌ Do NOT use directly - it has placeholder values

## Troubleshooting Login Issues

### Error: "Missing APP_AUTH_SECRET"
**Solution:** Add `APP_AUTH_SECRET` to `.env.production` (use `openssl rand -base64 32`)

### Error: "Invalid credentials" despite correct username/password
**Causes:**
1. `NEXT_PUBLIC_SUPABASE_URL` is missing or incorrect
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` is invalid
3. `SUPABASE_SERVICE_ROLE_KEY` is missing or incorrect
4. Supabase database tables don't exist (app_users, admins, etc.)

**Fix:** Verify all three Supabase variables are correct in `.env.production`

### Error: "Failed to send OTP"
**Causes:**
1. `APP_SMS_PROVIDER` is not set or invalid
2. SMS provider credentials are missing/incorrect
3. Using `console` provider (which doesn't actually send SMS)

**Fix:** Configure SMS provider credentials or set `APP_SMS_PROVIDER=console` for testing

### OTP not received (using Twilio)
1. Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` are correct
2. Verify `TWILIO_FROM` is a valid Twilio phone number
3. Check Twilio Console for failed message logs
4. Ensure phone number in correct E.164 format (+1234567890)

## For Vercel Deployment

1. Go to your project **Settings > Environment Variables**
2. Add all variables from `.env.production` in the **Production** environment
3. Redeploy your application
4. Login should now work!

## Security Checklist

- [ ] `APP_AUTH_SECRET` is a random string (use `openssl rand -base64 32`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is never exposed to frontend
- [ ] `APP_SMS_PROVIDER` is NOT set to `console` in production
- [ ] SMS provider credentials (Twilio/2Factor) are secure
- [ ] `.env.local` is in `.gitignore` (not committed)
- [ ] `.env.production` is NOT committed (add to `.gitignore`)
- [ ] All variables are set in production deployment (Vercel, etc.)

## Questions?

If login still doesn't work after setup:
1. Check application logs for specific error messages
2. Verify all variables are present in production environment
3. Confirm Supabase project and tables exist and are accessible
