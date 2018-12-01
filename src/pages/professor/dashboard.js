import 'normalize.css/normalize.css';
import '../../styles/index.scss';
import { initRoleSelection, bindRoleSelection } from '../../utils/role-modal';
import { getAllCourses, bindAddCourseButton } from '../../utils/course-utils';
import { addSurvey, getSurvey } from '../../utils/survey-utils';

// Redirect the user to the home page if not logged in
$(window).on('load', () => {
  const isLoggedIn = netlifyIdentity.currentUser();

  if (!isLoggedIn) {
    window.location.href = '/'
  }
  else if (isLoggedIn) {
    const role = localStorage.getItem('role');

    if (!window.location.href.includes(role)) {
      window.location.href = `/${role}/dashboard`
    }
  }
});

// Initializes and finds out if a user has a 'student' or 'professor' role
// or prompts the user to select a role (they cannot exit without choosing one)
initRoleSelection();

netlifyIdentity.on('login', () => {
  const role = localStorage.getItem('role');
  
  // get all courses on load or refresh
  // pass in survey options to dynamically bind to button selections in the course list
  const surveyFunction = role === 'professor' ? addSurvey : getSurvey;
  getAllCourses(surveyFunction);

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

  const role = localStorage.getItem('role');
  
  // Bind on-click handler for adding a course
  // pass in survey options to dynamically bind to button selections in the course list
  const surveyFunction = role === 'professor' ? addSurvey : getSurvey;
  bindAddCourseButton(surveyFunction);
});