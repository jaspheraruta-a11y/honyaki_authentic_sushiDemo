-- ==============================================================================
-- HONYAKI AUTHENTIC SUSHI VALENCIA — ADMIN ACCOUNT CREATION SCRIPT
-- User: honyakiitamaesushi2016@gmail.com
-- Role: admin
-- ==============================================================================

-- 1. Ensure required cryptographic extension is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create or Update Admin Account in Supabase Auth & Public Profiles
DO $$
DECLARE
  v_user_id UUID;
  v_encrypted_pw TEXT;
BEGIN
  -- Hash the password using bcrypt
  v_encrypted_pw := crypt('Demo2026', gen_salt('bf'));

  -- Check if the user already exists in auth.users
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'honyakiitamaesushi2016@gmail.com';

  IF v_user_id IS NULL THEN
    -- Generate new UUID for the admin user
    v_user_id := gen_random_uuid();

    -- Insert into auth.users with pre-confirmed email status
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token,
      is_super_admin
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      'honyakiitamaesushi2016@gmail.com',
      v_encrypted_pw,
      timezone('utc'::text, now()),
      timezone('utc'::text, now()),
      timezone('utc'::text, now()),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Honyaki Restaurant Admin","role":"admin"}'::jsonb,
      timezone('utc'::text, now()),
      timezone('utc'::text, now()),
      '',
      '',
      '',
      '',
      false
    );

    -- Insert into auth.identities (Required by Supabase GoTrue Auth)
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      v_user_id,
      format('{"sub":"%s","email":"%s"}', v_user_id::text, 'honyakiitamaesushi2016@gmail.com')::jsonb,
      'email',
      'honyakiitamaesushi2016@gmail.com',
      timezone('utc'::text, now()),
      timezone('utc'::text, now()),
      timezone('utc'::text, now())
    );

    RAISE NOTICE 'Admin user created successfully with ID: %', v_user_id;
  ELSE
    -- If user already exists, update their password and confirmed timestamp
    UPDATE auth.users
    SET
      encrypted_password = v_encrypted_pw,
      email_confirmed_at = COALESCE(email_confirmed_at, timezone('utc'::text, now())),
      updated_at = timezone('utc'::text, now()),
      raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        '"admin"'
      )
    WHERE id = v_user_id;

    RAISE NOTICE 'Admin user password updated for ID: %', v_user_id;
  END IF;

  -- 3. Upsert into public.profiles with role = 'admin'
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    phone,
    role,
    updated_at
  ) VALUES (
    v_user_id,
    'Honyaki Restaurant Admin',
    'honyakiitamaesushi2016@gmail.com',
    '0954 298 2417',
    'admin',
    timezone('utc'::text, now())
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    full_name = 'Honyaki Restaurant Admin',
    phone = '0954 298 2417',
    updated_at = timezone('utc'::text, now());

END $$;
