export function showPasswordError(
  password,
  setPassword,
  setPasswordErrorMessage
) {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const flag = strongPasswordRegex.test(password);
  if (flag) {
    return true;
  } else {
    setPassword("");
    let errorMessage = "";
    if (password.length < 8)
      errorMessage += "Password must be at least 8 characters long. ";
    if (!/[A-Z]/.test(password))
      errorMessage += "\nPassword must contain at least one capital letter. ";

    if (!/[a-z]/.test(password))
      errorMessage += "\nPassword must contain at least one small letter. ";
    if (!/[0-9]/.test(password))
      errorMessage += "\nPassword must contain at least one digit (0–9). ";
    if (!/[@$!%*?&]/.test(password))
      errorMessage +=
        "Password must contain at least one special character (@, $, !, %, *, ?, &). ";
    setPasswordErrorMessage(errorMessage);
    return false;
  }
}
