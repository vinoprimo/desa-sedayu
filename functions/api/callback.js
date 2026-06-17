export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieState = getCookie(request.headers.get('Cookie'), 'decap_oauth_state');

  if (!code || !state || state !== cookieState) {
    return new Response('Invalid OAuth callback state.', { status: 400 });
  }

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response('Missing GitHub OAuth environment variables.', { status: 500 });
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'desa-sedayu-decap-cms',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/callback`,
      state,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    return new Response(tokenData.error_description || 'GitHub OAuth token exchange failed.', {
      status: 401,
    });
  }

  return new Response(renderCallbackPage(tokenData.access_token), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': 'decap_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/api/; Max-Age=0',
    },
  });
}

function getCookie(cookieHeader, name) {
  return cookieHeader
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function renderCallbackPage(token) {
  const payload = JSON.stringify({ token, provider: 'github' });

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Authorizing...</title>
  </head>
  <body>
    <p>Login berhasil. Jendela ini akan tertutup otomatis.</p>
    <script>
      (function() {
        function receiveMessage(event) {
          window.opener.postMessage(
            'authorization:github:success:' + ${JSON.stringify(payload)},
            event.origin
          );
          window.close();
        }

        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
  </body>
</html>`;
}
