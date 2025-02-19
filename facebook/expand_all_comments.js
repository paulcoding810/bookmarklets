let count = 0;
async function run() {
  let viewList = [
    ...document.getElementsByClassName(
      "x193iq5w xeuugli x13faqbe x1vvkbs xlh3980 xvmahel x1n0sxbx x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen x1s688f xi81zsa"
    ),
  ].filter((item) => item.textContent.startsWith("View "));

  let seeList = [
    ...document.getElementsByClassName(
      "x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1sur9pj xkrqix3 xzsf02u x1s688f"
    ),
  ].filter((item) => item.textContent.startsWith("See more"));

  if (viewList.length === 0 && viewList.length === 0) {
    console.log(`Expanded ${count} item`);
    return;
  }

  viewList.forEach(async (item) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        count++;
        item.click();
        resolve();
      }, 3000);
    });
  });

  seeList.forEach(async (item) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        count++;
        item.click();
        resolve();
      }, 3000);
    });
  });

  //recursive
  setTimeout(async () => {
    await run();
  }, 3000);
}

await run();
