import 'normalize.css/normalize.css';
import '../../styles/index.scss';

const addStudentForm = () => {
  $('#add-course-form').append(`
    <div class="course-code input-block">
      <label for="course-code">Join code</label>
      <input id="course-code" name="courseCode" type="text" />
    </div>
  `);
};

const removeStudentForm = () => {
  $('.course-code').remove();
};

const addProfessorForm = () => {
  $('#add-course-form').append(`
    <div class="course-name input-block">
      <label for="course-name">Course name</label>
      <input id="course-name" name="courseName" type="text" />
    </div>
  `);
};

const removeProfessorForm = () => {
  $('.course-name').remove();
};

$('document').ready(() => {

  // Takes the information from the form and submits it to add-course Netlify function
  $('.add-course-button').on('click', () => {
    const form = $('#add-course-form');
    const role = form.find('select').get(0).value;
    const courseInfo = form.find('input').get(0).value;

    const courseObject = {
      'role': role,
      'courseInfo': courseInfo,
      'name': 'n/a'
    };

    fetch('/.netlify/functions/add-course', {
      method: "POST",
      body: JSON.stringify(courseObject)
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(err => {throw(err)});
      }
      response.text().then(console.log);

      // close the modal
      $('#add-course-modal .modal-footer button:first').click();

      // add course to list in sidebar
      // $('.sidebar .bottom-section').prepend(`
      //   <div class="course-info">
      //     <p>Course name: ${JSON.parse(response.text()).courseName}</p>
      //     <p>Course name: ${JSON.parse(response.text()).joinCode}</p>
      //   </div>
      // `);
    })
    .catch(err => console.error(err));
  });

  // Toggle student and professor forms
  $('select.role').on('change', () => {
    let val = $('select.role').val();

    if (val === 'professor') {
      removeStudentForm();
      addProfessorForm();
    } 
    else {
      removeProfessorForm();
      addStudentForm();
    }
  });
});