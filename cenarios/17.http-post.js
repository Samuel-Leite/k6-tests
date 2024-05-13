import http from "k6/http";
import { check } from "k6";

export default function () {
  const credencials = {
    username: "test_" + Date.now(),
    password: "secret" + Date.now(),
  };

  http.post(
    "https://test-api.k6.io/user/register/",
    JSON.stringify(credencials),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let res = http.post(
    "https://test-api.k6.io/auth/token/login/",
    JSON.stringify({
      username: credencials.username,
      password: credencials.password,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const accessToken = res.json().access;
  console.log(accessToken);

  http.get("https://test-api.k6.io/my/crocodiles/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  res = http.post(
    "https://test-api.k6.io/my/crocodiles/",
    JSON.stringify({
      name: "Dundee",
      sex: "M",
      date_of_birth: "1980-11-28",
    }),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const newCrocodileId = res.json().id;

  res = http.get(`https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  check(res, {
    "Status is 200": (r) => r.status === 200,
    'Crocodile id' : (r) => r.json().id === newCrocodileId,
  });

  res = http.put(
    `https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`,
    JSON.stringify({
      name: "Update Crocodile Dundee",
      sex: "F",
      date_of_birth: "1900-11-28",
    }),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  res = http.patch(
    `https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`,
    JSON.stringify({
      sex: "F",
    }),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  res = http.del(
    `https://test-api.k6.io/my/crocodiles/${newCrocodileId}/`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
