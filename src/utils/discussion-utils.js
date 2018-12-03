function addToDiscussionThread(comment) {
  const { commentID, message, upvotes } = comment;

  $('.discussion-thread .thread').append(`
    <div class="comment-wrapper">
      <div class="comment-info">
        <div data-commentid="${commentID}" style="display:none;"></div>
        <p class="message" data-message="${message}">${message}</p>
      </div>
      <div class="upvote-info">
        <button class="upvote-btn">
          <img src="${require('../assets/upvote.svg')}" alt="upvote" />
          <p class="upvote-num">${upvotes}</p>
        </button>
      </div>
    </div>
  `);
};

function bindUpvotes(discussionID) {
  $('.upvote-info .upvote-btn').off('click').on('click', (event) => {
    const email = netlifyIdentity.currentUser().email;

    const comment = $(event.target).closest('.comment-wrapper');
    const commentID = comment.find('[data-commentid]').data('commentid');
    const upvoteNum = comment.find('.upvote-num');

    const commentInfo = {
      email: email,
      discussionID: discussionID,
      commentID: commentID
    };

    fetch('/.netlify/functions/add-upvote', {
      method: "POST",
      body: JSON.stringify(commentInfo)
    })
    .then(response => {
      if (!response.ok) {
        return response
          .text()
          .then(err => {throw(err)});
      }
  
      response.text().then(function(result) {
        const { response } = JSON.parse(result);
        
        if (response === 'success') {
          const originalValue = Number(upvoteNum.text());
          upvoteNum.text(originalValue + 1);
        }
      });
    })
    .catch(err => console.error(err));
  });
};

function getComments(courseInfo) {
  const role = localStorage.getItem('role');
  
  fetch('/.netlify/functions/get-comments', {
    method: "POST",
    body: JSON.stringify({ joinCode: courseInfo.joinCode })
  })
  .then(response => {
    if (!response.ok) {
      return response
        .text()
        .then(err => {throw(err)});
    }

    response.text().then(function(result) {
      const { discussionID, comments } = JSON.parse(result);
      $('.discussion-thread .thread').empty();

      if (comments) {
        comments.map(comment => addToDiscussionThread(comment));

        // Only students can upvote
        if (role === 'student') {
          bindUpvotes(discussionID);
        }
        else if (role === 'professor') {
          // Hide prompt to click from professors
          $('.upvote-btn').css('cursor', 'default');
        }
      };
    });
  })
  .catch(err => console.error(err));
};

function submitComment(courseInfo) {
  // bug: since we are binding the on click every time we get a course list, 
  // we must unbind any click handlers before binding another to ensure we have one event binded
  $('.discussion-thread .submit-comment-btn').off('click').on('click', (event) => {
    const email = netlifyIdentity.currentUser().email;
    const comment = $('.comment-box .comment').val();
    const joinCode = courseInfo.joinCode;
    
    const message = {
      email: email,
      joinCode: joinCode,
      comment: comment
    };

    fetch('/.netlify/functions/add-comment', {
      method: "POST",
      body: JSON.stringify(message)
    })
    .then(response => {
      if (!response.ok) {
        return response
          .text()
          .then(err => {throw(err)});
      }

      response.text().then(function(result) {
        const comment = JSON.parse(result);

        addToDiscussionThread(comment);
      });
    })
    .catch(err => console.error(err));
  });
};

module.exports = { submitComment, getComments }