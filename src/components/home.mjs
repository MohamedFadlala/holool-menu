const copy = {
  ar: {
    name:'حلول التقنية', descriptor:'مواقع تعبّر عنك', skip:'انتقل إلى المحتوى', uses:'لمن نبني؟', approach:'كيف نعمل؟', language:'English', alternate:'/en/',
    title:'موقع يعرّف بك، مهما كان مجالك.',
    intro:'شركتك، أعمالك، أو خدماتك. نجمع ما تريد عرضه في موقع واضح وسهل التصفّح، يحمل هويتك ويصل إلى جمهورك برابط واحد.',
    primary:'اكتشف حلول التقنية', secondary:'استكشف أنواع المواقع', visual:'هويتك أولاً. موقعك امتداد لها.',
    strip:['مواقع تعريفية','صفحات هبوط','معارض أعمال','كتالوجات خدمات'],
    usesTitle:'لكل فكرة، مساحة على الويب.', usesIntro:'ابدأ بما تريد أن يعرفه زائر موقعك. نرتّب المحتوى والتصميم حوله.',
    examples:[['للشركات والمؤسسات','عرّف بنشاطك وفريقك، واجمع خدماتك ومعلومات التواصل في مكان واحد.'],['للمهنيين والمبدعين','اعرض خبراتك ومشاريعك وأعمالك بأسلوب يعبّر عنك.'],['للخدمات والمنتجات','نظّم خدماتك أو منتجاتك في كتالوج واضح يمكن مشاركته بسهولة.'],['للمشاريع والفعاليات','قدّم فكرة، أطلق صفحة لحملة، أو شارك تفاصيل فعالية عبر صفحة مخصّصة.']],
    processTitle:'من محتواك إلى موقعك.', steps:[['نبدأ بفكرتك','شاركنا هدف الموقع والنصوص والصور والهوية المتوفرة.'],['نرتّب ونصمّم','نختار طريقة عرض تناسب المحتوى وتراعي التصفّح على الهاتف.'],['نراجع وننشر','نراجع الصفحات والروابط معك، ثم نجهّز الموقع للنشر والمشاركة.']],
    note:'المواقع الثابتة مناسبة لعرض المعلومات والمحتوى. إذا كانت فكرتك تحتاج حسابات أو حجوزات أو دفعاً إلكترونياً، نحدّد متطلباتها أولاً.',
    finalTitle:'ما الذي تريد أن تعرضه للعالم؟', finalText:'ابدأ بهدف واضح ومحتوى يعكس مشروعك. نتولّى تحويله إلى صفحات يسهل الوصول إليها.', finalLink:'تعرّف على حلول التقنية', footer:'حلول التقنية', footerNote:'مواقع للشركات والأفراد والمشاريع.'
  },
  en: {
    name:'Holool', descriptor:'Websites that reflect you', skip:'Skip to content', uses:'Who it’s for', approach:'Our approach', language:'العربية', alternate:'/',
    title:'A place on the web for what you do.',
    intro:'Your company, your work, or your services. Bring what you want to share into a clear, easy-to-browse website that carries your identity and reaches your audience through one link.',
    primary:'Discover Holool', secondary:'Explore website types', visual:'Your identity comes first. Your website follows.',
    strip:['Company websites','Landing pages','Portfolios','Service catalogs'],
    usesTitle:'Every idea deserves a place on the web.', usesIntro:'Start with what your visitors need to know. We shape the content and design around it.',
    examples:[['Companies & organizations','Introduce your business and team, and bring services and contact details together.'],['Professionals & creatives','Show your experience, projects, and work in a style that reflects you.'],['Services & products','Organize what you offer in a clear catalog that is easy to share.'],['Projects & events','Introduce an idea, create a campaign landing page, or share the details of an event.']],
    processTitle:'From your content to your website.', steps:[['Start with your idea','Share your website’s purpose, content, images, and available brand assets.'],['Organize & design','We find a layout that suits the content and works well on a phone.'],['Review & publish','Review the pages and links together, then prepare the website for publishing and sharing.']],
    note:'Static websites are suited to presenting information and content. If your idea needs accounts, booking, or online payments, we establish those requirements first.',
    finalTitle:'What would you like to share with the world?', finalText:'Start with a clear purpose and content that reflects your project. We turn it into pages your audience can reach.', finalLink:'Explore Holool', footer:'Holool', footerNote:'Websites for businesses, people, and projects.'
  }
};

export function homeContent(lang) {
  const t = copy[lang];
  return `<a class="site-skip" href="#content">${t.skip}</a>
  <header class="site-header site-width">
    <a class="site-brand" href="${lang === 'en' ? '/en/' : '/'}"><img src="/shared/brand/icon.webp" alt="" width="48" height="48"><span><strong>${t.name}</strong><small>${t.descriptor}</small></span></a>
    <nav aria-label="${lang === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}"><a href="#possibilities">${t.uses}</a><a href="#approach">${t.approach}</a></nav>
    <a class="site-language" href="${t.alternate}" lang="${lang === 'ar' ? 'en' : 'ar'}">${t.language}<span aria-hidden="true">◎</span></a>
  </header>
  <main id="content" class="site-main">
    <section class="site-hero site-width">
      <div class="site-hero-copy"><h1>${t.title}</h1><p>${t.intro}</p><div class="site-actions"><a class="site-button" href="https://holoolsoftware.com">${t.primary}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg></a><a class="site-text-link" href="#possibilities">${t.secondary}</a></div></div>
      <figure class="site-identity"><span class="site-pixel pixel-one" aria-hidden="true"></span><span class="site-pixel pixel-two" aria-hidden="true"></span><img src="/shared/brand/logo.webp" alt="${lang === 'ar' ? 'شعار حلول التقنية' : 'Holool logo — حلول التقنية'}" width="640" height="557" fetchpriority="high"><figcaption>${t.visual}</figcaption></figure>
    </section>
    <div class="site-spectrum"><div class="site-width">${t.strip.map(label => `<span><i aria-hidden="true"></i>${label}</span>`).join('')}</div></div>
    <section id="possibilities" class="site-possibilities site-width"><div class="site-section-heading"><h2>${t.usesTitle}</h2><p>${t.usesIntro}</p></div><div class="site-usecases">${t.examples.map(([name,text]) => `<article><h3>${name}</h3><p>${text}</p></article>`).join('')}</div></section>
    <section id="approach" class="site-process"><div class="site-width"><h2>${t.processTitle}</h2><ol>${t.steps.map(([name,text]) => `<li><h3>${name}</h3><p>${text}</p></li>`).join('')}</ol><p class="site-scope-note">${t.note}</p></div></section>
    <section class="site-invitation site-width"><div><h2>${t.finalTitle}</h2><p>${t.finalText}</p></div><a class="site-button" href="https://holoolsoftware.com">${t.finalLink}</a></section>
  </main>
  <footer class="site-footer"><div class="site-width"><a href="https://holoolsoftware.com"><img src="/shared/brand/icon.webp" alt="" width="28" height="28">${t.footer}</a><span>${t.footerNote}</span><span lang="en" dir="ltr">Powered by <a href="https://holoolsoftware.com">Holool</a></span></div></footer>`;
}
