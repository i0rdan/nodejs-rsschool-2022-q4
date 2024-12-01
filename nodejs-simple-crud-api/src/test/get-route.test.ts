import supertest from "supertest";

import { server } from "../index";
import { store } from "../store/store";
import {
  BASIC_ENDPOINT, ERRORS_MAP, HTTP_STATUS_CODES_MAP
} from "../utils/constants/constants";

afterEach(() => {
  server.close();
});

describe('Get Endpoint', () => {
  it('should get all users', async () => {
    const res = await supertest(server)
      .get(BASIC_ENDPOINT)
      .send();
    const users = JSON.parse(res.text);

    expect(res.statusCode).toEqual(HTTP_STATUS_CODES_MAP.OK);
    expect(users).toEqual(store.getAllUsers());
  });

  it('should get user by id', async () => {
    const [testUser] = store.getAllUsers();
    const res = await supertest(server)
      .get(`${BASIC_ENDPOINT}/${testUser.id}`)
      .send();
    const user = JSON.parse(res.text);

    expect(res.statusCode).toEqual(HTTP_STATUS_CODES_MAP.OK);
    expect(user).toEqual(testUser);
  });

  it('should have correct response when user id is wrong', async () => {
    const wrongUserId = 'dsfsdfds21321';
    const res = await supertest(server)
      .get(`${BASIC_ENDPOINT}/${wrongUserId}`)
      .send();
    const message = res.text;

    expect(res.statusCode).toEqual(HTTP_STATUS_CODES_MAP.BAD_REQUEST);
    expect(message).toEqual(ERRORS_MAP.NOT_UUID);
  });
});
