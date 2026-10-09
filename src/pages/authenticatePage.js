
import * as p from "@clack/prompts";
import { login, signup } from "../components/Auth/loginSignupHandler.js";

async function authenticatePage() {
  p.intro("Welcome to the System Information CLI App!");

  const action = await p.select({
    message: "Choose an option",
    options: [
      { value: "login", label: "Login" },
      { value: "signup", label: "Sign up" },
    ],
  });

  if (p.isCancel(action)) {
    p.cancel("Authentication cancelled.");
    return null;
  }

  const email = await p.text({
    message: "Email address",
    validate(value) {
      if (!value || !value.includes("@")) {
        return "Enter a valid email address.";
      }
    },
  });

  if (p.isCancel(email)) {
    p.cancel("Authentication cancelled.");
    return null;
  }

  const password = await p.password({
    message: "Password",
  });

  if (p.isCancel(password)) {
    p.cancel("Authentication cancelled.");
    return null;
  }

  const spinner = p.spinner();
  spinner.start("Authenticating...");

  try {
    let user;
    if (action === "login"){
        user = await login(email, password);
    }
    else if (action === "signup"){
        user = await signup(email, password);
    }

    spinner.stop("Authentication successful.");
    p.outro(`Welcome ${user.email}!`);

    return user;
  } catch (error) {
    spinner.stop("Authentication failed.");
    p.log.error(error.message);
    return null;
  }
}

export { authenticatePage };