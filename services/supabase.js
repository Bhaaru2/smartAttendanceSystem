import { createClient } from '@supabase/supabase-js';

// ⚠️ Replace these with your own values from Supabase
const SUPABASE_URL = 'https://sitzzijexybjkeygrsyf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_F_pUDI2bh6Wtrlou9Mr9Qw_PMd_qh_Q';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
