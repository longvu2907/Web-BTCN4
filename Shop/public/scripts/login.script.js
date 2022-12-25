import { AuthServerURL } from "./constants.js";

const loginForm = $("#loginForm");

loginForm.on("submit", async function (e) {
  e.preventDefault();

  const data = $(this)
    .serializeArray()
    .reduce((obj, field) => ({ ...obj, [field.name]: field.value }), {});

  data.tokenLife = parseInt(data.tokenLife) * 24 * 60 * 60;

  const res = await fetch(`${AuthServerURL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const resData = await res.json();

  if (res.ok) {
    console.log(resData);
    localStorage.setItem("accessToken", resData.accessToken);
    window.location.href = "/";
    return;
  }

  $(".feedback input").addClass("is-invalid");
  $(".feedback .invalid-feedback").text(resData.msg);
});
