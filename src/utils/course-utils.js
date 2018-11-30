// Add course to list in sidebar
function addCourseToSideBar(course) {
  $('.sidebar .courses').append(`
    <button class="course-info">
        <h5>Course Name: ${course.courseName}</h5>
        <p>Professor: ${course.professor}</p>
        <p>Join Code: ${course.joinCode}</p>
    </button>
  `);
};

function getAllCourses() {
  const user = netlifyIdentity.currentUser();

  fetch('/.netlify/functions/get-courses', {
    method: "POST",
    body: JSON.stringify({ email: user.email })
  })
  .then(response => {
    if (!response.ok) {
      return response
        .text()
        .then(err => {throw(err)});
    }

    response.text().then(function(result) {
      const { courses } = JSON.parse(result);

      if (courses) {
        courses.map(course => addCourseToSideBar(course));

        // Bind on-click handler for when a user selects a course in the sidebar
        $('.courses .course-info').on('click', function(event) {
        }); 
      };
    });
  })
  .catch(err => console.error(err));
};

// Takes the information from the form and submits it to add-course Netlify function
function bindAddCourseButton() {
  $('.add-course-button').on('click', function() {
    const user = netlifyIdentity.currentUser();
    const role = localStorage.getItem('role');
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
};

module.exports = {
  addCourseToSideBar,
  getAllCourses,
  bindAddCourseButton,
};