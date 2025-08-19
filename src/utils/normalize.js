export default function normalizeIceServers(resp) {
  if (!resp) return [{ urls: "stun:stun.l.google.com:19302" }];
  // if resp is array
  if (Array.isArray(resp)) return resp.length ? resp : [{ urls: "stun:stun.l.google.com:19302" }];

  const data = resp.iceServers ? resp : { iceServers: resp };
  const ice = Array.isArray(data.iceServers) ? data.iceServers.slice() : [];
  if (data.username && data.credential && ice.length) {
    const idx = ice.findIndex(s => JSON.stringify(s.urls).includes("turn"));
    const target = idx >= 0 ? idx : 0;
    ice[target] = { ...ice[target], username: data.username, credential: data.credential };
  }
  return ice.length ? ice : [{ urls: "stun:stun.l.google.com:19302" }];
}