import 'normalize.css/normalize.css';
import './styles/index.scss';


$('document').ready(() => {
  
  $('button.call-to-action').on('click', () => {
    netlifyIdentity.open('signup');
  });
});
