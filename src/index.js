import 'normalize.css/normalize.css';
import './styles/index.scss';
import { initRoleSelection, bindRoleSelection } from '../src/utils/role-modal';

// Initializes and finds out if a user has a 'student' or 'professor' role
// or prompts the user to select a role (they cannot exit without choosing one)
initRoleSelection();

// Clear the role on logout
netlifyIdentity.on('logout', () => {
  delete localStorage.role;
});

$('document').ready(() => {
  
  $('button.main-cta').on('click', () => {
    netlifyIdentity.open('signup');
  });

  // Bind on-click handler for selecting a role in the modal
  bindRoleSelection();
});
