export async function onRequestPost({ request, env }) {
  const code = request.headers.get('Authorization');
  const url = 'https://account.lazy.ink/v1/oauth2/token'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "client_id": env.client_id,
      "client_secret": env.client_secret,
      "grant_type": "authorization_code",
      "code": code,
      "redirect_uri": env.redirect_uri
    }),
  })
  const data = await response.json();
  const json = JSON.stringify(data);

  return new Response(json, {
    status: data?.code ? data?.code : data?.access_token ? 200 : 500,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

