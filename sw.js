// 단어랜드 서비스 워커: 인터넷이 없어도 앱 화면이 열리게 함
// 앱 파일은 "인터넷 먼저, 안 되면 저장본" 방식이라 새 버전을 올리면 다음 실행 때 바로 반영됨
const CACHE = "wordtime-v6";
// 사진 인식·PDF 읽기 파일(vendor/)은 크고 바뀌지 않아서 따로 보관: 앱을 업데이트해도 다시 받지 않음
// 한 번 받은 뒤로는 인터넷 없이 사진 인식과 PDF 읽기가 됨. 파일을 바꿀 때는 이 이름의 숫자를 올림
const VENDOR = "wordtime-vendor-v1";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== VENDOR).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;   // 외부 요청은 그대로
  if (url.pathname.includes("/vendor/")) {   // 보관본 먼저, 없으면 받아서 보관
    e.respondWith(caches.open(VENDOR).then(c => c.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) c.put(req, res.clone());
      return res;
    }))));
    return;
  }
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});
