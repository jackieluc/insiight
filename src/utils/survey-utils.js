//Survey.Survey.cssType = "bootstrap";
const defaultThemeColors = Survey.StylesManager.ThemeColors["default"];

defaultThemeColors["$main-color"] = "#3ED2CC";
defaultThemeColors["$main-hover-color"] = "#83DFDB";

Survey.StylesManager.applyTheme();

const surveySchema = {
  questionTitleTemplate: "{no}. {title}",
  pages: [{ 
    title: "Please fill out this survey.",
    elements: [
      {
        type: "radiogroup",
        name: "How are you today?",
        colCount: 5,
        isRequired: true,
        choices: ["Upset","Tired","So-So","OK", "Peachy"]
      },
      {
        type: "radiogroup",
        name: "How was Class?",
        colCount: 5,
        isRequired: true,
        choices: ["Very Useless","Useless","Neither","Helpful","Very Helpful"]
      },
      {
        type:"radiogroup",
        name:"How was the lecture material this week?",
        colCount: 5,
        isRequired:true,
        choices:["Very Hard","Hard","Average","Easy","Very Easy"]
      },
      {
        type:"radiogroup",
        name:"Do you find the material useful?",
        colCount: 5,
        isRequired: true,
        choices:["Absolutely Not","No","Neutral","Yes","Very Useful"]
      },
      {
        type:"radiogroup",
        name:"How comfortable are you with the material so far?",
        colCount: 5,
        isRequired:true,
        choices:["Very Uncomfortable","Uncomfortable","Neutral","Comfortable","Very Comfortable"]
      }
    ]
  }],
  completeText:"Submit survey"
};

function submitSurvey(survey, joinCode) {
  const email = netlifyIdentity.currentUser().email;
  const mySurvey = {
    email: email,
    joinCode: joinCode,
    survey: survey.data
  };

  fetch('/.netlify/functions/submit-survey', {
    method: "POST",
    body: JSON.stringify(mySurvey)
  })
  .then(response => {
    if (!response.ok) {
      return response
        .text()
        .then(err => {throw(err)});
    };

    response.text().then(function(result) {
      const resultJson = JSON.parse(result);
      console.log(resultJson.response);
    });
  })
  .catch(err => console.error(err));
};

function initSurvey(joinCode) {
  const survey = new Survey.Model(surveySchema);

  survey.onComplete.add(function (survey) {
    submitSurvey(survey, joinCode);
  });

  $('.survey-container').empty();
  $('.survey-container').Survey({ model: survey });
};

function addSurvey(surveyInfo) {

  let schema = {};

  // Build the schema, so we can access the counter for survey results
  // Example: schema['How are you today?']['Bad'] => '0'
  surveySchema.pages[0].elements.forEach(function(question) {
    const aQuestion = schema[question.name] = {};
    question.choices.forEach(function(choice) {
      aQuestion[choice] = 0;
    });
  });

  const survey = {
    ...surveyInfo,
    enabled: 'true',
    schema: schema
  };

  fetch('/.netlify/functions/add-survey', {
    method: "POST",
    body: JSON.stringify(survey)
  })
  .then(response => {
    if (!response.ok) {
      return response
        .text()
        .then(err => {throw(err)});
    };

    response.text().then(function(result) {
      const resultJson = JSON.parse(result);
      console.log(resultJson.response);
    });
  })
  .catch(err => console.error(err));
};

function getSurvey(surveyInfo) {
  const email = netlifyIdentity.currentUser().email;

  const mySurvey = {
    email: email,
    ...surveyInfo
  };

  return fetch('/.netlify/functions/get-survey', {
    method: "POST",
    body: JSON.stringify(mySurvey)
  })
  .then(response => {
    if (!response.ok) {
      return response
        .text()
        .then(err => {throw(err)});
    };

    return response.json();
  })
  .then(survey => {      
    if (survey.result === 'inProgress') {
      initSurvey(surveyInfo.joinCode);
      return true;
    };

    return false;

  })
  .catch(err => console.error(err));
};

module.exports = { addSurvey, getSurvey }