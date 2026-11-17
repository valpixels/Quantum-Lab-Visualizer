export interface QuizQuestion {
  question: string;
  question_ar?: string;
  options: string[];
  options_ar?: string[];
  correctIndex: number;
  explanation: string;
  explanation_ar?: string;
}

export interface FAQItem {
  question: string;
  question_ar?: string;
  answer: string;
  answer_ar?: string;
}

export interface LessonSection {
  id: string;
  title: string;
  title_ar?: string;
  body: string;
  body_ar?: string;
  visualHint?: "bloch" | "circuit" | "none";
  blochState?: { theta: number; phi: number };
}

export interface LessonModule {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  topics: string[];
  topics_ar?: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  dayIndex: number;
  isFinalDay?: boolean;
  content: LessonSection[];
  faqs: FAQItem[];
  quiz: QuizQuestion[];
}

export const LESSONS: LessonModule[] = [
  // ───────────────────────────── 1. QUBITS ─────────────────────────────
  {
    id: "qubits-intro",
    title: "Qubits",
    title_ar: "الكيوبتات",
    description: "What is a qubit, how is it different from a normal bit, and how can we picture it?",
    description_ar: "ما هو الكيوبت، وكيف يختلف عن البت العادي، وكيف نتخيّله؟",
    topics: ["Bits vs qubits", "Measurement", "Probability", "Bloch sphere"],
    topics_ar: ["البت والكيوبت", "القياس", "الاحتمالات", "كرة بلوخ"],
    difficulty: "Beginner",
    estimatedMinutes: 20,
    dayIndex: 1,
    content: [
      {
        id: "q1-1",
        title: "Bits and Qubits",
        title_ar: "البتات والكيوبتات",
        body: `A classical bit is like a light switch: it is either 0 or 1, and you can look at it as often as you like without changing it.

A qubit is the quantum version of a bit. Its state is described by two numbers that say how strongly it "leans" toward 0 and toward 1:

|ψ⟩ = α|0⟩ + β|1⟩

α and β are called amplitudes. For now, think of them as ordinary numbers (they are even allowed to be negative).

The rule for turning amplitudes into chances:
• Chance of measuring 0 = |α|²
• Chance of measuring 1 = |β|²
• The two chances must add up to 100%: |α|² + |β|² = 1

Example: α = 0.6 and β = 0.8 gives 0.36 (36%) for 0 and 0.64 (64%) for 1. Check: 0.36 + 0.64 = 1 ✓`,
        body_ar: `البت الكلاسيكي يشبه مفتاح الإضاءة: هو إما 0 أو 1، ويمكنك النظر إليه مرات كثيرة دون أن تغيّره.

الكيوبت هو النسخة الكمومية من البت. تُوصَف حالته بعددين يبيّنان مدى "ميله" نحو 0 ونحو 1:

|ψ⟩ = α|0⟩ + β|1⟩

يُسمّى α وβ السعات (amplitudes). فكّر فيهما الآن كأعداد عادية (ويُسمح لهما حتى أن تكونا سالبتين).

قاعدة تحويل السعات إلى احتمالات:
• احتمال قياس 0 = |α|²
• احتمال قياس 1 = |β|²
• يجب أن يكون مجموع الاحتمالين 100%: |α|² + |β|² = 1

مثال: α = 0.6 وβ = 0.8 تعطي 0.36 (36%) للقيمة 0 و0.64 (64%) للقيمة 1. تحقّق: 0.36 + 0.64 = 1 ✓`,
        visualHint: "bloch",
        blochState: { theta: 0, phi: 0 },
      },
      {
        id: "q1-2",
        title: "Measuring a Qubit",
        title_ar: "قياس الكيوبت",
        body: `Before you measure, a qubit can be a blend of 0 and 1. When you measure it, you always get a plain answer: 0 or 1, never something in between.

Which answer you get is random, but not always 50/50. For the 36% / 64% qubit from the last section:
• measure it once → you might get 0 or 1, and you cannot predict which
• prepare it and measure it 1000 times → about 360 zeros and about 640 ones

That is why quantum experiments are repeated many times: one result can't show you the amplitudes, but the pattern across many results can.

After the measurement, the qubit stays in the answer you got. The original blend is gone, so measuring is not a harmless "look" like reading a classical bit.`,
        body_ar: `قبل القياس، يمكن أن يكون الكيوبت مزيجاً من 0 و1. وعندما تقيسه تحصل دائماً على إجابة واضحة: 0 أو 1، ولا شيء بينهما.

الإجابة التي تحصل عليها عشوائية، لكنها ليست دائماً 50/50. في الكيوبت (36% / 64%) من القسم السابق:
• قِسه مرة واحدة ← قد تحصل على 0 أو 1 ولا يمكنك التنبؤ بأيهما
• جهّزه وقِسه 1000 مرة ← تحصل تقريباً على 360 صفراً و640 واحداً

لهذا تُكرَّر التجارب الكمومية مرات كثيرة: نتيجة واحدة لا تكشف السعات، لكن النمط عبر نتائج كثيرة يكشفها.

بعد القياس يبقى الكيوبت في الإجابة التي حصلت عليها. يزول المزيج الأصلي، فالقياس ليس "نظرة" بريئة كقراءة بت كلاسيكي.`,
        visualHint: "bloch",
        blochState: { theta: Math.PI / 2, phi: 0 },
      },
      {
        id: "q1-3",
        title: "The Bloch Sphere",
        title_ar: "كرة بلوخ",
        body: `The Bloch sphere draws the state of one qubit as an arrow starting at the center of a ball.

• North pole = |0⟩ (always measures 0)
• South pole = |1⟩ (always measures 1)
• Any point on the equator = 50/50 between 0 and 1
• In between = leaning toward 0 or 1, depending on which pole the arrow is closer to

The points |+⟩ and |−⟩ on the equator are both 50/50, but they sit on opposite sides. They differ in something called phase (the sign between the two parts). Phase doesn't change what you measure right away, but it matters a lot once gates are applied.

Try it: open the Bloch Sphere lab (unsync from the teacher first if you are following along). Press the presets |0⟩, |1⟩, |+⟩ and |−⟩ and watch the P(|0⟩) bar. Then move the θ slider: the probabilities change. Move the φ slider: the arrow spins around, but the probabilities stay the same!`,
        body_ar: `تعرض كرة بلوخ حالة كيوبت واحد على شكل سهم يبدأ من مركز كرة.

• القطب الشمالي = |0⟩ (يعطي 0 دائماً)
• القطب الجنوبي = |1⟩ (يعطي 1 دائماً)
• أي نقطة على خط الاستواء = 50/50 بين 0 و1
• ما بينهما = ميل نحو 0 أو 1 بحسب القطب الأقرب إلى السهم

النقطتان |+⟩ و|−⟩ على خط الاستواء كلتاهما 50/50 لكنهما على جانبين متقابلين. يختلفان في شيء اسمه الطور (الإشارة بين الجزأين). الطور لا يغيّر ما تقيسه مباشرة، لكنه مهم جداً عند تطبيق البوابات لاحقاً.

جرّب بنفسك: افتح مختبر كرة بلوخ (ألغِ المزامنة مع المعلم أولاً إن كنت تتابع معه). اضغط الحالات الجاهزة |0⟩ و|1⟩ و|+⟩ و|−⟩ وراقب شريط P(|0⟩). ثم حرّك شريط θ: تتغير الاحتمالات. وحرّك شريط φ: يدور السهم لكن الاحتمالات لا تتغير!`,
        visualHint: "bloch",
        blochState: { theta: Math.PI / 2, phi: 0 },
      },
    ],
    faqs: [
      {
        question: "Is a qubit really \"both 0 and 1 at the same time\"?",
        question_ar: "هل الكيوبت فعلاً \"0 و1 في آنٍ واحد\"؟",
        answer: "That is a popular shortcut, but it can mislead. A better picture: before measurement, a qubit is in a blend of 0 and 1 described by its amplitudes. It is not secretly a 0 or a 1 that we haven't looked at, and it isn't literally both. When you measure, you get one answer with the probabilities the amplitudes give.",
        answer_ar: "هذا اختصار شائع لكنه قد يضلّل. الصورة الأفضل: قبل القياس يكون الكيوبت في مزيج من 0 و1 تصفه سعاته. فهو ليس 0 أو 1 مخفياً لم ننظر إليه بعد، وليس كلاهما حرفياً. عند القياس تحصل على إجابة واحدة باحتمالات تحددها السعات.",
      },
      {
        question: "Can I look at a qubit without changing it?",
        question_ar: "هل يمكنني النظر إلى كيوبت دون أن أغيّره؟",
        answer: "Not if you want to learn whether it is 0 or 1. Measuring a qubit in a blend forces it to pick an answer, and the blend is lost. This is why quantum information is delicate, and also why it can be used for secure communication (see the Cryptography lesson).",
        answer_ar: "ليس إذا أردت معرفة أهو 0 أم 1. قياس كيوبت في مزيج يجبره على اختيار إجابة، ويضيع المزيج. لهذا تكون المعلومات الكمومية هشّة، ولهذا أيضاً يمكن استخدامها في الاتصالات الآمنة (انظر درس التشفير).",
      },
      {
        question: "How are real qubits built?",
        question_ar: "كيف تُصنع الكيوبتات الحقيقية؟",
        answer: "There are several approaches: tiny superconducting circuits cooled close to absolute zero (used by IBM and Google), single atoms or ions held by lasers and electric fields (used by IonQ and Quantinuum), particles of light (photons), and more. Each has strengths and weaknesses, and no approach has clearly won yet.",
        answer_ar: "هناك عدة طرق: دوائر صغيرة فائقة التوصيل تُبرَّد إلى ما يقارب الصفر المطلق (تستخدمها IBM وGoogle)، وذرات أو أيونات مفردة تُمسَك بالليزر والمجالات الكهربائية (تستخدمها IonQ وQuantinuum)، وجسيمات الضوء (الفوتونات)، وغيرها. لكل طريقة مزايا وعيوب، ولم تحسم طريقة واحدة السباق بعد.",
      },
      {
        question: "What is decoherence?",
        question_ar: "ما هو فك التماسك؟",
        answer: "Qubits are never perfectly alone: heat, vibrations and stray signals slowly disturb them, and they lose their quantum behavior. This is called decoherence. It is the main reason quantum computers need extreme cooling and shielding, and why errors are the biggest challenge in the field.",
        answer_ar: "الكيوبتات لا تكون معزولة تماماً: الحرارة والاهتزازات والإشارات الشاردة تزعجها ببطء فتفقد سلوكها الكمومي. يُسمّى هذا فك التماسك. وهو السبب الرئيسي لحاجة الحواسيب الكمومية إلى تبريد وعزل شديدين، ولماذا تُعدّ الأخطاء أكبر تحدٍّ في هذا المجال.",
      },
    ],
    quiz: [
      {
        question: "A qubit has |α|² = 0.25. What is the chance of measuring 1?",
        question_ar: "في كيوبت كان |α|² = 0.25. ما احتمال الحصول على 1 عند القياس؟",
        options: ["25%", "50%", "75%", "100%"],
        options_ar: ["25%", "50%", "75%", "100%"],
        correctIndex: 2,
        explanation: "The two chances must add up to 100%. If the chance of 0 is 25%, the chance of 1 is 100% − 25% = 75%.",
        explanation_ar: "يجب أن يكون مجموع الاحتمالين 100%. إذا كان احتمال 0 يساوي 25% فاحتمال 1 يساوي 100% − 25% = 75%.",
      },
      {
        question: "You measure a qubit that is in a blend of 0 and 1. What do you see?",
        question_ar: "تقيس كيوبتاً في مزيج من 0 و1. ماذا ترى؟",
        options: [
          "Either 0 or 1, never something in between",
          "A number between 0 and 1",
          "Both 0 and 1 at the same time",
          "Nothing, the qubit disappears",
        ],
        options_ar: [
          "إما 0 أو 1، ولا شيء بينهما",
          "عدداً بين 0 و1",
          "0 و1 معاً في الوقت نفسه",
          "لا شيء، يختفي الكيوبت",
        ],
        correctIndex: 0,
        explanation: "A measurement always gives a plain classical answer, 0 or 1. Which one you get is random, with the probabilities set by the amplitudes.",
        explanation_ar: "القياس يعطي دائماً إجابة كلاسيكية واضحة: 0 أو 1. والإجابة التي تحصل عليها عشوائية باحتمالات تحددها السعات.",
      },
      {
        question: "Which point on the Bloch sphere gives 0 or 1 with a 50/50 chance?",
        question_ar: "أي نقطة على كرة بلوخ تعطي 0 أو 1 باحتمال 50/50؟",
        options: [
          "The North pole",
          "The South pole",
          "The center of the ball",
          "Any point on the equator",
        ],
        options_ar: [
          "القطب الشمالي",
          "القطب الجنوبي",
          "مركز الكرة",
          "أي نقطة على خط الاستواء",
        ],
        correctIndex: 3,
        explanation: "The poles are the certain states |0⟩ and |1⟩. Every point on the equator is exactly halfway between them, so it measures 0 or 1 with equal chance.",
        explanation_ar: "القطبان هما الحالتان المؤكدتان |0⟩ و|1⟩. وكل نقطة على خط الاستواء تقع في منتصف المسافة بينهما، فتعطي 0 أو 1 باحتمال متساوٍ.",
      },
      {
        question: "Why do experiments measure the same prepared qubit state many times?",
        question_ar: "لماذا تقيس التجارب الحالة المجهّزة نفسها مرات كثيرة؟",
        options: [
          "Because the qubit wears out",
          "One result shows only 0 or 1; many results reveal the probabilities",
          "To make the qubit more accurate",
          "Because computers make mistakes",
        ],
        options_ar: [
          "لأن الكيوبت يتعب",
          "نتيجة واحدة تُظهر 0 أو 1 فقط؛ ونتائج كثيرة تكشف الاحتمالات",
          "لجعل الكيوبت أدق",
          "لأن الحواسيب تخطئ",
        ],
        correctIndex: 1,
        explanation: "A single measurement can't tell you the amplitudes. Repeating many times shows how often 0 and 1 appear, which reveals the probabilities.",
        explanation_ar: "القياس الواحد لا يكشف السعات. أما التكرار مرات كثيرة فيُظهر عدد مرات ظهور 0 و1، وهذا يكشف الاحتمالات.",
      },
    ],
  },

  // ─────────────────────── 2. SUPERPOSITION & GATES ───────────────────────
  {
    id: "superposition",
    title: "Superposition & Gates",
    title_ar: "التراكب والبوابات",
    description: "Meet the basic quantum gates, build a superposition with the Hadamard gate, and discover interference.",
    description_ar: "تعرّف على البوابات الكمومية الأساسية، وأنشئ تراكباً ببوابة هادامار، واكتشف التداخل.",
    topics: ["Quantum gates", "Hadamard gate", "Interference", "Many qubits"],
    topics_ar: ["البوابات الكمومية", "بوابة هادامار", "التداخل", "كيوبتات متعددة"],
    difficulty: "Beginner",
    estimatedMinutes: 25,
    dayIndex: 2,
    content: [
      {
        id: "sup-1",
        title: "Quantum Gates",
        title_ar: "البوابات الكمومية",
        body: `A quantum gate is an operation that changes the state of a qubit, just like a classical logic gate (NOT, AND, ...) changes bits. On the Bloch sphere, gates turn the arrow.

Three gates to know:
• X gate: the quantum NOT. It turns |0⟩ into |1⟩ and |1⟩ into |0⟩ (the arrow goes from the North pole to the South pole).
• H gate (Hadamard): turns a definite 0 or 1 into a 50/50 blend. The arrow moves from a pole to the equator.
• Z gate: leaves the chances of 0 and 1 alone but flips the sign of the |1⟩ part. On the sphere it spins the arrow half a turn around the vertical axis, so |+⟩ becomes |−⟩.

Two facts about all quantum gates:
• They can always be undone: apply the right gate afterwards and you are back where you started.
• In a circuit, time runs from left to right. Each horizontal line is one qubit and each box on it is a gate.

Try it: open the Circuit Lab and drag an X gate onto the wire q[0]. That small circuit is the quantum NOT.`,
        body_ar: `البوابة الكمومية عملية تغيّر حالة الكيوبت، تماماً كما تغيّر البوابة المنطقية الكلاسيكية (NOT وAND ...) البتات. وعلى كرة بلوخ تُدير البوابات السهم.

ثلاث بوابات يجب أن تعرفها:
• بوابة X: هي NOT الكمومية. تحوّل |0⟩ إلى |1⟩ و|1⟩ إلى |0⟩ (ينتقل السهم من القطب الشمالي إلى الجنوبي).
• بوابة H (هادامار): تحوّل 0 أو 1 المؤكد إلى مزيج 50/50. ينتقل السهم من أحد القطبين إلى خط الاستواء.
• بوابة Z: تترك احتمالي 0 و1 كما هما لكنها تقلب إشارة الجزء |1⟩. وعلى الكرة تدير السهم نصف دورة حول المحور الرأسي، فتصبح |+⟩ هي |−⟩.

حقيقتان عن كل البوابات الكمومية:
• يمكن دائماً التراجع عنها: طبّق البوابة المناسبة بعدها فتعود إلى حيث بدأت.
• في الدائرة يسير الزمن من اليسار إلى اليمين. كل خط أفقي هو كيوبت، وكل مربع عليه هو بوابة.

جرّب بنفسك: افتح مختبر الدوائر واسحب بوابة X إلى السلك q[0]. هذه الدائرة الصغيرة هي NOT الكمومية.`,
        visualHint: "bloch",
        blochState: { theta: 0, phi: 0 },
      },
      {
        id: "sup-2",
        title: "The Hadamard Gate",
        title_ar: "بوابة هادامار",
        body: `The Hadamard gate (H) is the most common way to create a superposition.

H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩
H|1⟩ = (|0⟩ − |1⟩)/√2 = |−⟩

Both results are 50/50: each amplitude is 1/√2 ≈ 0.707, and 0.707² ≈ 0.5. The only difference between them is the sign (the phase).

If you measure right after H, you get 0 or 1 at random with equal chance. For an ideal qubit this randomness is fundamental, unlike the pseudo-random numbers a normal computer produces.

Try it: in the Circuit Lab place an H gate on q[0]. Then in the Bloch Sphere lab press |0⟩ and then |+⟩ to see what H does to the arrow.`,
        body_ar: `بوابة هادامار (H) هي الطريقة الأكثر شيوعاً لإنشاء تراكب.

H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩
H|1⟩ = (|0⟩ − |1⟩)/√2 = |−⟩

النتيجتان كلتاهما 50/50: كل سعة تساوي 1/√2 ≈ 0.707، و0.707² ≈ 0.5. والفرق الوحيد بينهما هو الإشارة (الطور).

إذا قست مباشرة بعد H تحصل على 0 أو 1 عشوائياً بفرصة متساوية. وفي كيوبت مثالي تكون هذه العشوائية جوهرية، بخلاف الأعداد شبه العشوائية التي يولّدها الحاسوب العادي.

جرّب بنفسك: في مختبر الدوائر ضع بوابة H على q[0]. ثم في مختبر كرة بلوخ اضغط |0⟩ ثم |+⟩ لترى ما تفعله H بالسهم.`,
        visualHint: "bloch",
        blochState: { theta: Math.PI / 2, phi: 0 },
      },
      {
        id: "sup-3",
        title: "Interference",
        title_ar: "التداخل",
        body: `Is superposition just randomness? Here is a test. Start with |0⟩, apply H, then apply H again, then measure.

If the first H were just a coin flip, the second H couldn't make the result certain. But in reality you get 0 every single time. Why?

Amplitudes can be positive or negative, and they add up like waves:
• Two routes lead to |0⟩: they give +½ and +½, which add up to 1.
• Two routes lead to |1⟩: they give +½ and −½, which cancel to 0.

Amplitudes that add up are called constructive interference. Amplitudes that cancel are called destructive interference (just like noise-cancelling headphones).

Interference is the engine of quantum algorithms: the circuit is designed so that wrong answers cancel and the right answer adds up.

Try it: in the Circuit Lab place two H gates in a row on q[0] and compare with a single H.`,
        body_ar: `هل التراكب مجرد عشوائية؟ إليك اختباراً. ابدأ بـ |0⟩ ثم طبّق H ثم H مرة أخرى ثم قِس.

لو كانت H الأولى مجرد رمية عملة لما استطاعت H الثانية أن تجعل النتيجة مؤكدة. لكنك في الواقع تحصل على 0 في كل مرة. لماذا؟

السعات يمكن أن تكون موجبة أو سالبة، وهي تُجمَع كما تُجمَع الأمواج:
• هناك طريقان يؤديان إلى |0⟩: يعطيان +½ و+½ فيكون المجموع 1.
• وهناك طريقان يؤديان إلى |1⟩: يعطيان +½ و−½ فيلغي كل منهما الآخر ويصبح المجموع 0.

السعات التي تتجمع تُسمّى تداخلاً بنّاءً، والتي تلغي بعضها تُسمّى تداخلاً هدّاماً (كما تفعل سمّاعات إلغاء الضجيج).

التداخل هو محرّك الخوارزميات الكمومية: تُصمَّم الدائرة بحيث تلغي الإجابات الخاطئة بعضها وتتجمع الإجابة الصحيحة.

جرّب بنفسك: في مختبر الدوائر ضع بوابتي H متتاليتين على q[0] وقارن مع بوابة H واحدة.`,
        visualHint: "circuit",
      },
      {
        id: "sup-4",
        title: "More Qubits, More Possibilities",
        title_ar: "كيوبتات أكثر، احتمالات أكثر",
        body: `One qubit needs 2 amplitudes (one for 0, one for 1). Two qubits need 4 (00, 01, 10, 11). In general, n qubits need 2ⁿ amplitudes:

• 2 qubits → 4 amplitudes
• 10 qubits → 1,024 amplitudes
• 50 qubits → more than a million billion (about 10¹⁵) amplitudes

This is why simulating many qubits on a normal computer gets very hard, very quickly.

But there is a catch: when you measure n qubits you only get n ordinary bits, one result. A quantum computer does not "try every answer at once and hand you the best one". Useful quantum algorithms need clever circuits that use interference so the right answer becomes likely.`,
        body_ar: `كيوبت واحد يحتاج إلى سعتين (واحدة لـ 0 وواحدة لـ 1). وكيوبتان يحتاجان إلى 4 (00 و01 و10 و11). وبوجه عام يحتاج n من الكيوبتات إلى 2ⁿ من السعات:

• كيوبتان ← 4 سعات
• 10 كيوبتات ← 1,024 سعة
• 50 كيوبتاً ← أكثر من مليون مليار (نحو 10¹⁵) سعة

لهذا تصبح محاكاة كيوبتات كثيرة على حاسوب عادي صعبة جداً وبسرعة كبيرة.

لكن هناك محاذير: عندما تقيس n من الكيوبتات فإنك تحصل على n من البتات العادية فقط، أي نتيجة واحدة. والحاسوب الكمومي لا "يجرّب كل الإجابات دفعة واحدة ويعطيك أفضلها". الخوارزميات الكمومية المفيدة تحتاج إلى دوائر ذكية تستخدم التداخل لتصبح الإجابة الصحيحة هي المحتملة.`,
        visualHint: "none",
      },
    ],
    faqs: [
      {
        question: "Is superposition the same as randomness?",
        question_ar: "هل التراكب هو نفسه العشوائية؟",
        answer: "No. A hidden coin is just heads or tails and we don't know which. A qubit in superposition can show interference: apply H twice and you get a certain result, which ordinary uncertainty can never do. The amplitudes (including their signs) really matter.",
        answer_ar: "لا. العملة المخفية هي وجه أو ظهر ونحن فقط لا نعرف أيهما. أما الكيوبت في التراكب فيُظهر التداخل: طبّق H مرتين وستحصل على نتيجة مؤكدة، وهذا لا يمكن أن تفعله عدم المعرفة العادية. السعات (بما فيها إشاراتها) مهمة فعلاً.",
      },
      {
        question: "Can everyday objects be in superposition?",
        question_ar: "هل يمكن للأجسام اليومية أن تكون في تراكب؟",
        answer: "The rules of quantum physics apply to everything in principle, but big objects constantly interact with air, light and heat. That destroys the delicate quantum behavior almost instantly (decoherence). Schrödinger's cat is a thought experiment about this puzzle, not a real experiment.",
        answer_ar: "من حيث المبدأ تنطبق قواعد فيزياء الكم على كل شيء، لكن الأجسام الكبيرة تتفاعل باستمرار مع الهواء والضوء والحرارة، وهذا يدمّر السلوك الكمومي الدقيق بشكل شبه فوري (فك التماسك). قطة شرودنغر تجربة فكرية حول هذه المعضلة، وليست تجربة حقيقية.",
      },
      {
        question: "Are quantum computers always faster than normal computers?",
        question_ar: "هل الحواسيب الكمومية دائماً أسرع من الحواسيب العادية؟",
        answer: "No. They are expected to help with certain kinds of problems only. For everyday tasks like browsing, games or spreadsheets, normal computers are better and far cheaper.",
        answer_ar: "لا. يُتوقع أن تفيد في أنواع معينة من المسائل فقط. أما المهام اليومية كتصفح الإنترنت والألعاب والجداول فالحواسيب العادية أفضل وأرخص بكثير.",
      },
      {
        question: "If the Z gate doesn't change the chances of 0 and 1, what is it for?",
        question_ar: "إذا كانت بوابة Z لا تغيّر احتمالي 0 و1، فما فائدتها؟",
        answer: "Z changes the phase (the sign of the |1⟩ part). You can't see that by measuring right away, but it changes how later gates combine the amplitudes. For example, applying H, then Z, then H turns |0⟩ into |1⟩, exactly like an X gate.",
        answer_ar: "تغيّر Z الطور (إشارة الجزء |1⟩). لا يمكنك رؤية ذلك بالقياس مباشرة، لكنه يغيّر طريقة جمع البوابات اللاحقة للسعات. فمثلاً تطبيق H ثم Z ثم H يحوّل |0⟩ إلى |1⟩ تماماً كبوابة X.",
      },
    ],
    quiz: [
      {
        question: "Which gate is the quantum NOT, turning |0⟩ into |1⟩?",
        question_ar: "أي بوابة هي NOT الكمومية التي تحوّل |0⟩ إلى |1⟩؟",
        options: ["The H gate", "The Z gate", "The SWAP gate", "The X gate"],
        options_ar: ["بوابة H", "بوابة Z", "بوابة SWAP", "بوابة X"],
        correctIndex: 3,
        explanation: "The X gate flips |0⟩ to |1⟩ and |1⟩ to |0⟩. H makes a 50/50 blend, Z changes only the sign, and SWAP exchanges two qubits.",
        explanation_ar: "تقلب بوابة X الحالة |0⟩ إلى |1⟩ و|1⟩ إلى |0⟩. أما H فتصنع مزيجاً 50/50، وZ تغيّر الإشارة فقط، وSWAP تبدّل بين كيوبتين.",
      },
      {
        question: "You apply H to |0⟩ and then measure. What do you see?",
        question_ar: "تطبّق H على |0⟩ ثم تقيس. ماذا ترى؟",
        options: [
          "0 or 1, each about half the time",
          "Always 0",
          "Always 1",
          "Something between 0 and 1",
        ],
        options_ar: [
          "0 أو 1، كلٌّ منهما في نحو نصف المرات",
          "0 دائماً",
          "1 دائماً",
          "شيئاً بين 0 و1",
        ],
        correctIndex: 0,
        explanation: "H|0⟩ is an equal blend of 0 and 1, so each answer appears with 50% chance.",
        explanation_ar: "الحالة H|0⟩ مزيج متساوٍ من 0 و1، فتظهر كل إجابة باحتمال 50%.",
      },
      {
        question: "You apply H twice to |0⟩ and then measure. What happens, and why?",
        question_ar: "تطبّق H مرتين على |0⟩ ثم تقيس. ماذا يحدث ولماذا؟",
        options: [
          "Random 0 or 1 again, because H is random",
          "Always 1, because H flips the qubit",
          "Always 0, because the two routes to |1⟩ cancel",
          "It depends on how fast you apply the gates",
        ],
        options_ar: [
          "0 أو 1 عشوائياً مرة أخرى لأن H عشوائية",
          "1 دائماً لأن H تقلب الكيوبت",
          "0 دائماً لأن الطريقين المؤديين إلى |1⟩ يلغي كل منهما الآخر",
          "يعتمد على سرعة تطبيق البوابات",
        ],
        correctIndex: 2,
        explanation: "The two routes to |1⟩ have amplitudes +½ and −½ and cancel (destructive interference), while the two routes to |0⟩ add up (constructive interference).",
        explanation_ar: "الطريقان المؤديان إلى |1⟩ سعتاهما +½ و−½ فتلغيان بعضهما (تداخل هدّام)، بينما يتجمع الطريقان المؤديان إلى |0⟩ (تداخل بنّاء).",
      },
      {
        question: "How many amplitudes are needed to describe 5 qubits?",
        question_ar: "كم سعة نحتاج لوصف 5 كيوبتات؟",
        options: ["10", "32", "25", "5"],
        options_ar: ["10", "32", "25", "5"],
        correctIndex: 1,
        explanation: "n qubits need 2ⁿ amplitudes. For 5 qubits that is 2⁵ = 32.",
        explanation_ar: "يحتاج n من الكيوبتات إلى 2ⁿ من السعات. وفي 5 كيوبتات يكون ذلك 2⁵ = 32.",
      },
    ],
  },

  // ───────────────────────────── 3. ENTANGLEMENT ─────────────────────────────
  {
    id: "entanglement",
    title: "Entanglement",
    title_ar: "التشابك الكمومي",
    description: "Build a Bell pair and explore the strange link between entangled qubits, and what it can and can't do.",
    description_ar: "أنشئ زوج بيل واستكشف الرابط الغريب بين الكيوبتات المتشابكة، وما يمكنه فعله وما لا يمكنه.",
    topics: ["Entangled pairs", "Bell state", "CNOT gate", "Limits of entanglement"],
    topics_ar: ["الأزواج المتشابكة", "حالة بيل", "بوابة CNOT", "حدود التشابك"],
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    dayIndex: 3,
    content: [
      {
        id: "ent-1",
        title: "What Is Entanglement?",
        title_ar: "ما هو التشابك الكمومي؟",
        body: `Two qubits are entangled when they share one joint state that cannot be split into "the state of qubit A" and "the state of qubit B".

The most famous example is the Bell state:

(|00⟩ + |11⟩)/√2

If you measure both qubits:
• Each qubit on its own gives 0 or 1 at random, 50/50.
• But the two results are always the same: 00 or 11, never 01 or 10.

Isn't that just like a pair of gloves, where finding a left glove tells you the other is a right glove? Not quite. With gloves the answer was fixed in advance. In the 1960s, John Bell showed that if you measure entangled qubits in different ways, the results are correlated more strongly than any "fixed in advance" explanation allows. Experiments have confirmed this, and the 2022 Nobel Prize in Physics was awarded for them.`,
        body_ar: `يكون كيوبتان متشابكين عندما يشتركان في حالة واحدة مشتركة لا يمكن تقسيمها إلى "حالة الكيوبت A" و"حالة الكيوبت B".

أشهر مثال هو حالة بيل:

(|00⟩ + |11⟩)/√2

إذا قست الكيوبتين معاً:
• كل كيوبت وحده يعطي 0 أو 1 عشوائياً بنسبة 50/50.
• لكن النتيجتين تكونان دائماً متطابقتين: 00 أو 11، ولا تكونان أبداً 01 أو 10.

أليس هذا كزوج القفازات، حيث تخبرك رؤية القفاز الأيسر أن الآخر أيمن؟ ليس تماماً. في القفازات كانت الإجابة محددة مسبقاً. وفي ستينيات القرن العشرين بيّن جون بيل أنك إذا قست كيوبتات متشابكة بطرق مختلفة فإن النتائج ترتبط ارتباطاً أقوى مما يسمح به أي تفسير "محدد مسبقاً". وقد أكّدت التجارب ذلك، ومُنحت جائزة نوبل في الفيزياء لعام 2022 عنها.`,
        visualHint: "none",
      },
      {
        id: "ent-2",
        title: "Build a Bell Pair",
        title_ar: "أنشئ زوج بيل",
        body: `Only two steps are needed. Start with both qubits in |0⟩:

1. Apply H to qubit 0 → qubit 0 becomes a 50/50 blend.
2. Apply CNOT with qubit 0 as the control and qubit 1 as the target.

The CNOT gate ("controlled NOT") flips the target qubit only if the control qubit is 1:
• control is 0 → the target stays 0
• control is 1 → the target flips to 1

So whatever qubit 0 turns out to be, qubit 1 matches it. Together they form (|00⟩ + |11⟩)/√2.

Try it: open the Circuit Lab and click the "Bell State" example. You will see H on q[0] followed by the ⊕ symbol on q[1], which is the CNOT using q[0] as its control. Then try building the same circuit yourself on empty wires.

(There are three more Bell states, which differ by a sign or a flip. You can find them later.)`,
        body_ar: `خطوتان فقط تكفيان. ابدأ بالكيوبتين في |0⟩:

1. طبّق H على الكيوبت 0 ← يصبح الكيوبت 0 مزيجاً 50/50.
2. طبّق CNOT بحيث يكون الكيوبت 0 هو المتحكِّم والكيوبت 1 هو الهدف.

بوابة CNOT ("NOT المتحكَّم بها") تقلب الكيوبت الهدف فقط إذا كان المتحكِّم يساوي 1:
• المتحكِّم 0 ← يبقى الهدف 0
• المتحكِّم 1 ← ينقلب الهدف إلى 1

فمهما كانت نتيجة الكيوبت 0 فإن الكيوبت 1 يطابقها. معاً يكوّنان (|00⟩ + |11⟩)/√2.

جرّب بنفسك: افتح مختبر الدوائر واضغط المثال "Bell State". سترى H على q[0] ثم الرمز ⊕ على q[1]، وهو CNOT يستخدم q[0] متحكِّماً. ثم حاول بناء الدائرة نفسها بنفسك على أسلاك فارغة.

(هناك ثلاث حالات بيل أخرى تختلف بإشارة أو بقلب. يمكنك اكتشافها لاحقاً.)`,
        visualHint: "circuit",
      },
      {
        id: "ent-3",
        title: "What Entanglement Can and Can't Do",
        title_ar: "ما يمكن للتشابك فعله وما لا يمكنه",
        body: `What it can't do: send messages faster than light. Alice's results look completely random on their own, and so do Bob's. The link only appears when they compare their lists, and comparing needs an ordinary message (phone, internet), which is slower than light.

What it can do:
• Quantum teleportation: move the state of one qubit to another place using an entangled pair plus two ordinary bits. The original qubit's state is destroyed in the process, so nothing is copied and nothing travels faster than light.
• Secure keys: entanglement can be used to share secret keys that an eavesdropper can't copy (next lesson).
• Quantum computing: entanglement is an essential ingredient in many quantum algorithms.

Warning: entanglement is fragile. Noise from the environment (decoherence) can destroy it, so keeping qubits entangled over long times and distances is a big engineering challenge.`,
        body_ar: `ما لا يمكنه فعله: إرسال رسائل أسرع من الضوء. نتائج أليس تبدو عشوائية تماماً وحدها، وكذلك نتائج بوب. لا يظهر الرابط إلا عندما يقارنان قائمتيهما، والمقارنة تحتاج إلى رسالة عادية (هاتف، إنترنت)، وهي أبطأ من الضوء.

ما يمكنه فعله:
• الانتقال الكمومي (Teleportation): نقل حالة كيوبت إلى مكان آخر باستخدام زوج متشابك وبتين عاديين. وتُدمَّر حالة الكيوبت الأصلي أثناء ذلك، فلا يُنسَخ شيء ولا ينتقل شيء أسرع من الضوء.
• المفاتيح الآمنة: يمكن استخدام التشابك لتبادل مفاتيح سرية لا يستطيع المتنصت نسخها (في الدرس التالي).
• الحوسبة الكمومية: التشابك مكوّن أساسي في كثير من الخوارزميات الكمومية.

تنبيه: التشابك هشّ. فالضجيج من البيئة (فك التماسك) قد يدمّره، لذلك فإن إبقاء الكيوبتات متشابكة لفترات ومسافات طويلة تحدٍّ هندسي كبير.`,
        visualHint: "none",
      },
    ],
    faqs: [
      {
        question: "Can entanglement send information faster than light?",
        question_ar: "هل يمكن للتشابك إرسال معلومات أسرع من الضوء؟",
        answer: "No. Each person's own results look random, and you can't choose what you will get, so you can't encode a message. The correlation is only visible after both sides compare results using an ordinary message.",
        answer_ar: "لا. نتائج كل شخص وحده تبدو عشوائية ولا يمكنك اختيار ما ستحصل عليه، فلا تستطيع ترميز رسالة. لا تظهر الارتباطات إلا بعد أن يقارن الطرفان نتائجهما برسالة عادية.",
      },
      {
        question: "Does measuring one qubit instantly change the other?",
        question_ar: "هل يغيّر قياس أحد الكيوبتين الآخر فوراً؟",
        answer: "Physicists agree on what is observed: the two results are perfectly correlated, and no signal is sent. How to best describe what is \"really happening\" is debated and depends on the interpretation of quantum mechanics. A safe way to say it: the two qubits share one joint state, so their results match.",
        answer_ar: "يتفق الفيزيائيون على ما يُرصد: النتيجتان مترابطتان تماماً ولا تُرسَل أي إشارة. أما أفضل وصف لما يحدث \"فعلاً\" فمحل نقاش ويعتمد على تفسير ميكانيكا الكم. صياغة آمنة: الكيوبتان يتشاركان حالة واحدة، لذلك تتطابق نتيجتاهما.",
      },
      {
        question: "How is entanglement different from the glove example?",
        question_ar: "كيف يختلف التشابك عن مثال القفازات؟",
        answer: "With gloves, each one was a left or a right glove all along. Bell's analysis and many experiments show that entangled qubits, measured in different ways, give correlations that no \"decided in advance\" rule can reproduce.",
        answer_ar: "في القفازات كان كل قفاز أيسر أو أيمن طوال الوقت. أما تحليل بيل والتجارب الكثيرة فتبيّن أن الكيوبتات المتشابكة، عند قياسها بطرق مختلفة، تعطي ارتباطات لا يمكن لأي قاعدة \"محددة مسبقاً\" أن تعيد إنتاجها.",
      },
      {
        question: "Is entanglement fragile?",
        question_ar: "هل التشابك هشّ؟",
        answer: "Yes. Any unwanted interaction with the environment can destroy it. Building quantum networks and large quantum computers means protecting entanglement, or fixing errors when it gets damaged.",
        answer_ar: "نعم. أي تفاعل غير مرغوب فيه مع البيئة قد يدمّره. وبناء شبكات كمومية وحواسيب كمومية كبيرة يعني حماية التشابك، أو تصحيح الأخطاء عندما يتضرر.",
      },
    ],
    quiz: [
      {
        question: "Which steps create a Bell pair starting from |00⟩?",
        question_ar: "أي خطوات تنشئ زوج بيل بدءاً من |00⟩؟",
        options: [
          "X on qubit 0, then X on qubit 1",
          "H on qubit 0, then CNOT from qubit 0 to qubit 1",
          "A CNOT first, then measure both",
          "Z on both qubits",
        ],
        options_ar: [
          "X على الكيوبت 0 ثم X على الكيوبت 1",
          "H على الكيوبت 0 ثم CNOT من الكيوبت 0 إلى الكيوبت 1",
          "CNOT أولاً ثم قياس الاثنين",
          "Z على الكيوبتين",
        ],
        correctIndex: 1,
        explanation: "H puts qubit 0 into a 50/50 blend, then CNOT makes qubit 1 copy whatever qubit 0 is, giving (|00⟩ + |11⟩)/√2.",
        explanation_ar: "تضع H الكيوبت 0 في مزيج 50/50، ثم تجعل CNOT الكيوبت 1 يطابق الكيوبت 0 أياً كان، فتنتج (|00⟩ + |11⟩)/√2.",
      },
      {
        question: "You measure both qubits of the Bell pair (|00⟩ + |11⟩)/√2. Which results are possible?",
        question_ar: "تقيس كلا كيوبتي زوج بيل (|00⟩ + |11⟩)/√2. ما النتائج الممكنة؟",
        options: [
          "00, 01, 10 and 11, all equally likely",
          "Only 01 and 10",
          "Only 00",
          "00 or 11, each about half the time",
        ],
        options_ar: [
          "00 و01 و10 و11 بفرص متساوية",
          "01 و10 فقط",
          "00 فقط",
          "00 أو 11، كلٌّ منهما في نحو نصف المرات",
        ],
        correctIndex: 3,
        explanation: "Each qubit alone is random, but the two always match: the result is 00 or 11 with equal chance.",
        explanation_ar: "كل كيوبت وحده عشوائي، لكن النتيجتين تتطابقان دائماً: تكون النتيجة 00 أو 11 بفرصة متساوية.",
      },
      {
        question: "Why can't entanglement be used to send a message faster than light?",
        question_ar: "لماذا لا يمكن استخدام التشابك لإرسال رسالة أسرع من الضوء؟",
        options: [
          "Each side's own results look random; the link only shows when results are compared by an ordinary message",
          "The qubits are too slow",
          "Entanglement always breaks over long distances",
          "Nobody has built the right equipment yet",
        ],
        options_ar: [
          "نتائج كل طرف وحدها تبدو عشوائية؛ ولا يظهر الرابط إلا بمقارنة النتائج عبر رسالة عادية",
          "لأن الكيوبتات بطيئة جداً",
          "لأن التشابك ينكسر دائماً عبر المسافات الطويلة",
          "لأن أحداً لم يبنِ الأجهزة المناسبة بعد",
        ],
        correctIndex: 0,
        explanation: "You can't control which result you get, so you can't encode a message. The correlation only becomes visible when both sides compare notes the normal way.",
        explanation_ar: "لا يمكنك التحكم في النتيجة التي تحصل عليها، فلا يمكنك ترميز رسالة. ولا تظهر الارتباطات إلا عندما يقارن الطرفان ملاحظاتهما بالطريقة العادية.",
      },
      {
        question: "What did Bell's work and the experiments that followed show?",
        question_ar: "ماذا أظهر عمل بيل والتجارب التي تلته؟",
        options: [
          "Entangled particles talk to each other by radio",
          "Entanglement does not really exist",
          "The correlations can't be explained by results that were decided in advance, like gloves in boxes",
          "Qubits are larger than expected",
        ],
        options_ar: [
          "أن الجسيمات المتشابكة تتحدث بعضها مع بعض بالراديو",
          "أن التشابك غير موجود فعلاً",
          "أن الارتباطات لا يمكن تفسيرها بنتائج محددة مسبقاً، كقفازات في صناديق",
          "أن الكيوبتات أكبر مما كان متوقعاً",
        ],
        correctIndex: 2,
        explanation: "Bell tests rule out explanations where each particle carried a pre-decided answer, which is what makes entanglement different from ordinary correlation.",
        explanation_ar: "تستبعد اختبارات بيل التفسيرات التي يحمل فيها كل جسيم إجابة محددة مسبقاً، وهذا ما يميّز التشابك عن الارتباط العادي.",
      },
    ],
  },

  // ───────────────────────────── 4. CRYPTOGRAPHY ─────────────────────────────
  {
    id: "cryptography",
    title: "Cryptography",
    title_ar: "التشفير الكمومي",
    description: "How quantum computers threaten today's encryption, and two ways to defend: quantum key distribution and new math.",
    description_ar: "كيف تهدد الحواسيب الكمومية تشفير اليوم، وطريقتان للدفاع: توزيع المفاتيح الكمومي ورياضيات جديدة.",
    topics: ["Encryption basics", "Quantum key distribution", "Eavesdropping", "Post-quantum cryptography"],
    topics_ar: ["أساسيات التشفير", "توزيع المفاتيح الكمومي", "التنصت", "التشفير ما بعد الكمومي"],
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    dayIndex: 4,
    content: [
      {
        id: "cry-1",
        title: "Secrets and Why They're at Risk",
        title_ar: "الأسرار ولماذا هي معرّضة للخطر",
        body: `Encryption scrambles messages so only the right person can read them. It protects messages, passwords and online payments.

Much of today's internet security (RSA and similar systems) relies on a math problem that is easy to do in one direction and extremely hard to undo: multiplying two huge prime numbers is easy, but finding them again from the product (factoring) is not.

A large enough quantum computer running Shor's algorithm (Lesson 6) could do that factoring quickly, which would break these systems. Today's quantum computers are nowhere near that size.

Why worry now? Someone could record encrypted data today and decrypt it years later, once the technology exists ("harvest now, decrypt later"). So secrets that must stay secret for many years need protection early.

There are two main answers: use quantum physics to share keys safely (this lesson, part 2), or use new kinds of math that quantum computers are not known to break (part 3).`,
        body_ar: `يشوّش التشفير الرسائل بحيث لا يستطيع قراءتها إلا الشخص المقصود. وهو يحمي الرسائل وكلمات المرور والمدفوعات عبر الإنترنت.

يعتمد جزء كبير من أمن الإنترنت اليوم (نظام RSA وما يشبهه) على مسألة رياضية سهلة في اتجاه وصعبة جداً في الاتجاه المعاكس: ضرب عددين أوليين ضخمين سهل، لكن استرجاعهما من حاصل الضرب (التحليل إلى عوامل) ليس كذلك.

حاسوب كمومي كبير بما يكفي يشغّل خوارزمية شور (الدرس 6) يمكنه إجراء هذا التحليل بسرعة، مما يكسر هذه الأنظمة. والحواسيب الكمومية اليوم بعيدة جداً عن هذا الحجم.

لماذا القلق الآن؟ يمكن لأحدهم تسجيل بيانات مشفّرة اليوم وفكّ تشفيرها بعد سنوات حين تتوفر التقنية ("اجمع الآن وفكّ التشفير لاحقاً"). لذلك تحتاج الأسرار التي يجب أن تبقى سرية سنوات طويلة إلى حماية مبكرة.

هناك إجابتان رئيسيتان: استخدام فيزياء الكم لتبادل المفاتيح بأمان (الجزء 2 من هذا الدرس)، أو استخدام أنواع جديدة من الرياضيات لا يُعرف أن الحواسيب الكمومية تكسرها (الجزء 3).`,
        visualHint: "none",
      },
      {
        id: "cry-2",
        title: "Quantum Key Distribution (BB84, simplified)",
        title_ar: "توزيع المفاتيح الكمومي (BB84 مبسّطاً)",
        body: `Alice and Bob want a shared secret key (a random string of bits). BB84, invented by Bennett and Brassard in 1984, does it by sending single qubits.

The idea in plain steps:
1. Alice picks a random bit and a random way of preparing the qubit (call the two ways "+" and "×"), then sends the qubit.
2. Bob measures each qubit with a randomly chosen way, "+" or "×".
3. If Bob guessed the same way as Alice, he gets her bit. If he guessed differently, his result is random.
4. Alice and Bob announce publicly which way each one used, but not the bits. They keep only the positions where the ways matched. Those bits are the key.

What about a spy, Eve? She has to measure each qubit to learn the bit, and she has to guess the way too. When she guesses wrong (half the time), she disturbs the qubit, and some of Bob's bits will no longer match Alice's. On average about 1 in 4 of the bits they compare will disagree.

Alice and Bob compare a small sample of the key. If there are too many mismatches, they throw the key away. Eve can't just copy a qubit and send the original on, because quantum states can't be copied perfectly (the no-cloning theorem).`,
        body_ar: `تريد أليس وبوب مفتاحاً سرياً مشتركاً (سلسلة عشوائية من البتات). وبروتوكول BB84 الذي ابتكره بينيت وبراسار عام 1984 يفعل ذلك بإرسال كيوبتات مفردة.

الفكرة بخطوات بسيطة:
1. تختار أليس بتاً عشوائياً وطريقة عشوائية لتحضير الكيوبت (نسمّي الطريقتين "+" و"×") ثم ترسل الكيوبت.
2. يقيس بوب كل كيوبت بطريقة يختارها عشوائياً: "+" أو "×".
3. إذا خمّن بوب الطريقة نفسها التي استخدمتها أليس فإنه يحصل على بتّها. وإذا خمّن طريقة مختلفة تكون نتيجته عشوائية.
4. يعلن أليس وبوب علناً الطريقة التي استخدمها كل منهما لكل كيوبت، لكن دون البتات. ويحتفظان فقط بالمواضع التي تطابقت فيها الطريقتان. هذه البتات هي المفتاح.

وماذا عن جاسوس اسمه إيف؟ عليها أن تقيس كل كيوبت لتعرف البت، وعليها أن تخمّن الطريقة أيضاً. وعندما تخمّن خطأ (في نصف المرات) فإنها تزعج الكيوبت، فلا تعود بعض بتات بوب مطابقة لبتات أليس. وسطياً تختلف نحو 1 من كل 4 بتات يقارنانها.

يقارن أليس وبوب عينة صغيرة من المفتاح. فإذا كان عدد الأخطاء كبيراً يتخلصان من المفتاح. ولا تستطيع إيف ببساطة نسخ الكيوبت وإرسال الأصلي، لأن الحالات الكمومية لا يمكن نسخها بشكل مثالي (مبرهنة عدم الاستنساخ).`,
        visualHint: "none",
      },
      {
        id: "cry-3",
        title: "Post-Quantum Cryptography",
        title_ar: "التشفير ما بعد الكمومي",
        body: `Post-quantum cryptography (PQC) means new encryption methods that run on normal computers but are built on math problems that quantum computers are not known to solve quickly. No special quantum hardware is needed, so it can be rolled out on the internet we already have.

In August 2024 the US standards institute NIST published its first post-quantum standards:
• ML-KEM (based on Kyber) for sharing keys
• ML-DSA (based on Dilithium) and SLH-DSA (based on SPHINCS+) for digital signatures

More are on the way. Many organizations and some web browsers have already started switching, because of the "harvest now, decrypt later" risk.

Which is better, QKD or PQC? Quantum key distribution needs special hardware and has limited distance, so several national security agencies recommend PQC for everyday use. QKD is mostly used in research and special-purpose networks.`,
        body_ar: `التشفير ما بعد الكمومي (PQC) يعني طرق تشفير جديدة تعمل على حواسيب عادية لكنها مبنية على مسائل رياضية لا يُعرف أن الحواسيب الكمومية تحلّها بسرعة. ولا تحتاج إلى أجهزة كمومية خاصة، لذلك يمكن نشرها على الإنترنت الموجود أصلاً.

في أغسطس 2024 نشر المعهد الأمريكي للمعايير NIST أولى معاييره ما بعد الكمومية:
• ML-KEM (المبني على Kyber) لتبادل المفاتيح
• ML-DSA (المبني على Dilithium) وSLH-DSA (المبني على SPHINCS+) للتوقيعات الرقمية

وهناك معايير أخرى في الطريق. وقد بدأت جهات كثيرة وبعض المتصفحات بالانتقال فعلاً بسبب خطر "اجمع الآن وفكّ التشفير لاحقاً".

أيهما أفضل، QKD أم PQC؟ يحتاج توزيع المفاتيح الكمومي إلى أجهزة خاصة ومداه محدود، لذلك توصي عدة جهات أمن وطنية باستخدام PQC في الاستخدام اليومي. ويُستخدم QKD غالباً في الأبحاث والشبكات ذات الأغراض الخاصة.`,
        visualHint: "none",
      },
    ],
    faqs: [
      {
        question: "Is quantum key distribution used in the real world?",
        question_ar: "هل يُستخدم توزيع المفاتيح الكمومي في العالم الحقيقي؟",
        answer: "Yes, in pilot projects and some government and bank networks, including long fiber links and satellite experiments. But it needs special hardware, has distance limits and is expensive, so it is not used for ordinary internet traffic.",
        answer_ar: "نعم، في مشاريع تجريبية وبعض شبكات الحكومات والبنوك، بما فيها وصلات ألياف طويلة وتجارب بالأقمار الصناعية. لكنه يحتاج إلى أجهزة خاصة ومداه محدود وكلفته عالية، لذلك لا يُستخدم لحركة الإنترنت العادية.",
      },
      {
        question: "When will quantum computers break RSA?",
        question_ar: "متى ستكسر الحواسيب الكمومية تشفير RSA؟",
        answer: "Nobody knows. It would take far larger and more reliable machines than we have today. Recent research estimates that breaking 2048-bit RSA might need under a million noisy qubits running for about a week, which is still far beyond current hardware. Estimates keep changing, which is exactly why preparing early is recommended.",
        answer_ar: "لا أحد يعرف. سيحتاج الأمر إلى آلات أكبر بكثير وأكثر موثوقية مما لدينا اليوم. تقدّر أبحاث حديثة أن كسر RSA بطول 2048 بت قد يحتاج إلى أقل من مليون كيوبت مشوِّش تعمل نحو أسبوع، وهذا ما يزال أبعد بكثير من العتاد الحالي. والتقديرات تتغير باستمرار، ولهذا يُنصح بالاستعداد مبكراً.",
      },
      {
        question: "What does \"harvest now, decrypt later\" mean?",
        question_ar: "ما معنى \"اجمع الآن وفكّ التشفير لاحقاً\"؟",
        answer: "An attacker saves encrypted traffic today, even though they can't read it yet, and decrypts it years later with a future quantum computer. If your data must stay secret for 10+ years, it is already at risk.",
        answer_ar: "يحفظ المهاجم اليوم حركة بيانات مشفّرة رغم أنه لا يستطيع قراءتها الآن، ثم يفكّ تشفيرها بعد سنوات بحاسوب كمومي مستقبلي. فإذا كان لا بد أن تبقى بياناتك سرية أكثر من 10 سنوات فهي معرّضة للخطر الآن.",
      },
      {
        question: "Does quantum cryptography mean \"unbreakable\"?",
        question_ar: "هل يعني التشفير الكمومي أنه \"لا يمكن كسره\"؟",
        answer: "The protocol is secure in theory. Real devices can have flaws, such as imperfect detectors or lasers, and attackers have exploited such flaws in lab demonstrations. Security always depends on the implementation, not just the idea.",
        answer_ar: "البروتوكول آمن من الناحية النظرية. أما الأجهزة الحقيقية فقد يكون فيها عيوب، كأجهزة كشف أو ليزرات غير مثالية، وقد استغل مهاجمون عيوباً كهذه في عروض مخبرية. الأمن يعتمد دائماً على التنفيذ لا على الفكرة وحدها.",
      },
    ],
    quiz: [
      {
        question: "What could a large quantum computer running Shor's algorithm threaten?",
        question_ar: "ماذا يمكن أن يهدد حاسوب كمومي كبير يشغّل خوارزمية شور؟",
        options: [
          "Wi-Fi speeds",
          "Video quality",
          "Encryption such as RSA that relies on factoring",
          "Battery life",
        ],
        options_ar: [
          "سرعة الواي فاي",
          "جودة الفيديو",
          "تشفيراً مثل RSA يعتمد على تحليل الأعداد",
          "عمر البطارية",
        ],
        correctIndex: 2,
        explanation: "Shor's algorithm can factor large numbers efficiently, which would break encryption based on the difficulty of factoring.",
        explanation_ar: "تستطيع خوارزمية شور تحليل الأعداد الكبيرة بكفاءة، مما يكسر التشفير المعتمد على صعوبة التحليل.",
      },
      {
        question: "In BB84, why do Alice and Bob announce their measurement ways publicly?",
        question_ar: "في BB84، لماذا يعلن أليس وبوب طرق القياس علناً؟",
        options: [
          "To decide which positions to keep: only the matching ones become the key",
          "To tell Eve how to listen",
          "To reveal the key to everyone",
          "To make the process faster",
        ],
        options_ar: [
          "لتحديد المواضع التي يحتفظان بها: المتطابقة فقط تصبح المفتاح",
          "ليخبرا إيف كيف تتنصت",
          "ليكشفا المفتاح للجميع",
          "لتسريع العملية",
        ],
        correctIndex: 0,
        explanation: "They only reveal which way each of them used, not the bits. Positions with matching ways give identical bits, and those bits form the secret key.",
        explanation_ar: "يعلنان فقط الطريقة التي استخدمها كل منهما، وليس البتات. المواضع ذات الطريقتين المتطابقتين تعطي بتات متطابقة، وهذه البتات تكوّن المفتاح السري.",
      },
      {
        question: "If an eavesdropper measures the qubits on the way, what do Alice and Bob notice?",
        question_ar: "إذا قاس متنصت الكيوبتات في الطريق، ماذا يلاحظ أليس وبوب؟",
        options: [
          "Nothing at all",
          "The connection gets slower",
          "The qubits multiply",
          "More mismatches when they compare part of their key",
        ],
        options_ar: [
          "لا شيء إطلاقاً",
          "يصبح الاتصال أبطأ",
          "تتضاعف الكيوبتات",
          "عدداً أكبر من الاختلافات عند مقارنة جزء من مفتاحهما",
        ],
        correctIndex: 3,
        explanation: "Measuring disturbs the qubits, so some of Bob's bits no longer match Alice's. A high mismatch rate in the comparison reveals the spy.",
        explanation_ar: "القياس يزعج الكيوبتات، فلا تعود بعض بتات بوب مطابقة لبتات أليس. ونسبة الاختلاف العالية في المقارنة تكشف الجاسوس.",
      },
      {
        question: "What is post-quantum cryptography?",
        question_ar: "ما هو التشفير ما بعد الكمومي؟",
        options: [
          "Encryption that runs only on quantum computers",
          "New methods for normal computers designed to resist attacks from both normal and quantum computers",
          "Cryptography that uses only entanglement",
          "Encryption that stopped being used in 2024",
        ],
        options_ar: [
          "تشفير يعمل على الحواسيب الكمومية فقط",
          "طرق جديدة للحواسيب العادية مصمَّمة لتقاوم هجمات الحواسيب العادية والكمومية معاً",
          "تشفير يستخدم التشابك فقط",
          "تشفير توقف استخدامه عام 2024",
        ],
        correctIndex: 1,
        explanation: "PQC runs on ordinary hardware and is based on math problems that quantum computers are not known to solve quickly.",
        explanation_ar: "يعمل PQC على عتاد عادي ويعتمد على مسائل رياضية لا يُعرف أن الحواسيب الكمومية تحلّها بسرعة.",
      },
    ],
  },

  // ─────────────────────── 5. BIOCHEMISTRY & SIMULATION ───────────────────────
  {
    id: "biochemistry",
    title: "Biochemistry & Simulation",
    title_ar: "الكيمياء الحيوية والمحاكاة",
    description: "Why molecules are hard for normal computers to simulate, and how quantum computers might help chemistry and medicine one day.",
    description_ar: "لماذا يصعب على الحواسيب العادية محاكاة الجزيئات، وكيف قد تساعد الحواسيب الكمومية الكيمياء والطب يوماً ما.",
    topics: ["Molecules are quantum", "Drug discovery", "Catalysts", "Quantum + classical teamwork"],
    topics_ar: ["الجزيئات كمومية", "اكتشاف الأدوية", "المحفزات", "تعاون الكمومي والكلاسيكي"],
    difficulty: "Beginner",
    estimatedMinutes: 20,
    dayIndex: 5,
    content: [
      {
        id: "bio-1",
        title: "Why Are Molecules Hard to Simulate?",
        title_ar: "لماذا يصعب محاكاة الجزيئات؟",
        body: `Everything in chemistry comes from how electrons behave inside atoms and molecules, and electrons follow the rules of quantum physics.

To predict what a molecule will do (Will a drug stick to a protein? How does an enzyme work?), a computer has to keep track of the quantum state of all its electrons together.

That is the same problem you met in Lesson 2: the number of amplitudes doubles with each extra qubit's worth of state. Even a small molecule like caffeine has on the order of 10⁴⁸ possible states, far too many numbers to store exactly, even on the biggest supercomputer.

Chemists use clever approximations, and they work well for many molecules. But for some, such as certain catalysts, the approximations are not accurate enough.

In 1981 the physicist Richard Feynman suggested a different idea: since nature is quantum, build a computer out of quantum parts to simulate it. This was one of the first ideas for quantum computers.`,
        body_ar: `كل شيء في الكيمياء ينشأ من سلوك الإلكترونات داخل الذرات والجزيئات، والإلكترونات تتبع قواعد فيزياء الكم.

للتنبؤ بما سيفعله جزيء (هل سيلتصق الدواء ببروتين؟ كيف يعمل إنزيم؟) يجب على الحاسوب تتبّع الحالة الكمومية لجميع إلكتروناته معاً.

وهذه هي المشكلة نفسها التي رأيتها في الدرس 2: يتضاعف عدد السعات مع كل كيوبت إضافي من الحالة. وحتى جزيء صغير كالكافيين له ما يقارب 10⁴⁸ حالة ممكنة، وهي أعداد كثيرة جداً لا يمكن تخزينها بدقة حتى على أكبر حاسوب فائق.

يستخدم الكيميائيون تقريبات ذكية تنجح مع جزيئات كثيرة. لكنها في بعضها، كبعض المحفزات، لا تكون دقيقة بما يكفي.

وفي عام 1981 اقترح الفيزيائي ريتشارد فاينمان فكرة مختلفة: بما أن الطبيعة كمومية، فلنبنِ حاسوباً من أجزاء كمومية لمحاكاتها. كانت هذه من أولى أفكار الحواسيب الكمومية.`,
        visualHint: "none",
      },
      {
        id: "bio-2",
        title: "What Could Quantum Computers Help With?",
        title_ar: "فيمَ يمكن أن تساعد الحواسيب الكمومية؟",
        body: `Researchers hope accurate quantum simulation could help with:

• Drug discovery: predicting how strongly a candidate drug sticks to its target in the body, before spending years testing it in a lab.
• Catalysts and enzymes: designing better catalysts. For example, making fertilizer from nitrogen in the air (the Haber–Bosch process) uses around 1–2% of the world's energy, and a better catalyst could save a lot of it.
• Batteries and materials: understanding what happens inside new battery materials or solar cells.

Be realistic: these are goals, not results yet. Researchers run small experiments on quantum computers, but as of today they have not beaten the best classical methods on a chemistry problem that really matters. Check recent news for updates, because this field moves quickly.`,
        body_ar: `يأمل الباحثون أن تساعد المحاكاة الكمومية الدقيقة في:

• اكتشاف الأدوية: التنبؤ بمدى التصاق دواء مرشَّح بهدفه في الجسم، قبل إنفاق سنوات في اختباره بالمختبر.
• المحفزات والإنزيمات: تصميم محفزات أفضل. فمثلاً إنتاج السماد من نيتروجين الهواء (عملية هابر–بوش) يستهلك نحو 1–2% من طاقة العالم، ومحفز أفضل قد يوفر الكثير منها.
• البطاريات والمواد: فهم ما يحدث داخل مواد البطاريات والخلايا الشمسية الجديدة.

كن واقعياً: هذه أهداف وليست نتائج بعد. يجري الباحثون تجارب صغيرة على الحواسيب الكمومية، لكنها حتى اليوم لم تتفوق على أفضل الطرق الكلاسيكية في مسألة كيميائية ذات أهمية حقيقية. تابع الأخبار الحديثة، فهذا المجال يتطور بسرعة.`,
        visualHint: "none",
      },
      {
        id: "bio-3",
        title: "How Would It Work? A Team Effort",
        title_ar: "كيف سيعمل؟ جهد مشترك",
        body: `Near-term quantum computers are small and noisy, so researchers use a team approach with a quantum computer and a normal computer working together.

The idea, in simple steps:
1. The quantum computer prepares a guess for the molecule's state and measures its energy.
2. A normal computer reads the result and slightly adjusts the settings of the quantum circuit.
3. Repeat many times. Nature prefers low energy (like a ball rolling to the bottom of a valley), so the best guess is the one with the lowest energy.

This is like tuning a guitar: play a note, listen, adjust, repeat. The method is called the Variational Quantum Eigensolver (VQE), but you don't need to remember the name.

Because of noise, today's experiments are limited to very small molecules such as hydrogen (H₂). Simulating large, important molecules will need much bigger machines that correct their own errors.`,
        body_ar: `الحواسيب الكمومية القريبة المدى صغيرة ومشوِّشة، لذلك يستخدم الباحثون نهج الفريق: حاسوب كمومي وحاسوب عادي يعملان معاً.

الفكرة بخطوات بسيطة:
1. يحضّر الحاسوب الكمومي تخميناً لحالة الجزيء ويقيس طاقته.
2. يقرأ حاسوب عادي النتيجة ويعدّل قليلاً إعدادات الدائرة الكمومية.
3. تُكرَّر العملية مرات كثيرة. الطبيعة تفضّل الطاقة المنخفضة (كالكرة التي تتدحرج إلى قاع وادٍ)، فأفضل تخمين هو الذي له أقل طاقة.

هذا يشبه ضبط أوتار الغيتار: اعزف نغمة، واستمع، وعدّل، وكرّر. تُسمّى الطريقة المحلّل الكمومي التغيّري للقيم الذاتية (VQE)، لكن لا يلزمك حفظ الاسم.

وبسبب الضجيج تقتصر تجارب اليوم على جزيئات صغيرة جداً مثل الهيدروجين (H₂). أما محاكاة الجزيئات الكبيرة المهمة فتحتاج إلى آلات أكبر بكثير تصحّح أخطاءها بنفسها.`,
        visualHint: "none",
      },
    ],
    faqs: [
      {
        question: "Has a quantum computer discovered a new drug yet?",
        question_ar: "هل اكتشف حاسوب كمومي دواءً جديداً حتى الآن؟",
        answer: "No. Quantum computers are still too small and noisy for real drug discovery. Companies and universities are experimenting, mainly to be ready when the hardware improves.",
        answer_ar: "لا. ما تزال الحواسيب الكمومية صغيرة ومشوِّشة جداً لاكتشاف الأدوية فعلياً. تجري الشركات والجامعات تجارب بشكل رئيسي لتكون جاهزة حين يتحسن العتاد.",
      },
      {
        question: "Why not just use normal supercomputers?",
        question_ar: "لماذا لا نستخدم الحواسيب الفائقة العادية فقط؟",
        answer: "Scientists do, and they get excellent results with approximations (including AI methods). Quantum computers are only expected to help in the hard cases where those approximations break down.",
        answer_ar: "يفعل العلماء ذلك، ويحصلون على نتائج ممتازة بالتقريبات (ومنها طرق الذكاء الاصطناعي). ويُتوقع أن تفيد الحواسيب الكمومية فقط في الحالات الصعبة التي تفشل فيها تلك التقريبات.",
      },
      {
        question: "How long until quantum computers are useful for chemistry?",
        question_ar: "كم سيستغرق الأمر حتى تفيد الحواسيب الكمومية الكيمياء؟",
        answer: "Nobody can say for sure. Many experts think it needs error-corrected machines much larger than today's, which could take a decade or more. Progress in hardware and in smarter algorithms may shorten that.",
        answer_ar: "لا أحد يستطيع الجزم. يرى كثير من الخبراء أن الأمر يحتاج إلى آلات تصحّح أخطاءها وأكبر بكثير من اليوم، وقد يستغرق ذلك عقداً أو أكثر. وقد يختصر التقدم في العتاد وفي الخوارزميات الأذكى هذه المدة.",
      },
    ],
    quiz: [
      {
        question: "Why are molecules hard to simulate on a normal computer?",
        question_ar: "لماذا يصعب محاكاة الجزيئات على حاسوب عادي؟",
        options: [
          "Atoms are too small to see",
          "They move too fast",
          "Computers don't know any chemistry",
          "The number of quantum states grows extremely fast with the size of the molecule",
        ],
        options_ar: [
          "لأن الذرات أصغر من أن تُرى",
          "لأنها تتحرك بسرعة كبيرة",
          "لأن الحواسيب لا تعرف شيئاً عن الكيمياء",
          "لأن عدد الحالات الكمومية ينمو بسرعة هائلة مع حجم الجزيء",
        ],
        correctIndex: 3,
        explanation: "The state of a molecule's electrons needs exponentially many numbers to describe, so exact simulation quickly becomes impossible for normal computers.",
        explanation_ar: "تحتاج حالة إلكترونات الجزيء إلى عدد أسّي من الأرقام لوصفها، لذلك تصبح المحاكاة الدقيقة سريعاً مستحيلة على الحواسيب العادية.",
      },
      {
        question: "In the team approach, what does the normal computer do?",
        question_ar: "في نهج الفريق، ماذا يفعل الحاسوب العادي؟",
        options: [
          "It replaces the qubits",
          "It reads the results and adjusts the quantum circuit to improve the guess",
          "It builds the molecule",
          "It cools the quantum chip",
        ],
        options_ar: [
          "يحل محل الكيوبتات",
          "يقرأ النتائج ويعدّل الدائرة الكمومية لتحسين التخمين",
          "يصنع الجزيء",
          "يبرّد الشريحة الكمومية",
        ],
        correctIndex: 1,
        explanation: "The quantum computer measures the energy of a guess, and the normal computer tweaks the circuit's settings and tries again.",
        explanation_ar: "يقيس الحاسوب الكمومي طاقة تخمين ما، ثم يعدّل الحاسوب العادي إعدادات الدائرة ويحاول مجدداً.",
      },
      {
        question: "Which statement is true today?",
        question_ar: "أي عبارة صحيحة اليوم؟",
        options: [
          "Quantum computers are being tested on very small molecules but haven't yet beaten the best classical methods on a chemistry problem that matters",
          "Quantum computers have already designed many new medicines",
          "Classical computers can't simulate any molecules at all",
          "Chemists are not allowed to use quantum computers",
        ],
        options_ar: [
          "تُختبر الحواسيب الكمومية على جزيئات صغيرة جداً لكنها لم تتفوق بعد على أفضل الطرق الكلاسيكية في مسألة كيميائية مهمة",
          "صمّمت الحواسيب الكمومية بالفعل أدوية جديدة كثيرة",
          "لا تستطيع الحواسيب الكلاسيكية محاكاة أي جزيء إطلاقاً",
          "لا يُسمح للكيميائيين باستخدام الحواسيب الكمومية",
        ],
        correctIndex: 0,
        explanation: "The field is promising but still at an early stage. Today's quantum computers are small and noisy.",
        explanation_ar: "المجال واعد لكنه ما يزال في مرحلة مبكرة. فالحواسيب الكمومية اليوم صغيرة ومشوِّشة.",
      },
      {
        question: "Which physicist suggested in 1981 using quantum systems to simulate nature?",
        question_ar: "أي فيزيائي اقترح عام 1981 استخدام أنظمة كمومية لمحاكاة الطبيعة؟",
        options: ["Albert Einstein", "Niels Bohr", "Richard Feynman", "Alan Turing"],
        options_ar: ["ألبرت أينشتاين", "نيلز بور", "ريتشارد فاينمان", "آلان تورينغ"],
        correctIndex: 2,
        explanation: "Richard Feynman proposed that a computer built from quantum parts would be the natural way to simulate quantum nature.",
        explanation_ar: "اقترح ريتشارد فاينمان أن الحاسوب المبني من أجزاء كمومية هو الطريقة الطبيعية لمحاكاة الطبيعة الكمومية.",
      },
    ],
  },

  // ───────────────────────────── 6. ALGORITHMS ─────────────────────────────
  {
    id: "algorithms",
    title: "Algorithms",
    title_ar: "الخوارزميات الكمومية",
    description: "What makes an algorithm quantum? Meet Grover's search and Shor's factoring, and learn what quantum computers are really good for.",
    description_ar: "ما الذي يجعل الخوارزمية كمومية؟ تعرّف على بحث غروفر وتحليل شور، وما الذي تجيده الحواسيب الكمومية فعلاً.",
    topics: ["Interference at work", "Grover's search", "Shor's algorithm", "The big picture"],
    topics_ar: ["التداخل أثناء العمل", "بحث غروفر", "خوارزمية شور", "الصورة الكبيرة"],
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    dayIndex: 6,
    isFinalDay: true,
    content: [
      {
        id: "alg-1",
        title: "What Makes an Algorithm Quantum?",
        title_ar: "ما الذي يجعل الخوارزمية كمومية؟",
        body: `A quantum algorithm follows a pattern you already know from the earlier lessons:

1. Start the qubits in a simple state and use gates like H to create a superposition.
2. Use more gates (often with entanglement) so that the amplitudes interfere: wrong answers cancel, the right answer adds up.
3. Measure. If the circuit was designed well, the right answer shows up with high probability.

Quantum computers are not faster at everything. The size of the speedup depends on the problem:
• For many problems there is no known quantum speedup.
• For some, such as searching, the speedup is moderate (Grover's algorithm).
• For a few, such as factoring, the speedup is dramatic (Shor's algorithm).

Finding out which problems benefit is an active area of research.`,
        body_ar: `تتبع الخوارزمية الكمومية نمطاً تعرفه من الدروس السابقة:

1. ابدأ الكيوبتات من حالة بسيطة واستخدم بوابات مثل H لإنشاء تراكب.
2. استخدم بوابات أخرى (غالباً مع التشابك) بحيث تتداخل السعات: تلغي الإجابات الخاطئة بعضها وتتجمع الإجابة الصحيحة.
3. قِس. فإذا صُمِّمت الدائرة جيداً تظهر الإجابة الصحيحة باحتمال عالٍ.

الحواسيب الكمومية ليست أسرع في كل شيء. فحجم التسريع يعتمد على المسألة:
• في مسائل كثيرة لا يوجد تسريع كمومي معروف.
• في بعضها، كالبحث، يكون التسريع متوسطاً (خوارزمية غروفر).
• وفي قلة منها، كتحليل الأعداد، يكون التسريع كبيراً جداً (خوارزمية شور).

ومعرفة أي المسائل تستفيد من ذلك مجال بحث نشط.`,
        visualHint: "circuit",
      },
      {
        id: "alg-2",
        title: "Grover's Search",
        title_ar: "بحث غروفر",
        body: `Imagine a phone book with 1,000,000 names in random order, and you want to find one particular number. A normal computer has to check names one by one: about 500,000 checks on average.

Grover's algorithm (1996) needs only about 800 steps. In general, searching N items takes about √N steps instead of about N steps. This is called a quadratic speedup.

How it works, in simple terms:
1. Put all the possibilities into an equal superposition (H on every qubit).
2. Mark the right answer by flipping the sign of its amplitude. If you measured now, nothing would look different.
3. Run an "amplify" step that turns the sign flip into a larger amplitude for the right answer.
4. Repeat steps 2–3 about √N times, then measure.

Surprising detail: don't repeat too many times. Past the best point, the right answer's chance goes back down, like pushing a swing at the wrong moment.

Fun fact: with just 4 items (2 qubits), one round finds the right answer every time.`,
        body_ar: `تخيّل دليل هاتف فيه 1,000,000 اسم بترتيب عشوائي، وتريد العثور على رقم محدد. على الحاسوب العادي أن يفحص الأسماء واحداً واحداً: نحو 500,000 فحص في المتوسط.

أما خوارزمية غروفر (1996) فتحتاج إلى نحو 800 خطوة فقط. وبوجه عام فإن البحث في N عنصر يحتاج إلى نحو √N خطوة بدلاً من نحو N خطوة. وهذا يسمى تسريعاً تربيعياً.

كيف تعمل، ببساطة:
1. ضع كل الاحتمالات في تراكب متساوٍ (H على كل كيوبت).
2. علّم الإجابة الصحيحة بقلب إشارة سعتها. لو قست الآن فلن يبدو شيء مختلفاً.
3. نفّذ خطوة "تضخيم" تحوّل قلب الإشارة إلى سعة أكبر للإجابة الصحيحة.
4. كرّر الخطوتين 2–3 نحو √N مرة ثم قِس.

تفصيل مدهش: لا تكرر أكثر من اللازم. فبعد أفضل نقطة يعود احتمال الإجابة الصحيحة إلى الانخفاض، كمن يدفع أرجوحة في اللحظة الخاطئة.

معلومة طريفة: مع 4 عناصر فقط (كيوبتان) تجد جولة واحدة الإجابة الصحيحة في كل مرة.`,
        visualHint: "none",
      },
      {
        id: "alg-3",
        title: "Shor's Algorithm",
        title_ar: "خوارزمية شور",
        body: `Factoring means splitting a number into primes. For 15 it is easy: 3 × 5. For a number with 600 digits, the best known methods on normal computers would take an impossibly long time. That difficulty protects much of today's encryption (Lesson 4).

Shor's algorithm (1994) finds the factors with a quantum computer. The key idea: factoring can be turned into finding a hidden repeating pattern in a list of numbers. Quantum interference (using a tool called the Quantum Fourier Transform, which finds repeating patterns a bit like finding the pitch of a sound) is very good at that.

The speedup is dramatic: the time needed grows much more slowly with the size of the number than for the best known normal methods.

Status today: in 2001 a small quantum machine factored 15 = 3 × 5. Breaking real encryption needs huge, error-corrected quantum computers that do not exist yet. That is why the world is already moving to post-quantum cryptography.`,
        body_ar: `تحليل عدد إلى عوامله يعني تقسيمه إلى أعداد أولية. وهو سهل مع 15: ‏3 × 5. أما مع عدد من 600 رقم فإن أفضل الطرق المعروفة على الحواسيب العادية تستغرق وقتاً طويلاً لدرجة الاستحالة. وهذه الصعوبة تحمي جزءاً كبيراً من تشفير اليوم (الدرس 4).

تجد خوارزمية شور (1994) العوامل بحاسوب كمومي. الفكرة الأساسية: يمكن تحويل التحليل إلى إيجاد نمط متكرر مخفي في قائمة أعداد. والتداخل الكمومي (باستخدام أداة اسمها تحويل فورييه الكمومي، وهي تكتشف الأنماط المتكررة كما تكتشف طبقة الصوت) بارع جداً في ذلك.

التسريع كبير: يزداد الزمن اللازم مع حجم العدد ببطء أكبر بكثير مما في أفضل الطرق العادية المعروفة.

الوضع اليوم: في عام 2001 حلّلت آلة كمومية صغيرة العدد 15 = 3 × 5. أما كسر تشفير حقيقي فيحتاج إلى حواسيب كمومية ضخمة تصحّح أخطاءها وهي غير موجودة بعد. ولهذا يتجه العالم فعلاً نحو التشفير ما بعد الكمومي.`,
        visualHint: "none",
      },
      {
        id: "alg-4",
        title: "The Big Picture",
        title_ar: "الصورة الكبيرة",
        body: `Quantum computers are not expected to replace your laptop or phone. Think of them as specialized helpers, a bit like graphics cards (GPUs), that may one day speed up certain hard problems:
• simulating molecules and materials (Lesson 5)
• some search and optimization tasks
• breaking some kinds of encryption (and driving the move to safer encryption)

Being honest matters in this field: there is a lot of hype. A good habit is to ask "which problem, how much faster, compared with what, and on which hardware?" whenever you read a big claim.

Want to keep going? You can learn to write real quantum circuits for free with tools such as Qiskit and the IBM Quantum Learning website, and you don't need advanced physics to start.`,
        body_ar: `لا يُتوقع أن تحل الحواسيب الكمومية محل حاسوبك المحمول أو هاتفك. فكّر فيها كمساعدين متخصصين، أشبه بكروت الرسوميات (GPU)، قد يسرّعون يوماً ما مسائل صعبة معينة:
• محاكاة الجزيئات والمواد (الدرس 5)
• بعض مهام البحث والتحسين
• كسر بعض أنواع التشفير (ودفع الانتقال إلى تشفير أكثر أماناً)

الأمانة مهمة في هذا المجال: فيه الكثير من المبالغة. وعادة جيدة أن تسأل عند قراءة أي ادعاء كبير: "أي مسألة؟ وكم أسرع؟ مقارنة بماذا؟ وعلى أي عتاد؟"

تريد المتابعة؟ يمكنك تعلّم كتابة دوائر كمومية حقيقية مجاناً باستخدام أدوات مثل Qiskit وموقع IBM Quantum Learning، ولا تحتاج إلى فيزياء متقدمة للبدء.`,
        visualHint: "none",
      },
    ],
    faqs: [
      {
        question: "Are quantum speedups always huge?",
        question_ar: "هل التسريعات الكمومية دائماً كبيرة؟",
        answer: "No. Grover's search gives a quadratic speedup, Shor's factoring a dramatic one, and for many problems no speedup is known at all. Each problem has to be studied separately.",
        answer_ar: "لا. بحث غروفر يعطي تسريعاً تربيعياً، وتحليل شور تسريعاً كبيراً، وفي مسائل كثيرة لا يُعرف أي تسريع. ولا بد من دراسة كل مسألة على حدة.",
      },
      {
        question: "Can quantum computers solve the very hardest problems quickly?",
        question_ar: "هل تستطيع الحواسيب الكمومية حل أصعب المسائل بسرعة؟",
        answer: "Most experts believe not. The hardest known kinds of problems (called NP-complete) are not expected to become easy, even with a quantum computer. Quantum computers are expected to help with certain structured problems.",
        answer_ar: "يعتقد معظم الخبراء أنها لا تستطيع. فأصعب أنواع المسائل المعروفة (المسماة NP-كاملة) لا يُتوقع أن تصبح سهلة حتى بحاسوب كمومي. ويُتوقع أن تفيد الحواسيب الكمومية في مسائل منظَّمة معينة.",
      },
      {
        question: "Do I need to be a physicist to program a quantum computer?",
        question_ar: "هل أحتاج إلى أن أكون فيزيائياً لبرمجة حاسوب كمومي؟",
        answer: "No. Many people start with circuits, a bit of linear algebra and some Python. Free tools let you build and simulate circuits on your own laptop.",
        answer_ar: "لا. يبدأ كثيرون بالدوائر وقليل من الجبر الخطي وبعض لغة بايثون. وتتيح لك أدوات مجانية بناء الدوائر ومحاكاتها على حاسوبك المحمول.",
      },
    ],
    quiz: [
      {
        question: "Roughly how many steps does Grover's algorithm need to search 1,000,000 unsorted items?",
        question_ar: "كم خطوة تقريباً تحتاج خوارزمية غروفر للبحث في 1,000,000 عنصر غير مرتّب؟",
        options: ["1,000,000", "500,000", "About 800", "Just 1"],
        options_ar: ["1,000,000", "500,000", "نحو 800", "خطوة واحدة فقط"],
        correctIndex: 2,
        explanation: "Grover's algorithm needs about √N steps. The square root of 1,000,000 is 1,000, and the exact count is about 0.8 × 1,000 ≈ 800 steps.",
        explanation_ar: "تحتاج خوارزمية غروفر إلى نحو √N خطوة. والجذر التربيعي لـ 1,000,000 هو 1,000، والعدد الدقيق نحو 0.8 × 1,000 ≈ 800 خطوة.",
      },
      {
        question: "Which quantum algorithm threatens RSA encryption?",
        question_ar: "أي خوارزمية كمومية تهدد تشفير RSA؟",
        options: ["Shor's algorithm", "Grover's algorithm", "The BB84 protocol", "The Hadamard gate"],
        options_ar: ["خوارزمية شور", "خوارزمية غروفر", "بروتوكول BB84", "بوابة هادامار"],
        correctIndex: 0,
        explanation: "Shor's algorithm factors large numbers efficiently on a large enough quantum computer. BB84 is a key-sharing protocol, and H is just one gate.",
        explanation_ar: "تحلّل خوارزمية شور الأعداد الكبيرة بكفاءة على حاسوب كمومي كبير بما يكفي. أما BB84 فهو بروتوكول لتبادل المفاتيح، وH مجرد بوابة واحدة.",
      },
      {
        question: "What is the main trick behind quantum algorithms?",
        question_ar: "ما الحيلة الرئيسية وراء الخوارزميات الكمومية؟",
        options: [
          "Trying every answer at once and reading them all",
          "Running a faster clock",
          "Using more electricity",
          "Using interference so wrong answers cancel and the right answer adds up",
        ],
        options_ar: [
          "تجربة كل الإجابات دفعة واحدة وقراءتها جميعاً",
          "تشغيل ساعة أسرع",
          "استخدام كهرباء أكثر",
          "استخدام التداخل بحيث تلغي الإجابات الخاطئة بعضها وتتجمع الإجابة الصحيحة",
        ],
        correctIndex: 3,
        explanation: "A measurement only returns one result, so algorithms use interference to make the correct answer the most likely one.",
        explanation_ar: "القياس يعطي نتيجة واحدة فقط، لذلك تستخدم الخوارزميات التداخل لجعل الإجابة الصحيحة هي الأرجح.",
      },
      {
        question: "What role are quantum computers expected to play?",
        question_ar: "ما الدور المتوقع للحواسيب الكمومية؟",
        options: [
          "Replacing laptops and phones",
          "Specialized helpers for certain hard problems",
          "Running every app much faster",
          "Taking over the internet within a year",
        ],
        options_ar: [
          "الحلول محل الحواسيب المحمولة والهواتف",
          "مساعدات متخصصة في مسائل صعبة معينة",
          "تشغيل كل التطبيقات أسرع بكثير",
          "السيطرة على الإنترنت خلال عام",
        ],
        correctIndex: 1,
        explanation: "Quantum computers are expected to be specialized accelerators for particular problems, working alongside normal computers.",
        explanation_ar: "يُتوقع أن تكون الحواسيب الكمومية مسرّعات متخصصة لمسائل معينة، تعمل إلى جانب الحواسيب العادية.",
      },
    ],
  },
];

export function getLessonById(id: string): LessonModule | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getLessonForDay(day: number): LessonModule | undefined {
  return LESSONS.find((l) => l.dayIndex === day);
}

export const TOTAL_DAYS = LESSONS.length;

export function getCurrentDay(startDateISO: string): number {
  const start = new Date(startDateISO).setHours(0, 0, 0, 0);
  const now = new Date().setHours(0, 0, 0, 0);
  const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(Math.max(diffDays, 1), TOTAL_DAYS);
}

export function getProgramStartDate(): string | null {
  return localStorage.getItem("quantum_program_start");
}

export function setProgramStartDate(): string {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem("quantum_program_start", today);
  return today;
}
