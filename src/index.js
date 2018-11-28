import 'normalize.css/normalize.css';
import './styles/index.scss';

window.onload = function()
{
  if (netlifyIdentity.currentUser()) {
    const name = netlifyIdentity.currentUser().user_metadata.full_name;
    $('.netlify-identity-item.netlify-identity-user-details span').text('Hi, ' + name);
  }
}

netlifyIdentity.on('login', (user) => {
  setTimeout(function(){ 
    $('.netlify-identity-item.netlify-identity-user-details span').text('Hi, ' + user.user_metadata.full_name);
  }, 20);  
});

$('document').ready(() => {
  
  $('button.call-to-action').on('click', () => {
    netlifyIdentity.open('signup');
  });
});
