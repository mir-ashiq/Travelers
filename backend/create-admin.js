#!/usr/bin/env node

/**
 * Admin Password Setup Utility
 * Sets password for admin users
 * 
 * Usage:
 *   node create-admin.js
 */

import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import readline from 'readline';

// Load .env file
if (fs.existsSync('.env')) {
  dotenv.config();
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Create readline interface for prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

async function setAdminPassword() {
  console.log('\n📝 Admin Password Setup');
  console.log('═══════════════════════════════════════\n');

  try {
    // List existing admins
    const { data: admins, error: fetchError } = await supabase
      .from('admin_users')
      .select('id, email, name, role')
      .order('email');

    if (fetchError) throw fetchError;

    if (admins.length === 0) {
      console.log('❌ No admin users found in database.');
      process.exit(1);
    }

    console.log('Available Admin Users:\n');
    admins.forEach((admin, index) => {
      console.log(`  ${index + 1}. ${admin.email} (${admin.role}) - ${admin.name}`);
    });

    // Get selection
    const selection = await question('\nSelect admin number (or enter email): ');
    let selectedAdmin = null;

    if (!isNaN(selection) && selection > 0 && selection <= admins.length) {
      selectedAdmin = admins[parseInt(selection) - 1];
    } else {
      selectedAdmin = admins.find(a => a.email === selection);
    }

    if (!selectedAdmin) {
      console.log('❌ Invalid selection');
      process.exit(1);
    }

    console.log(`\n✅ Selected: ${selectedAdmin.email} (${selectedAdmin.role})`);

    // Get password
    const password = await question('\nEnter password: ');

    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      process.exit(1);
    }

    // Confirm password
    const confirmPassword = await question('Confirm password: ');

    if (password !== confirmPassword) {
      console.log('❌ Passwords do not match');
      process.exit(1);
    }

    // Hash password
    console.log('\n🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Update admin user
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({
        password_hash: passwordHash,
        is_active: true,
      })
      .eq('id', selectedAdmin.id);

    if (updateError) throw updateError;

    console.log('✅ Password set successfully!\n');
    console.log('Login Credentials:');
    console.log(`  Email: ${selectedAdmin.email}`);
    console.log(`  Password: ${password}\n`);

    rl.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

setAdminPassword();
