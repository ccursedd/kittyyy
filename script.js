// Supabase setup
const supabaseUrl = 'https://ylgtgecqhdhakzbjdkqq.supabase.co';
const supabaseKey = 'sb_publishable_ILF6pER_bdL8GppxOzfumg_xsDoMA6T';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Toggle between login, signup, and password reset
function toggleLogin() {
  document.getElementById('login-box').style.display = 'block';
  document.getElementById('signup-box').style.display = 'none';
  document.getElementById('forgot-password-box').style.display = 'none';
}

function toggleSignup() {
  document.getElementById('login-box').style.display = 'none';
  document.getElementById('signup-box').style.display = 'block';
  document.getElementById('forgot-password-box').style.display = 'none';
}

function toggleForgotPassword() {
  document.getElementById('login-box').style.display = 'none';
  document.getElementById('signup-box').style.display = 'none';
  document.getElementById('forgot-password-box').style.display = 'block';
}

// Sign up function
async function signup() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  // Create a new user
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert('Error: ' + error.message);
  } else {
    // Generate a key for the user
    const userKey = user.id;
    await supabase.from('users').upsert([{ id: userKey, email: email }]);

    alert('Account created! Please check your email for verification.');
    // Redirect to login
    toggleLogin();
  }
}

// Login function (using the key)
async function login() {
  const key = document.getElementById('login-key').value;

  // Validate the key
  const { data, error } = await supabase.from('users').select('*').eq('id', key).single();
  
  if (error || !data) {
    alert('Error: Invalid key');
  } else {
    const userKey = data.id;
    localStorage.setItem('userKey', userKey);
    displayDashboard(data.email, userKey);
  }
}

// Reset password function
async function resetPassword() {
  const email = document.getElementById('reset-email').value;

  const { data, error } = await supabase.auth.api.resetPasswordForEmail(email);
  if (error) {
    alert('Error: ' + error.message);
  } else {
    alert('Password reset link sent to your email!');
    toggleLogin();
  }
}

// Display user dashboard
function displayDashboard(email, userKey) {
  document.getElementById('app').style.display = 'none';
  document.getElementById('dashboard-container').style.display = 'block';
  document.getElementById('username-display').innerText = email;
  document.getElementById('user-key').innerText = userKey;
}

// Logout function
function logout() {
  localStorage.removeItem('userKey');
  supabase.auth.signOut();
  window.location.reload();
}

// On page load, check if the user is already logged in
window.onload = function () {
  const userKey = localStorage.getItem('userKey');
  if (userKey) {
    // Fetch user info using the key (ID)
    supabase.from('users').select('*').eq('id', userKey).single().then(({ data }) => {
      if (data) {
        displayDashboard(data.email, userKey);
      } else {
        localStorage.removeItem('userKey');
        toggleLogin();
      }
    });
  } else {
    toggleLogin();
  }
};