import http from "k6/http";
import { Counter } from "k6/metrics";
import { check, sleep } from "k6";

export const options = {
  thresholds: {
    http_req_duration: ["p(95)<300"], //verificar limite da duração aceitavel
    "http_req_duration{page:order}": ["p(95)<250"],
    http_errors: ["count==0"],
    'http_errors{page:order}' : ["count==0"],
    checks: ['rate>=0.99'],
    'checks{page:order}' : ['rate>=0.99'],
  },
};

let httpErrors = new Counter("http_errors"); //custom metrics

export default function () {
  let response = http.get(
    "https://run.mocky.io/v3/bcd60544-8a57-4880-8cc6-34d9dda34a06"
  );

  if (response.error) {
    httpErrors.add(1);
  }

  check(response, {
    "status is 200": (r) => r.status === 200,
  });

  //submit order
  response = http.get(
    "https://run.mocky.io/v3/b05f9bd5-c28b-4fd4-86d3-f6b41214c1b3?mocky-delay=2000ms",
    {
      tags: {
        page: "order",
      },
    }
  );
  if (response.error) {
    httpErrors.add(1, { page: "order" });
  }

  check(response,{
      "status is 201": (r) => r.status === 201,
    },
    { page: "order" }
  );
  sleep(1);
}
