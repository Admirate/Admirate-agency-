export const renderClientGrid = (logos, getUrl) =>
  logos
    .map(
      (brand) =>
        `<li class="client-cell${brand.inv ? " is-inverted" : ""}"><img src="${getUrl(brand.file)}" alt="${brand.name}"${brand.inv ? ' class="inv"' : ""}${brand.scale ? ` style="--s:${brand.scale}"` : ""} loading="lazy" decoding="async"></li>`,
    )
    .join("");
