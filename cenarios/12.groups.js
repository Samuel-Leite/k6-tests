import http from "k6/http";
import { sleep, group, check } from "k6";

export const options = {
  thresholds: {
    http_req_duration: ["p(95)<1000"], //verificar limite da duração aceitavel
    'group_duration{group:::Main page}' : ["p(95)<9000"],
    'group_duration{group:::News page}' : ["p(95)<6000"],
    'group_duration{group:::Main page::Assets}' : ["p(95)<4000"],
  },
};

export default function () {
  group("Main page", function () { //separado por grupo de pagina
    let response = http.get("https://run.mocky.io/v3/b05f9bd5-c28b-4fd4-86d3-f6b41214c1b3?mocky-delay=5000ms");

    check(response, {
      "Status is 200": (resp) => resp.status === 200,
    }); //verifica o status

    group('Assets', function(){ //subgrupo pertencente ao Main Page
        http.get("https://run.mocky.io/v3/b05f9bd5-c28b-4fd4-86d3-f6b41214c1b3?mocky-delay=1000ms");
        http.get("https://run.mocky.io/v3/b05f9bd5-c28b-4fd4-86d3-f6b41214c1b3?mocky-delay=1000ms");
    })
  });

  group("News page", function () {
    http.get("https://run.mocky.io/v3/b05f9bd5-c28b-4fd4-86d3-f6b41214c1b3?mocky-delay=5000ms");
  });

  sleep(1);
}
