import http from "k6/http";
import { check, sleep } from "k6";
import exec from 'k6/execution'


export const options = {
  vus: 10,
  duration: "10s",
  thresholds: {
    http_req_duration: ["p(95)>100"], //verificar limite da duração aceitavel
    http_req_failed: ['rate<0.01'], //limite de falhas que deve ocorrer entre 0,01 e 1,00 (em percentual)
    http_reqs: ['count>20'],
    http_reqs: ['rate>3'],
    vus: ['value>9'],
    checks: ['rate>=0.98']
  },
};

export default function () {
  const response = http.get("https://test.k6.io/" + (exec.scenario.iterationInTest === 1 ? 'foo' : ''));
  console.log()

  check(response, {
    "Status is 200": (resp) => resp.status === 200, //verifica o status
    "Page is starpage": (resp) =>
      resp.body.includes("Collection of simple web-pages"), //verifica a existencia do texto na pagina
  });
  sleep(2);
}
