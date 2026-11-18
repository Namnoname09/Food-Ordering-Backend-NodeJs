const form = document.querySelector(".login-form");
const message = form.querySelector('[role="status"]');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  submitButton.disabled = true;

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message || "Yêu cầu thất bại.";
      return;
    }

    if (new URL(form.action).pathname === "/auth/register") {
      window.location.assign("/login.html");
      return;
    }

    const role = data.user?.role;
    if (role !== "admin" && role !== "user") {
      message.textContent = "Quyền tài khoản không hợp lệ.";
      return;
    }

    window.location.assign(role === "admin" ? "/successLogin.html" : "/successUser.html");
  } catch {
    message.textContent = "Không thể hoàn tất yêu cầu.";
  } finally {
    submitButton.disabled = false;
  }
});
