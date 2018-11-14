import 'normalize.css/normalize.css';
import '../../styles/index.scss';


$('document').ready(() => {

  $('.add-course-button').on('click', () => {
    fetch('/.netlify/functions/add-course', {
      method: "POST",
      body: JSON.stringify({
        text: 'i want to add a course'
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(err => {throw(err)});
      }
      response.text().then(console.log);
    })
    .catch(err => console.error(err));
  });
});