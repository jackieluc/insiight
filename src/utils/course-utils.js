const Moment = require('moment');
var data;



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

function bindProfessorSurvey(surveySelectElement, surveyFunction, surveyInfo) {
  
  const { courseName, joinCode, expireTime } = surveyInfo;
  const surveyIsInProgress = localStorage.getItem(`survey-${joinCode}`);
  const surveyIsExpired = surveyIsInProgress === 'expired' ? true : Moment().isAfter(surveyIsInProgress);

  const surveyIsStarted = surveyIsInProgress === null ? false : true;

  if (surveyIsExpired || !surveyIsStarted) {
    localStorage.setItem(`survey-${joinCode}`, 'expired');
  }


  if (surveyIsExpired || !surveyIsStarted) {
    surveySelectElement.append(`
      <div class="row">
        <div class="col-sm-4">
          <div class="card survey-card">
            <div class="card-body">
              <h5 class="card-title">Send a survey to ${courseName}</h5>
              <p class="card-text">Start receiving feedback from your students in your course by sending them a survey!</p>
              <button class="survey-cta cta">Send survey</button>
              <button class="results-cta cta">View Results</button>
            </div>
          </div>
        </div>
      </div>
    `);
  }
  else {
    surveySelectElement.append(`
      <div class="row">
        <div class="col-sm-4">
          <div class="card survey-card">
            <div class="card-body">
              <h5 class="card-title">Survey is currently in progress for ${courseName}</h5>
              <p class="card-text">Please wait until ${surveyIsInProgress.format('MMMM Do YYYY, h:mm:ss')} to view the results of the survey.</p>
              <button class="results-cta cta">View Results</button>
            </div>
          </div>
        </div>
      </div>
    `);
  };

  $('.survey-cta').on('click', function(event) {
    console.log('here');
    // Enable the survey on the back-end
    surveyFunction(surveyInfo);

    $('.survey-card').empty();
    $('.survey-card').append(`
      <div class="card-body">
        <h5 class="card-title">Survey successfully sent!</h5>
        <p class="card-text">Your survey results will appear on ${expireTime.format('MMMM Do YYYY, h:mm:ss')}.</p>
      </div>
    `);

    localStorage.setItem(`survey-${joinCode}`, expireTime);
  });

  $('.results-cta').on('click', function(event) {
    displayResults(getResults());

  });

  function getRandomInt() {
    max = 50;
    return Math.floor(Math.random() * Math.floor(max));
  }
    function displayResults(numbs){
    //getResults().then(function(myJson) {alert(JSON.stringify(myJson))});
    //alert ();

    //$('.survey-card').empty();
    $('.survey').empty();
    $('.survey').append(`
      <div id="question-containers">
        <div class="qcontainer" >
          <canvas id="q1_Chart"></canvas>
        </div>
        <div class="qcontainer">
           <canvas id="q2_Chart"></canvas>
        </div>
        <div class="qcontainer" >
          <canvas id="q3_Chart"></canvas>
        </div>
      </div>

      <div id="question-containers">
        <div class="qcontainer" >
          <canvas id="q4_Chart"></canvas>
        </div>
        <div class="qcontainer" >
          <canvas id="q5_Chart"></canvas>
        </div>
      </div>
    `);
    var ctx = document.getElementById('q1_Chart').getContext('2d');
    var ctx2 = document.getElementById('q2_Chart').getContext('2d');
    var ctx3 = document.getElementById('q3_Chart').getContext('2d');
    var ctx4 = document.getElementById('q4_Chart').getContext('2d');
    var ctx5 = document.getElementById('q5_Chart').getContext('2d');
    var colors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)'
  ];
  
  var gdata = [7, 10, 5, 12, 20];
  
  var glabels = ["Answer 1", "Answer 2", "Answer 3", "Answer 4", "Answer 5"];
  
  var q1data = [getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt()];
  var q2data = [getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt()];
  var q3data = [getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt()];
  var q4data = [getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt()];
  var q5data = [getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt()];

  var q1label = "How are you today?";
  var q1answer = ["Upset","Tired","So-So","OK", "Peachy"];

  var q2label = "How was Class?";
  var q2answer = ["Very Useless","Useless","Neither","Helpful","Very Helpful"];

  var q3label = "How was the lecture material this week?";
  var q3answer = ["Very Hard","Hard","Average","Easy","Very Easy"];

  var q4label = "Do you find the material useful?";
  var q4answer = ["Absolutely Not","No","Neutral","Yes","Very Useful"];

  var q5label = "How comfortable are you with the material so far?";
  var q5answer = ["Very Uncomfortable","Uncomfortable","Neutral","Comfortable","Very Comfortable"];
  
  //var q1data = resultz.slice(4);
  //var q2data = resultz.slice(5,10);
  //var q3data = resultz.slice(10,15);
  //var q4data = resultz.slice(15, 20);
  //var q5data = resultz.slice(20,25);
  
  
  
  Chart.defaults.global.defaultFontFamily = 'Roboto';
   
  var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'pie',
  
      // The data for our dataset
      data: {
          labels: q1answer,
          datasets: [{
              data: q1data,
              backgroundColor: colors,
              borderColor: colors,
              borderWidth: 1
          }]
      },
  
      // Configuration options go here
      options: {
          title: {
              display: true,
              text: q1label
          }
      }
  });
  
  
  var chart = new Chart(ctx2, {
      // The type of chart we want to create
      type: 'pie',
  
      // The data for our dataset
      data: {
          labels: q2answer,
          datasets: [{
              data: q2data,
              backgroundColor: colors,
              borderColor: colors,
              borderWidth: 1
          }]
      },
  
      // Configuration options go here
      options: {
          title: {
              display: true,
              text: q2label
          }
      }
  });
  
  
  var chart = new Chart(ctx3, {
      // The type of chart we want to create
      type: 'pie',
  
      // The data for our dataset
      data: {
          labels: q3answer,
          datasets: [{
              label: "My First dataset",
              backgroundColor: colors,
              borderColor: colors,
              data: q3data,
          }]
      },
  
      // Configuration options go here
      options: {
          title: {
              display: true,
              text: q3label
          }
      }
  });
  
  var chart = new Chart(ctx4, {
      // The type of chart we want to create
      type: 'pie',
  
      // The data for our dataset
      data: {
          labels: q4answer,
          datasets: [{
              label: "My First dataset",
              backgroundColor: colors,
              borderColor: colors,
              data: q4data,
          }]
      },
  
      // Configuration options go here
      options: {
          title: {
              display: true,
              text: q4label
          }
      }
  });
  
  var chart = new Chart(ctx5, {
      // The type of chart we want to create
      type: 'pie',
  
      // The data for our dataset
      data: {
          labels: q5answer,
          datasets: [{
              label: "My First dataset",
              backgroundColor: colors,
              borderColor: colors,
              data: q5data,
          }]
      },
  
      // Configuration options go here
      options: {
          title: {
              display: true,
              text: q5label
          }
      }
  });
  
  };
};

function bindStudentSurvey(surveyFunction, surveyInfo) {
  
  surveyFunction(surveyInfo).then(surveyInProgress => {
    if (!surveyInProgress) {  
      $('.survey-container').empty();
      $('.survey-container').append(`
        <div class="row">
          <div class="col-sm-6">
            <div class="card survey-card">
              <div class="card-body">
                <h5 class="card-title">There are no surveys at this time.</h5>
                <p class="card-text">Please wait for your professor to send out a survey.</p>
              </div>
            </div>
          </div>
        </div>
      `);
    };
  });
};

function bindCourseSelection(surveyFunction) {
  $('.courses .course-info').on('click', function(event) {
    
    
    const role = localStorage.getItem('role');

    const course = $(event.target).closest('.course-info');
    
    const courseName = course.find('[data-course]').data('course');
    const professor = course.find('[data-professor]').data('professor');
    const joinCode = course.find('[data-code]').data('code');

    const surveyInfo = {
      courseName: courseName,
      professor: professor,
      joinCode: joinCode,
      createdTime: Moment.now(),
      expireTime: Moment().add(1, 'day')
    }

    $('.dashboard-title').text(`Survey for ${courseName}`)

    if (role === 'professor') {
      const surveySelectElement = $(`.professor-survey-options`);
      surveySelectElement.empty();
      
      bindProfessorSurvey(surveySelectElement, surveyFunction, surveyInfo);
    }
    else if (role === 'student') {
      bindStudentSurvey(surveyFunction, surveyInfo);
    }
  }); 
}

function getAllCourses(surveyFunction) {
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
        bindCourseSelection(surveyFunction);
      };
    });
  })
  .catch(err => console.error(err));
};

function getResults() {

  //const role = localStorage.getItem('role');

    //const course = $(event.target).closest('.course-info');
    //alert(JSON.stringify(role));

  fetch('/.netlify/functions/get-results', {
    method: "POST",
    body: '1172'
  })
  
  .then(response => {
    console.log("fdgffhgj");
    if (!response.ok) {
      return response
        .text()
        .then(err => {throw(err)});
    }

    response.text().then(function(result) {
      var test = JSON.stringify(result);
      //alert(test);
    });
  })
  .catch(err => console.error(err));
};

// Takes the information from the form and submits it to add-course Netlify function
function bindAddCourseButton(surveyFunction) {
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

        if (!course.courseName) {
          $('#add-course-form .student-form').append(`
            <p style="color: red; margin: 1rem 0 0 0;">Course does not exist, please try another Join Code.</p>
          `)
        }
        else {
          addCourseToSideBar(course);
          // Bind on-click handler for when a user selects a course in the sidebar
          bindCourseSelection(surveyFunction);

          $('#add-course-modal').modal('hide');
        }
      });
    })
    .catch(err => console.error(err));
  });
};

module.exports = {
  addCourseToSideBar,
  getAllCourses,
  bindAddCourseButton,
};



