import { AuthServerURL } from "./constants.js";

const loginForm = $("#registerForm");

loginForm.on("submit", async function (e) {
  e.preventDefault();

  const data = $(this)
    .serializeArray()
    .reduce((obj, field) => ({ ...obj, [field.name]: field.value }), {});

  const res = await fetch(`${AuthServerURL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const resData = await res.json();

  if (res.ok) {
    console.log(resData);
    window.location.href = "/login";
    return;
  }

  $(".feedback input").addClass("is-invalid");
  $(".feedback .invalid-feedback").text(resData.msg);
});
