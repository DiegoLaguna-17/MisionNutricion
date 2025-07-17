// supabase.js
import { createClient } from  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://mgphcaelmxaevdfflizl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncGhjYWVsbXhhZXZkZmZsaXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTY4NTQsImV4cCI6MjA2ODI5Mjg1NH0.WNQveoFLY64aaw9jIfVzUlmko1jzB9WmrPrJXkhhNX8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
