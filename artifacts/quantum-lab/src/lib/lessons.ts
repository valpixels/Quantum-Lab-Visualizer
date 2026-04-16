export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface LessonSection {
  id: string;
  title: string;
  body: string;
  visualHint?: "bloch" | "circuit" | "none";
  blochState?: { theta: number; phi: number };
}

export interface LessonModule {
  id: string;
  title: string;
  description: string;
  topics: string[];
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
    description: "What is a qubit? How does it differ from a classical bit, and how do we visualize quantum states?",
    topics: ["Superposition", "Bloch Sphere", "State vectors", "Measurement"],
    difficulty: "Beginner",
    estimatedMinutes: 20,
    dayIndex: 1,
    content: [
      {
        id: "q1-1",
        title: "What is a Qubit?",
        body: "A classical bit can only be 0 or 1. A qubit, however, can exist in a superposition of both states simultaneously.\n\nMathematically:\n\n|ψ⟩ = α|0⟩ + β|1⟩\n\nwhere α and β are complex amplitudes satisfying |α|² + |β|² = 1.\n\nWhen we measure a qubit, it collapses to either |0⟩ with probability |α|² or |1⟩ with probability |β|².",
        visualHint: "bloch",
        blochState: { theta: 0, phi: 0 },
      },
      {
        id: "q1-2",
        title: "The Bloch Sphere",
        body: "The Bloch sphere is a geometric representation of the pure state space of a qubit. Any qubit state can be mapped to a point on the sphere:\n\n|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩\n\n• North pole (θ=0): |0⟩ state\n• South pole (θ=π): |1⟩ state\n• Equator: Equal superposition states (like |+⟩ and |-⟩)\n\nInteract with the Bloch sphere to explore different quantum states!",
        visualHint: "bloch",
        blochState: { theta: Math.PI / 2, phi: 0 },
      },
      {
        id: "q1-3",
        title: "Common Qubit States",
        body: "Key states on the Bloch sphere:\n\n|+⟩ = (|0⟩ + |1⟩)/√2  — +X axis  (θ=π/2, φ=0)\n|-⟩ = (|0⟩ - |1⟩)/√2  — -X axis  (θ=π/2, φ=π)\n|i⟩ = (|0⟩ + i|1⟩)/√2 — +Y axis  (θ=π/2, φ=π/2)\n\nThese are the eigenstates of the Pauli X and Y operators.",
        visualHint: "bloch",
        blochState: { theta: Math.PI / 2, phi: Math.PI / 2 },
      },
    ],
    faqs: [
      {
        question: "Why can't we just say a qubit is 'both 0 and 1 at the same time'?",
        answer: "That's a common simplification, but it's misleading. A qubit in superposition is not simultaneously 0 AND 1 — it's in a mathematical combination of states with specific amplitudes. When measured, it gives a definite result according to those probabilities. The 'both at once' description misses the phase information that makes quantum computing powerful.",
      },
      {
        question: "Can I observe a qubit in superposition without collapsing it?",
        answer: "No — any interaction that gains information about which state a qubit is in will cause collapse. This is the measurement problem in quantum mechanics. Sophisticated techniques like quantum error correction work around this, but they can't avoid it fundamentally.",
      },
      {
        question: "How is a qubit physically implemented?",
        answer: "There are many physical implementations: superconducting circuits (IBM, Google), trapped ions (IonQ, Honeywell), photonic qubits, nitrogen-vacancy centres in diamond, and topological qubits (Microsoft). Each has different trade-offs in coherence time, gate fidelity, and scalability.",
      },
      {
        question: "What is decoherence?",
        answer: "Decoherence is when a qubit's quantum state becomes entangled with the environment, causing it to lose its quantum properties and behave classically. It's the main challenge in building practical quantum computers. Current qubit coherence times range from microseconds to milliseconds.",
      },
    ],
    quiz: [
      {
        question: "What happens to a qubit when you measure it?",
        options: [
          "It stays in superposition",
          "It collapses to either |0⟩ or |1⟩",
          "It becomes two bits",
          "Nothing changes",
        ],
        correctIndex: 1,
        explanation: "Measurement causes the qubit to collapse from its superposition state to a definite classical outcome — either 0 or 1 — with probabilities determined by its amplitudes.",
      },
      {
        question: "Where on the Bloch sphere is the |0⟩ state located?",
        options: ["South pole", "Equator", "North pole", "Origin"],
        correctIndex: 2,
        explanation: "The |0⟩ state corresponds to θ=0, which places it at the north pole of the Bloch sphere.",
      },
      {
        question: "For a qubit |ψ⟩ = α|0⟩ + β|1⟩, what constraint must α and β satisfy?",
        options: [
          "α + β = 1",
          "|α|² + |β|² = 1",
          "α = β",
          "α · β = 0",
        ],
        correctIndex: 1,
        explanation: "The normalization constraint requires |α|² + |β|² = 1, ensuring that measurement probabilities sum to 1.",
      },
    ],
  },
  {
    id: "superposition",
    title: "Superposition",
    description: "Deep dive into quantum superposition — what it means mathematically and why it's a computational resource.",
    topics: ["Wave functions", "Interference", "Quantum parallelism"],
    difficulty: "Beginner",
    estimatedMinutes: 25,
    dayIndex: 2,
    content: [
      {
        id: "sup-1",
        title: "The Principle of Superposition",
        body: "Superposition is one of the core principles of quantum mechanics. Unlike classical systems, quantum systems can exist in a linear combination of multiple states simultaneously.\n\nFor a single qubit:\n|ψ⟩ = α|0⟩ + β|1⟩\n\nFor two qubits, superposition over 4 states:\n|ψ⟩ = α|00⟩ + β|01⟩ + γ|10⟩ + δ|11⟩\n\nFor n qubits: superposition over 2ⁿ states simultaneously!",
        visualHint: "bloch",
        blochState: { theta: Math.PI / 2, phi: 0 },
      },
      {
        id: "sup-2",
        title: "Interference",
        body: "Superposition enables quantum interference — amplitudes can add constructively (making outcomes more likely) or destructively (making outcomes less likely).\n\nThis is analogous to wave interference in physics. Quantum algorithms exploit interference to amplify the probability of correct answers and suppress wrong answers.\n\nThe Hadamard gate creates equal superposition: H|0⟩ = (|0⟩ + |1⟩)/√2\n\nApplying H twice: H(H|0⟩) = |0⟩ — the amplitudes interfere perfectly back to the start.",
        visualHint: "circuit",
      },
      {
        id: "sup-3",
        title: "Quantum Parallelism",
        body: "Because n qubits can be in superposition of 2ⁿ states, a quantum computer can evaluate a function on all 2ⁿ inputs simultaneously — quantum parallelism.\n\nHowever, measurement collapses this to just one answer. The trick of quantum algorithms is to engineer interference so the desired answer has high probability when measured.\n\n10 qubits → 1024 parallel computations\n50 qubits → over 10¹⁵ parallel computations\n300 qubits → more states than atoms in the observable universe!",
        visualHint: "none",
      },
    ],
    faqs: [
      {
        question: "Is superposition the same as randomness?",
        answer: "No — superposition is fundamentally different from classical randomness. A coin that we haven't looked at is definitely either heads or tails; we just don't know which. A qubit in superposition is genuinely neither — it doesn't have a definite value until measured. This isn't ignorance; it's the nature of quantum reality.",
      },
      {
        question: "Can macroscopic objects be in superposition?",
        answer: "In principle, yes — quantum mechanics applies to all matter. However, large objects interact with so many environmental particles that decoherence happens almost instantaneously, destroying superposition. Schrödinger's cat was a thought experiment to highlight this paradox, not a practical reality.",
      },
      {
        question: "Does quantum parallelism mean quantum computers are always faster?",
        answer: "No — quantum parallelism is not 'free'. Because measurement collapses superposition to one outcome, you need clever algorithms that use interference to make the right answer highly probable. Not all problems benefit from this. Quantum computers have specific advantages for certain problem types (factoring, search, simulation).",
      },
    ],
    quiz: [
      {
        question: "What does the Hadamard gate do to |0⟩?",
        options: [
          "Leaves it unchanged",
          "Flips it to |1⟩",
          "Creates equal superposition (|0⟩ + |1⟩)/√2",
          "Applies a phase shift",
        ],
        correctIndex: 2,
        explanation: "The Hadamard gate H creates an equal superposition: H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩",
      },
      {
        question: "How many states can 8 qubits be in superposition over?",
        options: ["8", "16", "64", "256"],
        correctIndex: 3,
        explanation: "n qubits can be in superposition of 2ⁿ states. 2⁸ = 256 states.",
      },
    ],
  },
  {
    id: "entanglement",
    title: "Entanglement",
    description: "Explore quantum entanglement — Einstein's 'spooky action at a distance' and its role in quantum computing.",
    topics: ["Bell states", "EPR pairs", "Non-locality", "Teleportation"],
    difficulty: "Intermediate",
    estimatedMinutes: 30,
    dayIndex: 3,
    content: [
      {
        id: "ent-1",
        title: "What is Entanglement?",
        body: "Quantum entanglement occurs when two or more qubits become correlated such that the state of each cannot be described independently — even when separated by large distances.\n\nEinstein called it 'spooky action at a distance.' Unlike classical correlations (e.g., matched gloves), entanglement involves genuine quantum correlations that violate Bell inequalities.\n\nTo create entanglement:\n1. Apply H to qubit 0 → superposition\n2. Apply CNOT with qubit 0 as control → entanglement!",
        visualHint: "circuit",
      },
      {
        id: "ent-2",
        title: "Bell States",
        body: "The four maximally entangled two-qubit Bell states:\n\n|Φ+⟩ = (|00⟩ + |11⟩)/√2\n|Φ-⟩ = (|00⟩ - |11⟩)/√2\n|Ψ+⟩ = (|01⟩ + |10⟩)/√2\n|Ψ-⟩ = (|01⟩ - |10⟩)/√2\n\nIf two particles share |Φ+⟩ and you measure one as 0, the other instantly becomes 0 — regardless of distance. This cannot be used for faster-than-light communication (no-communication theorem).",
        visualHint: "circuit",
      },
      {
        id: "ent-3",
        title: "Quantum Teleportation",
        body: "Quantum teleportation transfers a quantum state using entanglement + classical communication:\n\n1. Alice and Bob share a Bell pair\n2. Alice performs a Bell measurement on her unknown state |ψ⟩ and her half of the pair\n3. Alice sends 2 classical bits to Bob\n4. Bob applies corrections to his qubit\n5. Bob's qubit is now in state |ψ⟩\n\nNote: The original state is destroyed (no-cloning theorem). Teleportation is not faster than light — it requires classical communication.",
        visualHint: "none",
      },
    ],
    faqs: [
      {
        question: "Can entanglement be used to send information faster than light?",
        answer: "No. While measuring one entangled particle instantly affects the other, the outcome is random — you cannot control it to encode a message. To convey the outcome, you need classical communication. This is the no-communication theorem.",
      },
      {
        question: "Is entanglement fragile?",
        answer: "Yes — entanglement is very fragile. Any interaction with the environment (decoherence) can destroy it. Maintaining entanglement between distant qubits is a major engineering challenge and is central to building quantum networks.",
      },
      {
        question: "What's the difference between entanglement and classical correlation?",
        answer: "Classical correlations exist before measurement (like pre-paired gloves). Quantum entanglement is different: neither particle has a definite value before measurement. The correlations are stronger than any classical hidden-variable theory allows — proven by Bell inequality violations in experiments.",
      },
    ],
    quiz: [
      {
        question: "Which circuit creates a Bell state from |00⟩?",
        options: [
          "Two X gates",
          "H gate on qubit 0, then CNOT",
          "Two CNOT gates",
          "A single Z gate",
        ],
        correctIndex: 1,
        explanation: "Applying H to qubit 0 creates superposition, then CNOT entangles the two qubits, producing (|00⟩ + |11⟩)/√2.",
      },
      {
        question: "What is true about entangled qubits when measured?",
        options: [
          "They always give the same result independently",
          "Their outcomes are correlated in a way classical physics cannot explain",
          "Measuring one destroys the other",
          "They communicate faster than light",
        ],
        correctIndex: 1,
        explanation: "Entangled qubits show correlations that violate Bell inequalities — this cannot be explained by any classical hidden-variable theory.",
      },
    ],
  },
  {
    id: "cryptography",
    title: "Cryptography",
    description: "How quantum mechanics enables unbreakable encryption and threatens classical cryptographic systems.",
    topics: ["BB84 protocol", "Quantum key distribution", "Post-quantum crypto", "Shor's threat"],
    difficulty: "Intermediate",
    estimatedMinutes: 35,
    dayIndex: 4,
    content: [
      {
        id: "cry-1",
        title: "Classical vs Quantum Cryptography",
        body: "Classical cryptography (RSA, ECC) relies on mathematical hardness — factoring large numbers or discrete logarithm problems. These are hard for classical computers but vulnerable to quantum computers via Shor's algorithm.\n\nQuantum cryptography uses the laws of physics (rather than mathematical assumptions) to guarantee security. The most famous protocol is QKD: Quantum Key Distribution.\n\nWith QKD, any eavesdropping attempt is physically detectable — it disturbs the quantum states being transmitted.",
        visualHint: "none",
      },
      {
        id: "cry-2",
        title: "BB84 Protocol",
        body: "BB84 (Bennett & Brassard, 1984) is the first and most famous QKD protocol:\n\n1. Alice sends qubits in random bases (+/×) and random states\n2. Bob measures in random bases\n3. Alice and Bob publicly compare which bases they used\n4. They keep only bits where they used matching bases → secret key\n5. They sacrifice some bits to check for eavesdropping\n\nIf an eavesdropper (Eve) intercepts, she must measure qubits (disturbing them) then re-send. This introduces errors Alice and Bob can detect.\n\nSecurity is guaranteed by the no-cloning theorem.",
        visualHint: "none",
      },
      {
        id: "cry-3",
        title: "Post-Quantum Cryptography",
        body: "Shor's algorithm can break RSA and ECC on a powerful enough quantum computer. This has prompted NIST (National Institute of Standards and Technology) to standardize post-quantum cryptographic algorithms.\n\nIn 2024, NIST finalized standards including:\n• CRYSTALS-Kyber (key encapsulation)\n• CRYSTALS-Dilithium (digital signatures)\n• FALCON (signatures)\n\nThese are classical algorithms based on mathematical problems believed to be hard for both classical and quantum computers (e.g., lattice problems).\n\nOrganizations should begin migrating to post-quantum algorithms now — especially for long-lived secrets.",
        visualHint: "none",
      },
    ],
    faqs: [
      {
        question: "Is QKD being used today?",
        answer: "Yes — QKD systems exist commercially (Toshiba, ID Quantique, QuantumCTek). China operates a 2,000 km quantum backbone network. However, QKD has practical limitations: distance constraints (typically <100 km without quantum repeaters), high cost, and requires dedicated hardware. Post-quantum cryptography may be more practical for most uses.",
      },
      {
        question: "When will quantum computers break RSA?",
        answer: "Current estimates suggest a quantum computer capable of breaking 2048-bit RSA would need millions of fault-tolerant qubits. Today's most advanced quantum computers have thousands of noisy qubits. Most experts estimate 10-20 years, though this is uncertain. Organizations handling long-lived secrets should be migrating to post-quantum cryptography now.",
      },
      {
        question: "What is 'harvest now, decrypt later'?",
        answer: "Adversaries may collect encrypted data today, store it, and decrypt it once quantum computers are powerful enough. If today's secrets need to remain secret for 10+ years, they're already at risk. This is why post-quantum migration is urgent — especially for government, healthcare, and financial data.",
      },
    ],
    quiz: [
      {
        question: "What guarantees the security of QKD?",
        options: [
          "Strong mathematical assumptions",
          "The no-cloning theorem and quantum measurement disturbance",
          "Encryption key length",
          "The speed of quantum computers",
        ],
        correctIndex: 1,
        explanation: "QKD security is guaranteed by physical laws: the no-cloning theorem (can't copy qubits) and the fact that measurement disturbs quantum states, making eavesdropping detectable.",
      },
      {
        question: "Which algorithm threatens RSA encryption?",
        options: ["Grover's algorithm", "Deutsch-Jozsa algorithm", "Shor's algorithm", "BB84 protocol"],
        correctIndex: 2,
        explanation: "Shor's algorithm can factor large integers in polynomial time, which would break RSA and other factoring-based cryptosystems.",
      },
    ],
  },
  {
    id: "biochemistry",
    title: "Biochemistry & Quantum Simulation",
    description: "How quantum computers could revolutionise drug discovery, protein folding, and materials science.",
    topics: ["Molecular simulation", "Drug discovery", "Energy calculations", "VQE algorithm"],
    difficulty: "Advanced",
    estimatedMinutes: 40,
    dayIndex: 5,
    content: [
      {
        id: "bio-1",
        title: "Why Quantum for Chemistry?",
        body: "Molecules are fundamentally quantum systems. Their electronic structure follows quantum mechanics, but classical computers struggle to simulate this exactly — the number of quantum states grows exponentially with molecule size.\n\nSimulating caffeine (C₈H₁₀N₄O₂) exactly would require ~10⁴⁸ classical bits — more than atoms in Earth. A quantum computer with ~180 qubits could simulate it exactly.\n\nThis is Feynman's original vision for quantum computers (1981): 'Nature isn't classical, dammit, and if you want to make a simulation of nature, you'd better make it quantum mechanical.'",
        visualHint: "none",
      },
      {
        id: "bio-2",
        title: "Drug Discovery Applications",
        body: "Quantum simulation applications in biochemistry:\n\n• Protein folding: Understand how proteins fold to design drugs that target specific shapes\n• Enzyme catalysis: Model how enzymes work to design better biocatalysts\n• Drug-receptor binding: Calculate binding energies of drug candidates more accurately\n• Nitrogen fixation: Design better catalysts for fertilizer production (Haber-Bosch uses 2% of world's energy)\n\nNear-term milestone: Accurately simulating the FeMo-cofactor of nitrogenase enzyme — a molecule too complex for classical computers.",
        visualHint: "none",
      },
      {
        id: "bio-3",
        title: "The VQE Algorithm",
        body: "The Variational Quantum Eigensolver (VQE) is a near-term algorithm for quantum chemistry:\n\n1. Prepare a parameterized quantum state |ψ(θ)⟩ on a quantum computer\n2. Measure the expectation value ⟨E⟩ = ⟨ψ(θ)|H|ψ(θ)⟩\n3. Use a classical optimizer to find parameters θ that minimize ⟨E⟩\n4. By the variational principle, the minimum energy ≥ true ground state energy\n\nVQE can run on today's noisy quantum computers and is being tested by IBM, Google, and others for small molecules. It's a 'quantum-classical hybrid' algorithm.",
        visualHint: "none",
      },
    ],
    faqs: [
      {
        question: "Has a quantum computer discovered any drugs yet?",
        answer: "Not yet — current quantum computers are still too small and noisy for practical drug discovery. However, companies like IBM, Google, Roche, and Pfizer are actively researching this. The first meaningful quantum chemistry results on useful molecules are expected in the next 5-10 years.",
      },
      {
        question: "What is the 'quantum advantage' crossover for chemistry?",
        answer: "Quantum advantage in chemistry means using a quantum computer to solve a chemical problem that no classical computer can solve in reasonable time. Current estimates suggest this will require fault-tolerant quantum computers with ~100,000-1,000,000 physical qubits — likely 15-20 years away.",
      },
      {
        question: "What is quantum machine learning in biology?",
        answer: "Quantum machine learning (QML) applies quantum algorithms to ML tasks. In biology, researchers hope QML could speed up protein structure prediction, genomic analysis, or drug candidate screening. However, claims of quantum speedup for ML are still being evaluated — genuine quantum advantage in ML has not yet been demonstrated.",
      },
    ],
    quiz: [
      {
        question: "Why is quantum computing well-suited for molecular simulation?",
        options: [
          "Molecules are digital systems",
          "Molecules are quantum systems and quantum computers naturally represent quantum states",
          "Quantum computers are faster for all computations",
          "Molecules are too small for classical computers to see",
        ],
        correctIndex: 1,
        explanation: "Molecules obey quantum mechanics. A quantum computer can represent molecular quantum states efficiently, while classical computers require exponentially many bits.",
      },
      {
        question: "What does VQE stand for?",
        options: [
          "Variable Quantum Estimator",
          "Variational Quantum Eigensolver",
          "Virtual Qubit Environment",
          "Verified Quantum Experiment",
        ],
        correctIndex: 1,
        explanation: "VQE stands for Variational Quantum Eigensolver — a quantum-classical hybrid algorithm for finding ground state energies of molecules.",
      },
    ],
  },
  {
    id: "algorithms",
    title: "Algorithms",
    description: "Landmark quantum algorithms and their advantages: from Deutsch-Jozsa to Shor and Grover.",
    topics: ["Deutsch-Jozsa", "Grover search", "Shor factoring", "Quantum Fourier Transform"],
    difficulty: "Advanced",
    estimatedMinutes: 45,
    dayIndex: 6,
    isFinalDay: true,
    content: [
      {
        id: "alg-1",
        title: "Deutsch-Jozsa: First Quantum Speedup",
        body: "The first algorithm to demonstrate quantum advantage over classical computation (1992).\n\nProblem: Given a function f:{0,1}ⁿ → {0,1}, determine if it's constant or balanced.\nClassical: Up to 2ⁿ⁻¹ + 1 queries worst case.\nQuantum: Exactly 1 query!\n\nThe algorithm applies H to all n qubits, queries f once using quantum parallelism, applies H again, then measures. If all zeros → constant; otherwise → balanced.\n\nIts real importance: proved quantum computers can solve problems fundamentally faster than classical ones.",
        visualHint: "circuit",
      },
      {
        id: "alg-2",
        title: "Grover's Search: Quadratic Speedup",
        body: "Grover's algorithm (1996) searches an unsorted database of N items in O(√N) queries.\n\nClassical: O(N) average, O(N) worst case\nQuantum: O(√N) — for N=1,000,000: only 1,000 queries!\n\nHow it works:\n1. Start in equal superposition of all N states\n2. Apply 'oracle' to mark the target (phase flip)\n3. Apply 'diffusion' operator to amplify the marked state\n4. Repeat ~π√N/4 times\n5. Measure — high probability of finding target\n\nNote: This is a quadratic (not exponential) speedup, but is provably optimal.",
        visualHint: "none",
      },
      {
        id: "alg-3",
        title: "Shor's Algorithm: Exponential Speedup",
        body: "Shor's algorithm (1994) factors integers in polynomial time — threatening RSA.\n\nClassical: Exponential time O(exp(n^{1/3}))\nQuantum: Polynomial time O(n³)\n\nFor a 2048-bit number:\nClassical → longer than the age of the universe\nQuantum → hours on a large quantum computer\n\nThe quantum core uses the Quantum Fourier Transform (QFT) to find the period of a modular function. This is the most practically important quantum algorithm.\n\nStatus: Today's quantum computers cannot yet break RSA — insufficient qubits and too much noise. But post-quantum migration should begin now.",
        visualHint: "none",
      },
    ],
    faqs: [
      {
        question: "Are quantum speedups always exponential?",
        answer: "No — quantum speedups vary by problem. Shor's algorithm provides exponential speedup for factoring. Grover's provides quadratic speedup for search. For many problems, no quantum speedup exists. The study of which problems admit quantum speedups and by how much is an active area of research.",
      },
      {
        question: "What is BQP and how does it relate to quantum computing?",
        answer: "BQP (Bounded-error Quantum Polynomial time) is the class of problems solvable by a quantum computer in polynomial time with high probability. It contains P (efficiently solvable classically) and is believed to be larger than P (explaining quantum advantage). Whether BQP contains NP is an open question.",
      },
      {
        question: "What is the current state of quantum algorithm development?",
        answer: "Beyond Shor and Grover, researchers have developed algorithms for optimization (QAOA), machine learning (QML), linear systems (HHL), and simulation (VQE, QLSP). Many of these are 'near-term' algorithms designed for today's noisy hardware. Whether they achieve practical quantum advantage remains an active research question.",
      },
    ],
    quiz: [
      {
        question: "Grover's algorithm provides what type of speedup?",
        options: [
          "Exponential speedup",
          "Quadratic speedup (√N)",
          "Linear speedup",
          "Logarithmic speedup",
        ],
        correctIndex: 1,
        explanation: "Grover's algorithm searches N items in O(√N) queries — a quadratic speedup over classical O(N). It is provably optimal for quantum search.",
      },
      {
        question: "Which quantum algorithm threatens RSA encryption?",
        options: ["Grover's algorithm", "VQE", "Shor's algorithm", "Deutsch-Jozsa"],
        correctIndex: 2,
        explanation: "Shor's algorithm factors integers in polynomial time, which would break RSA encryption if run on a sufficiently large quantum computer.",
      },
      {
        question: "What key technique does Shor's algorithm use?",
        options: [
          "Quantum teleportation",
          "Quantum Fourier Transform",
          "Grover's diffusion operator",
          "BB84 protocol",
        ],
        correctIndex: 1,
        explanation: "The quantum core of Shor's algorithm uses the Quantum Fourier Transform to find the period of a modular function, which reveals the factors.",
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
