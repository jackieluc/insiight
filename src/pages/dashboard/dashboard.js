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
    
    const courseInfo = $('#add-course-form').find('input').map((index, inputField) => {
      let courseObject = {};
      courseObject[inputField.name] = inputField.value;

      return courseObject;
    });

    fetch('/.netlify/functions/add-course', {
      method: "POST",
      body: JSON.stringify(courseInfo)
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(err => {throw(err)});
      }
      response.text().then(console.log);
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