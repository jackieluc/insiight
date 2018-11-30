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
      <h5>Course Name: ${course.courseName}</h5>
      <p>Professor: ${course.professor}</p>
      <p>Join Code: ${course.joinCode}</p>
    </div>
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
      };
    });
  })
  .catch(err => console.error(err));
};

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

// Initialize the add-course form to show student or professor form
initAddCourseForm();

netlifyIdentity.on('login', () => {
  // get all courses on load or refresh
  getAllCourses();
});

// Clear the role on logout and redirect to home page
netlifyIdentity.on('logout', () => {
  delete localStorage.role;
  window.location.href = '/';
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


//Survey
//Survey.Survey.cssType = "bootstrap";
var defaultThemeColors = Survey
    .StylesManager
    .ThemeColors["default"];
defaultThemeColors["$main-color"] = "#3ED2CC";
defaultThemeColors["$main-hover-color"] = "#83DFDB";

Survey
    .StylesManager
    .applyTheme();

var surveyJSON = {
  questionTitleTemplate: "{no}. {title}",
  pages: [{ 
    name: "page1",
    elements: [
      {
        type: "radiogroup",
        name: "How are you today?",
        colCount: 5,
        isRequired: true,
        choices:["Very Good","Good","OK","Bad", "Very Bad"]
      },
      {
        type: "radiogroup",
        name: "How was Class?",
        colCount: 5,
        isRequired: true,
        choices: ["V.Useless","Useless","Neither","Helpful","V.Helpful"]
      },
      {
        type:"radiogroup",
        name:"question3",
        colCount: 5,
        isRequired:true,
        choices:["item1","item2","item3","item4","item5"]
      },
      {
        type:"radiogroup",
        name:"question4",
        colCount: 5,
        isRequired: true,
        choices:["item1","item2","item3","item4","item5"]
      },
      {
        type:"radiogroup",
        name:"question5",
        colCount: 5,
        isRequired:true,
        choices:["item1","item2","item3","item4","item5"]
      }
    ]
  }],
  completeText:"Submit survey"
}

var survey = new Survey.Model(surveyJSON);
survey.surveyPostId = '72167288-14c7-4f0e-af17-6c4955db4e9a';
survey.surveyShowDataSaving = true;

function sendDataToServer(survey) {
    //send Ajax request to your web server.
    alert("The results are:" + JSON.stringify(survey.data));
    
}

$("#surveyContainer").Survey({
    model: survey,
    onComplete: sendDataToServer
});