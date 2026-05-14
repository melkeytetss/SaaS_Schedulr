(function() {
  const scriptTag = document.currentScript;
  if (!scriptTag) return;
  
  const host = scriptTag.getAttribute("data-host");
  const slug = scriptTag.getAttribute("data-slug");
  if (!host) return;

  const url = new URL(scriptTag.src);
  const baseUrl = url.origin;

  const iframe = document.createElement("iframe");
  iframe.src = `${baseUrl}/${host}${slug ? '/' + slug : ''}`;
  iframe.style.width = "100%";
  iframe.style.height = "600px";
  iframe.style.border = "1px solid rgba(0,0,0,0.1)";
  iframe.style.borderRadius = "8px";

  scriptTag.parentNode.insertBefore(iframe, scriptTag.nextSibling);
})();
