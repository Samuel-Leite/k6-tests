import http from "k6/http";

export const options = {
    thresholds: {
      http_req_duration: ["p(95)<1000"], //verificar limite da duração aceitavel
      'http_req_duration{status:200}' : ["p(95)<1000"],
      'http_req_duration{status:201}' : ["p(95)<1000"],
    },
  };

  export default function () {
    http.get('https://run.mocky.io/v3/bcd60544-8a57-4880-8cc6-34d9dda34a06')
    http.get('https://run.mocky.io/v3/41ad9333-92c2-4b53-9806-a64fa85d856a?mocky-delay=2000ms')
  }