//Survey
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

const survey = new Survey.Model(surveySchema);
survey.surveyPostId = '72167288-14c7-4f0e-af17-6c4955db4e9a';
survey.surveyShowDataSaving = true;

function sendDataToServer(survey) {
    //send Ajax request to your web server.
    alert("The results are:" + JSON.stringify(survey.data));
    
}

function initSurvey() {
  $(".survey-container").Survey({
      model: survey,
      onComplete: sendDataToServer
  });
};

module.exports = { initSurvey }