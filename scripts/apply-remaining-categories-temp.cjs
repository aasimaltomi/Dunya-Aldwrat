const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const F=(id,ar,en,tr,officialUrl)=>({id,name:{ar,en,tr},officialUrl});

const categories={
  'plat-11':[
    F('foundations-of-english','أسس اللغة الإنجليزية','Foundations of English','İngilizce Temelleri','https://www.aucegypt.edu/academics/free-english-courses'),
    F('integrated-english','الإنجليزية المتكاملة','Integrated English','Bütünleşik İngilizce','https://www.aucegypt.edu/academics/free-english-courses'),
    F('college-prep-english','الإنجليزية للإعداد الجامعي','College Prep English','Üniversite Hazırlık İngilizcesi','https://www.aucegypt.edu/academics/free-english-courses'),
    F('thematic-courses','الدورات الموضوعية','Thematic Courses','Tematik Kurslar','https://www.aucegypt.edu/academics/free-english-courses')
  ],
  'plat-22':[
    F('python','بايثون','Python','Python','https://www.kaggle.com/learn/python'),
    F('intro-machine-learning','مقدمة في تعلم الآلة','Intro to Machine Learning','Makine Öğrenmesine Giriş','https://www.kaggle.com/learn/intro-to-machine-learning'),
    F('pandas','Pandas','Pandas','Pandas','https://www.kaggle.com/learn/pandas'),
    F('data-visualization','تصور البيانات','Data Visualization','Veri Görselleştirme','https://www.kaggle.com/learn/data-visualization'),
    F('intro-sql','مقدمة في SQL','Intro to SQL','SQL’e Giriş','https://www.kaggle.com/learn/intro-to-sql'),
    F('intro-deep-learning','مقدمة في التعلم العميق','Intro to Deep Learning','Derin Öğrenmeye Giriş','https://www.kaggle.com/learn/intro-to-deep-learning'),
    F('computer-vision','الرؤية الحاسوبية','Computer Vision','Bilgisayarlı Görü','https://www.kaggle.com/learn/computer-vision'),
    F('time-series','السلاسل الزمنية','Time Series','Zaman Serileri','https://www.kaggle.com/learn/time-series')
  ],
  'plat-23':[
    F('introduction-to-github','مقدمة إلى GitHub','Introduction to GitHub','GitHub’a Giriş','https://github.com/skills/introduction-to-github'),
    F('communicate-using-markdown','التواصل باستخدام Markdown','Communicate Using Markdown','Markdown ile İletişim','https://github.com/skills/communicate-using-markdown'),
    F('github-pages','GitHub Pages','GitHub Pages','GitHub Pages','https://github.com/skills/github-pages'),
    F('review-pull-requests','مراجعة طلبات السحب','Review Pull Requests','Pull Request İnceleme','https://github.com/skills/review-pull-requests'),
    F('resolve-merge-conflicts','حل تعارضات الدمج','Resolve Merge Conflicts','Birleştirme Çakışmalarını Çözme','https://github.com/skills/resolve-merge-conflicts'),
    F('hello-github-actions','مقدمة إلى GitHub Actions','Hello GitHub Actions','GitHub Actions’a Giriş','https://github.com/skills/hello-github-actions')
  ],
  'plat-30':[
    F('full-stack-javascript','تطوير الويب المتكامل بـ JavaScript','Full-Stack JavaScript','Full-Stack JavaScript','https://satr.tuwaiq.edu.sa/path/ecbAGsuqOQ/view'),
    F('full-stack-python','تطوير الويب المتكامل بـ Python','Full-Stack Python','Full-Stack Python','https://satr.tuwaiq.edu.sa/path/OTZExaETAH/view'),
    F('data-science-ai','علم البيانات والذكاء الاصطناعي','Data Science & AI','Veri Bilimi ve Yapay Zekâ','https://satr.tuwaiq.edu.sa/path/zaNuCyeqGx/view'),
    F('data-analysis','تحليل البيانات','Data Analysis','Veri Analizi','https://satr.tuwaiq.edu.sa/path/GeI4P6aBSK/view'),
    F('cybersecurity','أساسيات الأمن السيبراني','Cybersecurity Fundamentals','Siber Güvenlik Temelleri','https://satr.tuwaiq.edu.sa/path/E0v6z0oS6R/view'),
    F('ios-development','تطوير تطبيقات iOS','iOS Development','iOS Geliştirme','https://satr.tuwaiq.edu.sa/path/TxrppJSrgx/view'),
    F('android-development','تطوير تطبيقات Android','Android Development','Android Geliştirme','https://satr.tuwaiq.edu.sa/path/KGYLmAVZWT/view'),
    F('flutter-development','تطوير تطبيقات Flutter','Flutter Development','Flutter Geliştirme','https://satr.tuwaiq.edu.sa/path/OHarLRCHae/view')
  ],
  'plat-33':[
    F('economics-management-marketing','الاقتصاد والإدارة والتسويق','Economics, Management & Marketing','Ekonomi, Yönetim ve Pazarlama','https://www.rwaq.org/courses'),
    F('computer-science-digitalization','علوم الحاسب والرّقمنة','Computer Science & Digitalization','Bilgisayar Bilimleri ve Dijitalleşme','https://www.rwaq.org/courses'),
    F('education','التربية','Education','Eğitim','https://www.rwaq.org/courses'),
    F('islamic-studies','الدراسات الإسلامية','Islamic Studies','İslami İlimler','https://www.rwaq.org/courses'),
    F('social-humanities','العلوم الاجتماعية والإنسانية','Social Sciences & Humanities','Sosyal ve Beşeri Bilimler','https://www.rwaq.org/courses'),
    F('arabic-language-literature','الآداب واللغة العربية','Arabic Language & Literature','Arap Dili ve Edebiyatı','https://www.rwaq.org/courses'),
    F('medicine-public-health','الطب والصحة العامة','Medicine & Public Health','Tıp ve Halk Sağlığı','https://www.rwaq.org/courses'),
    F('languages-translation','اللغات والترجمة','Languages & Translation','Diller ve Çeviri','https://www.rwaq.org/courses'),
    F('curriculum-teaching-methods','مناهج وطرق التدريس','Curriculum & Teaching Methods','Müfredat ve Öğretim Yöntemleri','https://www.rwaq.org/courses'),
    F('creativity-innovation','الإبداع والابتكار','Creativity & Innovation','Yaratıcılık ve İnovasyon','https://www.rwaq.org/courses'),
    F('law','القانون','Law','Hukuk','https://www.rwaq.org/courses'),
    F('mathematics-science','الرياضيات والعلوم','Mathematics & Science','Matematik ve Fen Bilimleri','https://www.rwaq.org/courses'),
    F('culture-media','الثقافة والإعلام','Culture & Media','Kültür ve Medya','https://www.rwaq.org/courses'),
    F('podcasts','بودكاست رواق','Rwaq Podcasts','Rwaq Podcastleri','https://www.rwaq.org/courses'),
    F('skills-hobbies','مهارات وهوايات','Skills & Hobbies','Beceriler ve Hobiler','https://www.rwaq.org/courses'),
    F('engineering','الهندسة','Engineering','Mühendislik','https://www.rwaq.org/courses'),
    F('tourism-archaeology','السياحة والآثار','Tourism & Archaeology','Turizm ve Arkeoloji','https://www.rwaq.org/courses'),
    F('environment-agriculture','البيئة والزراعة','Environment & Agriculture','Çevre ve Tarım','https://www.rwaq.org/courses'),
    F('rwaq-programs','برامج رواق','Rwaq Programs','Rwaq Programları','https://www.rwaq.org/courses')
  ],
  'plat-37':[
    F('matlab-onramp','أساسيات MATLAB','MATLAB Onramp','MATLAB Temelleri','https://matlabacademy.mathworks.com/details/matlab-onramp/gettingstarted'),
    F('simulink-onramp','أساسيات Simulink','Simulink Onramp','Simulink Temelleri','https://matlabacademy.mathworks.com/details/simulink-onramp/simulink'),
    F('machine-learning-onramp','أساسيات تعلم الآلة','Machine Learning Onramp','Makine Öğrenmesi Temelleri','https://matlabacademy.mathworks.com/details/machine-learning-onramp/machinelearning'),
    F('deep-learning-onramp','أساسيات التعلم العميق','Deep Learning Onramp','Derin Öğrenme Temelleri','https://matlabacademy.mathworks.com/details/deep-learning-onramp/deeplearning'),
    F('image-processing-onramp','أساسيات معالجة الصور','Image Processing Onramp','Görüntü İşleme Temelleri','https://matlabacademy.mathworks.com/details/image-processing-onramp/imageprocessing'),
    F('signal-processing-onramp','أساسيات معالجة الإشارات','Signal Processing Onramp','Sinyal İşleme Temelleri','https://matlabacademy.mathworks.com/details/signal-processing-onramp/signalprocessing'),
    F('statistics-onramp','أساسيات الإحصاء','Statistics Onramp','İstatistik Temelleri','https://matlabacademy.mathworks.com/details/statistics-onramp/orst'),
    F('app-building-onramp','أساسيات بناء التطبيقات','App Building Onramp','Uygulama Geliştirme Temelleri','https://matlabacademy.mathworks.com/details/app-building-onramp/orab')
  ],
  'plat-39':[
    F('problem-solving-basic','حل المشكلات - أساسي','Problem Solving (Basic)','Problem Çözme (Temel)','https://www.hackerrank.com/skills-verification/problem_solving_basic'),
    F('python-basic','Python - أساسي','Python (Basic)','Python (Temel)','https://www.hackerrank.com/skills-verification/python_basic'),
    F('sql-intermediate','SQL - متوسط','SQL (Intermediate)','SQL (Orta)','https://www.hackerrank.com/skills-verification/sql_intermediate'),
    F('java-basic','Java - أساسي','Java (Basic)','Java (Temel)','https://www.hackerrank.com/skills-verification/java_basic'),
    F('javascript-basic','JavaScript - أساسي','JavaScript (Basic)','JavaScript (Temel)','https://www.hackerrank.com/skills-verification/javascript_basic'),
    F('react-basic','React - أساسي','React (Basic)','React (Temel)','https://www.hackerrank.com/skills-verification/react_basic'),
    F('rest-api-intermediate','REST API - متوسط','REST API (Intermediate)','REST API (Orta)','https://www.hackerrank.com/skills-verification/rest_api_intermediate'),
    F('angular-basic','Angular - أساسي','Angular (Basic)','Angular (Temel)','https://www.hackerrank.com/skills-verification/angular_basic')
  ],
  'plat-40':[
    F('programming','البرمجة','Programming','Programlama','https://www.coursat.org/category/programming'),
    F('design','التصميم','Design','Tasarım','https://www.coursat.org/category/design'),
    F('languages','اللغات','Languages','Diller','https://www.coursat.org/category/languages'),
    F('networks','الشبكات','Networks','Ağlar','https://www.coursat.org/category/networks'),
    F('security','الأمن والحماية','Security','Güvenlik','https://www.coursat.org/category/security'),
    F('database','قواعد البيانات','Databases','Veritabanları','https://www.coursat.org/category/database'),
    F('os','أنظمة التشغيل','Operating Systems','İşletim Sistemleri','https://www.coursat.org/category/os'),
    F('webdev','تطوير الويب','Web Development','Web Geliştirme','https://www.coursat.org/category/webdev'),
    F('management-economy','الإدارة والاقتصاد','Management & Economy','Yönetim ve Ekonomi','https://www.coursat.org/category/management-economy'),
    F('computer-science','علوم الحاسب','Computer Science','Bilgisayar Bilimleri','https://www.coursat.org/category/computer-science'),
    F('science','العلوم','Science','Fen Bilimleri','https://www.coursat.org/category/science'),
    F('math','الرياضيات','Mathematics','Matematik','https://www.coursat.org/category/math'),
    F('software','البرامج والتطبيقات','Software','Yazılım','https://www.coursat.org/category/software'),
    F('self-development','تطوير الذات','Self Development','Kişisel Gelişim','https://www.coursat.org/category/self-development')
  ]
};

const sources={
  'plat-11':'https://www.aucegypt.edu/academics/free-english-courses',
  'plat-22':'https://www.kaggle.com/learn',
  'plat-23':'https://github.com/skills.html',
  'plat-30':'https://satr.tuwaiq.edu.sa',
  'plat-33':'https://www.rwaq.org/courses',
  'plat-37':'https://matlabacademy.mathworks.com/',
  'plat-39':'https://www.hackerrank.com/skills-verification',
  'plat-40':'https://www.coursat.org/categories'
};

const dataPath=path.join(root,'data.json');
const data=JSON.parse(fs.readFileSync(dataPath,'utf8'));
for(const [id,fields] of Object.entries(categories)){
  const platform=data.platforms.find(p=>p.id===id);
  if(!platform)throw new Error(`Missing ${id}`);
  platform.fields=fields;
}
fs.writeFileSync(dataPath,JSON.stringify(data,null,2)+'\n');

const baselinePath=path.join(root,'tests','fixtures','category-effective-baseline.json');
const baseline=JSON.parse(fs.readFileSync(baselinePath,'utf8'));
for(const [id,fields] of Object.entries(categories))baseline[id]=fields;
fs.writeFileSync(baselinePath,JSON.stringify(baseline,null,2)+'\n');

const researchPath=path.join(root,'research-data.json');
const research=JSON.parse(fs.readFileSync(researchPath,'utf8'));
for(const [id,source] of Object.entries(sources)){
  const row=(research.publicPlatformResearch||[]).find(p=>p.id===id);
  if(!row)throw new Error(`Missing research row ${id}`);
  if(!row.pathResearch||typeof row.pathResearch!=='object')throw new Error(`Missing pathResearch ${id}`);
  row.pathResearch.lastVerified='2026-09-23';
  row.pathResearch.fieldsSourceUrl=source;
}
fs.writeFileSync(researchPath,JSON.stringify(research,null,2)+'\n');

console.log('Applied remaining categories:',Object.fromEntries(Object.entries(categories).map(([id,fields])=>[id,fields.length])));
