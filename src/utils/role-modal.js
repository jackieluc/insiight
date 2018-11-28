function openRoleModal() {
  $('#pick-role-modal').modal('show');
};

function closeRoleModal() {
  $('#pick-role-modal').hide();
  $('body').removeClass('modal-open');
  $('.modal-backdrop').remove();
};

module.exports = {
  initRoleSelection: function() {
    netlifyIdentity.on('login', (user) => {
      setTimeout(function() { 
        $('.netlify-identity-item.netlify-identity-user-details span').text('Hi, ' + user.user_metadata.full_name);
      }, 20);
    
      if (!Boolean(localStorage['role'])) {
        openRoleModal();

      };
    });
  },
  bindRoleSelection: function() {
    $('#pick-role-modal button.call-to-action').on('click', (event) => {
      localStorage['role'] = event.target.value;
      closeRoleModal();

      // Redirect to dashboard page
      if (!window.location.href.includes('dashboard')) {
        window.location.href="/dashboard";
      };
    });
  }
};