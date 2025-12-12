import $ from 'jquery';
import { getShell } from './electronHelper';

export const openLinksExternally = (): void => {
  
  $(document).off().on('click', 'a[href^="http"]', function(event) {
    event.preventDefault();
    const shell = getShell();
    if (shell) {
      shell.openExternal(this.href);
    }
  });
}