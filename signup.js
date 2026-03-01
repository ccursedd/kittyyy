const supabase = supabase.createClient('https://ylgtgecqhdhakzbjdkqq.supabase.co', 'sb_publishable_ILF6pER_bdL8GppxOzfumg_xsDoMA6T');

async function signup() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert('Error: ' + error.message);
    return;
  }

  const apiKey = user.id;

  const { data, insertError } = await supabase.from('users').upsert([
    { id: user.id, email: email, api_key: apiKey, username: email.split('@')[0] }
  ]);

  if (insertError) {
    alert('Error saving user data: ' + insertError.message);
    return;
  }

  alert('Account created! Please check your email for verification.');
  window.location.href = 'login.html';
}