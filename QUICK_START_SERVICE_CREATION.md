# ✅ Quick Start Checklist - Enable Service Creation

## Step 1: Run SQL in Supabase
- [ ] Open [Supabase Dashboard](https://app.supabase.com)
- [ ] Go to **SQL Editor** → **New Query**
- [ ] Copy & paste contents of `SUPABASE_RLS_FIX.sql`
- [ ] Click **Run** (wait for ✅ Success)

## Step 2: Verify Installation
Run this query to confirm policies exist:
```sql
SELECT policyname FROM pg_policies WHERE tablename = 'services';
```

Should return 4 policies. ✅

## Step 3: Test in Your App

### Log in as Business User
```
1. Go to login page
2. Sign in with business account
3. Verify you're authenticated
```

### Create a Test Service
```
1. Navigate to: /admin/services
2. Click "Create Service" button
3. Fill in form:
   - Title: "Test Service"
   - Category: "Technology"
   - Description: "This is a test service"
   - Price: 100.00
   - Phone: +233 24 123 4567
   - Email: test@example.com
   - Add a location
   - Image URL: any valid image URL
4. Click Submit
```

### Expected Result
✅ Toast: "Service created successfully!"
✅ Redirects to /admin/services
✅ New service appears in your dashboard

---

## If It Still Fails

### Error: "violates row-level security policy"
**Solution:**
```sql
-- Check if RLS is enabled
SELECT rowsecurity FROM pg_tables WHERE tablename = 'services';
-- Should return: t (true)

-- Check your user ID
SELECT auth.uid();
-- Copy this ID for debugging
```

### Error: "Column 'business_id' does not exist"
**Solution:**
Add the missing column:
```sql
ALTER TABLE services ADD COLUMN IF NOT EXISTS business_id uuid;
ALTER TABLE services ADD COLUMN IF NOT EXISTS business_name text;
```

### Error: Still can't see /admin/services page
**Solution:**
1. Check you're logged in with a business account
2. Verify user.role is "business" or "admin" in browser console:
   ```javascript
   console.log(localStorage.getItem('auth-store'))
   ```
3. If role is wrong, update it in Supabase:
   ```sql
   UPDATE profiles SET role = 'business' WHERE id = 'your-user-id';
   ```

---

## Files Modified

| File | Change |
|------|--------|
| `SUPABASE_RLS_FIX.sql` | ✨ NEW - SQL policies to fix RLS |
| `SUPABASE_SETUP_GUIDE.md` | ✨ NEW - Detailed setup instructions |
| `src/types/admin.types.ts` | ✅ Added businessId & businessName to CreateServiceRequest |
| `src/features/admin/CreateServicePage.tsx` | ✅ Removed unnecessary type cast |

---

## 🎯 What's Now Working

✅ You can create services with the proper RLS policies
✅ Image URL uploads with services
✅ Services linked to your business account
✅ Type safety for service creation

---

## 📞 Support

If you need help:
1. Check the `SUPABASE_SETUP_GUIDE.md` for detailed troubleshooting
2. Run the verification SQL queries above
3. Check browser console for error messages
