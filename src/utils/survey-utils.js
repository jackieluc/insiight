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
        choices:["Very Good","Good","OK","Bad", "Very Bad"]
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
};

const survey = new Survey.Model(surveySchema);
survey.surveyPostId = '72167288-14c7-4f0e-af17-6c4955db4e9a';
survey.surveyShowDataSaving = true;

function sendDataToServer(survey) {
    //send Ajax request to your web server.
    alert("The results are:" + JSON.stringify(survey.data));
    
};

function initSurvey() {
  $(".survey-container").Survey({
      model: survey,
      onComplete: sendDataToServer
  });
};

function addSurvey(surveyInfo) {

  let schema = {};

  // Build the schema, so we can access the counter for survey results
  // Example: schema['How are you today?']['Bad'] => '0'
  surveySchema.pages[0].elements.forEach(function(question) {
    const aQuestion = schema[question.name] = {};
    question.choices.forEach(function(choice) {
      aQuestion[choice] = '0';
    });
  });

  const survey = {
    ...surveyInfo,
    schema: schema
  }

  fetch('/.netlify/functions/add-survey', {
    method: "POST",
    body: JSON.stringify(survey)
  })
  .then(response => {
    if (!response.ok) {
      return response
        .text()
        .then(err => {throw(err)});
    }

    response.text().then(function(result) {
      const resultJson = JSON.parse(result);
      console.log(resultJson.response);
    });
  })
  .catch(err => console.error(err));
};

function getSurvey(surveyInfo) {

  fetch('/.netlify/functions/get-survey', {
    method: "POST",
    body: JSON.stringify(surveyInfo)
  })
  .then(response => {
    if (!response.ok) {
      return response
        .text()
        .then(err => {throw(err)});
    }

    response.text().then(function(result) {
      const resultJson = JSON.parse(result);
      console.log(resultJson);

      // if (enabled / moment.isBefore(expireDate))
      // initSurvey
      // return true
      // else 
      // return false
    });
  })
  .catch(err => console.error(err));
};

module.exports = { initSurvey, surveySchema, addSurvey, getSurvey }