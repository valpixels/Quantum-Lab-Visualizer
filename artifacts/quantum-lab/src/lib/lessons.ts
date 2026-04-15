export interface LessonModule {
  id: string;
  title: string;
  description: string;
  topics: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  content: LessonSection[];
}

export interface LessonSection {
  id: string;
  title: string;
  body: string;
  visualHint?: "bloch" | "circuit" | "none";
  blochState?: { theta: number; phi: number };
  circuitExample?: string;
}

export const LESSONS: LessonModule[] = [
  {
    id: "qubits-intro",
    title: "Introduction to Qubits",
    description:
      "Learn what a qubit is, how it differs from a classical bit, and how to visualize quantum states.",
    topics: ["Superposition", "Bloch Sphere", "State vectors"],
    difficulty: "Beginner",
    estimatedMinutes: 20,
    content: [
      {
        id: "qubits-1",
        title: "What is a Qubit?",
        body: "A classical bit can only be 0 or 1. A qubit, however, can exist in a superposition of both states simultaneously. Mathematically, a qubit state is written as |ψ⟩ = α|0⟩ + β|1⟩, where α and β are complex amplitudes satisfying |α|² + |β|² = 1.\n\nWhen we measure a qubit, it collapses to either |0⟩ with probability |α|² or |1⟩ with probability |β|².",
        visualHint: "bloch",
        blochState: { theta: 0, phi: 0 },
      },
      {
        id: "qubits-2",
        title: "The Bloch Sphere",
        body: "The Bloch sphere is a geometric representation of the pure state space of a two-level quantum mechanical system (qubit). Any qubit state |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩ can be mapped to a point on the sphere using spherical coordinates (θ, φ).\n\n• North pole (θ=0): |0⟩ state\n• South pole (θ=π): |1⟩ state\n• Equator: Equal superposition states\n\nUse the controls to explore different quantum states!",
        visualHint: "bloch",
        blochState: { theta: Math.PI / 2, phi: 0 },
      },
      {
        id: "qubits-3",
        title: "Common Qubit States",
        body: "Key states on the Bloch sphere:\n\n|+⟩ = (|0⟩ + |1⟩)/√2 — Located at (θ=π/2, φ=0), the +X axis\n|-⟩ = (|0⟩ - |1⟩)/√2 — Located at (θ=π/2, φ=π), the -X axis\n|i⟩ = (|0⟩ + i|1⟩)/√2 — Located at (θ=π/2, φ=π/2), the +Y axis\n\nThese are the eigenstates of the Pauli X and Y operators respectively.",
        visualHint: "bloch",
        blochState: { theta: Math.PI / 2, phi: Math.PI / 2 },
      },
    ],
  },
  {
    id: "quantum-gates",
    title: "Quantum Gates",
    description:
      "Explore the fundamental quantum gates and how they transform qubit states.",
    topics: ["Pauli Gates", "Hadamard Gate", "Phase Gates", "CNOT"],
    difficulty: "Beginner",
    estimatedMinutes: 30,
    content: [
      {
        id: "gates-1",
        title: "Single-Qubit Gates",
        body: "Quantum gates are unitary operations that transform qubit states. Unlike classical logic gates, quantum gates are reversible.\n\nThe Pauli gates are fundamental:\n• X gate (NOT): Flips |0⟩ to |1⟩ and vice versa. Rotation of π around the X-axis of the Bloch sphere.\n• Y gate: Rotation of π around the Y-axis. Maps |0⟩ → i|1⟩ and |1⟩ → -i|0⟩.\n• Z gate: Rotation of π around the Z-axis. Applies a phase flip: |0⟩ → |0⟩, |1⟩ → -|1⟩.",
        visualHint: "circuit",
      },
      {
        id: "gates-2",
        title: "Hadamard Gate",
        body: "The Hadamard (H) gate creates superposition. It maps:\n• |0⟩ → |+⟩ = (|0⟩ + |1⟩)/√2\n• |1⟩ → |-⟩ = (|0⟩ - |1⟩)/√2\n\nIn matrix form: H = (1/√2) [[1, 1], [1, -1]]\n\nApplying H twice returns to the original state. The Hadamard gate is its own inverse and is essential for creating interference in quantum algorithms.",
        visualHint: "circuit",
      },
      {
        id: "gates-3",
        title: "Two-Qubit Gates: CNOT",
        body: "The Controlled-NOT (CNOT) gate operates on two qubits: a control qubit and a target qubit. It flips the target qubit if and only if the control qubit is |1⟩.\n\nCNOT truth table:\n• |00⟩ → |00⟩\n• |01⟩ → |01⟩\n• |10⟩ → |11⟩\n• |11⟩ → |10⟩\n\nThe CNOT gate is crucial for creating entanglement between qubits — one of the most powerful resources in quantum computing.",
        visualHint: "circuit",
      },
    ],
  },
  {
    id: "quantum-circuits",
    title: "Quantum Circuits",
    description:
      "Learn how to design and read quantum circuits, the programming language of quantum computers.",
    topics: ["Circuit notation", "Wire diagrams", "Measurement", "Bell states"],
    difficulty: "Intermediate",
    estimatedMinutes: 40,
    content: [
      {
        id: "circuits-1",
        title: "Circuit Notation",
        body: "Quantum circuits are read left to right, with time flowing left to right. Each horizontal wire represents a qubit. Gates are placed on wires and applied in sequence.\n\nConventions:\n• Each qubit line starts with its initial state (usually |0⟩)\n• Single-qubit gates appear as labeled boxes on one wire\n• Two-qubit gates connect two wires\n• Measurement is typically shown at the end with a meter symbol\n\nTry building a simple circuit in the Circuit Designer!",
        visualHint: "circuit",
      },
      {
        id: "circuits-2",
        title: "Bell State Circuit",
        body: "A Bell state is a maximally entangled two-qubit state. The simplest Bell state circuit:\n\n1. Start with |00⟩\n2. Apply Hadamard (H) to qubit 0 → (|0⟩ + |1⟩)/√2 ⊗ |0⟩\n3. Apply CNOT with qubit 0 as control, qubit 1 as target\n4. Result: (|00⟩ + |11⟩)/√2\n\nThis state cannot be written as a product of individual qubit states — the qubits are entangled! Measuring one qubit instantly determines the other's state.",
        visualHint: "circuit",
      },
      {
        id: "circuits-3",
        title: "Quantum Measurement",
        body: "Measurement in quantum mechanics is fundamentally different from classical observation. When we measure a qubit:\n\n• The qubit collapses to either |0⟩ or |1⟩\n• The probability of each outcome is determined by the state's amplitudes\n• After measurement, the superposition is destroyed\n• Multiple measurements of identically prepared qubits give a probability distribution\n\nThis irreversibility of measurement is what makes quantum algorithms carefully choreograph all computations before measuring.",
        visualHint: "bloch",
        blochState: { theta: Math.PI / 4, phi: Math.PI / 4 },
      },
    ],
  },
  {
    id: "entanglement",
    title: "Quantum Entanglement",
    description:
      "Explore the phenomenon of quantum entanglement and its implications for quantum computing.",
    topics: ["EPR pairs", "Bell inequalities", "Quantum teleportation"],
    difficulty: "Intermediate",
    estimatedMinutes: 35,
    content: [
      {
        id: "entangle-1",
        title: "What is Entanglement?",
        body: "Quantum entanglement is a phenomenon where two or more qubits become correlated in such a way that the quantum state of each cannot be described independently of the others, even when separated by large distances.\n\nEinstein famously called this 'spooky action at a distance.' Unlike classical correlations (e.g., gloves in separate boxes), quantum entanglement involves genuine quantum correlations that violate classical probability bounds (Bell inequalities).\n\nEntanglement is a key resource for quantum teleportation, quantum cryptography, and quantum computing speedup.",
        visualHint: "none",
      },
      {
        id: "entangle-2",
        title: "Bell States",
        body: "The four maximally entangled two-qubit states, known as Bell states:\n\n|Φ+⟩ = (|00⟩ + |11⟩)/√2\n|Φ-⟩ = (|00⟩ - |11⟩)/√2\n|Ψ+⟩ = (|01⟩ + |10⟩)/√2\n|Ψ-⟩ = (|01⟩ - |10⟩)/√2\n\nThese four states form a complete orthonormal basis for the two-qubit Hilbert space. Any two-qubit state can be expressed as a superposition of Bell states.",
        visualHint: "circuit",
      },
      {
        id: "entangle-3",
        title: "Quantum Teleportation",
        body: "Quantum teleportation transfers a quantum state from one location to another using entanglement and classical communication. It does NOT transfer matter or energy faster than light.\n\nProtocol (Alice wants to send state |ψ⟩ to Bob):\n1. Share an entangled Bell pair between Alice and Bob\n2. Alice performs a Bell measurement on |ψ⟩ and her entangled qubit\n3. Alice sends 2 classical bits to Bob\n4. Bob applies a correction operation based on Alice's bits\n5. Bob's qubit is now in state |ψ⟩\n\nThe original state |ψ⟩ is destroyed at Alice's location (no-cloning theorem).",
        visualHint: "none",
      },
    ],
  },
  {
    id: "quantum-algorithms",
    title: "Quantum Algorithms",
    description:
      "Survey of landmark quantum algorithms and their advantages over classical approaches.",
    topics: [
      "Deutsch-Jozsa",
      "Grover's Search",
      "Shor's Algorithm",
      "Quantum advantage",
    ],
    difficulty: "Advanced",
    estimatedMinutes: 50,
    content: [
      {
        id: "algo-1",
        title: "Deutsch-Jozsa Algorithm",
        body: "The Deutsch-Jozsa algorithm was one of the first quantum algorithms to show an exponential speedup over classical computation.\n\nProblem: Given a black-box function f:{0,1}^n → {0,1}, determine if f is constant (same output for all inputs) or balanced (equal numbers of 0s and 1s).\n\nClassically: Requires up to 2^(n-1) + 1 queries in the worst case.\nQuantum: Requires exactly 1 query!\n\nThe algorithm uses superposition to query all inputs simultaneously through quantum parallelism.",
        visualHint: "circuit",
      },
      {
        id: "algo-2",
        title: "Grover's Search Algorithm",
        body: "Grover's algorithm provides a quadratic speedup for searching unsorted databases.\n\nProblem: Find a marked item in a database of N items.\nClassical: O(N) queries on average\nQuantum: O(√N) queries\n\nFor N = 1 million: Classical needs ~500,000 queries, Quantum needs ~1,000!\n\nThe algorithm amplifies the amplitude of the correct answer through a series of 'Grover iterations' using quantum interference. Each iteration slightly increases the probability of measuring the correct answer.",
        visualHint: "none",
      },
      {
        id: "algo-3",
        title: "Shor's Factoring Algorithm",
        body: "Shor's algorithm efficiently factors large integers, threatening RSA encryption.\n\nProblem: Factor a large integer N = p × q\nClassical (best known): Exponential time O(exp(n^(1/3)))\nQuantum: Polynomial time O(n³)\n\nFor a 2048-bit number: Classical would take longer than the age of the universe; a quantum computer could do it in hours.\n\nThe quantum core uses the Quantum Fourier Transform (QFT) to find the period of a modular function. This is a profound example of quantum advantage in a practically important problem.",
        visualHint: "none",
      },
    ],
  },
];

export function getLessonById(id: string): LessonModule | undefined {
  return LESSONS.find((l) => l.id === id);
}
