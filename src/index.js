import 'normalize.css/normalize.css';
import './styles/index.scss';
import { initRoleSelection, bindRoleSelection, checkRoleFromDb } from '../src/utils/role-modal';


// Hides the 'dashboard' page when a user is not logged in
$(window).on('load', () => {
  const currentUser = netlifyIdentity.currentUser();

  if (!currentUser) {
    $('nav .dashboard-link').hide();
  }
});

// Initializes and finds out if a user has a 'student' or 'professor' role
// or prompts the user to select a role (they cannot exit without choosing one)
initRoleSelection();

netlifyIdentity.on('login', () => {
  
  // Change the navigation menu URL to include the role
  const role = localStorage.getItem('role');
  if (!Boolean(role)) {
    checkRoleFromDb();
  }
  else {
    $('nav .dashboard-link .nav-link').attr('href', `/${role}/dashboard`);
    // Add 'dashboard' page back in the navigation menu
    $('nav .dashboard-link').show();
  }
});

// Clear the role on logout
netlifyIdentity.on('logout', () => {
  delete localStorage.role;
  $('nav .dashboard-link').hide();
});

// When the HTML document has finished loading, run the following callback function
$('document').ready(() => {
  
  // Bind the 'signup' modal to the button
  $('button.main-cta').on('click', () => {
    netlifyIdentity.open('signup');
  });

  // Bind on-click handler for selecting a role in the modal
  bindRoleSelection();
});