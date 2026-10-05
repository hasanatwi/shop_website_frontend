export function showEmailError(email, setEmailErrorMessage, setEmail) {
  console.log("The showEmailError function was entered");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log("The email is in wrong format");
    setEmail("");
    setEmailErrorMessage("Wrong Email Format. Please try again");
    return false;
  }
  setEmailErrorMessage("");
  return true;
}
