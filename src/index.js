import 'normalize.css/normalize.css';
import './styles/index.scss';

//following three lines are for an optional theme, can delete if needed
import CMS from 'netlify-cms'
CMS.registerPreviewTemplate('my-template', MyTemplate)
$('document').ready(() => {
});
