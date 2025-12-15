import $ from 'jquery';
import { openExternal } from './electronHelper';

export const openLinksExternally = (): void => {
  
  $(document).off().on('click', 'a[href^="http"]', function(event) {
    event.preventDefault();
    openExternal(this.href);
  });
}