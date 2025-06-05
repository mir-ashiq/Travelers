/*
  # Fix Row Level Security Policies for Destinations Table

  1. Changes
     - Updates RLS policy for the destinations table to properly allow authenticated users to perform all operations
     - Ensures authenticated users can insert new destinations

  2. Security
     - Maintains RLS on the destinations table
     - Ensures only authenticated users can modify destination data
*/

-- First ensure RLS is enabled (it should be already, but just to be safe)
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

-- Drop the existing policy if it exists (to avoid duplicates)
DROP POLICY IF EXISTS "Admin users can perform all operations on destinations" ON destinations;

-- Create a new policy that properly allows authenticated users to perform all operations
CREATE POLICY "Enable all operations for authenticated users" 
ON destinations
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);