# 🔧 Supabase RLS Setup Guide - Services Creation Fix

## Problem
When trying to create a service, you're getting:
```
Integration failed: new row violates row-level security policy
```

This happens because Supabase has Row-Level Security (RLS) enabled on the `services` table, but the policies aren't configured correctly.

---

## ✅ Solution: Apply RLS Policies

### Step 1: Go to Supabase Dashboard

1. Visit [app.supabase.com](https://app.supabase.com)
2. Select your **Business Project**
3. In the left sidebar, go to **SQL Editor**

### Step 2: Copy the SQL Commands

Open the file: `SUPABASE_RLS_FIX.sql` in this project and copy ALL the SQL code.

### Step 3: Paste & Execute

1. Click **"New Query"** in the SQL Editor
2. Paste all the SQL code
3. Click **"Run"** (or press `Ctrl+Enter`)
4. Wait for ✅ **Success** message

### Step 4: Verify Policies Are Created

Run this query to verify:

```sql
SELECT 
  policyname, 
  permissive, 
  qual 
FROM pg_policies 
WHERE tablename = 'services'
ORDER BY policyname;
```

You should see 4 policies:
- ✅ `Allow authenticated users to create services` (INSERT)
- ✅ `Allow users to view all services` (SELECT)
- ✅ `Allow business owners to update their services` (UPDATE)
- ✅ `Allow business owners to delete their services` (DELETE)

---

## 🧪 Test Service Creation

### 1. Make Sure You're Logged In
- Log in with your business account
- Verify your user ID is set correctly

### 2. Go to Admin Dashboard
```
/admin/services
```

### 3. Click "Create Service"
- Fill in the form with service details
- Upload image (or provide image URL)
- Submit the form

### 4. Expected Result
✅ Service should be created successfully
✅ Toast notification: "Service created successfully!"
✅ Service appears in your dashboard

---

## 🔍 Troubleshooting

### If you still get RLS error:

**Check 1: Verify RLS is enabled**
```sql
SELECT rowsecurity FROM pg_tables WHERE tablename = 'services';
```
Should return: `t` (true)

**Check 2: Verify your user ID**
```sql
SELECT auth.uid();
```
This should return your authenticated user's UUID. Copy this ID.

**Check 3: Test insert directly**
```sql
INSERT INTO services (
  title, 
  description, 
  category, 
  base_price, 
  business_id, 
  business_name,
  image,
  is_active,
  contact,
  locations
) VALUES (
  'Test Service',
  'Test Description',
  'Technology',
  100.00,
  '12345678-1234-1234-1234-123456789012', -- Replace with your user ID
  'Your Business',
  'https://example.com/image.jpg',
  true,
  '{"phone": "+233 24 123 4567", "email": "test@example.com"}'::jsonb,
  '[]'::jsonb
);
```

---

## 📋 What Each Policy Does

| Policy | Action | Allows |
|--------|--------|--------|
| Create Services | INSERT | Any authenticated user can create services with their own business_id |
| View All Services | SELECT | Anyone can view all published services |
| Update Services | UPDATE | Only service owners (matching business_id) can edit |
| Delete Services | DELETE | Only service owners (matching business_id) can delete |

---

## 🚀 Next Steps

1. ✅ Run the SQL commands above
2. ✅ Test creating a service
3. ✅ Upload an image with your service
4. ✅ View it in your admin dashboard

If you still have issues, run:
```sql
SELECT * FROM services LIMIT 1;
```
to check if any services exist in the database.

---

## 📝 Database Schema Requirements

Your `services` table should have these columns:
```
- id (uuid, primary key)
- title (text)
- description (text)
- category (text)
- base_price (numeric)
- business_id (uuid) ← IMPORTANT: Must match auth.uid()
- business_name (text)
- image (text)
- is_active (boolean)
- contact (jsonb)
- locations (jsonb)
- tags (jsonb, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

If your table is missing columns, create them with:
```sql
ALTER TABLE services ADD COLUMN IF NOT EXISTS business_id uuid;
ALTER TABLE services ADD COLUMN IF NOT EXISTS business_name text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
```

