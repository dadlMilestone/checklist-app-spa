
export const includeHTML = (): void => {
  //get all info elements
  const z = document.getElementsByClassName('info');
  for (let i = 0; i < z.length; i++) {
    const elmnt = z[i];
    //if the info element has an include-html attribute...
    const file = elmnt.getAttribute('include-html');
        //...fetch the file using the attribute path and read its text
        fetch(file)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load ${file}: ${response.status} ${response.statusText}`);
            }
            return response.text();
          })
          .then(text => {
            //extract only the body content
            const body = getBody(text);
            //assign it to the inlcude-html element, remove the attribute, and loop through
            elmnt.innerHTML = body;
            elmnt.removeAttribute('include-html');
          })
          .catch(error => {
            console.error('Error loading HTML content:', error);
            elmnt.innerHTML = '<p>Failed to load content. Please try again.</p>';
            elmnt.removeAttribute('include-html');
          })
    }
  }

//extract only the body content
function getBody(content: string) 
{ 
   var x = content.indexOf('<body');
   x = content.indexOf('>', x);    
   var y = content.lastIndexOf('</body>'); 
   return content.slice(x + 1, y);
} 