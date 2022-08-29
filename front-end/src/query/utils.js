export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const apiRequest = async ({
  path,
  method = "GET",
  body,
  headers,
  token = null,
}) => {
  const requestOptions = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(body),
  };

  return fetch(API_URL + path, requestOptions).then((response) =>
    response ? response.json() : {}
  );
};
