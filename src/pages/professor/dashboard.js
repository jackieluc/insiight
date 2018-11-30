import 'normalize.css/normalize.css';
import '../../styles/index.scss';
import { initRoleSelection, bindRoleSelection } from '../../utils/role-modal';
import { getAllCourses, bindAddCourseButton } from '../../utils/course-utils';

// Redirect the user to the home page if not logged in
$(window).on('load', () => {
  const isLoggedIn = netlifyIdentity.currentUser();

  if (!isLoggedIn) {
    window.location.href = '/'
  }
});

// Initializes and finds out if a user has a 'student' or 'professor' role
// or prompts the user to select a role (they cannot exit without choosing one)
initRoleSelection();

netlifyIdentity.on('login', () => {
  // get all courses on load or refresh
  getAllCourses();

  const role = localStorage.getItem('role');

  // Change the navigation menu URL to include the role
  $('nav .dashboard-link .nav-link').attr('href', `/${role}/dashboard`);
  
  $('.survey').css('width', '80%'); 
});

// Clear the role on logout and redirect to home page
netlifyIdentity.on('logout', () => {
  delete localStorage.role;
  window.location.href = '/';
});

$('document').ready(function() {

  // Bind on-click handler for selecting a role in the modal
  bindRoleSelection();

  // Bind on-click handler for adding a course
  bindAddCourseButton();
});