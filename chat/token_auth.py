from channels.auth import AuthMiddlewareStack
from django.contrib.auth.models import AnonymousUser
from knox.models import AuthToken
from channels.db import database_sync_to_async
from knox.auth import TokenAuthentication
from rest_framework import HTTP_HEADER_ENCODING

@database_sync_to_async
def get_user(token):
    knox_auth = TokenAuthentication()
    user, auth_token = knox_auth.authenticate_credentials(token.encode(HTTP_HEADER_ENCODING))
    return user

class TokenAuthMiddleware:

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return TokenAuthMiddlewareInstance(scope, self)

class TokenAuthMiddlewareInstance:

    def __init__(self, scope, middleware):
        self.middleware = middleware
        self.scope = dict(scope)
        self.inner = self.middleware.inner

    async def __call__(self, receive, send):
        query = dict((x.split('=') for x in self.scope['query_string'].decode().split("&")))
        token = query['token']
        self.scope['user'] = await get_user(token)
        return await self.inner(self.scope, receive, send)

TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))

""" knoxAuth = TokenAuthentication();
user, auth_token = knoxAuth.authenticate_credentials(tokenString.encode(HTTP_HEADER_ENCODING))
scope['user'] = user """


""" class TokenAuthMiddlewareInstance:

    def __init__(self, scope, middleware):
        self.middleware = middleware
        self.scope = dict(scope)
        self.inner = self.middleware.inner

    async def __call__(self, receive, send):
        query = dict((x.split('=') for x in self.scope['query_string'].decode().split("&")))
        token = query['token']
        self.scope['user'] = await get_user(token)
        return await self.inner(self.scope, receive, send)

TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner)) """



""" def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        query = dict((x.split('=') for x in scope['query_string'].decode().split("&")))
        token = query['token']
        knox_auth = TokenAuthentication()
        user, auth_token = knox_auth.authenticate_credentials(token.encode(HTTP_HEADER_ENCODING))
        scope['user'] = user
        return self.inner(scope) """


""" try:
        auth_token = AuthToken.objects.get(digest=token)
        return auth_token.user
    except AuthToken.DoesNotExist:
        return AnonymousUser() """