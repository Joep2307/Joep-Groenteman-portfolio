// Imported here rather than linked from the page: the dev server cannot
// serve a link that points outside exe/.
import '../src/styles/site.scss';
import { mountSite } from '../src/site/mountSite';

mountSite(document);
