import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 2 },
    { duration: '20s', target: 5 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  let url = 'http://localhost:3000/orders';
  let payload = JSON.stringify({ product_id: 1, quantity: 2 });
  let params = { headers: { 'Content-Type': 'application/json' } };

  let res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has order_id': (r) => JSON.parse(r.body).hasOwnProperty('order_id'),
  });

  sleep(1);
}