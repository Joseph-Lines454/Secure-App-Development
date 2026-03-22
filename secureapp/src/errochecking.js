


export function EmailCheck(email)
{
  var regex = /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/

  if (regex.test(email) === true)
  {
    return true;
  }
  else
  {
    return false;
  }

}
export function PasswordChecker(password)
{
  var regex = /([(0-9)(+-=><)(A-Z)])/
  
  if (regex.test(password) === true && password.length >= 8)
  {
    
    return true;
  }
  else
  {
    
    return false;
  }



}
export function TextChecker(text)
{
  var regex = /([a-z])|([A-Z])/g
  if (text == "" || text.length < 4)
  {
    return false;
  }
  else if (regex.test(text) == false)
  {
    return false;
  }
  else if (text.length > 25)
  {
    return false;
  }
  return true;
}
export function DescriptionChecker(text)
{
  var regex = /([a-z])|([A-Z])/g
  if (text == "")
  {
    return false;
  }
  else if (regex.test(text) == false)
  {
    return false;
  }
  else if (text.length > 200)
  {
    return false;
  }
  return true;
}


