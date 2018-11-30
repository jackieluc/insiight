import 'normalize.css/normalize.css';
import './styles/index.scss';
import { initRoleSelection, bindRoleSelection } from '../src/utils/role-modal';


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
  // Add 'dashboard' page back in the navigation menu
  $('nav .dashboard-link').show();
});

// Clear the role on logout
netlifyIdentity.on('logout', () => {
  delete localStorage.role;
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