const supabase = supabase.createClient('https://ylgtgecqhdhakzbjdkqq.supabase.co', 'sb_publishable_ILF6pER_bdL8GppxOzfumg_xsDoMA6T');

async function login() {
  const apiKey = document.getElementById('login-key').value;

  const { data, error } = await supabase.from('users').select('*').eq('api_key', apiKey).single();

  if (error || !data) {
    alert('Error: Invalid API key');
    return;
  }

  const userKey = data.id;
  localStorage.setItem('userKey', userKey);
  window.location.href = 'dashboard.html';
}