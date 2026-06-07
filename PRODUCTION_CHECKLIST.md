# Production Login Setup Checklist

## ✅ Quick Setup Steps

### 1. Get Supabase Credentials
- [ ] Go to https://app.supabase.com and log in
- [ ] Select your project
- [ ] Go to **Settings > API**
- [ ] Copy `Project URL` → store as `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copy `anon public` key → store as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Copy `service_role secret` → store as `SUPABASE_SERVICE_ROLE_KEY`

### 2. Generate Auth Secret
- [ ] Run: `openssl rand -base64 32`
- [ ] Copy output → store as `APP_AUTH_SECRET`

### 3. Choose SMS Provider
- [ ] **Option A (Testing):** Set `APP_SMS_PROVIDER=console`
- [ ] **Option B (Twilio):** Set up Twilio and add credentials
- [ ] **Option C (2Factor.in):** Set up 2Factor.in and add credentials

### 4. For Vercel Deployment
- [ ] Go to your Vercel project
- [ ] **Settings > Environment Variables**
- [ ] Select **Production** environment
- [ ] Add each variable from the list below

### 5. Deploy
- [ ] Push changes to GitHub
- [ ] Vercel will auto-deploy
- [ ] Test login at https://yourdomain.com/login

---

## 📋 Required Variables for Production

Copy these variables to Vercel Production environment:

```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
APP_AUTH_SECRET=your-random-secret-from-openssl
APP_SMS_PROVIDER=console  # (or twilio/2factor)
```

### For Twilio (if using)
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_FROM=+1234567890
```

### For 2Factor.in (if using)
```
TWOFACTOR_API_KEY=your-api-key
TWOFACTOR_OTP_TEMPLATE=your-template-id
```

---

## 🔍 Testing After Deployment

1. **Visit login page:** https://yourdomain.com/login
2. **Try registration:**
   - Click "Register" tab
   - Enter a phone number
   - Click "Send OTP"
3. **Check OTP delivery:**
   - If `APP_SMS_PROVIDER=console`: Check Vercel logs
   - If `APP_SMS_PROVIDER=twilio`: Check SMS on phone
4. **Enter OTP and complete registration**
5. **Login with created credentials**

---

## ❌ Troubleshooting

| Issue | Solution |
|-------|----------|
| **Login button does nothing** | Check browser console for errors. Usually missing SUPABASE variables. |
| **"Invalid credentials" error** | Verify `SUPABASE_SERVICE_ROLE_KEY` is correct. Check Supabase database has `app_users` table. |
| **"Missing APP_AUTH_SECRET"** | Add `APP_AUTH_SECRET` to Vercel Production env vars. |
| **OTP not received** | If using Twilio, check credentials. If using console, check Vercel logs. |
| **"SMS provider not configured"** | Add `APP_SMS_PROVIDER` to env vars (try `console` for testing). |

---

## 📚 More Help

- **Detailed setup:** See `ENV_SETUP_GUIDE.md`
- **All env variables:** See `.env.example`
- **Local development:** Edit `.env.local`

---

## ✨ That's It!

Login should now work in production. If you run into issues:

1. Check Vercel Production logs
2. Verify all required variables are set
3. Confirm Supabase database and tables exist
4. See troubleshooting section above
