import 'normalize.css/normalize.css';
import '../../styles/index.scss';
import { initRoleSelection, bindRoleSelection } from '../../utils/role-modal';

function addStudentForm() {
  $('#add-course-form').append(`
    <div class="course-code input-block">
      <label for="course-code">Join code</label>
      <input id="course-code" name="courseCode" type="text" />
    </div>
  `);
};

function removeStudentForm() {
  $('.course-code').remove();
};

function addProfessorForm() {
  $('#add-course-form').append(`
    <div class="course-name input-block">
      <label for="course-name">Course name</label>
      <input id="course-name" name="courseName" type="text" />
    </div>
  `);
};

function removeProfessorForm() {
  $('.course-name').remove();
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

// Clear the role on logout
netlifyIdentity.on('logout', () => {
  delete localStorage.role;
});

$('document').ready(function() {

  // Bind on-click handler for selecting a role in the modal
  bindRoleSelection();

  // Takes the information from the form and submits it to add-course Netlify function
  $('.add-course-button').on('click', function() {
    const form = $('#add-course-form');
    const role = form.find('select').get(0).value;
    const courseInfo = form.find('input').get(0).value;

    const courseSchema = {
      'role': role,
      'courseInfo': courseInfo,
      'name': 'n/a'
    };

    fetch('/.netlify/functions/add-course', {
      method: "POST",
      body: JSON.stringify(courseSchema)
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

  // Toggle student and professor forms
  $('select.role').on('change', () => {
    let role = $('select.role').val();

    if (role === 'professor') {
      removeStudentForm();
      addProfessorForm();
    } 
    else {
      removeProfessorForm();
      addStudentForm();
    }
  });
});