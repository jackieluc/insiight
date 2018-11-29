import 'normalize.css/normalize.css';
import '../../styles/index.scss';
import { initRoleSelection, bindRoleSelection } from '../../utils/role-modal';

// Show the appropriate form for a user's role
function initAddCourseForm() {
  const role = localStorage.role;

  if (role === 'student') {
    $('.professor-form').remove();
  }
  else if (role === 'professor') {
    $('.student-form').remove();
  }
};

// Add course to list in sidebar
function addCourseToSideBar(course) {
  $('.sidebar .courses').append(`
    <div class="course-info">
      <p>Course Name: ${course.courseName}</p>
      <p>Professor: ${course.professor}</p>
      <p>Join Code: ${course.joinCode}</p>
    </div>
  `);
};

// Initializes and finds out if a user has a 'student' or 'professor' role
// or prompts the user to select a role (they cannot exit without choosing one)
initRoleSelection();

// Initialize the add-course form to show student or professor form
initAddCourseForm();

netlifyIdentity.on('login', () => {

  // get all courses
});

// Clear the role on logout
netlifyIdentity.on('logout', () => {
  delete localStorage.role;
});

$('document').ready(function() {

  // Bind on-click handler for selecting a role in the modal
  bindRoleSelection();

  // Takes the information from the form and submits it to add-course Netlify function
  $('.add-course-button').on('click', function() {
    const user = netlifyIdentity.currentUser();
    const role = localStorage.role;
    const form = $(`#add-course-form .${role}-form`);
    
    let courseInfo = {};
    
    if (role === 'student') {

      const joinCode = form.find('input').get(0).value;

      courseInfo = {
        email: user.email,
        role: role,
        joinCode: joinCode
      };
    }
    else if (role === 'professor') {

      const school = form.find('input').get(0).value;
      const course = form.find('input').get(1).value;

      courseInfo = {
        name: user.user_metadata.full_name,
        email: user.email,
        role: role,
        course: course,
        school: school
      };
    }

    fetch('/.netlify/functions/add-course', {
      method: "POST",
      body: JSON.stringify(courseInfo)
    })
    .then(response => {
      if (!response.ok) {
        return response
          .text()
          .then(err => {throw(err)});
      }

      response.text().then(function(result) {
        const course = JSON.parse(result);
        addCourseToSideBar(course);
      });

      $('#add-course-modal').modal('hide');
    })
    .catch(err => console.error(err));
  });
});