const supabase = supabase.createClient('https://ylgtgecqhdhakzbjdkqq.supabase.co', 'sb_publishable_ILF6pER_bdL8GppxOzfumg_xsDoMA6T');

window.onload = async function () {
  const userKey = localStorage.getItem('userKey');
  
  if (!userKey) {
    window.location.href = 'login.html';
  }

  const { data, error } = await supabase.from('users').select('*').eq('id', userKey).single();
  if (error || !data) {
    localStorage.removeItem('userKey');
    window.location.href = 'login.html';
  } else {
    document.getElementById('username-display').innerText = data.email;
    document.getElementById('user-key').innerText = data.api_key;

    document.getElementById('profile-image').src = data.profile_image_url || 'default-pfp.jpg';
    document.getElementById('banner-image').src = data.banner_image_url || 'default-banner.jpg';
  }
};

function logout() {
  localStorage.removeItem('userKey');
  window.location.href = 'login.html';
}

async function uploadProfilePic() {
  const file = document.getElementById('profile-pic').files[0];
  const userKey = localStorage.getItem('userKey');

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`profile-pics/${userKey}.jpg`, file);

  if (error) {
    alert('Error uploading profile picture: ' + error.message);
  } else {
    const profileImageUrl = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path).publicURL;

    await supabase.from('users').update({ profile_image_url: profileImageUrl }).eq('id', userKey);
    alert('Profile picture updated!');
    document.getElementById('profile-image').src = profileImageUrl;
  }
}

async function uploadBanner() {
  const file = document.getElementById('banner-pic').files[0];
  const userKey = localStorage.getItem('userKey');

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`banners/${userKey}.jpg`, file);

  if (error) {
    alert('Error uploading banner image: ' + error.message);
  } else {
    const bannerImageUrl = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path).publicURL;

    await supabase.from('users').update({ banner_image_url: bannerImageUrl }).eq('id', userKey);
    alert('Banner updated!');
    document.getElementById('banner-image').src = bannerImageUrl;
  }
}