const Moment = require('moment');

// Add course to list in sidebar
function addCourseToSideBar(course) {
  const { courseName, professor, joinCode } = course;
  const role = localStorage.getItem('role');

  const visibility = role === 'professor' ? `style="display:none;"` : '';

  $('.sidebar .courses').append(`
    <button class="course-info">
        <h5 data-course="${courseName}">Course Name: ${courseName}</h5>
        <p data-professor="${professor}" ${visibility}>Professor: ${professor}</p>
        <p data-code="${joinCode}">Join Code: ${joinCode}</p>
    </button>
  `);
};

function bindCourseSelection(sendSurvey) {
  $('.courses .course-info').on('click', function(event) {
    const role = localStorage.getItem('role');
    const surveyOptions = $(`.${role}-survey-options`);

    surveyOptions.empty();

    const course = $(event.target).closest('.course-info');
    const courseName = course.find('[data-course]').data('course');
    const professor = course.find('[data-professor]').data('professor');
    const joinCode = course.find('[data-code]').data('code');

    const surveyInfo = {
      courseName: courseName,
      professor: professor,
      joinCode: joinCode,
      createdTime: Moment.now(),
      expireTime: Moment().add(7, 'days')
    }

    $('.dashboard-title').text(`Dashboard for ${courseName}`)

    if (role === 'professor') {
      const surveyExpireTime = localStorage.getItem(`survey-${joinCode}`);

      const surveyIsExpired = Moment().isAfter(surveyExpireTime);

      if (surveyIsExpired || !surveyExpireTime) {
        surveyOptions.append(`
          <div class="row">
            <div class="col-sm-4">
              <div class="card survey-card">
                <div class="card-body">
                  <h5 class="card-title">Send a survey to ${courseName}</h5>
                  <p class="card-text">Start receiving feedback from your students in your course by sending them a survey!</p>
                  <button class="survey-cta cta">Send survey</button>
                </div>
              </div>
            </div>
          </div>
        `);
      }
      else {
        surveyOptions.append(`
          <div class="row">
            <div class="col-sm-4">
              <div class="card survey-card">
                <div class="card-body">
                  <h5 class="card-title">Survey currently in progress for ${courseName}</h5>
                  <p class="card-text">Please wait until ${surveyExpireTime.format('MMMM Do YYYY, h:mm:ss a')} to view the results of the survey.</p>
                </div>
              </div>
            </div>
          </div>
        `);
      }

      $('.survey-cta').on('click', function(event) {

        // Enable the survey on the back-end
        sendSurvey(surveyInfo);

        $('.survey-card').empty();
        $('.survey-card').append(`
          <div class="card-body">
            <h5 class="card-title">Survey successfully sent!</h5>
            <p class="card-text">Your survey results will appear on ${surveyInfo.expireTime.format('MMMM Do YYYY, h:mm:ss a')}.</p>
          </div>
        `);

        localStorage.setItem(`survey-${joinCode}`, surveyInfo.expireTime);
      });
    }
  }); 
}

function getAllCourses(sendSurvey) {
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
        bindCourseSelection(sendSurvey);
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