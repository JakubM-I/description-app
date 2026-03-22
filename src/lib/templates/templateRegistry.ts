import type {
  BrandContentDocument,
  BrandId,
  LioneloDescriptionData,
  LioneloSectionItem,
  OvermaxDescriptionData,
  OvermaxDetailItem,
  PeluvioDescriptionData,
  PeluvioFeatureItem,
  PreviewBlock,
  ProductListItem,
} from '../../features/generator/types'

type TemplateRegistryBuildParams = {
  product: ProductListItem
  content: BrandContentDocument
}

type TemplateRegistryEntry = {
  generatorId: string
  brandLabel: string
  buildHtml: (params: TemplateRegistryBuildParams) => string
  buildPreview: (params: TemplateRegistryBuildParams) => PreviewBlock[]
}

type LioneloSectionConfig = {
  id: 'features' | 'details' | 'sets'
  title: string
  buttonId: string
  gridId: string
  sliderClass: string
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const joinFragments = (fragments: Array<string | null | undefined>) =>
  fragments.filter(Boolean).join('\n')

const createPreviewHeaderBlock = (title: string): PreviewBlock => ({
  title,
})

const createPreviewItemBlock = (
  title: string | null,
  text: string | null,
): PreviewBlock | null => {
  if (!title && !text) {
    return null
  }

  return {
    title: title ?? undefined,
    text: text ?? undefined,
  }
}

const renderContentImage = (params: {
  imageUrl: string | null
  imageAlt: string | null
  className?: string
  width?: string
  height?: string
  loading?: string
  indent?: string
}) => {
  if (!params.imageUrl || !params.imageAlt) {
    return ''
  }

  const indent = params.indent ?? '      '
  const attributes = [
    `src="${escapeHtml(params.imageUrl)}"`,
    `alt="${escapeHtml(params.imageAlt)}"`,
    params.className ? `class="${params.className}"` : '',
    params.width ? `width="${params.width}"` : '',
    params.height ? `height="${params.height}"` : '',
    params.loading ? `loading="${params.loading}"` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return `${indent}<img ${attributes} />`
}

const renderTextTag = (params: {
  tag: string
  className: string
  text: string | null
  indent?: string
}) =>
  params.text
    ? `${params.indent ?? '      '}<${params.tag} class="${params.className}">${escapeHtml(
        params.text,
      )}</${params.tag}>`
    : ''

const renderLioneloSlide = (
  item: LioneloSectionItem,
  variant: LioneloSectionConfig['id'],
) => {
  const itemBody = joinFragments([
    renderTextTag({
      tag: 'h2',
      className: 'lo-prodDesc__gridItemTitle',
      text: item.title,
    }),
    renderTextTag({
      tag: 'p',
      className: 'lo-prodDesc__gridItemDesc',
      text: item.desc,
    }),
  ])

  const image =
    variant === 'features'
      ? renderContentImage({
          imageUrl: item.imageUrl,
          imageAlt: item.imageAlt,
          className: 'lo-prodDesc__videoPlaceHolder',
          width: '490',
          height: '392',
        })
      : variant === 'details'
        ? renderContentImage({
            imageUrl: item.imageUrl,
            imageAlt: item.imageAlt,
            className: 'lo-prodDesc__detailIcon',
            width: '52',
            height: '41',
            indent: '          ',
          })
        : renderContentImage({
            imageUrl: item.imageUrl,
            imageAlt: item.imageAlt,
            className: 'lo-prodDesc__setImage',
            width: '259',
            height: '186',
            loading: 'lazy',
          })

  const contentPrefix =
    variant === 'details' && image
      ? [
          '        <div class="lo-prodDesc__iconWrapper">',
          image,
          '        </div>',
        ].join('\n')
      : image
        ? image
        : ''

  return joinFragments([
    '        <div class="swiper-slide">',
    '          <div class="lo-prodDesc__detailItem">',
    contentPrefix,
    itemBody
      ? ['            <div class="lo-prodDesc__gridItemBody">', itemBody, '            </div>'].join(
          '\n',
        )
      : '',
    '          </div>',
    '        </div>',
  ])
}

const renderLioneloSectionNav = (variant: LioneloSectionConfig['id']) => {
  if (variant === 'features') {
    return joinFragments([
      '      <div class="lo-prodDesc-navDesktop lo-prodDesc-navDesktop--prev js-prodDescSliderNav">',
      '        <button class="lo-prodDesc-nav__navBtn lo-prodDesc-nav__navBtn--prev" aria-label="Poprzedni slajd"></button>',
      '      </div>',
      '      <div class="lo-prodDesc-navDesktop lo-prodDesc-navDesktop--next js-prodDescSliderNav">',
      '        <button class="lo-prodDesc-nav__navBtn lo-prodDesc-nav__navBtn--next" aria-label="Następny slajd"></button>',
      '      </div>',
      '      <div class="lo-prodDesc-nav">',
      '        <div class="lo-prodDesc-nav__btnWrapper">',
      '          <button class="lo-prodDesc-nav__navBtn lo-prodDesc-nav__navBtn--prev" aria-label="Poprzedni slajd">',
      '            <img src="/img/cms/new-prod-description/icons/nav-arrow-prev.png" alt="" />',
      '          </button>',
      '        </div>',
      '        <div class="lo-prodDesc-nav__pagginationWrapper">',
      '          <div class="swiper-pagination"></div>',
      '        </div>',
      '        <div class="lo-prodDesc-nav__btnWrapper">',
      '          <button class="lo-prodDesc-nav__navBtn lo-prodDesc-nav__navBtn--next" aria-label="Następny slajd">',
      '            <img src="/img/cms/new-prod-description/icons/nav-arrow-next.png" alt="" />',
      '          </button>',
      '        </div>',
      '      </div>',
    ])
  }

  const variantClass =
    variant === 'details'
      ? 'lo-prodDesc-nav__navBtnDet'
      : 'lo-prodDesc-nav__navBtnSet'

  return joinFragments([
    '      <div class="lo-prodDesc-nav">',
    '        <div class="lo-prodDesc-nav__btnWrapper">',
    `          <button class="lo-prodDesc-nav__navBtn ${variantClass}--prev" aria-label="Poprzedni slajd">`,
    '            <img src="/img/cms/new-prod-description/icons/nav-arrow-prev.png" alt="" />',
    '          </button>',
    '        </div>',
    '        <div class="lo-prodDesc-nav__pagginationWrapper">',
    '          <div class="swiper-pagination"></div>',
    '        </div>',
    '        <div class="lo-prodDesc-nav__btnWrapper">',
    `          <button class="lo-prodDesc-nav__navBtn ${variantClass}--next" aria-label="Następny slajd">`,
    '            <img src="/img/cms/new-prod-description/icons/nav-arrow-next.png" alt="" />',
    '          </button>',
    '        </div>',
    '      </div>',
  ])
}

const renderLioneloSection = (
  config: LioneloSectionConfig,
  items: LioneloSectionItem[],
  isExpanded: boolean,
) => {
  if (items.length === 0) {
    return ''
  }

  const expandedClass = isExpanded ? ' expanded' : ''

  return joinFragments([
    '  <div class="lo-prodDesc__sectionHeader lo-prodDesc__container">',
    `    <button class="lo-prodDesc__sectionBtn js-prodDescBtn${expandedClass}" id="${config.buttonId}" aria-expanded="${
      isExpanded ? 'true' : 'false'
    }" aria-controls="${config.gridId}">`,
    `      <span class="lo-prodDesc__sectionTitle">${config.title}</span>`,
    '      <span class="lo-prodDesc__sectionBtnIcon"></span>',
    '    </button>',
    '  </div>',
    `  <div class="lo-prodDesc__container js-prodDescGrid${expandedClass}" id="${config.gridId}" aria-hidden="${
      isExpanded ? 'false' : 'true'
    }" role="region" aria-labelledby="${config.buttonId}">`,
    `    <div class="lo-prodDesc__grid swiper ${config.sliderClass}">`,
    '      <div class="swiper-wrapper">',
    ...items.map((item) => renderLioneloSlide(item, config.id)),
    '      </div>',
    renderLioneloSectionNav(config.id),
    '    </div>',
    '  </div>',
  ])
}

const buildLioneloHtml = (content: LioneloDescriptionData) => {
  const sections = [
    {
      config: {
        id: 'features',
        title: 'Cechy szczególne',
        buttonId: 'product-featuresBtn',
        gridId: 'product-featuresGrid',
        sliderClass: 'swiper-featured',
      } as LioneloSectionConfig,
      items: content.features,
    },
    {
      config: {
        id: 'details',
        title: 'Szczegóły produktu',
        buttonId: 'product-detailBtn',
        gridId: 'product-detailsGrid',
        sliderClass: 'swiper-details',
      } as LioneloSectionConfig,
      items: content.details,
    },
    {
      config: {
        id: 'sets',
        title: 'Dodatkowo w zestawie',
        buttonId: 'product-setsBtn',
        gridId: 'product-setsGrid',
        sliderClass: 'swiper-sets',
      } as LioneloSectionConfig,
      items: content.sets,
    },
  ].filter((section) => section.items.length > 0)

  const intro = content.intro
    ? joinFragments([
        '  <header class="lo-prodDesc__intro lo-prodDesc__container">',
        renderTextTag({
          tag: 'p',
          className: 'lo-prodDesc__introTxt',
          text: content.intro.text1,
          indent: '    ',
        }),
        renderTextTag({
          tag: 'p',
          className: 'lo-prodDesc__slogan',
          text: content.intro.slogan,
          indent: '    ',
        }),
        renderTextTag({
          tag: 'p',
          className: 'lo-prodDesc__introTxt',
          text: content.intro.text2,
          indent: '    ',
        }),
        '  </header>',
      ])
    : ''

  return joinFragments([
    '<section id="lo-prodDesc" class="js-productDescription">',
    intro,
    ...sections.map((section, index) =>
      renderLioneloSection(section.config, section.items, index === 0),
    ),
    '</section>',
  ])
}

const buildLioneloPreview = (content: LioneloDescriptionData): PreviewBlock[] => {
  const blocks: PreviewBlock[] = []

  if (content.intro) {
    const introText = [content.intro.text1, content.intro.slogan, content.intro.text2]
      .filter(Boolean)
      .join('\n')

    if (introText) {
      blocks.push({
        title: 'Intro',
        text: introText,
      })
    }
  }

  const sections = [
    { title: 'Cechy szczególne', items: content.features },
    { title: 'Szczegóły produktu', items: content.details },
    { title: 'Dodatkowo w zestawie', items: content.sets },
  ]

  for (const section of sections) {
    if (section.items.length === 0) {
      continue
    }

    blocks.push(createPreviewHeaderBlock(section.title))

    for (const item of section.items) {
      const block = createPreviewItemBlock(item.title, item.desc)

      if (block) {
        blocks.push(block)
      }
    }
  }

  return blocks
}

const renderPeluvioFeatureSlide = (item: PeluvioFeatureItem) =>
  joinFragments([
    '        <div class="swiper-slide feature-slider__slide">',
    renderTextTag({
      tag: 'h3',
      className: 'feature-slider__slide-title',
      text: item.title,
      indent: '          ',
    }),
    renderTextTag({
      tag: 'p',
      className: 'feature-slider__slide-txt',
      text: item.text,
      indent: '          ',
    }),
    '        </div>',
  ])

const buildPeluvioHtml = (content: PeluvioDescriptionData) => {
  const hero = content.hero
    ? joinFragments([
        '<div class="info accordion-item" id="description">',
        '  <h2 class="info__title accordion-header" id="product-description-heading">',
        '    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#product-description-collapse" aria-expanded="true" aria-controls="product-description-collapse">',
        '      Opis Produktu',
        '    </button>',
        '  </h2>',
        '  <div id="product-description-collapse" class="info__content accordion-collapse collapse show" data-bs-parent="#product-infos-accordion" aria-labelledby="product-description-heading">',
        '    <div class="product__description accordion-body rich-text">',
        '      <section id="lo-prodDesc" class="js-productDescription">',
        '        <div class="row">',
        '          <div class="col-md-6">',
        renderTextTag({
          tag: 'h2',
          className: 'lo-prodDesc__heading',
          text: content.hero.title,
          indent: '            ',
        }),
        renderTextTag({
          tag: 'p',
          className: 'lo-prodDesc__introTxt',
          text: content.hero.text,
          indent: '            ',
        }),
        '          </div>',
        '          <div class="col-md-6 image-column">',
        renderContentImage({
          imageUrl: content.hero.imageUrl,
          imageAlt: content.hero.imageAlt,
          indent: '            ',
        }),
        '          </div>',
        '        </div>',
        '      </section>',
        '    </div>',
        '  </div>',
        '</div>',
      ])
    : ''

  const features =
    content.features.length > 0
      ? joinFragments([
          '<div class="info accordion-item" id="feature-slider">',
          '  <div class="info__content">',
          '    <div class="swiper feature-slider" style="overflow: hidden !important;">',
          '      <div class="pe-slider-header" style="display: flex;">',
          '        <div style="flex-grow: 1;">',
          '          <h2 class="info__title accordion-header" id="product-feature-slider-heading">',
          '            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#product-feature-slider-collapse" aria-expanded="true" aria-controls="product-feature-slider-collapse">',
          '              Zalety produktu',
          '            </button>',
          '          </h2>',
          '        </div>',
          '        <div class="swiper-nav-container pe-swiper-nav-dekstop" style="position: relative; right: unset; top: unset;">',
          '          <button class="pe-prodFeatures__navBtn pe-prodFeatures__navBtn--prev" aria-label="Poprzedni slajd">',
          '            <img src="/img/cms/peluvio/arrow-prev.png" alt="" />',
          '          </button>',
          '          <button class="pe-prodFeatures__navBtn pe-prodFeatures__navBtn--next" aria-label="Następny slajd">',
          '            <img src="/img/cms/peluvio/arrow-next.png" alt="" />',
          '          </button>',
          '        </div>',
          '      </div>',
          '      <div class="swiper-wrapper accordion-collapse collapse show" id="product-feature-slider-collapse" aria-labelledby="product-feature-slider-heading">',
          ...content.features.map(renderPeluvioFeatureSlide),
          '      </div>',
          '      <div class="swiper-nav-container pe-swiper-nav-mobile">',
          '        <button class="pe-prodFeatures__navBtn pe-prodFeatures__navBtn--prev" aria-label="Poprzedni slajd">',
          '          <img src="/img/cms/peluvio/arrow-prev.png" alt="" />',
          '        </button>',
          '        <button class="pe-prodFeatures__navBtn pe-prodFeatures__navBtn--next" aria-label="Następny slajd">',
          '          <img src="/img/cms/peluvio/arrow-next.png" alt="" />',
          '        </button>',
          '      </div>',
          '      <div class="swiper-pagination peluvio-swiper-nav"></div>',
          '    </div>',
          '  </div>',
          '</div>',
        ])
      : ''

  return joinFragments([hero, features])
}

const buildPeluvioPreview = (content: PeluvioDescriptionData): PreviewBlock[] => {
  const blocks: PreviewBlock[] = []

  if (content.hero) {
    blocks.push({
      title: 'Opis produktu',
      text: [content.hero.title, content.hero.text].filter(Boolean).join('\n'),
    })
  }

  if (content.features.length > 0) {
    blocks.push(createPreviewHeaderBlock('Zalety produktu'))

    for (const feature of content.features) {
      const block = createPreviewItemBlock(feature.title, feature.text)

      if (block) {
        blocks.push(block)
      }
    }
  }

  return blocks
}

const renderOvermaxTitle = (item: OvermaxDetailItem) =>
  item.title
    ? `              <h3 class="ov-product-details__title" id="${item.titleId}">${escapeHtml(
        item.title,
      )}</h3>`
    : ''

const renderOvermaxPopup = (item: OvermaxDetailItem) =>
  joinFragments([
    `        <div class="ov-cms-popup js-ovCmsPopUp" id="popup-${item.popupKey}" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="${item.popupHeadingId}">`,
    '          <div class="ov-cms-popup__btnWrapper">',
    '            <button class="ov-cms-popup__closeBtn js-ovPopUpCloseBtn" aria-label="Zamknij okno">',
    '              <span>x</span>',
    '            </button>',
    '          </div>',
    `          <div class="ov-cms-popup__body js-ovPopupBody" data-popup="${item.popupKey}">`,
    item.title
      ? `            <div class="ov-cms-popup__title ov-section-heading" id="${item.popupHeadingId}">${escapeHtml(
          item.title,
        )}</div>`
      : '',
    renderTextTag({
      tag: 'p',
      className: 'ov-cms-popup__contentText',
      text: item.text,
      indent: '            ',
    }),
    item.imageUrl && item.imageAlt
      ? joinFragments([
          '            <div class="ov-cms-popup__imgWrapper">',
          `              <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.imageAlt)}" />`,
          '            </div>',
        ])
      : '',
    '          </div>',
    '        </div>',
  ])

const buildOvermaxHtml = (content: OvermaxDescriptionData) => {
  if (content.details.length === 0) {
    return ''
  }

  return joinFragments([
    '<section class="ov-product-details ov-section" id="ov-product-details">',
    '  <div class="ov-product-details__body container-padding">',
    '    <div class="ov-section-title">Szczegóły</div>',
    '    <h2 class="ov-section-heading"><span class="ov-text-featured">Towarzysz</span> każdej przygody i okoliczności</h2>',
    '    <div class="ov-product-details__details">',
    '      <div class="swiper swiper-details">',
    '        <div class="swiper-wrapper">',
    ...content.details.map((item) =>
      joinFragments([
        '          <div class="swiper-slide">',
        '            <div class="ov-product-details__item">',
        renderContentImage({
          imageUrl: item.imageUrl,
          imageAlt: item.imageAlt,
          width: '420',
          height: '550',
          indent: '              ',
        }),
        renderOvermaxTitle(item),
        '              <div class="ov-product-details__moreBtn">',
        '                <img src="/img/cms/OH-Home/arrow.svg" alt="" />',
        '              </div>',
        `              <button class="ov-product-details__btn js-openPopupBtn" data-popupid="${item.popupKey}" aria-haspopup="dialog" aria-expanded="false" aria-controls="popup-${item.popupKey}"${
          item.title
            ? ` aria-label="Dowiedź się więcej o: ${escapeHtml(item.title)}"`
            : ''
        }>`,
        '                <span class="sr-only">Więcej informacji</span>',
        '              </button>',
        '            </div>',
        '          </div>',
      ]),
    ),
    '        </div>',
    '        <div class="ov-product-details__nav">',
    '          <button class="ov-product-details__navBtn ov-product-details__navBtn--prev">',
    '            <img src="/img/cms/OH-Home/arrow–left.svg" alt="" />',
    '          </button>',
    '          <button class="ov-product-details__navBtn ov-product-details__navBtn--next">',
    '            <img src="/img/cms/OH-Home/arrow–right.svg" alt="" />',
    '          </button>',
    '          <div class="ov-product-details__paggination"></div>',
    '        </div>',
    '      </div>',
    '      <div class="ov-cms-popup__wrapper js-ovCmsPopUpWrapper">',
    ...content.details.map(renderOvermaxPopup),
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>',
  ])
}

const buildOvermaxPreview = (content: OvermaxDescriptionData): PreviewBlock[] => {
  if (content.details.length === 0) {
    return []
  }

  const blocks: PreviewBlock[] = [createPreviewHeaderBlock('Szczegóły')]

  for (const item of content.details) {
    const block = createPreviewItemBlock(item.title, item.text)

    if (block) {
      blocks.push(block)
    }
  }

  return blocks
}

const buildHtmlByBrand = (brand: BrandId, content: BrandContentDocument) => {
  switch (brand) {
    case 'lionelo':
      return buildLioneloHtml(content as LioneloDescriptionData)
    case 'peluvio':
      return buildPeluvioHtml(content as PeluvioDescriptionData)
    case 'overmax':
      return buildOvermaxHtml(content as OvermaxDescriptionData)
  }
}

const buildPreviewByBrand = (brand: BrandId, content: BrandContentDocument) => {
  switch (brand) {
    case 'lionelo':
      return buildLioneloPreview(content as LioneloDescriptionData)
    case 'peluvio':
      return buildPeluvioPreview(content as PeluvioDescriptionData)
    case 'overmax':
      return buildOvermaxPreview(content as OvermaxDescriptionData)
  }
}

const createRegistryEntry = (
  brandId: BrandId,
  brandLabel: string,
): TemplateRegistryEntry => ({
  generatorId: `${brandId}-html-generator`,
  brandLabel,
  buildHtml: ({ content }) => buildHtmlByBrand(brandId, content),
  buildPreview: ({ content }) => buildPreviewByBrand(brandId, content),
})

export const templateRegistry: Record<BrandId, TemplateRegistryEntry> = {
  lionelo: createRegistryEntry('lionelo', 'Lionelo'),
  overmax: createRegistryEntry('overmax', 'Overmax'),
  peluvio: createRegistryEntry('peluvio', 'Peluvio'),
}
