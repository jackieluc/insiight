import 'normalize.css/normalize.css';
import '../../styles/survey.scss';


$('document').ready(() => {
    
    $('h1').text('Survey');
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


var surveyJSON = {questionTitleTemplate : "{no}. {title}",
    pages:[{name:"page1",elements:[
        {
            type:"radiogroup",
            name:"How are you today?",
            isRequired:true,
            choices:["Very Good","Good","OK","Bad", "Very Bad"], colCount:5
        },{
            type:"radiogroup",
            name:"How was Class?",
            isRequired:true,
            choices:["V.Useless","Useless","Neither","Helpful","V.Helpful"],colCount:5
        },{
            type:"radiogroup",
            name:"question3",
            isRequired:true,
            choices:["item1","item2","item3","item4","item5"],colCount:5
        },{
            type:"radiogroup",
            name:"question4",
            isRequired:true,choices:["item1","item2","item3","item4","item5"],colCount:5
        },{
            type:"radiogroup",
            name:"question5",
            isRequired:true,
            choices:["item1","item2","item3","item4","item5"],colCount:5
        }
    ]
}],
completeText:"Submit"
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

/*
function getParams() {
    var url = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    var result = {};
    url.forEach(function(item) {
      var param = item.split("=");
      result[param[0]] = param[1];
    });
    return result;
  }
  
  function init() {
    Survey.dxSurveyService.serviceUrl = "";
  
    var css = {
      root: "sv_main sv_frame sv_default_css"
    };
  
    var surveyId = decodeURI(getParams()["id"]);
    var model = new Survey.Model({ surveyId: surveyId, surveyPostId: surveyId });
    model.css = css;
    window.survey = model;
    model.render("surveyElement");
  
    // // Load survey by id from url
    // var xhr = new XMLHttpRequest();
    // xhr.open('GET', "https://surveyjs-php.herokuapp.com" + '/survey?surveyId=' + surveyId);
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // xhr.onload = function () {
    //     var result = JSON.parse(xhr.response);
    //     if(!!result) {
    //         var surveyModel = new Survey.Model(result);
    //         window.survey = surveyModel;
    //         ko.cleanNode(document.getElementById("surveyElement"));
    //         document.getElementById("surveyElement").innerText = "";
    //         surveyModel.render("surveyElement");
    //     }
    // };
    // xhr.send();
  }
  
  init();
  */