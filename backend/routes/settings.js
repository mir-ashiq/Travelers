/**
 * Settings Routes
 * Handles site settings management
 * - GET /settings - Get all settings
 * - POST /settings - Save settings
 * - POST /settings/logo - Upload logo
 * - DELETE /settings/logo - Delete logo
 */

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables (fallback if not already loaded by server.js)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const router = express.Router();

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
let supabaseAdmin = null;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration for settings route');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('   VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase initialized for settings route');
}

// Initialize admin client for storage operations (uses SERVICE_ROLE_KEY for bypass RLS)
if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  console.log('✅ Supabase admin client initialized for storage operations');
} else {
  console.warn('⚠️  Supabase admin client not initialized - storage operations may fail');
}

// Configure multer for file uploads (logo)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, png, gif, webp)'));
    }
  }
});

// Helper function to check if Supabase is initialized
const checkSupabaseInit = (req, res) => {
  if (!supabase) {
    console.error('Supabase not initialized for request:', req.path);
    res.status(500).json({ error: 'Database connection not configured' });
    return false;
  }
  return true;
};

/**
 * GET /api/settings
 * Retrieve all settings
 */
router.get('/', async (req, res) => {
  try {
    // Check if Supabase is initialized
    if (!checkSupabaseInit(req, res)) return;

    // Get all settings from site_settings table
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');

    if (error) {
      console.error('Error fetching settings:', error);
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }

    // Convert array to object for easier use
    const settings = {};
    if (data) {
      data.forEach(item => {
        settings[item.key] = item.value;
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Settings fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/settings/:key
 * Retrieve specific setting
 */
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;

    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching setting:', error);
      return res.status(500).json({ error: 'Failed to fetch setting' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json({ [key]: data.value });
  } catch (error) {
    console.error('Setting fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/settings
 * Save/update settings
 * Expects: { [key]: value, [key2]: value2, ... }
 */
router.post('/', async (req, res) => {
  try {
    // Check if Supabase is initialized
    if (!checkSupabaseInit(req, res)) return;

    const settings = req.body;

    if (!settings || Object.keys(settings).length === 0) {
      return res.status(400).json({ error: 'No settings provided' });
    }

    // Upsert each setting
    const updates = [];
    for (const [key, value] of Object.entries(settings)) {
      updates.push(
        supabase
          .from('site_settings')
          .upsert({ key, value }, { onConflict: 'key' })
      );
    }

    const results = await Promise.all(updates);

    // Check for errors
    for (const result of results) {
      if (result.error) {
        console.error('Error saving settings:', result.error);
        return res.status(500).json({ error: 'Failed to save settings' });
      }
    }

    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Settings save error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/settings/:key
 * Update specific setting
 */
router.put('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required' });
    }

    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ key, value }, { onConflict: 'key' })
      .select();

    if (error) {
      console.error('Error updating setting:', error);
      return res.status(500).json({ error: 'Failed to update setting' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Setting update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/settings/logo
 * Upload and update company logo
 * File stored in Supabase storage bucket
 */
router.post('/logo', upload.single('logo'), async (req, res) => {
  try {
    // Check if Supabase is initialized
    if (!checkSupabaseInit(req, res)) return;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucketName = 'site-assets';
    const fileName = `logo-${Date.now()}${path.extname(req.file.originalname)}`;
    const filePath = `logos/${fileName}`;

    console.log(`Uploading logo to bucket: ${bucketName}, file: ${filePath}`);

    // Use admin client for storage operations (bypasses RLS)
    if (!supabaseAdmin) {
      return res.status(500).json({ 
        error: 'Storage admin client not configured',
        details: 'SUPABASE_SERVICE_ROLE_KEY is required for storage operations'
      });
    }

    // Upload to Supabase storage using admin client
    const { data, error } = await supabaseAdmin
      .storage
      .from(bucketName)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Logo upload error:', error);
      // Provide more helpful error messages
      if (error.statusCode === '404' || error.message?.includes('Bucket not found')) {
        return res.status(500).json({ 
          error: `Storage bucket "${bucketName}" not found. Please ensure the bucket exists in Supabase Storage.`,
          bucketName,
          details: error.message 
        });
      }
      if (error.statusCode === '403' || error.message?.includes('row-level security')) {
        return res.status(500).json({ 
          error: 'Permission denied for storage upload. RLS policies may be too restrictive.',
          details: error.message 
        });
      }
      return res.status(500).json({ 
        error: 'Failed to upload logo',
        details: error.message 
      });
    }

    console.log('Logo uploaded successfully:', data);

    // Get public URL using admin client
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log('Logo public URL:', publicUrl);

    // Update settings with logo URL (use regular client for data)
    const { data: updateData, error: updateError } = await supabase
      .from('site_settings')
      .upsert({ 
        key: 'general_settings',
        value: { logoUrl: publicUrl, logoFileName: fileName }
      }, { onConflict: 'key' })
      .select();

    if (updateError) {
      console.error('Error updating logo setting:', updateError);
      return res.status(500).json({ error: 'Failed to save logo URL to settings' });
    }

    res.json({ 
      success: true, 
      logoUrl: publicUrl,
      message: 'Logo uploaded successfully',
      data: updateData
    });
  } catch (error) {
    console.error('Logo upload error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

/**
 * DELETE /api/settings/logo
 * Delete logo from storage and settings
 */
router.delete('/logo', async (req, res) => {
  try {
    // Check if Supabase is initialized
    if (!checkSupabaseInit(req, res)) return;

    const bucketName = 'site-assets';

    // Get current logo filename
    const { data: generalSettings, error: fetchError } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'general_settings')
      .single();

    if (fetchError) {
      console.error('Error fetching current logo:', fetchError);
    }

    if (generalSettings?.value?.logoFileName) {
      const logoPath = `logos/${generalSettings.value.logoFileName}`;
      console.log(`Deleting logo from storage: ${logoPath}`);
      
      // Delete from storage
      const { error: deleteError } = await supabase
        .storage
        .from(bucketName)
        .remove([logoPath]);

      if (deleteError) {
        console.error('Error deleting logo from storage:', deleteError);
        // Don't fail the request if storage delete fails, still update DB
      } else {
        console.log('Logo deleted from storage successfully');
      }
    }

    // Update settings to remove logo URL
    const { data: updateData, error: updateError } = await supabase
      .from('site_settings')
      .upsert({ 
        key: 'general_settings',
        value: { logoUrl: null, logoFileName: null }
      }, { onConflict: 'key' })
      .select();

    if (updateError) {
      console.error('Error updating logo setting:', updateError);
      return res.status(500).json({ error: 'Failed to update settings' });
    }

    res.json({ 
      success: true, 
      message: 'Logo deleted successfully',
      data: updateData
    });
  } catch (error) {
    console.error('Logo delete error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

/**
 * DELETE /api/settings/:key
 * Delete specific setting
 */
router.delete('/:key', async (req, res) => {
  try {
    const { key } = req.params;

    const { error } = await supabase
      .from('site_settings')
      .delete()
      .eq('key', key);

    if (error) {
      console.error('Error deleting setting:', error);
      return res.status(500).json({ error: 'Failed to delete setting' });
    }

    res.json({ success: true, message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Setting delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
