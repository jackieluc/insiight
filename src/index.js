import 'normalize.css/normalize.css';
import './styles/index.scss';


//not sure if i'm doing this part correctly
import CMS from 'netlify-cms'

// Now the registry is available via the CMS object.
CMS.registerPreviewTemplate('my-template', MyTemplate)

$('document').ready(() => {
    
});
