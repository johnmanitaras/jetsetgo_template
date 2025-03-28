export const authChannel = new BroadcastChannel('auth_channel');

export function broadcastAuthState(user: any) {
  console.log('Broadcasting auth state:', user ? 'logged in' : 'logged out');
  
  if (user) {
    user.getIdTokenResult().then((idTokenResult: any) => {
      const claims = idTokenResult.claims;
      const tenant = claims.tenant || null;
      const userId = claims.user_id || null;
      const groups = claims.groups || [];
      const permissions = claims.permissions || [];
      
      authChannel.postMessage({
        type: 'AUTH_STATE_CHANGED',
        user: {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified
        },
        tenant,
        userId,
        groups,
        permissions
      });
    });
  } else {
    authChannel.postMessage({
      type: 'AUTH_STATE_CHANGED',
      user: null,
      tenant: null,
      userId: null,
      groups: [],
      permissions: []
    });
  }
}