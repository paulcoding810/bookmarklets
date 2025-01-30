var stop = false;

function serialize(formData) {
  const params = [];

  formData.forEach((value, key) => {
    params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
  });

  return params.join("&");
}

async function getFormData(id, type) {
  return await fetch(`https://www.fshare.vn/${type}/` + id, {
    credentials: "include",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-GB,en;q=0.5",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      Priority: "u=0, i",
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    },
    method: "GET",
    mode: "cors",
  })
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const form = doc.getElementById("form-download");
      return new FormData(form);
    });
}

async function getDownloadUrl(linkcode, formData) {
  formData.set("linkcode", linkcode);
  let body = serialize(formData);

  let downloadData = await fetch("https://www.fshare.vn/download/get", {
    credentials: "include",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0",
      Accept: "*/*",
      "Accept-Language": "en-GB,en;q=0.5",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      Priority: "u=0",
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    },
    referrer: "https://www.fshare.vn",
    body: body,
    method: "POST",
    mode: "cors",
  }).then((res) => res.json());
  if (downloadData.url) {
    return downloadData.url;
  }
  console.log(linkcode, downloadData);
  return null;
}

async function getFiles(folderId) {
  let files = await fetch(
    `https://www.fshare.vn/api/v3/files/folder?linkcode=${folderId}&sort=type,-modified`,
    {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "vi-VN,vi",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        Priority: "u=0",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
      },
      referrer: `https://www.fshare.vn/folder/${folderId}`,
      method: "GET",
      mode: "cors",
    }
  ).then((res) => res.json());

  return files?.items ?? [];
}

function delay(ms = 3000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getFolderId() {
  const id = location.pathname.match(/folder\/(.+)/)?.[1];
  return id;
}

function getFileId() {
  const id = location.pathname.match(/file\/(.+)/)?.[1];
  return id;
}

async function downloadFolder(folderId) {
  console.log("Download Folder", folderId);

  let files = await getFiles(folderId);

  if (files.length === 0) {
    console.log("0 files. Exiting");
    return;
  }

  const formData = await getFormData(folderId, "folder");

  let result = [];

  console.log(files);
  console.log(formData);

  for (let index = 0; index < files.length; index++) {
    const { linkcode, name, type } = files[index] ?? {};
    if (type === 0) {
      console.log("Skip folder " + name);
      continue;
    }
    if (!linkcode || !name) {
      console.log("file not found, exiting", files[index]);
      rerturn;
    }
    if (stop) return;
    console.log(`Fetching ${name}`);
    let url = await getDownloadUrl(fileId, formData);
    if (url) {
      result.push(url);
      console.log(`Download url = ${url}`);
      console.log();
      await delay(1500);
    } else {
      console.log("reach error, exiting...");
      return 1;
    }
  }
  return result;
}

async function downloadFile(fileId) {
  console.log("Download File", fileId);
  const formData = await getFormData(fileId, "file");
  console.log(formData);

  let result = [];

  let url = await getDownloadUrl(fileId, formData);
  if (url) {
    result.push(url);
    console.log(`Download url = ${url}`);
    console.log();
  } else {
    console.log("reach error, exiting...");
    return 1;
  }
  return result;
}

async function main() {
  const folderId = getFolderId();
  const fileId = getFileId();
  let result = [];
  if (folderId) {
    result = await downloadFolder();
  } else if (fileId) {
    result = await downloadFile(fileId);
  } else {
    console.log("file/folder not found, exiting");
    return 1;
  }
  alert(result.join("\n"));
  return result;
}

await main();
