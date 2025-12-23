
// Supabase client initialization
// PRE-REQUISITE: Ensure the supabase-js library is loaded via CDN in your HTML file before this script.
// Example: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const supabaseUrl = 'https://pklzapardiddnxwmobcj.supabase.co';
const supabaseKey = 'sb_publishable_LlRGxG6M2rjl42EjcB3Qtg_d833nfl-';

// Check if supabase global object is available
if (typeof supabase !== 'undefined') {
    const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
    window.supabaseClient = _supabase; // Expose to window for easy access
    console.log('Supabase client initialized');
} else {
    console.error('Supabase library not found. Make sure to include the CDN or import it.');
}
