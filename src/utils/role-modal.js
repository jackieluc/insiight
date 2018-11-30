function openRoleModal() {
  $('#pick-role-modal').modal('show');
};

function closeRoleModal() {
  $('#pick-role-modal').hide();
  $('body').removeClass('modal-open');
  $('.modal-backdrop').remove();
};

// Add the user with their role in the database
function addRoleToDb(role) {
  const user = netlifyIdentity.currentUser();
  const userSchema = {
    'name': user.user_metadata.full_name,
    'email': user.email,
    'role': role,
  };

  fetch('/.netlify/functions/add-user', {
    method: "POST",
    body: JSON.stringify(userSchema)
  })
  .then(response => {
    if (!response.ok) {
      return response
        .text()
        .then(err => {throw(err)});
    };

    response.text().then(function(result) {
      console.log('Aded user to the database');
    });
  })
  .catch(err => console.error(err));
};

function checkRoleFromDb() {
  const user = netlifyIdentity.currentUser();

  fetch('/.netlify/functions/get-user', {
    method: "POST",
    body: JSON.stringify({ email: user.email })
  })
  .then(response => {
    if (!response.ok) {
      return response
        .text()
        .then(err => {throw(err)});
    };

    response.text().then(function(result) {
      const payload = JSON.parse(result);
    
      // Prompt the user to get their role
      // or set the role from the DB
      if (!payload || !payload.role) openRoleModal();
      else localStorage.setItem('role', payload.role);
    });
  })
  .catch(err => console.error(err));
};

function initRoleSelection() {
  netlifyIdentity.on('login', (user) => {
    setTimeout(function() { 
      $('.netlify-identity-item.netlify-identity-user-details span').text('Hi, ' + user.user_metadata.full_name);
    }, 20);
  
    if (!Boolean(localStorage.getItem('role'))) {        
      checkRoleFromDb();
    };
  });
};

function bindRoleSelection() {
  $('#pick-role-modal button.call-to-action').on('click', (event) => {
    localStorage.setItem('role', event.target.value);
    closeRoleModal();

    const role = localStorage.getItem('role');
    addRoleToDb(role);

    // Redirect to 'dashboard' page based on their role
    if (!window.location.href.includes('dashboard')) {
      window.location.href = `${role}/dashboard`;
    };
  });    
}

module.exports = { initRoleSelection, bindRoleSelection };