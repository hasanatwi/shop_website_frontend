export function showEmailError(email, setEmailErrorMessage, setEmail) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setEmail("");
    setEmailErrorMessage("Wrong Email Format. Please try again");
    return false;
  }
  setEmailErrorMessage("");
  return true;
}
