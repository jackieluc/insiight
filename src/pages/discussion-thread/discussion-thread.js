import 'normalize.css/normalize.css';
import '../../styles/index.scss';

$(window).on('load', () => {
    const isLoggedIn = netlifyIdentity.currentUser();
  
    if (!isLoggedIn) {
      window.location.href = '/'
    }
    else if (isLoggedIn) {
      const role = localStorage.getItem('role');
  
      if (!window.location.href.includes(role)) {
        window.location.href = `/${role}/discussion-thread`
      }
    }
  });


var thread = {body: "", upvotes: 0};
    

// Add thread to body of page
function addThreadToBody() {
  const role = localStorage.getItem('role');
  role === 'professor' ? `style="display:none;"` : '';

  document.getElementById('spanResult').textContent = result;
  
  var result = thread.body;
  $('.discussion-thread .thread-form').append(`
    <input type="text" id="textone" />
  `);
};

function upvoteThreadBtn(){
    $('.upvote-btn').on('click', function() {
        thread.upvotes+=1;
    })
}


// Takes the information from the form and submits it to add-course Netlify function
function bindAddThreadBtn() {
  $('.submit-btn').on('click', function() {
    const user = netlifyIdentity.currentUser();
    const role = localStorage.getItem('role');
    const form = $(`#add-course-form .${role}-form`);

    fetch('/.netlify/functions/add-thread', {
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
        const thread = JSON.parse(result);
        addThreadToBody(thread);
      });

      $('#add-thread-modal').modal('hide');
    })
    .catch(err => console.error(err));
  });
};

$('document').ready(function() {

    // Bind on-click handler for selecting a role in the modal
    addThreadToBody();
    upvoteThreadBtn();
    bindAddThreadBtn();
  });