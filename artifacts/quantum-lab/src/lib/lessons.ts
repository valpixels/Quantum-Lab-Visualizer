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
  {
    id: "qubits-intro",
    title: "Qubits",
    title_ar: "الكيوبتات",
    description: "What is a qubit? How does it differ from a classical bit, and how do we visualize quantum states?",
    description_ar: "ما هو الكيوبت؟ كيف يختلف عن البت الكلاسيكي، وكيف نُصوِّر الحالات الكمومية؟",
    topics: ["Superposition", "Bloch Sphere", "State vectors", "Measurement"],
    topics_ar: ["التراكب الكمومي", "كرة بلوخ", "متجهات الحالة", "القياس"],
    difficulty: "Beginner",
    estimatedMinutes: 20,
    dayIndex: 1,
    content: [
      {
        id: "q1-1",
        title: "What is a Qubit?",
        title_ar: "ما هو الكيوبت؟",
        body: `A classical bit can only be 0 or 1. A qubit, however, can exist in a superposition of both states simultaneously.

Mathematically:

|ψ⟩ = α|0⟩ + β|1⟩

where α and β are complex amplitudes satisfying |α|² + |β|² = 1.

When we measure a qubit, it collapses to either |0⟩ with probability |α|² or |1⟩ with probability |β|².`,
        body_ar: `البت الكلاسيكي لا يمكنه أن يكون إلا 0 أو 1. أما الكيوبت، فيمكنه الوجود في تراكب من الحالتين معاً في آنٍ واحد.

رياضياً:

|ψ⟩ = α|0⟩ + β|1⟩

حيث α وβ معاملات مركبة تستوفي الشرط: |α|² + |β|² = 1

عند قياس الكيوبت، يتفكك إما إلى |0⟩ باحتمال |α|²، أو إلى |1⟩ باحتمال |β|².`,
        visualHint: "bloch",
        blochState: { theta: 0, phi: 0 },
      },
      {
        id: "q1-2",
        title: "The Bloch Sphere",
        title_ar: "كرة بلوخ",
        body: `The Bloch sphere is a geometric representation of the pure state space of a qubit. Any qubit state can be mapped to a point on the sphere:

|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩

• North pole (θ=0): |0⟩ state
• South pole (θ=π): |1⟩ state
• Equator: Equal superposition states (like |+⟩ and |-⟩)

Interact with the Bloch sphere to explore different quantum states!`,
        body_ar: `كرة بلوخ هي تمثيل هندسي لفضاء الحالات النقية للكيوبت. يمكن رسم أي حالة كيوبت على نقطة على الكرة:

|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩

• القطب الشمالي (θ=0): الحالة |0⟩
• القطب الجنوبي (θ=π): الحالة |1⟩
• خط الاستواء: حالات التراكب المتساوي (مثل |+⟩ و|-⟩)

تفاعل مع كرة بلوخ لاستكشاف حالات كمومية مختلفة!`,
        visualHint: "bloch",
        blochState: { theta: Math.PI / 2, phi: 0 },
      },
      {
        id: "q1-3",
        title: "Common Qubit States",
        title_ar: "حالات الكيوبت الشائعة",
        body: `Key states on the Bloch sphere:

|+⟩ = (|0⟩ + |1⟩)/√2  — +X axis  (θ=π/2, φ=0)
|-⟩ = (|0⟩ - |1⟩)/√2  — -X axis  (θ=π/2, φ=π)
|i⟩ = (|0⟩ + i|1⟩)/√2 — +Y axis  (θ=π/2, φ=π/2)

These are the eigenstates of the Pauli X and Y operators.`,
        body_ar: `الحالات الرئيسية على كرة بلوخ:

|+⟩ = (|0⟩ + |1⟩)/√2  — محور +X  (θ=π/2, φ=0)
|-⟩ = (|0⟩ - |1⟩)/√2  — محور -X  (θ=π/2, φ=π)
|i⟩ = (|0⟩ + i|1⟩)/√2 — محور +Y  (θ=π/2, φ=π/2)

هذه هي الحالات الذاتية لمشغلَي باولي X وY.`,
        visualHint: "bloch",
        blochState: { theta: Math.PI / 2, phi: Math.PI / 2 },
      },
    ],
    faqs: [
      {
        question: "Why can't we just say a qubit is 'both 0 and 1 at the same time'?",
        question_ar: "لماذا لا يمكننا القول إن الكيوبت هو '0 و1 في آنٍ واحد'؟",
        answer: "That's a common simplification, but it's misleading. A qubit in superposition is not simultaneously 0 AND 1 — it's in a mathematical combination of states with specific amplitudes. When measured, it gives a definite result according to those probabilities. The 'both at once' description misses the phase information that makes quantum computing powerful.",
        answer_ar: "هذا تبسيط شائع، لكنه مضلل. الكيوبت في التراكب ليس 0 و1 في آنٍ واحد — بل هو في تركيبة رياضية من الحالتين بمعاملات محددة. عند القياس، يعطي نتيجة محددة وفق تلك الاحتمالات. وصف 'الاثنين معاً' يُغفل معلومات الطور التي تجعل الحوسبة الكمومية قوية.",
      },
      {
        question: "Can I observe a qubit in superposition without collapsing it?",
        question_ar: "هل يمكنني مراقبة كيوبت في التراكب دون أن أتسبب في تفككه؟",
        answer: "No — any interaction that gains information about which state a qubit is in will cause collapse. This is the measurement problem in quantum mechanics. Sophisticated techniques like quantum error correction work around this, but they can't avoid it fundamentally.",
        answer_ar: "لا — أي تفاعل يكتسب معلومات عن حالة الكيوبت سيؤدي إلى تفككه. هذه هي إشكالية القياس في ميكانيكا الكم. تقنيات متطورة مثل تصحيح الأخطاء الكمومية تتحايل على هذا، لكنها لا تتجنبه بشكل جذري.",
      },
      {
        question: "How is a qubit physically implemented?",
        question_ar: "كيف يُنفَّذ الكيوبت فيزيائياً؟",
        answer: "There are many physical implementations: superconducting circuits (IBM, Google), trapped ions (IonQ, Honeywell), photonic qubits, nitrogen-vacancy centres in diamond, and topological qubits (Microsoft). Each has different trade-offs in coherence time, gate fidelity, and scalability.",
        answer_ar: "هناك تطبيقات فيزيائية عديدة: الدوائر فائقة التوصيل (IBM، Google)، الأيونات المحصورة (IonQ، Honeywell)، الكيوبتات الضوئية، مراكز النيتروجين-الفراغ في الماس، والكيوبتات الطوبولوجية (Microsoft). لكل منها مقايضات مختلفة في زمن التماسك ودقة البوابات والقابلية للتوسع.",
      },
      {
        question: "What is decoherence?",
        question_ar: "ما هو فك التماسك؟",
        answer: "Decoherence is when a qubit's quantum state becomes entangled with the environment, causing it to lose its quantum properties and behave classically. It's the main challenge in building practical quantum computers. Current qubit coherence times range from microseconds to milliseconds.",
        answer_ar: "فك التماسك هو عندما تتشابك الحالة الكمومية للكيوبت مع البيئة المحيطة، مما يجعله يفقد خصائصه الكمومية ويتصرف بشكل كلاسيكي. إنه التحدي الرئيسي في بناء حاسبات كمومية عملية. تتراوح أزمنة تماسك الكيوبتات الحالية من ميكروثوانٍ إلى مللي ثوانٍ.",
      },
    ],
    quiz: [
      {
        question: "What happens to a qubit when you measure it?",
        question_ar: "ماذا يحدث للكيوبت عند قياسه؟",
        options: ["It stays in superposition", "It collapses to either |0⟩ or |1⟩", "It becomes two bits", "Nothing changes"],
        options_ar: ["يبقى في التراكب", "يتفكك إلى |0⟩ أو |1⟩", "يصبح بتين", "لا شيء يتغير"],
        correctIndex: 1,
        explanation: "Measurement causes the qubit to collapse from its superposition state to a definite classical outcome — either 0 or 1 — with probabilities determined by its amplitudes.",
        explanation_ar: "يؤدي القياس إلى تفكك الكيوبت من حالة التراكب إلى نتيجة كلاسيكية محددة — إما 0 أو 1 — باحتمالات تحددها معاملاته.",
      },
      {
        question: "Where on the Bloch sphere is the |0⟩ state located?",
        question_ar: "أين تقع الحالة |0⟩ على كرة بلوخ؟",
        options: ["South pole", "Equator", "North pole", "Origin"],
        options_ar: ["القطب الجنوبي", "خط الاستواء", "القطب الشمالي", "المركز"],
        correctIndex: 2,
        explanation: "The |0⟩ state corresponds to θ=0, which places it at the north pole of the Bloch sphere.",
        explanation_ar: "تقابل الحالة |0⟩ الزاوية θ=0، مما يضعها عند القطب الشمالي لكرة بلوخ.",
      },
      {
        question: "For a qubit |ψ⟩ = α|0⟩ + β|1⟩, what constraint must α and β satisfy?",
        question_ar: "في الكيوبت |ψ⟩ = α|0⟩ + β|1⟩، ما الشرط الواجب توافره في α وβ؟",
        options: ["α + β = 1", "|α|² + |β|² = 1", "α = β", "α · β = 0"],
        options_ar: ["α + β = 1", "|α|² + |β|² = 1", "α = β", "α · β = 0"],
        correctIndex: 1,
        explanation: "The normalization constraint requires |α|² + |β|² = 1, ensuring that measurement probabilities sum to 1.",
        explanation_ar: "تشترط قيد التسوية أن يكون |α|² + |β|² = 1، لضمان أن مجموع احتمالات القياس يساوي 1.",
      },
    ],
  },
  {
    id: "superposition",
    title: "Superposition",
    title_ar: "التراكب الكمومي",
    description: "Deep dive into quantum superposition — what it means mathematically and why it's a computational resource.",
    description_ar: "غوص عميق في التراكب الكمومي — ما معناه رياضياً ولماذا يُعدّ مورداً حسابياً.",
    topics: ["Wave functions", "Interference", "Quantum parallelism"],
    topics_ar: ["دوال الموجة", "التداخل", "التوازي الكمومي"],
    difficulty: "Beginner",
    estimatedMinutes: 25,
    dayIndex: 2,
    content: [
      {
        id: "sup-1",
        title: "The Principle of Superposition",
        title_ar: "مبدأ التراكب",
        body: `Superposition is one of the core principles of quantum mechanics. Unlike classical systems, quantum systems can exist in a linear combination of multiple states simultaneously.

For a single qubit:
|ψ⟩ = α|0⟩ + β|1⟩

For two qubits, superposition over 4 states:
|ψ⟩ = α|00⟩ + β|01⟩ + γ|10⟩ + δ|11⟩

For n qubits: superposition over 2ⁿ states simultaneously!`,
        body_ar: `التراكب هو أحد المبادئ الجوهرية لميكانيكا الكم. على عكس الأنظمة الكلاسيكية، يمكن للأنظمة الكمومية أن تتواجد في تركيبة خطية من حالات متعددة في آنٍ واحد.

لكيوبت واحد:
|ψ⟩ = α|0⟩ + β|1⟩

لكيوبتين، التراكب على 4 حالات:
|ψ⟩ = α|00⟩ + β|01⟩ + γ|10⟩ + δ|11⟩

لـ n كيوبت: التراكب على 2ⁿ حالة في آنٍ واحد!`,
        visualHint: "bloch",
        blochState: { theta: Math.PI / 2, phi: 0 },
      },
      {
        id: "sup-2",
        title: "Interference",
        title_ar: "التداخل",
        body: `Superposition enables quantum interference — amplitudes can add constructively (making outcomes more likely) or destructively (making outcomes less likely).

This is analogous to wave interference in physics. Quantum algorithms exploit interference to amplify the probability of correct answers and suppress wrong answers.

The Hadamard gate creates equal superposition: H|0⟩ = (|0⟩ + |1⟩)/√2

Applying H twice: H(H|0⟩) = |0⟩ — the amplitudes interfere perfectly back to the start.`,
        body_ar: `يُتيح التراكب التداخل الكمومي — يمكن للمعاملات أن تتراكم بشكل بنّاء (مما يجعل النتائج أكثر احتمالاً) أو مدمِّر (مما يجعلها أقل احتمالاً).

هذا مشابه لتداخل الأمواج في الفيزياء. تستغل الخوارزميات الكمومية التداخل لتضخيم احتمال الإجابات الصحيحة وإخماد الإجابات الخاطئة.

بوابة هادامار تخلق تراكباً متساوياً: H|0⟩ = (|0⟩ + |1⟩)/√2

تطبيق H مرتين: H(H|0⟩) = |0⟩ — تتداخل المعاملات لتعود إلى نقطة البداية.`,
        visualHint: "circuit",
      },
      {
        id: "sup-3",
        title: "Quantum Parallelism",
        title_ar: "التوازي الكمومي",
        body: `Because n qubits can be in superposition of 2ⁿ states, a quantum computer can evaluate a function on all 2ⁿ inputs simultaneously — quantum parallelism.

However, measurement collapses this to just one answer. The trick of quantum algorithms is to engineer interference so the desired answer has high probability when measured.

10 qubits → 1,024 parallel computations
50 qubits → over 10¹⁵ parallel computations
300 qubits → more states than atoms in the observable universe!`,
        body_ar: `لأن n كيوبت يمكنها أن تكون في تراكب من 2ⁿ حالة، يمكن للحاسوب الكمومي تقييم دالة على جميع 2ⁿ مدخلات في آنٍ واحد — التوازي الكمومي.

لكن القياس يُفكك هذا إلى إجابة واحدة فقط. حيلة الخوارزميات الكمومية هي هندسة التداخل بحيث تكون الإجابة المطلوبة ذات احتمال عالٍ عند القياس.

10 كيوبت → 1,024 عملية حسابية متوازية
50 كيوبت → أكثر من 10¹⁵ عملية متوازية
300 كيوبت → حالات أكثر من ذرات الكون المرئي!`,
        visualHint: "none",
      },
    ],
    faqs: [
      {
        question: "Is superposition the same as randomness?",
        question_ar: "هل التراكب هو نفسه العشوائية؟",
        answer: "No — superposition is fundamentally different from classical randomness. A coin that we haven't looked at is definitely either heads or tails; we just don't know which. A qubit in superposition is genuinely neither — it doesn't have a definite value until measured.",
        answer_ar: "لا — التراكب مختلف جوهرياً عن العشوائية الكلاسيكية. عملة لم ننظر إليها هي بالتأكيد إما وجه أو ظهر؛ نحن فقط لا نعلم. أما الكيوبت في التراكب فليس لديه قيمة محددة حقاً قبل القياس.",
      },
      {
        question: "Can macroscopic objects be in superposition?",
        question_ar: "هل يمكن للأجسام الكبيرة أن تكون في تراكب؟",
        answer: "In principle, yes — quantum mechanics applies to all matter. However, large objects interact with so many environmental particles that decoherence happens almost instantaneously. Schrödinger's cat was a thought experiment to highlight this paradox.",
        answer_ar: "من حيث المبدأ، نعم — تنطبق ميكانيكا الكم على كل المادة. لكن الأجسام الكبيرة تتفاعل مع الكثير من جسيمات البيئة لدرجة أن فك التماسك يحدث بشكل فوري تقريباً. قطة شرودنغر كانت تجربة فكرية لتسليط الضوء على هذه المفارقة.",
      },
      {
        question: "Does quantum parallelism mean quantum computers are always faster?",
        question_ar: "هل يعني التوازي الكمومي أن الحواسيب الكمومية دائماً أسرع؟",
        answer: "No — quantum parallelism is not 'free'. Because measurement collapses superposition to one outcome, you need clever algorithms that use interference. Not all problems benefit from this. Quantum computers have specific advantages for certain problem types.",
        answer_ar: "لا — التوازي الكمومي ليس 'مجانياً'. لأن القياس يُفكك التراكب إلى نتيجة واحدة، تحتاج إلى خوارزميات ذكية تستخدم التداخل. لا تستفيد جميع المسائل من هذا. للحواسيب الكمومية مزايا محددة لأنواع معينة من المسائل.",
      },
    ],
    quiz: [
      {
        question: "What does the Hadamard gate do to |0⟩?",
        question_ar: "ماذا تفعل بوابة هادامار بالحالة |0⟩؟",
        options: ["Leaves it unchanged", "Flips it to |1⟩", "Creates equal superposition (|0⟩ + |1⟩)/√2", "Applies a phase shift"],
        options_ar: ["تتركها دون تغيير", "تقلبها إلى |1⟩", "تخلق تراكباً متساوياً (|0⟩ + |1⟩)/√2", "تطبق إزاحة طور"],
        correctIndex: 2,
        explanation: "The Hadamard gate H creates an equal superposition: H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩",
        explanation_ar: "بوابة هادامار H تخلق تراكباً متساوياً: H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩",
      },
      {
        question: "How many states can 8 qubits be in superposition over?",
        question_ar: "على كم حالة يمكن لـ 8 كيوبتات أن تكون في تراكب؟",
        options: ["8", "16", "64", "256"],
        options_ar: ["8", "16", "64", "256"],
        correctIndex: 3,
        explanation: "n qubits can be in superposition of 2ⁿ states. 2⁸ = 256 states.",
        explanation_ar: "يمكن لـ n كيوبت أن تكون في تراكب من 2ⁿ حالة. 2⁸ = 256 حالة.",
      },
    ],
  },
  {
    id: "entanglement",
    title: "Entanglement",
    title_ar: "التشابك الكمومي",
    description: "Explore quantum entanglement — Einstein's 'spooky action at a distance' and its role in quantum computing.",
    description_ar: "استكشف التشابك الكمومي — 'الفعل الشبحي عن بُعد' لأينشتاين ودوره في الحوسبة الكمومية.",
    topics: ["Bell states", "EPR pairs", "Non-locality", "Teleportation"],
    topics_ar: ["حالات بيل", "أزواج EPR", "اللامحلية", "الإرسال الكمومي"],
    difficulty: "Intermediate",
    estimatedMinutes: 30,
    dayIndex: 3,
    content: [
      {
        id: "ent-1",
        title: "What is Entanglement?",
        title_ar: "ما هو التشابك الكمومي؟",
        body: `Quantum entanglement occurs when two or more qubits become correlated such that the state of each cannot be described independently — even when separated by large distances.

Einstein called it 'spooky action at a distance.' Unlike classical correlations, entanglement involves genuine quantum correlations that violate Bell inequalities.

To create entanglement:
1. Apply H to qubit 0 → superposition
2. Apply CNOT with qubit 0 as control → entanglement!`,
        body_ar: `يحدث التشابك الكمومي عندما يصبح كيوبتان أو أكثر مترابطَين بحيث لا يمكن وصف حالة كل منهما بشكل مستقل — حتى عند فصلهما بمسافات كبيرة.

أسماه أينشتاين 'الفعل الشبحي عن بُعد.' على عكس الارتباطات الكلاسيكية، يتضمن التشابك ارتباطات كمومية حقيقية تنتهك متراجحات بيل.

لإنشاء التشابك:
1. طبّق H على الكيوبت 0 ← تراكب
2. طبّق CNOT مع الكيوبت 0 كمتحكم ← تشابك!`,
        visualHint: "circuit",
      },
      {
        id: "ent-2",
        title: "Bell States",
        title_ar: "حالات بيل",
        body: `The four maximally entangled two-qubit Bell states:

|Φ+⟩ = (|00⟩ + |11⟩)/√2
|Φ-⟩ = (|00⟩ - |11⟩)/√2
|Ψ+⟩ = (|01⟩ + |10⟩)/√2
|Ψ-⟩ = (|01⟩ - |10⟩)/√2

If two particles share |Φ+⟩ and you measure one as 0, the other instantly becomes 0 — regardless of distance. This cannot be used for faster-than-light communication (no-communication theorem).`,
        body_ar: `حالات بيل الأربع لكيوبتين متشابكتين بالكامل:

|Φ+⟩ = (|00⟩ + |11⟩)/√2
|Φ-⟩ = (|00⟩ - |11⟩)/√2
|Ψ+⟩ = (|01⟩ + |10⟩)/√2
|Ψ-⟩ = (|01⟩ - |10⟩)/√2

إذا اشترك جسيمان في |Φ+⟩ وقِست أحدهما فوجدته 0، يصبح الآخر 0 فوراً — بغض النظر عن المسافة. لا يمكن استخدام هذا لإرسال معلومات أسرع من الضوء (مبرهنة عدم التواصل).`,
        visualHint: "circuit",
      },
      {
        id: "ent-3",
        title: "Quantum Teleportation",
        title_ar: "الإرسال الكمومي",
        body: `Quantum teleportation transfers a quantum state using entanglement + classical communication:

1. Alice and Bob share a Bell pair
2. Alice performs a Bell measurement on her unknown state |ψ⟩ and her half of the pair
3. Alice sends 2 classical bits to Bob
4. Bob applies corrections to his qubit
5. Bob's qubit is now in state |ψ⟩

Note: The original state is destroyed (no-cloning theorem). Teleportation is not faster than light — it requires classical communication.`,
        body_ar: `يُنقل الإرسال الكمومي حالة كمومية باستخدام التشابك + الاتصال الكلاسيكي:

1. تشترك أليس وبوب في زوج بيل
2. تجري أليس قياس بيل على حالتها المجهولة |ψ⟩ ونصفها من الزوج
3. ترسل أليس 2 بت كلاسيكي إلى بوب
4. يطبق بوب تصحيحات على كيوبته
5. كيوبت بوب الآن في الحالة |ψ⟩

ملاحظة: تُدمَّر الحالة الأصلية (مبرهنة عدم الاستنساخ). الإرسال الكمومي ليس أسرع من الضوء — يتطلب اتصالاً كلاسيكياً.`,
        visualHint: "none",
      },
    ],
    faqs: [
      {
        question: "Can entanglement be used to send information faster than light?",
        question_ar: "هل يمكن استخدام التشابك لإرسال معلومات أسرع من الضوء؟",
        answer: "No. While measuring one entangled particle instantly affects the other, the outcome is random — you cannot control it to encode a message. To convey the outcome, you need classical communication. This is the no-communication theorem.",
        answer_ar: "لا. رغم أن قياس أحد الجسيمين المتشابكين يؤثر على الآخر فوراً، فإن النتيجة عشوائية — لا يمكنك التحكم فيها لتشفير رسالة. لنقل النتيجة تحتاج إلى اتصال كلاسيكي. هذه هي مبرهنة عدم التواصل.",
      },
      {
        question: "Is entanglement fragile?",
        question_ar: "هل التشابك هش؟",
        answer: "Yes — entanglement is very fragile. Any interaction with the environment (decoherence) can destroy it. Maintaining entanglement between distant qubits is a major engineering challenge and is central to building quantum networks.",
        answer_ar: "نعم — التشابك هش جداً. أي تفاعل مع البيئة (فك التماسك) يمكنه تدميره. الحفاظ على التشابك بين كيوبتات بعيدة يمثل تحدياً هندسياً رئيسياً وهو محور بناء الشبكات الكمومية.",
      },
      {
        question: "What's the difference between entanglement and classical correlation?",
        question_ar: "ما الفرق بين التشابك والارتباط الكلاسيكي؟",
        answer: "Classical correlations exist before measurement (like pre-paired gloves). Quantum entanglement is different: neither particle has a definite value before measurement. The correlations are stronger than any classical hidden-variable theory allows — proven by Bell inequality violations.",
        answer_ar: "الارتباطات الكلاسيكية موجودة قبل القياس (كالقفازات المتطابقة). التشابك الكمومي مختلف: لا يملك أيٌّ من الجسيمين قيمة محددة قبل القياس. الارتباطات أقوى مما تسمح به أي نظرية متغيرات خفية كلاسيكية — وهذا ثبت بانتهاكات متراجحات بيل.",
      },
    ],
    quiz: [
      {
        question: "Which circuit creates a Bell state from |00⟩?",
        question_ar: "أي دائرة تخلق حالة بيل من |00⟩؟",
        options: ["Two X gates", "H gate on qubit 0, then CNOT", "Two CNOT gates", "A single Z gate"],
        options_ar: ["بوابتا X", "بوابة H على الكيوبت 0 ثم CNOT", "بوابتا CNOT", "بوابة Z واحدة"],
        correctIndex: 1,
        explanation: "Applying H to qubit 0 creates superposition, then CNOT entangles the two qubits, producing (|00⟩ + |11⟩)/√2.",
        explanation_ar: "تطبيق H على الكيوبت 0 يخلق تراكباً، ثم CNOT يُشابك الكيوبتين، منتجاً (|00⟩ + |11⟩)/√2.",
      },
      {
        question: "What is true about entangled qubits when measured?",
        question_ar: "ما الصحيح بشأن الكيوبتات المتشابكة عند قياسها؟",
        options: ["They always give the same result independently", "Their outcomes are correlated in a way classical physics cannot explain", "Measuring one destroys the other", "They communicate faster than light"],
        options_ar: ["دائماً تعطي نفس النتيجة باستقلالية", "نتائجها مترابطة بطريقة لا تستطيع الفيزياء الكلاسيكية تفسيرها", "قياس أحدهما يدمر الآخر", "تتواصل أسرع من الضوء"],
        correctIndex: 1,
        explanation: "Entangled qubits show correlations that violate Bell inequalities — this cannot be explained by any classical hidden-variable theory.",
        explanation_ar: "تُظهر الكيوبتات المتشابكة ارتباطات تنتهك متراجحات بيل — لا يمكن تفسير هذا بأي نظرية متغيرات خفية كلاسيكية.",
      },
    ],
  },
  {
    id: "cryptography",
    title: "Cryptography",
    title_ar: "التشفير الكمومي",
    description: "How quantum mechanics enables unbreakable encryption and threatens classical cryptographic systems.",
    description_ar: "كيف تُتيح ميكانيكا الكم التشفير الذي لا يمكن كسره وتهدد أنظمة التشفير الكلاسيكية.",
    topics: ["BB84 protocol", "Quantum key distribution", "Post-quantum crypto", "Shor's threat"],
    topics_ar: ["بروتوكول BB84", "توزيع المفاتيح الكمومية", "التشفير ما بعد الكمومي", "تهديد شور"],
    difficulty: "Intermediate",
    estimatedMinutes: 35,
    dayIndex: 4,
    content: [
      {
        id: "cry-1",
        title: "Classical vs Quantum Cryptography",
        title_ar: "التشفير الكلاسيكي مقابل الكمومي",
        body: `Classical cryptography (RSA, ECC) relies on mathematical hardness — factoring large numbers or discrete logarithm problems. These are hard for classical computers but vulnerable to quantum computers via Shor's algorithm.

Quantum cryptography uses the laws of physics (rather than mathematical assumptions) to guarantee security.

With QKD, any eavesdropping attempt is physically detectable — it disturbs the quantum states being transmitted.`,
        body_ar: `يعتمد التشفير الكلاسيكي (RSA، ECC) على صعوبة رياضية — تحليل أعداد كبيرة إلى عواملها أو مسائل اللوغاريتم المنفصل. هذه صعبة على الحواسيب الكلاسيكية لكنها عرضة للحواسيب الكمومية عبر خوارزمية شور.

يستخدم التشفير الكمومي قوانين الفيزياء (بدلاً من الافتراضات الرياضية) لضمان الأمان.

مع QKD، أي محاولة تنصت قابلة للكشف فيزيائياً — فهي تُخلّ بالحالات الكمومية المُرسَلة.`,
        visualHint: "none",
      },
      {
        id: "cry-2",
        title: "BB84 Protocol",
        title_ar: "بروتوكول BB84",
        body: `BB84 (Bennett & Brassard, 1984) is the first and most famous QKD protocol:

1. Alice sends qubits in random bases (+/×) and random states
2. Bob measures in random bases
3. Alice and Bob publicly compare which bases they used
4. They keep only bits where they used matching bases → secret key
5. They sacrifice some bits to check for eavesdropping

If an eavesdropper intercepts, she must measure qubits (disturbing them) then re-send. This introduces errors Alice and Bob can detect.

Security is guaranteed by the no-cloning theorem.`,
        body_ar: `BB84 (بينيت وبراسار، 1984) هو أول بروتوكول QKD وأشهره:

1. ترسل أليس كيوبتات في أسس عشوائية (+/×) وحالات عشوائية
2. يقيس بوب في أسس عشوائية
3. تقارن أليس وبوب علناً الأسس المستخدمة
4. يحتفظان فقط بالبتات التي استخدما فيها أسساً متطابقة ← مفتاح سري
5. يُضحيان ببعض البتات للتحقق من وجود تنصت

إذا تدخل متنصت، يجب عليه قياس الكيوبتات (فيُخلّ بها) ثم إعادة إرسالها. هذا يُدخل أخطاء تستطيع أليس وبوب اكتشافها.

الأمان مضمون بمبرهنة عدم الاستنساخ.`,
        visualHint: "none",
      },
      {
        id: "cry-3",
        title: "Post-Quantum Cryptography",
        title_ar: "التشفير ما بعد الكمومي",
        body: `Shor's algorithm can break RSA and ECC on a powerful enough quantum computer. NIST finalized post-quantum standards in 2024:

• CRYSTALS-Kyber (key encapsulation)
• CRYSTALS-Dilithium (digital signatures)
• FALCON (signatures)

These classical algorithms are based on mathematical problems believed hard for both classical and quantum computers (e.g., lattice problems).

Organizations should begin migrating to post-quantum algorithms now — especially for long-lived secrets.`,
        body_ar: `يمكن لخوارزمية شور كسر RSA وECC على حاسوب كمومي قوي بما يكفي. أنجز NIST معايير ما بعد الكمومي في 2024:

• CRYSTALS-Kyber (تغليف المفاتيح)
• CRYSTALS-Dilithium (التوقيعات الرقمية)
• FALCON (التوقيعات)

هذه خوارزميات كلاسيكية مبنية على مسائل رياضية يُعتقد أنها صعبة على الحواسيب الكلاسيكية والكمومية معاً (مثل مسائل الشبكة الرياضية).

يجب على المؤسسات البدء بالانتقال إلى خوارزميات ما بعد الكمومي الآن — خاصة للأسرار طويلة الأمد.`,
        visualHint: "none",
      },
    ],
    faqs: [
      {
        question: "Is QKD being used today?",
        question_ar: "هل يُستخدم QKD اليوم؟",
        answer: "Yes — QKD systems exist commercially (Toshiba, ID Quantique, QuantumCTek). China operates a 2,000 km quantum backbone network. However, QKD has practical limitations: distance constraints, high cost, and requires dedicated hardware.",
        answer_ar: "نعم — أنظمة QKD موجودة تجارياً (توشيبا، ID Quantique، QuantumCTek). تشغّل الصين شبكة عمود فقري كمومية بطول 2,000 كم. لكن QKD له قيود عملية: قيود المسافة، التكلفة العالية، ويتطلب أجهزة متخصصة.",
      },
      {
        question: "When will quantum computers break RSA?",
        question_ar: "متى ستكسر الحواسيب الكمومية تشفير RSA؟",
        answer: "Current estimates suggest a quantum computer capable of breaking 2048-bit RSA would need millions of fault-tolerant qubits. Most experts estimate 10-20 years. Organizations handling long-lived secrets should be migrating to post-quantum cryptography now.",
        answer_ar: "تشير التقديرات الحالية إلى أن حاسوباً كمومياً قادراً على كسر RSA ذي 2048 بت سيحتاج ملايين الكيوبتات المتحملة للأخطاء. يُقدّر معظم الخبراء ذلك بـ 10-20 سنة. يجب على المؤسسات التي تتعامل مع أسرار طويلة الأمد الانتقال الآن.",
      },
      {
        question: "What is 'harvest now, decrypt later'?",
        question_ar: "ما المقصود بـ 'اجمع الآن وفكّ التشفير لاحقاً'؟",
        answer: "Adversaries may collect encrypted data today, store it, and decrypt it once quantum computers are powerful enough. If today's secrets need to remain secret for 10+ years, they're already at risk.",
        answer_ar: "قد يجمع الخصوم البيانات المشفرة اليوم ويخزنونها، ويفكون تشفيرها حالما تصبح الحواسيب الكمومية قوية بما يكفي. إذا كانت الأسرار الحالية بحاجة للبقاء سرية لأكثر من 10 سنوات، فهي معرضة للخطر بالفعل.",
      },
    ],
    quiz: [
      {
        question: "What guarantees the security of QKD?",
        question_ar: "ما الذي يضمن أمان QKD؟",
        options: ["Strong mathematical assumptions", "The no-cloning theorem and quantum measurement disturbance", "Encryption key length", "The speed of quantum computers"],
        options_ar: ["افتراضات رياضية قوية", "مبرهنة عدم الاستنساخ واضطراب القياس الكمومي", "طول مفتاح التشفير", "سرعة الحواسيب الكمومية"],
        correctIndex: 1,
        explanation: "QKD security is guaranteed by physical laws: the no-cloning theorem and the fact that measurement disturbs quantum states, making eavesdropping detectable.",
        explanation_ar: "أمان QKD مضمون بقوانين الفيزياء: مبرهنة عدم الاستنساخ وحقيقة أن القياس يُخلّ بالحالات الكمومية، مما يجعل التنصت قابلاً للكشف.",
      },
      {
        question: "Which algorithm threatens RSA encryption?",
        question_ar: "أي خوارزمية تهدد تشفير RSA؟",
        options: ["Grover's algorithm", "Deutsch-Jozsa algorithm", "Shor's algorithm", "BB84 protocol"],
        options_ar: ["خوارزمية غروفر", "خوارزمية دويتش-يوزسا", "خوارزمية شور", "بروتوكول BB84"],
        correctIndex: 2,
        explanation: "Shor's algorithm can factor large integers in polynomial time, which would break RSA and other factoring-based cryptosystems.",
        explanation_ar: "يمكن لخوارزمية شور تحليل الأعداد الصحيحة الكبيرة في وقت متعدد الحدود، مما سيكسر RSA وأنظمة التشفير الأخرى القائمة على التحليل.",
      },
    ],
  },
  {
    id: "biochemistry",
    title: "Biochemistry & Simulation",
    title_ar: "الكيمياء الحيوية والمحاكاة",
    description: "How quantum computers could revolutionise drug discovery, protein folding, and materials science.",
    description_ar: "كيف يمكن للحواسيب الكمومية أن تُحدث ثورة في اكتشاف الأدوية وطيّ البروتينات وعلوم المواد.",
    topics: ["Molecular simulation", "Drug discovery", "Energy calculations", "VQE algorithm"],
    topics_ar: ["محاكاة الجزيئات", "اكتشاف الأدوية", "حسابات الطاقة", "خوارزمية VQE"],
    difficulty: "Advanced",
    estimatedMinutes: 40,
    dayIndex: 5,
    content: [
      {
        id: "bio-1",
        title: "Why Quantum for Chemistry?",
        title_ar: "لماذا الكم للكيمياء؟",
        body: `Molecules are fundamentally quantum systems. Their electronic structure follows quantum mechanics, but classical computers struggle to simulate this exactly — the number of quantum states grows exponentially with molecule size.

Simulating caffeine (C₈H₁₀N₄O₂) exactly would require ~10⁴⁸ classical bits — more than atoms in Earth. A quantum computer with ~180 qubits could simulate it exactly.

This is Feynman's original vision for quantum computers (1981): 'Nature isn't classical, dammit, and if you want to make a simulation of nature, you'd better make it quantum mechanical.'`,
        body_ar: `الجزيئات هي أنظمة كمومية بطبيعتها. بنيتها الإلكترونية تتبع ميكانيكا الكم، لكن الحواسيب الكلاسيكية تعجز عن محاكاتها بدقة — عدد الحالات الكمومية ينمو بشكل أسي مع حجم الجزيء.

محاكاة الكافيين (C₈H₁₀N₄O₂) بدقة تستلزم ~10⁴⁸ بت كلاسيكي — أكثر من ذرات الأرض. حاسوب كمومي بـ ~180 كيوبت يمكنه محاكاته بدقة تامة.

هذه كانت رؤية فاينمان الأصلية للحواسيب الكمومية (1981): 'الطبيعة ليست كلاسيكية، للعنة، وإذا أردت محاكاة الطبيعة، فالأفضل أن تجعل محاكاتك كمومية.'`,
        visualHint: "none",
      },
      {
        id: "bio-2",
        title: "Drug Discovery Applications",
        title_ar: "تطبيقات اكتشاف الأدوية",
        body: `Quantum simulation applications in biochemistry:

• Protein folding: Understand how proteins fold to design drugs that target specific shapes
• Enzyme catalysis: Model how enzymes work to design better biocatalysts
• Drug-receptor binding: Calculate binding energies of drug candidates more accurately
• Nitrogen fixation: Design better catalysts for fertilizer production (Haber-Bosch uses 2% of world's energy)

Near-term milestone: Accurately simulating the FeMo-cofactor of nitrogenase enzyme — a molecule too complex for classical computers.`,
        body_ar: `تطبيقات المحاكاة الكمومية في الكيمياء الحيوية:

• طيّ البروتينات: فهم كيفية طيّ البروتينات لتصميم أدوية تستهدف أشكالاً محددة
• التحفيز الإنزيمي: نمذجة عمل الإنزيمات لتصميم محفزات حيوية أفضل
• ارتباط الدواء بالمستقبل: حساب طاقات الارتباط لمرشحي الأدوية بدقة أعلى
• تثبيت النيتروجين: تصميم محفزات أفضل لإنتاج الأسمدة (عملية هابر-بوش تستهلك 2% من طاقة العالم)

الهدف القريب: محاكاة دقيقة لعامل FeMo المساعد لإنزيم النيتروجيناز — جزيء أعقد مما تستطيع الحواسيب الكلاسيكية التعامل معه.`,
        visualHint: "none",
      },
      {
        id: "bio-3",
        title: "The VQE Algorithm",
        title_ar: "خوارزمية VQE",
        body: `The Variational Quantum Eigensolver (VQE) is a near-term algorithm for quantum chemistry:

1. Prepare a parameterized quantum state |ψ(θ)⟩ on a quantum computer
2. Measure the expectation value ⟨E⟩ = ⟨ψ(θ)|H|ψ(θ)⟩
3. Use a classical optimizer to find parameters θ that minimize ⟨E⟩
4. By the variational principle, the minimum energy ≥ true ground state energy

VQE can run on today's noisy quantum computers and is being tested by IBM, Google, and others for small molecules. It's a 'quantum-classical hybrid' algorithm.`,
        body_ar: `محلّل القيم الذاتية التغيّري الكمومي (VQE) هو خوارزمية قريبة المدى للكيمياء الكمومية:

1. تحضير حالة كمومية ذات معاملات |ψ(θ)⟩ على حاسوب كمومي
2. قياس القيمة المتوقعة ⟨E⟩ = ⟨ψ(θ)|H|ψ(θ)⟩
3. استخدام محسّن كلاسيكي لإيجاد معاملات θ تُصغّر ⟨E⟩
4. بمبدأ التغيّر، الطاقة الدنيا ≥ طاقة الحالة الأرضية الحقيقية

يمكن تشغيل VQE على الحواسيب الكمومية الحالية الصاخبة وتختبره IBM وGoogle وغيرهما للجزيئات الصغيرة. إنها خوارزمية 'هجينة كمومية-كلاسيكية'.`,
        visualHint: "none",
      },
    ],
    faqs: [
      {
        question: "Has a quantum computer discovered any drugs yet?",
        question_ar: "هل اكتشف حاسوب كمومي أي أدوية حتى الآن؟",
        answer: "Not yet — current quantum computers are still too small and noisy for practical drug discovery. However, companies like IBM, Google, Roche, and Pfizer are actively researching this. The first meaningful results on useful molecules are expected in the next 5-10 years.",
        answer_ar: "ليس بعد — الحواسيب الكمومية الحالية لا تزال صغيرة وصاخبة جداً لاكتشاف الأدوية العملي. لكن شركات مثل IBM وGoogle وRoche وPfizer تبحث في هذا بنشاط. من المتوقع أولى النتائج المجدية على الجزيئات المفيدة خلال 5-10 سنوات.",
      },
      {
        question: "What is the 'quantum advantage' crossover for chemistry?",
        question_ar: "ما نقطة تعادل 'الميزة الكمومية' للكيمياء؟",
        answer: "Quantum advantage in chemistry means using a quantum computer to solve a chemical problem that no classical computer can solve in reasonable time. Current estimates suggest this will require fault-tolerant quantum computers with ~100,000-1,000,000 physical qubits — likely 15-20 years away.",
        answer_ar: "الميزة الكمومية في الكيمياء تعني استخدام حاسوب كمومي لحل مسألة كيميائية لا يستطيع أي حاسوب كلاسيكي حلها في وقت معقول. تشير التقديرات الحالية إلى أن هذا سيتطلب حواسيب كمومية متحملة للأخطاء بـ ~100,000-1,000,000 كيوبت فيزيائي — على الأرجح بعد 15-20 سنة.",
      },
    ],
    quiz: [
      {
        question: "Why is quantum computing well-suited for molecular simulation?",
        question_ar: "لماذا الحوسبة الكمومية مناسبة لمحاكاة الجزيئات؟",
        options: ["Molecules are digital systems", "Molecules are quantum systems and quantum computers naturally represent quantum states", "Quantum computers are faster for all computations", "Molecules are too small for classical computers to see"],
        options_ar: ["الجزيئات أنظمة رقمية", "الجزيئات أنظمة كمومية والحواسيب الكمومية تمثل الحالات الكمومية بشكل طبيعي", "الحواسيب الكمومية أسرع لجميع الحسابات", "الجزيئات أصغر من أن ترصدها الحواسيب الكلاسيكية"],
        correctIndex: 1,
        explanation: "Molecules obey quantum mechanics. A quantum computer can represent molecular quantum states efficiently, while classical computers require exponentially many bits.",
        explanation_ar: "تخضع الجزيئات لميكانيكا الكم. يمكن للحاسوب الكمومي تمثيل الحالات الكمومية الجزيئية بكفاءة، بينما تحتاج الحواسيب الكلاسيكية إلى عدد أسي من البتات.",
      },
      {
        question: "What does VQE stand for?",
        question_ar: "ماذا تعني اختصار VQE؟",
        options: ["Variable Quantum Estimator", "Variational Quantum Eigensolver", "Virtual Qubit Environment", "Verified Quantum Experiment"],
        options_ar: ["المقدِّر الكمومي المتغيّر", "محلّل القيم الذاتية التغيّري الكمومي", "بيئة الكيوبت الافتراضية", "التجربة الكمومية المتحقق منها"],
        correctIndex: 1,
        explanation: "VQE stands for Variational Quantum Eigensolver — a quantum-classical hybrid algorithm for finding ground state energies of molecules.",
        explanation_ar: "VQE اختصار لـ Variational Quantum Eigensolver — خوارزمية هجينة كمومية-كلاسيكية لإيجاد طاقات الحالة الأرضية للجزيئات.",
      },
    ],
  },
  {
    id: "algorithms",
    title: "Algorithms",
    title_ar: "الخوارزميات الكمومية",
    description: "Landmark quantum algorithms and their advantages: from Deutsch-Jozsa to Shor and Grover.",
    description_ar: "الخوارزميات الكمومية البارزة ومزاياها: من دويتش-يوزسا إلى شور وغروفر.",
    topics: ["Deutsch-Jozsa", "Grover search", "Shor factoring", "Quantum Fourier Transform"],
    topics_ar: ["دويتش-يوزسا", "بحث غروفر", "تحليل شور", "تحويل فورييه الكمومي"],
    difficulty: "Advanced",
    estimatedMinutes: 45,
    dayIndex: 6,
    isFinalDay: true,
    content: [
      {
        id: "alg-1",
        title: "Deutsch-Jozsa: First Quantum Speedup",
        title_ar: "دويتش-يوزسا: أول تسريع كمومي",
        body: `The first algorithm to demonstrate quantum advantage over classical computation (1992).

Problem: Given a function f:{0,1}ⁿ → {0,1}, determine if it's constant or balanced.
Classical: Up to 2ⁿ⁻¹ + 1 queries worst case.
Quantum: Exactly 1 query!

The algorithm applies H to all n qubits, queries f once using quantum parallelism, applies H again, then measures. If all zeros → constant; otherwise → balanced.

Its real importance: proved quantum computers can solve problems fundamentally faster than classical ones.`,
        body_ar: `أول خوارزمية أثبتت الميزة الكمومية على الحوسبة الكلاسيكية (1992).

المسألة: بالنظر إلى دالة f:{0,1}ⁿ → {0,1}، حدد إن كانت ثابتة أم متوازنة.
كلاسيكياً: حتى 2ⁿ⁻¹ + 1 استعلام في أسوأ الحالات.
كمومياً: استعلام واحد بالضبط!

تطبّق الخوارزمية H على جميع الكيوبتات الـ n، تستعلم f مرة باستخدام التوازي الكمومي، تطبق H مرة أخرى، ثم تقيس. إذا كانت كلها أصفاراً ← ثابتة؛ وإلا ← متوازنة.

أهميتها الحقيقية: أثبتت أن الحواسيب الكمومية يمكنها حل مسائل بشكل أسرع جوهرياً من الكلاسيكية.`,
        visualHint: "circuit",
      },
      {
        id: "alg-2",
        title: "Grover's Search: Quadratic Speedup",
        title_ar: "بحث غروفر: تسريع تربيعي",
        body: `Grover's algorithm (1996) searches an unsorted database of N items in O(√N) queries.

Classical: O(N) average, O(N) worst case
Quantum: O(√N) — for N=1,000,000: only 1,000 queries!

How it works:
1. Start in equal superposition of all N states
2. Apply 'oracle' to mark the target (phase flip)
3. Apply 'diffusion' operator to amplify the marked state
4. Repeat ~π√N/4 times
5. Measure — high probability of finding target

Note: This is a quadratic speedup — provably optimal for quantum search.`,
        body_ar: `خوارزمية غروفر (1996) تبحث في قاعدة بيانات غير مرتبة من N عنصر في O(√N) استعلام.

كلاسيكياً: O(N) متوسطاً وأسوأ حالة
كمومياً: O(√N) — لـ N=1,000,000: فقط 1,000 استعلام!

آلية العمل:
1. البدء في تراكب متساوٍ لجميع الحالات الـ N
2. تطبيق 'الأوراكل' لوسم الهدف (قلب الطور)
3. تطبيق مشغّل 'الانتشار' لتضخيم الحالة الموسومة
4. التكرار ~π√N/4 مرة
5. القياس — احتمال عالٍ لإيجاد الهدف

ملاحظة: هذا تسريع تربيعي — وهو الأمثل مُثبَتاً للبحث الكمومي.`,
        visualHint: "none",
      },
      {
        id: "alg-3",
        title: "Shor's Algorithm: Exponential Speedup",
        title_ar: "خوارزمية شور: تسريع أسي",
        body: `Shor's algorithm (1994) factors integers in polynomial time — threatening RSA.

Classical: Exponential time O(exp(n^{1/3}))
Quantum: Polynomial time O(n³)

For a 2048-bit number:
Classical → longer than the age of the universe
Quantum → hours on a large quantum computer

The quantum core uses the Quantum Fourier Transform (QFT) to find the period of a modular function. This is the most practically important quantum algorithm.

Status: Today's quantum computers cannot yet break RSA — insufficient qubits and too much noise. But post-quantum migration should begin now.`,
        body_ar: `خوارزمية شور (1994) تُحلّل الأعداد الصحيحة في وقت متعدد الحدود — مهددةً RSA.

كلاسيكياً: وقت أسي O(exp(n^{1/3}))
كمومياً: وقت متعدد الحدود O(n³)

لعدد من 2048 بت:
كلاسيكياً ← أطول من عمر الكون
كمومياً ← ساعات على حاسوب كمومي كبير

تستخدم النواة الكمومية تحويل فورييه الكمومي (QFT) لإيجاد دورة دالة معيارية. هذه أهم الخوارزميات الكمومية عملياً.

الوضع الحالي: لا تستطيع الحواسيب الكمومية الحالية بعد كسر RSA — كيوبتات غير كافية وضجيج كثير. لكن الانتقال إلى ما بعد الكمومي يجب أن يبدأ الآن.`,
        visualHint: "none",
      },
    ],
    faqs: [
      {
        question: "Are quantum speedups always exponential?",
        question_ar: "هل التسريعات الكمومية دائماً أسية؟",
        answer: "No — quantum speedups vary by problem. Shor's provides exponential speedup for factoring. Grover's provides quadratic speedup for search. For many problems, no quantum speedup exists. The study of which problems admit quantum speedups is an active area of research.",
        answer_ar: "لا — تتفاوت التسريعات الكمومية حسب المسألة. شور يوفر تسريعاً أسياً للتحليل. غروفر يوفر تسريعاً تربيعياً للبحث. لكثير من المسائل لا يوجد تسريع كمومي. دراسة أي المسائل تقبل التسريعات الكمومية مجال بحث نشط.",
      },
      {
        question: "What is BQP?",
        question_ar: "ما هو BQP؟",
        answer: "BQP (Bounded-error Quantum Polynomial time) is the class of problems solvable by a quantum computer in polynomial time with high probability. It contains P and is believed to be larger than P (explaining quantum advantage). Whether BQP contains NP is an open question.",
        answer_ar: "BQP (زمن متعدد الحدود الكمومي محدود الخطأ) هو صنف المسائل القابلة للحل بواسطة حاسوب كمومي في وقت متعدد الحدود باحتمال عالٍ. يحتوي P ويُعتقد أنه أكبر من P (مما يفسر الميزة الكمومية). ما إذا كان BQP يحتوي NP سؤال مفتوح.",
      },
    ],
    quiz: [
      {
        question: "Grover's algorithm provides what type of speedup?",
        question_ar: "ما نوع التسريع الذي توفره خوارزمية غروفر؟",
        options: ["Exponential speedup", "Quadratic speedup (√N)", "Linear speedup", "Logarithmic speedup"],
        options_ar: ["تسريع أسي", "تسريع تربيعي (√N)", "تسريع خطي", "تسريع لوغاريتمي"],
        correctIndex: 1,
        explanation: "Grover's algorithm searches N items in O(√N) queries — a quadratic speedup over classical O(N). It is provably optimal for quantum search.",
        explanation_ar: "تبحث خوارزمية غروفر في N عنصر في O(√N) استعلام — تسريع تربيعي مقارنة بالكلاسيكي O(N). وهو الأمثل مُثبَتاً للبحث الكمومي.",
      },
      {
        question: "Which quantum algorithm threatens RSA encryption?",
        question_ar: "أي خوارزمية كمومية تهدد تشفير RSA؟",
        options: ["Grover's algorithm", "VQE", "Shor's algorithm", "Deutsch-Jozsa"],
        options_ar: ["خوارزمية غروفر", "VQE", "خوارزمية شور", "دويتش-يوزسا"],
        correctIndex: 2,
        explanation: "Shor's algorithm factors integers in polynomial time, which would break RSA encryption if run on a sufficiently large quantum computer.",
        explanation_ar: "تُحلّل خوارزمية شور الأعداد الصحيحة في وقت متعدد الحدود، مما سيكسر تشفير RSA إذا شُغّلت على حاسوب كمومي كبير بما يكفي.",
      },
      {
        question: "What key technique does Shor's algorithm use?",
        question_ar: "ما التقنية الرئيسية التي تستخدمها خوارزمية شور؟",
        options: ["Quantum teleportation", "Quantum Fourier Transform", "Grover's diffusion operator", "BB84 protocol"],
        options_ar: ["الإرسال الكمومي", "تحويل فورييه الكمومي", "مشغّل انتشار غروفر", "بروتوكول BB84"],
        correctIndex: 1,
        explanation: "The quantum core of Shor's algorithm uses the Quantum Fourier Transform to find the period of a modular function, which reveals the factors.",
        explanation_ar: "تستخدم النواة الكمومية لخوارزمية شور تحويل فورييه الكمومي لإيجاد دورة دالة معيارية، مما يكشف عن العوامل.",
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
