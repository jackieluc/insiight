import 'normalize.css/normalize.css';
import './styles/index.scss';


//not sure if this is the right place for this
import CMS from 'netlify-cms'
// Now the registry is available via the CMS object.
CMS.registerPreviewTemplate('my-template', MyTemplate)


$('document').ready(() => {
    
});
