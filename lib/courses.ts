export interface CourseLesson {
  id: string;
  title: string;
  description: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  modules: CourseModule[];
}

const COURSES: Course[] = [
  // ─── MATHEMATICS ──────────────────────────────────────────────────────────
  {
    id: "math-arithmetic",
    subjectId: "mathematics",
    title: "Foundations of Arithmetic",
    description: "Master the building blocks of mathematics — numbers, operations, fractions, decimals and percentages.",
    level: "beginner",
    duration: "4 weeks",
    modules: [
      {
        id: "m1", title: "Number Systems", lessons: [
          { id: "l1", title: "Natural Numbers & Integers", description: "Understanding positive and negative whole numbers, number lines and absolute value." },
          { id: "l2", title: "Rational Numbers", description: "Fractions, mixed numbers, and how to compare and order them on a number line." },
          { id: "l3", title: "Real Numbers Overview", description: "The real number system: rational, irrational, integers, and how they relate." },
          { id: "l4", title: "Prime & Composite Numbers", description: "Identifying primes, factorization, GCD and LCM with practical examples." },
        ],
      },
      {
        id: "m2", title: "Operations & Properties", lessons: [
          { id: "l5", title: "Addition & Subtraction", description: "Properties of addition, carrying and borrowing, mental math strategies." },
          { id: "l6", title: "Multiplication & Division", description: "Multiplication tables, long division, properties like distributive and associative." },
          { id: "l7", title: "Order of Operations (PEMDAS)", description: "Solving expressions with multiple operations correctly using PEMDAS/BODMAS." },
          { id: "l8", title: "Estimation & Rounding", description: "When and how to estimate; rounding rules for different contexts." },
        ],
      },
      {
        id: "m3", title: "Fractions & Decimals", lessons: [
          { id: "l9", title: "Adding & Subtracting Fractions", description: "Finding common denominators and simplifying results." },
          { id: "l10", title: "Multiplying & Dividing Fractions", description: "Cross-multiplication, reciprocals and mixed number operations." },
          { id: "l11", title: "Decimal Operations", description: "Adding, subtracting, multiplying and dividing decimals with place-value understanding." },
          { id: "l12", title: "Converting Fractions & Decimals", description: "Converting between fractions, decimals and percentages fluently." },
        ],
      },
      {
        id: "m4", title: "Percentages & Ratios", lessons: [
          { id: "l13", title: "What is a Percentage?", description: "Percent as a ratio out of 100; visual and numerical representations." },
          { id: "l14", title: "Percent Problems", description: "Finding the percent, the part and the whole using equations and proportions." },
          { id: "l15", title: "Ratios & Proportions", description: "Setting up ratios, solving proportions and applying them to real-world problems." },
          { id: "l16", title: "Percentage Change", description: "Percent increase, percent decrease, discounts and markups." },
        ],
      },
    ],
  },
  {
    id: "math-algebra-1",
    subjectId: "mathematics",
    title: "Algebra Essentials",
    description: "From variables to linear equations — the core algebraic skills every student needs.",
    level: "beginner",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "Variables & Expressions", lessons: [
          { id: "l1", title: "What Are Variables?", description: "Using letters to represent unknown values; writing and evaluating algebraic expressions." },
          { id: "l2", title: "Simplifying Expressions", description: "Combining like terms, distributing, and using the properties of equality." },
          { id: "l3", title: "Translating Word Problems", description: "Converting verbal descriptions into algebraic expressions and equations." },
        ],
      },
      {
        id: "m2", title: "Linear Equations", lessons: [
          { id: "l4", title: "One-Step Equations", description: "Solving equations using inverse operations with integers and fractions." },
          { id: "l5", title: "Multi-Step Equations", description: "Equations requiring multiple steps; solving with variables on both sides." },
          { id: "l6", title: "Literal Equations", description: "Rearranging formulas to solve for any given variable." },
          { id: "l7", title: "Word Problems with Equations", description: "Setting up and solving age problems, distance problems, and mixture problems." },
        ],
      },
      {
        id: "m3", title: "Inequalities", lessons: [
          { id: "l8", title: "Linear Inequalities", description: "Solving and graphing one-variable inequalities on a number line." },
          { id: "l9", title: "Compound Inequalities", description: "AND/OR compound inequalities and interval notation." },
          { id: "l10", title: "Absolute Value Equations & Inequalities", description: "Solving equations and inequalities involving absolute value expressions." },
        ],
      },
      {
        id: "m4", title: "Systems of Equations", lessons: [
          { id: "l11", title: "Solving by Substitution", description: "Substituting one equation into another to find the intersection point." },
          { id: "l12", title: "Solving by Elimination", description: "Adding or subtracting equations to eliminate a variable." },
          { id: "l13", title: "Word Problems with Systems", description: "Translating two-variable scenarios into systems and solving them." },
        ],
      },
    ],
  },
  {
    id: "math-geometry",
    subjectId: "mathematics",
    title: "Geometry & Trigonometry",
    description: "Explore shapes, space, and the relationship between angles and sides with trigonometric functions.",
    level: "intermediate",
    duration: "6 weeks",
    modules: [
      {
        id: "m1", title: "Plane Geometry", lessons: [
          { id: "l1", title: "Lines, Angles & Triangles", description: "Types of angles, parallel lines, transversals and triangle classification." },
          { id: "l2", title: "Congruence & Similarity", description: "Congruence criteria (SSS, SAS, ASA) and similarity ratios." },
          { id: "l3", title: "Quadrilaterals & Polygons", description: "Properties of parallelograms, rectangles, rhombi, trapezoids and regular polygons." },
          { id: "l4", title: "Circles", description: "Radius, diameter, circumference, arc length, sector area and central angles." },
        ],
      },
      {
        id: "m2", title: "Area & Volume", lessons: [
          { id: "l5", title: "Area of 2D Shapes", description: "Formulas for area of triangles, quadrilaterals, circles and composite figures." },
          { id: "l6", title: "Surface Area of 3D Shapes", description: "Nets and surface area of prisms, cylinders, pyramids, cones and spheres." },
          { id: "l7", title: "Volume of 3D Shapes", description: "Volume formulas and Cavalieri's principle applied to solids." },
        ],
      },
      {
        id: "m3", title: "The Pythagorean Theorem", lessons: [
          { id: "l8", title: "Pythagorean Theorem", description: "Proof, applications in 2D and 3D, and converse of the theorem." },
          { id: "l9", title: "Special Right Triangles", description: "45-45-90 and 30-60-90 triangles and their side ratios." },
          { id: "l10", title: "Distance & Midpoint", description: "Distance formula and midpoint formula on the coordinate plane." },
        ],
      },
      {
        id: "m4", title: "Trigonometry Fundamentals", lessons: [
          { id: "l11", title: "SOH-CAH-TOA", description: "Sine, cosine and tangent ratios in right triangles with angle of elevation/depression." },
          { id: "l12", title: "The Unit Circle", description: "Radian measure, unit circle values at 30°, 45°, 60°, 90° and their exact values." },
          { id: "l13", title: "Trig Functions & Graphs", description: "Graphs of sin, cos and tan: amplitude, period, phase shift and vertical shift." },
          { id: "l14", title: "Trigonometric Identities", description: "Pythagorean identities, reciprocal identities and co-function identities." },
        ],
      },
    ],
  },
  {
    id: "math-precalculus",
    subjectId: "mathematics",
    title: "Pre-Calculus",
    description: "Bridge the gap to calculus with advanced functions, analytic geometry, and an introduction to limits.",
    level: "intermediate",
    duration: "6 weeks",
    modules: [
      {
        id: "m1", title: "Functions & Their Graphs", lessons: [
          { id: "l1", title: "Function Notation & Domain/Range", description: "Defining functions, function notation, domain and range from graphs and equations." },
          { id: "l2", title: "Transformations of Functions", description: "Shifts, reflections, stretches and compressions of parent functions." },
          { id: "l3", title: "Composition & Inverse Functions", description: "Composing functions, finding inverses algebraically and graphically." },
        ],
      },
      {
        id: "m2", title: "Polynomial & Rational Functions", lessons: [
          { id: "l4", title: "Polynomial Functions", description: "End behavior, zeros, multiplicity and graphing polynomials." },
          { id: "l5", title: "Rational Functions", description: "Asymptotes, holes and graphing rational functions." },
          { id: "l6", title: "Polynomial Division", description: "Long division and synthetic division; Remainder and Factor Theorems." },
        ],
      },
      {
        id: "m3", title: "Exponentials & Logarithms", lessons: [
          { id: "l7", title: "Exponential Functions", description: "Growth and decay models, base e and exponential equations." },
          { id: "l8", title: "Logarithmic Functions", description: "Log as the inverse of exponential; properties and change-of-base formula." },
          { id: "l9", title: "Solving Exponential & Log Equations", description: "Using properties of logarithms to solve equations in real-world contexts." },
        ],
      },
      {
        id: "m4", title: "Introduction to Limits", lessons: [
          { id: "l10", title: "Intuitive Concept of a Limit", description: "What a limit is; one-sided limits and limits at infinity via tables and graphs." },
          { id: "l11", title: "Limit Laws", description: "Sum, product, quotient and composition rules for calculating limits algebraically." },
          { id: "l12", title: "Continuity", description: "Definition of continuity, types of discontinuity and the Intermediate Value Theorem." },
        ],
      },
    ],
  },
  {
    id: "math-calculus",
    subjectId: "mathematics",
    title: "Calculus I: Differentiation",
    description: "A rigorous introduction to differential calculus — limits, derivatives and their applications.",
    level: "advanced",
    duration: "8 weeks",
    modules: [
      {
        id: "m1", title: "Limits & Continuity", lessons: [
          { id: "l1", title: "Formal Definition of a Limit", description: "Epsilon-delta definition, limit laws and computing limits algebraically." },
          { id: "l2", title: "Limits Involving Infinity", description: "Horizontal and vertical asymptotes via limits; limits at infinity." },
          { id: "l3", title: "Squeeze Theorem", description: "Using the Squeeze Theorem for difficult limits including sin(x)/x as x→0." },
        ],
      },
      {
        id: "m2", title: "The Derivative", lessons: [
          { id: "l4", title: "Definition of the Derivative", description: "Derivative as a limit of the difference quotient; tangent lines and instantaneous rate." },
          { id: "l5", title: "Differentiation Rules", description: "Power, constant, sum/difference rules and derivatives of exponentials and logs." },
          { id: "l6", title: "Product & Quotient Rules", description: "Differentiating products and quotients of functions with examples." },
          { id: "l7", title: "Chain Rule", description: "Differentiating composite functions; implicit differentiation." },
        ],
      },
      {
        id: "m3", title: "Derivative of Trig Functions", lessons: [
          { id: "l8", title: "Derivatives of sin, cos, tan", description: "Computing derivatives of all six trig functions and their proofs." },
          { id: "l9", title: "Inverse Trig Derivatives", description: "Derivatives of arcsin, arccos, arctan with applications." },
        ],
      },
      {
        id: "m4", title: "Applications of Derivatives", lessons: [
          { id: "l10", title: "Critical Points & Extrema", description: "Finding max/min using the First and Second Derivative Tests." },
          { id: "l11", title: "Curve Sketching", description: "Using derivatives to determine increasing/decreasing behavior and concavity." },
          { id: "l12", title: "Optimization Problems", description: "Real-world min/max problems: area, volume, cost and revenue optimization." },
          { id: "l13", title: "Related Rates", description: "Setting up and solving problems where multiple quantities change over time." },
        ],
      },
    ],
  },
  {
    id: "math-statistics",
    subjectId: "mathematics",
    title: "Statistics & Probability",
    description: "Analyze data, understand distributions, and make predictions using statistical reasoning.",
    level: "intermediate",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "Descriptive Statistics", lessons: [
          { id: "l1", title: "Measures of Central Tendency", description: "Mean, median and mode — when to use each, and the effect of outliers." },
          { id: "l2", title: "Measures of Spread", description: "Range, variance, standard deviation and interquartile range." },
          { id: "l3", title: "Data Visualization", description: "Histograms, box plots, scatter plots and their interpretation." },
        ],
      },
      {
        id: "m2", title: "Probability", lessons: [
          { id: "l4", title: "Basic Probability Rules", description: "Sample spaces, events, addition rule, complement and multiplication rule." },
          { id: "l5", title: "Conditional Probability", description: "P(A|B), independence and Bayes' Theorem with real examples." },
          { id: "l6", title: "Counting Techniques", description: "Permutations (nPr), combinations (nCr) and the Fundamental Counting Principle." },
        ],
      },
      {
        id: "m3", title: "Distributions", lessons: [
          { id: "l7", title: "Binomial Distribution", description: "Binomial experiments, formula, mean and standard deviation." },
          { id: "l8", title: "Normal Distribution", description: "Bell curve properties, empirical rule (68-95-99.7) and z-scores." },
          { id: "l9", title: "Sampling Distributions", description: "Central Limit Theorem, standard error and sampling variability." },
        ],
      },
      {
        id: "m4", title: "Statistical Inference", lessons: [
          { id: "l10", title: "Confidence Intervals", description: "Constructing and interpreting confidence intervals for a population mean." },
          { id: "l11", title: "Hypothesis Testing", description: "Null/alternative hypotheses, p-values, Type I and Type II errors." },
          { id: "l12", title: "Linear Regression", description: "Least-squares regression line, correlation coefficient and prediction." },
        ],
      },
    ],
  },
  {
    id: "math-linear-algebra",
    subjectId: "mathematics",
    title: "Linear Algebra",
    description: "Vectors, matrices, transformations and eigenvalues — the mathematics of multi-dimensional space.",
    level: "advanced",
    duration: "7 weeks",
    modules: [
      {
        id: "m1", title: "Vectors", lessons: [
          { id: "l1", title: "Vector Basics", description: "Vectors in Rⁿ, vector addition, scalar multiplication and geometric interpretation." },
          { id: "l2", title: "Dot Product & Cross Product", description: "Computing dot and cross products; angles between vectors and orthogonality." },
          { id: "l3", title: "Linear Combinations & Span", description: "Span of a set of vectors, linear independence and basis." },
        ],
      },
      {
        id: "m2", title: "Matrices", lessons: [
          { id: "l4", title: "Matrix Operations", description: "Addition, scalar multiplication and matrix multiplication with concrete examples." },
          { id: "l5", title: "Matrix Inverse & Determinant", description: "Computing inverses and determinants of 2×2 and 3×3 matrices." },
          { id: "l6", title: "Row Reduction & Echelon Form", description: "Gaussian elimination and reduced row echelon form for solving systems." },
        ],
      },
      {
        id: "m3", title: "Vector Spaces", lessons: [
          { id: "l7", title: "Subspaces", description: "Definition of a subspace; null space and column space of a matrix." },
          { id: "l8", title: "Basis & Dimension", description: "Finding a basis for a vector space; rank-nullity theorem." },
        ],
      },
      {
        id: "m4", title: "Eigenvalues & Eigenvectors", lessons: [
          { id: "l9", title: "Eigenvalues & Eigenvectors", description: "Characteristic polynomial, computing eigenvalues and eigenvectors by hand." },
          { id: "l10", title: "Diagonalization", description: "Diagonalizing a matrix and its applications in differential equations and Markov chains." },
          { id: "l11", title: "Linear Transformations", description: "Matrices as transformations; kernel, image and the matrix representation of a linear map." },
        ],
      },
    ],
  },

  // ─── PHYSICS ──────────────────────────────────────────────────────────────
  {
    id: "physics-fundamentals",
    subjectId: "physics",
    title: "Physics Fundamentals",
    description: "Scientific method, measurement, units and the basics of motion — the starting point for all physics.",
    level: "beginner",
    duration: "4 weeks",
    modules: [
      {
        id: "m1", title: "Measurement & Units", lessons: [
          { id: "l1", title: "SI Units & Prefixes", description: "The seven base SI units, common prefixes (kilo, milli, micro) and unit conversion." },
          { id: "l2", title: "Significant Figures & Scientific Notation", description: "Rules for sig figs, rounding and expressing large/small numbers in scientific notation." },
          { id: "l3", title: "Dimensional Analysis", description: "Using unit factors to convert between measurement systems and check equations." },
        ],
      },
      {
        id: "m2", title: "Kinematics in 1D", lessons: [
          { id: "l4", title: "Distance, Displacement & Speed", description: "Scalar vs vector quantities; average speed and average velocity." },
          { id: "l5", title: "Acceleration", description: "Definition of acceleration, uniform acceleration, and sign conventions." },
          { id: "l6", title: "Kinematic Equations", description: "The four kinematic equations for constant acceleration with worked examples." },
          { id: "l7", title: "Free Fall", description: "Gravity as constant acceleration (g = 9.8 m/s²), projectile drops and time of flight." },
        ],
      },
      {
        id: "m3", title: "Kinematics in 2D", lessons: [
          { id: "l8", title: "Vectors in 2D", description: "Component form, magnitude, direction and vector addition in two dimensions." },
          { id: "l9", title: "Projectile Motion", description: "Horizontal and vertical components of projectile motion; range and maximum height." },
          { id: "l10", title: "Relative Motion", description: "Frames of reference and adding relative velocities." },
        ],
      },
    ],
  },
  {
    id: "physics-mechanics",
    subjectId: "physics",
    title: "Classical Mechanics",
    description: "Newton's laws, energy, momentum and rotation — the core of classical physics.",
    level: "intermediate",
    duration: "7 weeks",
    modules: [
      {
        id: "m1", title: "Newton's Laws", lessons: [
          { id: "l1", title: "Newton's First Law (Inertia)", description: "Inertia, net force and equilibrium with examples of balanced/unbalanced forces." },
          { id: "l2", title: "Newton's Second Law (F = ma)", description: "Applying F = ma to single objects and systems; free body diagrams." },
          { id: "l3", title: "Newton's Third Law", description: "Action-reaction pairs, identifying third-law partners in real situations." },
          { id: "l4", title: "Friction & Normal Force", description: "Static vs kinetic friction, coefficients, inclined planes and tension." },
        ],
      },
      {
        id: "m2", title: "Work & Energy", lessons: [
          { id: "l5", title: "Work Done by a Force", description: "W = Fd·cosθ, work done by variable forces and the Work-Energy Theorem." },
          { id: "l6", title: "Kinetic & Potential Energy", description: "KE = ½mv², gravitational PE = mgh, elastic PE = ½kx²." },
          { id: "l7", title: "Conservation of Energy", description: "Isolated systems, energy transformation, efficiency and power." },
        ],
      },
      {
        id: "m3", title: "Momentum & Collisions", lessons: [
          { id: "l8", title: "Linear Momentum & Impulse", description: "p = mv, impulse-momentum theorem and force-time graphs." },
          { id: "l9", title: "Conservation of Momentum", description: "Applying momentum conservation to explosions and collisions." },
          { id: "l10", title: "Elastic & Inelastic Collisions", description: "Distinguishing elastic and inelastic collisions; perfectly inelastic collision formula." },
        ],
      },
      {
        id: "m4", title: "Rotational Motion", lessons: [
          { id: "l11", title: "Angular Kinematics", description: "Angular displacement, velocity, acceleration and kinematic equations in rotation." },
          { id: "l12", title: "Torque & Moment of Inertia", description: "τ = rF·sinθ, moment of inertia for common shapes and Newton's 2nd law in rotation." },
          { id: "l13", title: "Angular Momentum", description: "L = Iω, conservation of angular momentum and examples (spinning ice skater)." },
        ],
      },
    ],
  },
  {
    id: "physics-em",
    subjectId: "physics",
    title: "Electricity & Magnetism",
    description: "Electric charges, fields, circuits, magnetic forces and electromagnetic induction.",
    level: "intermediate",
    duration: "7 weeks",
    modules: [
      {
        id: "m1", title: "Electrostatics", lessons: [
          { id: "l1", title: "Electric Charge & Coulomb's Law", description: "Positive/negative charge, conductors/insulators, Coulomb's Law F = kq₁q₂/r²." },
          { id: "l2", title: "Electric Fields", description: "Field lines, E = F/q, field of a point charge and superposition principle." },
          { id: "l3", title: "Electric Potential & Voltage", description: "Work done against electric field, potential energy, voltage V = W/q." },
        ],
      },
      {
        id: "m2", title: "DC Circuits", lessons: [
          { id: "l4", title: "Ohm's Law & Resistance", description: "V = IR, resistivity, factors affecting resistance and I-V characteristics." },
          { id: "l5", title: "Series & Parallel Circuits", description: "Equivalent resistance, current and voltage rules for series and parallel combinations." },
          { id: "l6", title: "Kirchhoff's Laws", description: "KCL and KVL for analyzing multi-loop circuits with worked examples." },
          { id: "l7", title: "Power in Circuits", description: "P = IV = I²R = V²/R; energy consumption and the kilowatt-hour." },
        ],
      },
      {
        id: "m3", title: "Magnetism", lessons: [
          { id: "l8", title: "Magnetic Fields & Forces", description: "F = qv×B, right-hand rules, force on a current-carrying conductor." },
          { id: "l9", title: "Magnetic Field Sources", description: "Biot-Savart law overview, field of a long wire and solenoids." },
        ],
      },
      {
        id: "m4", title: "Electromagnetic Induction", lessons: [
          { id: "l10", title: "Faraday's Law", description: "Magnetic flux, Faraday's law of induction, Lenz's Law and sign convention." },
          { id: "l11", title: "AC Generation & Transformers", description: "How generators produce AC; transformer principle and voltage stepping." },
        ],
      },
    ],
  },
  {
    id: "physics-thermo",
    subjectId: "physics",
    title: "Thermodynamics",
    description: "Heat, temperature, the laws of thermodynamics and engines.",
    level: "intermediate",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "Temperature & Heat", lessons: [
          { id: "l1", title: "Temperature Scales", description: "Celsius, Fahrenheit and Kelvin; absolute zero and conversion formulas." },
          { id: "l2", title: "Heat Transfer", description: "Conduction, convection and radiation — mechanisms, examples and thermal conductivity." },
          { id: "l3", title: "Specific Heat Capacity", description: "Q = mcΔT, calorimetry and thermal equilibrium problems." },
        ],
      },
      {
        id: "m2", title: "Laws of Thermodynamics", lessons: [
          { id: "l4", title: "Zeroth & First Laws", description: "Thermal equilibrium; first law ΔU = Q - W and internal energy." },
          { id: "l5", title: "Second Law & Entropy", description: "Direction of heat flow, entropy increase, disorder and irreversibility." },
          { id: "l6", title: "Third Law", description: "Absolute zero and the behavior of entropy at 0 K." },
        ],
      },
      {
        id: "m3", title: "Heat Engines & Cycles", lessons: [
          { id: "l7", title: "Carnot Cycle", description: "Ideal heat engine, Carnot efficiency η = 1 - T_cold/T_hot and its significance." },
          { id: "l8", title: "Real Engines & Refrigerators", description: "Otto cycle, diesel cycle, heat pumps and coefficient of performance." },
        ],
      },
    ],
  },
  {
    id: "physics-waves",
    subjectId: "physics",
    title: "Waves & Optics",
    description: "Mechanical waves, sound, light, reflection, refraction and optical instruments.",
    level: "intermediate",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "Wave Properties", lessons: [
          { id: "l1", title: "Wave Basics", description: "Transverse vs longitudinal waves; wavelength, frequency, amplitude and wave speed." },
          { id: "l2", title: "Interference & Superposition", description: "Constructive and destructive interference; standing waves and nodes." },
          { id: "l3", title: "Doppler Effect", description: "Frequency shift for moving source/observer; applications in radar and medical imaging." },
        ],
      },
      {
        id: "m2", title: "Sound", lessons: [
          { id: "l4", title: "Sound Waves", description: "Pressure waves, speed of sound, intensity, decibels and the human ear." },
          { id: "l5", title: "Resonance & Harmonics", description: "Standing waves in strings and pipes; fundamental frequency and overtones." },
        ],
      },
      {
        id: "m3", title: "Geometric Optics", lessons: [
          { id: "l6", title: "Reflection & Mirrors", description: "Law of reflection, plane and curved mirrors, mirror equation and magnification." },
          { id: "l7", title: "Refraction & Snell's Law", description: "Index of refraction, Snell's Law, total internal reflection and fiber optics." },
          { id: "l8", title: "Lenses & Optical Instruments", description: "Converging and diverging lenses, thin lens equation, eye and telescope." },
        ],
      },
    ],
  },
  {
    id: "physics-modern",
    subjectId: "physics",
    title: "Modern Physics",
    description: "Special relativity, quantum mechanics, atomic structure and nuclear physics.",
    level: "advanced",
    duration: "7 weeks",
    modules: [
      {
        id: "m1", title: "Special Relativity", lessons: [
          { id: "l1", title: "Postulates of Special Relativity", description: "Constant speed of light, reference frames and the Lorentz factor γ." },
          { id: "l2", title: "Time Dilation & Length Contraction", description: "Derivation and applications of Δt = γΔt₀ and L = L₀/γ." },
          { id: "l3", title: "Mass-Energy Equivalence", description: "E = mc², relativistic momentum and kinetic energy." },
        ],
      },
      {
        id: "m2", title: "Quantum Mechanics Basics", lessons: [
          { id: "l4", title: "Wave-Particle Duality", description: "Photoelectric effect, photons, de Broglie wavelength and double-slit experiment." },
          { id: "l5", title: "Heisenberg Uncertainty Principle", description: "ΔxΔp ≥ ℏ/2 and its physical meaning; zero-point energy." },
          { id: "l6", title: "The Schrödinger Equation", description: "Wave functions, probability densities and the infinite square well." },
        ],
      },
      {
        id: "m3", title: "Atomic & Nuclear Physics", lessons: [
          { id: "l7", title: "Atomic Models", description: "Bohr model, energy levels, emission spectra and the hydrogen atom." },
          { id: "l8", title: "Radioactive Decay", description: "Alpha, beta and gamma decay, half-life and decay law N = N₀e^(-λt)." },
          { id: "l9", title: "Nuclear Reactions", description: "Fission, fusion, binding energy and Q-values." },
        ],
      },
    ],
  },

  // ─── CHEMISTRY ────────────────────────────────────────────────────────────
  {
    id: "chem-intro",
    subjectId: "chemistry",
    title: "Introduction to Chemistry",
    description: "Atoms, elements, the periodic table and basic chemical bonding from the ground up.",
    level: "beginner",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "Matter & Atoms", lessons: [
          { id: "l1", title: "States of Matter", description: "Solid, liquid, gas and plasma; physical vs chemical changes." },
          { id: "l2", title: "Atomic Structure", description: "Protons, neutrons, electrons; atomic number, mass number and isotopes." },
          { id: "l3", title: "Electron Configuration", description: "Orbitals, energy levels, Aufbau principle, Hund's rule and Pauli exclusion." },
        ],
      },
      {
        id: "m2", title: "The Periodic Table", lessons: [
          { id: "l4", title: "Organization of the Periodic Table", description: "Periods, groups, metals/nonmetals/metalloids and families of elements." },
          { id: "l5", title: "Periodic Trends", description: "Atomic radius, ionization energy, electronegativity and electron affinity trends." },
        ],
      },
      {
        id: "m3", title: "Chemical Bonding", lessons: [
          { id: "l6", title: "Ionic Bonds", description: "Electron transfer, formation of ions, lattice structure and properties of ionic compounds." },
          { id: "l7", title: "Covalent Bonds", description: "Electron sharing, Lewis structures, polar vs nonpolar bonds." },
          { id: "l8", title: "VSEPR Theory & Molecular Geometry", description: "Predicting shapes using VSEPR: linear, bent, tetrahedral, trigonal planar." },
          { id: "l9", title: "Metallic Bonds & Intermolecular Forces", description: "Sea of electrons model, van der Waals, dipole-dipole, hydrogen bonding." },
        ],
      },
    ],
  },
  {
    id: "chem-reactions",
    subjectId: "chemistry",
    title: "Chemical Reactions & Stoichiometry",
    description: "Balancing equations, types of reactions, and quantitative calculations with the mole concept.",
    level: "beginner",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "Chemical Equations", lessons: [
          { id: "l1", title: "Writing & Balancing Equations", description: "Conservation of mass, balancing by inspection and the activity series." },
          { id: "l2", title: "Types of Reactions", description: "Synthesis, decomposition, single/double displacement, combustion with examples." },
        ],
      },
      {
        id: "m2", title: "The Mole Concept", lessons: [
          { id: "l3", title: "Molar Mass & Avogadro's Number", description: "Calculating molar mass from the periodic table; N_A = 6.022×10²³." },
          { id: "l4", title: "Mole Conversions", description: "Converting between grams, moles and particles using mole ratios." },
          { id: "l5", title: "Empirical & Molecular Formulas", description: "Determining empirical formula from percent composition and finding molecular formula." },
        ],
      },
      {
        id: "m3", title: "Stoichiometry", lessons: [
          { id: "l6", title: "Mole Ratios from Equations", description: "Using balanced equations to find mole-to-mole relationships." },
          { id: "l7", title: "Mass-to-Mass Calculations", description: "Stoichiometry roadmap: grams → moles → moles → grams." },
          { id: "l8", title: "Limiting Reactants & Percent Yield", description: "Identifying the limiting reagent, theoretical yield and percent yield calculations." },
        ],
      },
    ],
  },
  {
    id: "chem-states",
    subjectId: "chemistry",
    title: "States of Matter & Solutions",
    description: "Gas laws, solutions, concentration and colligative properties.",
    level: "intermediate",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "Gas Laws", lessons: [
          { id: "l1", title: "Ideal Gas Law", description: "PV = nRT, Boyle's, Charles's and Avogadro's laws as special cases." },
          { id: "l2", title: "Dalton's Law & Graham's Law", description: "Partial pressures in gas mixtures; effusion and diffusion rates." },
          { id: "l3", title: "Kinetic Molecular Theory", description: "Assumptions of KMT, distribution of molecular speeds and ideal vs real gases." },
        ],
      },
      {
        id: "m2", title: "Solutions & Concentration", lessons: [
          { id: "l4", title: "Types of Solutions", description: "Solute/solvent, electrolytes, solubility rules and factors affecting solubility." },
          { id: "l5", title: "Concentration Units", description: "Molarity (M), molality (m), percent by mass and mole fraction." },
          { id: "l6", title: "Dilution Calculations", description: "C₁V₁ = C₂V₂ and preparing solutions in the lab." },
        ],
      },
      {
        id: "m3", title: "Colligative Properties", lessons: [
          { id: "l7", title: "Boiling Point Elevation & Freezing Point Depression", description: "ΔT = Kf·m·i and ΔT = Kb·m·i with van't Hoff factor for electrolytes." },
          { id: "l8", title: "Osmotic Pressure", description: "π = MRT, osmosis, semipermeable membranes and applications in biology." },
        ],
      },
    ],
  },
  {
    id: "chem-organic",
    subjectId: "chemistry",
    title: "Organic Chemistry Essentials",
    description: "Hydrocarbons, functional groups, nomenclature and key organic reactions.",
    level: "intermediate",
    duration: "7 weeks",
    modules: [
      {
        id: "m1", title: "Hydrocarbons", lessons: [
          { id: "l1", title: "Alkanes & Nomenclature", description: "IUPAC naming of straight and branched-chain alkanes; conformations." },
          { id: "l2", title: "Alkenes & Alkynes", description: "Naming, geometry of double bonds, cis/trans isomerism and hybridization." },
          { id: "l3", title: "Aromatic Compounds", description: "Benzene structure, aromaticity (Hückel's rule) and substituted benzenes." },
        ],
      },
      {
        id: "m2", title: "Functional Groups", lessons: [
          { id: "l4", title: "Alcohols, Ethers & Aldehydes", description: "Structure, naming, physical properties and reactions of each group." },
          { id: "l5", title: "Ketones, Carboxylic Acids & Esters", description: "Structure, naming, acid-base behavior and ester formation." },
          { id: "l6", title: "Amines & Amides", description: "Classification, basicity, hydrogen bonding and biological relevance." },
        ],
      },
      {
        id: "m3", title: "Reaction Mechanisms", lessons: [
          { id: "l7", title: "Nucleophilic Substitution (SN1 & SN2)", description: "Mechanism, stereochemistry, substrate and solvent effects." },
          { id: "l8", title: "Elimination Reactions (E1 & E2)", description: "Zaitsev's rule, Hofmann elimination and competition with substitution." },
          { id: "l9", title: "Addition Reactions to Alkenes", description: "Electrophilic addition, Markovnikov's rule, hydrogenation and halogenation." },
        ],
      },
    ],
  },
  {
    id: "chem-electro",
    subjectId: "chemistry",
    title: "Thermochemistry & Electrochemistry",
    description: "Enthalpy, entropy, free energy, redox reactions and electrochemical cells.",
    level: "intermediate",
    duration: "6 weeks",
    modules: [
      {
        id: "m1", title: "Thermochemistry", lessons: [
          { id: "l1", title: "Enthalpy & Calorimetry", description: "Hess's Law, standard enthalpies of formation, and bomb calorimetry." },
          { id: "l2", title: "Entropy & Gibbs Free Energy", description: "ΔG = ΔH - TΔS, spontaneity and equilibrium at ΔG = 0." },
        ],
      },
      {
        id: "m2", title: "Chemical Equilibrium", lessons: [
          { id: "l3", title: "Equilibrium Constant (K)", description: "Writing K expressions, Kc vs Kp, and the reaction quotient Q." },
          { id: "l4", title: "Le Chatelier's Principle", description: "Predicting shifts in equilibrium due to concentration, pressure and temperature changes." },
        ],
      },
      {
        id: "m3", title: "Electrochemistry", lessons: [
          { id: "l5", title: "Oxidation & Reduction", description: "Assigning oxidation states, balancing redox equations in acidic/basic solution." },
          { id: "l6", title: "Galvanic Cells", description: "Cell notation, standard reduction potentials and E°cell = E°cathode - E°anode." },
          { id: "l7", title: "Electrolysis", description: "Electrolytic cells, Faraday's laws and applications (electroplating, electrolysis of water)." },
        ],
      },
    ],
  },
  {
    id: "chem-analytical",
    subjectId: "chemistry",
    title: "Analytical Chemistry",
    description: "Quantitative analysis techniques: titration, spectroscopy, chromatography and error analysis.",
    level: "advanced",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "Acids, Bases & Titrations", lessons: [
          { id: "l1", title: "pH, pOH & Kw", description: "Strong vs weak acids/bases, Kₐ/K_b, Ka·Kb = Kw, and pH calculations." },
          { id: "l2", title: "Buffer Solutions", description: "Henderson-Hasselbalch equation, buffer capacity and biological buffers." },
          { id: "l3", title: "Titration Curves", description: "Equivalence point, indicators, strong-strong, weak-strong titration curves." },
        ],
      },
      {
        id: "m2", title: "Spectroscopy", lessons: [
          { id: "l4", title: "UV-Vis Spectroscopy", description: "Beer-Lambert Law A = εcl, chromophores and quantitative analysis." },
          { id: "l5", title: "IR Spectroscopy", description: "Molecular vibrations, characteristic absorption bands for functional groups." },
        ],
      },
      {
        id: "m3", title: "Separation Techniques", lessons: [
          { id: "l6", title: "Chromatography", description: "TLC, column, GC and HPLC — stationary/mobile phase and retention factors." },
          { id: "l7", title: "Error Analysis", description: "Systematic vs random error, accuracy vs precision, standard deviation and propagation of error." },
        ],
      },
    ],
  },

  // ─── HISTORY ──────────────────────────────────────────────────────────────
  {
    id: "hist-ancient",
    subjectId: "history",
    title: "Ancient World History",
    description: "From the first civilizations in Mesopotamia to the fall of the Western Roman Empire.",
    level: "beginner",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "First Civilizations", lessons: [
          { id: "l1", title: "Mesopotamia", description: "Sumerians, cuneiform writing, city-states, the Code of Hammurabi and Babylon." },
          { id: "l2", title: "Ancient Egypt", description: "Pharaohs, dynasties, pyramids, the Nile, religion and the New Kingdom." },
          { id: "l3", title: "Indus Valley & Early China", description: "Harappa, Mohenjo-daro, Yellow River civilizations and the Shang Dynasty." },
        ],
      },
      {
        id: "m2", title: "Classical Greece", lessons: [
          { id: "l4", title: "City-States & Democracy", description: "Athens, Sparta, the polis system and the birth of democracy under Cleisthenes." },
          { id: "l5", title: "Persian Wars & Classical Age", description: "Marathon, Thermopylae, Salamis and the golden age of Pericles." },
          { id: "l6", title: "Alexander the Great & Hellenism", description: "Alexander's conquests, the spread of Greek culture and Hellenistic kingdoms." },
        ],
      },
      {
        id: "m3", title: "Rome", lessons: [
          { id: "l7", title: "The Roman Republic", description: "Founding myths, Senate, consuls, Punic Wars and the Social War." },
          { id: "l8", title: "The Roman Empire", description: "Julius Caesar, Augustus, Pax Romana, provinces and Roman engineering." },
          { id: "l9", title: "Decline & Fall of Rome", description: "Crisis of the 3rd century, Diocletian, Constantine, Christianity and 476 AD." },
        ],
      },
    ],
  },
  {
    id: "hist-medieval",
    subjectId: "history",
    title: "Medieval History",
    description: "The Middle Ages in Europe and beyond — feudalism, Crusades, the Black Death and cultural revival.",
    level: "beginner",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "Early Medieval Europe", lessons: [
          { id: "l1", title: "The Byzantine Empire", description: "Eastern Roman Empire, Justinian, Hagia Sophia and the Corpus Juris Civilis." },
          { id: "l2", title: "The Rise of Islam", description: "Muhammad, the caliphates, Islamic golden age and the spread of Islam to 750 AD." },
          { id: "l3", title: "Charlemagne & the Carolingians", description: "Charlemagne's empire, feudalism and the revival of learning in Western Europe." },
        ],
      },
      {
        id: "m2", title: "High Medieval Period", lessons: [
          { id: "l4", title: "The Crusades", description: "Causes, seven major Crusades, consequences for Europe and the Middle East." },
          { id: "l5", title: "Feudal Society & the Church", description: "Manor economy, serf-lord relationships, papal power and the Investiture Controversy." },
          { id: "l6", title: "Magna Carta & Parliament", description: "King John, barons, Magna Carta 1215, and the development of representative government." },
        ],
      },
      {
        id: "m3", title: "Late Middle Ages", lessons: [
          { id: "l7", title: "The Black Death", description: "Origins, spread, mortality (30-50% of Europe), social and economic consequences." },
          { id: "l8", title: "Hundred Years' War & Joan of Arc", description: "English-French conflict, the role of Joan of Arc and the emergence of nationalism." },
          { id: "l9", title: "The Ottoman Empire", description: "Rise of the Ottomans, fall of Constantinople 1453 and Suleiman the Magnificent." },
        ],
      },
    ],
  },
  {
    id: "hist-exploration",
    subjectId: "history",
    title: "Renaissance & Age of Exploration",
    description: "The rebirth of classical learning, European voyages of discovery and the Reformation.",
    level: "intermediate",
    duration: "4 weeks",
    modules: [
      {
        id: "m1", title: "The Renaissance", lessons: [
          { id: "l1", title: "Renaissance Origins in Italy", description: "Florence, Medici patronage, humanism and the rediscovery of classical texts." },
          { id: "l2", title: "Renaissance Art & Science", description: "Leonardo, Michelangelo, Galileo, Copernicus and the Scientific Revolution." },
          { id: "l3", title: "The Printing Press", description: "Gutenberg's press, spread of literacy and its impact on religion and politics." },
        ],
      },
      {
        id: "m2", title: "Exploration & Colonization", lessons: [
          { id: "l4", title: "Portuguese Exploration", description: "Prince Henry, Vasco da Gama, circumnavigation of Africa and the spice trade." },
          { id: "l5", title: "Columbus & the Americas", description: "1492, the Columbian Exchange, conquistadors and the destruction of Aztec/Inca empires." },
          { id: "l6", title: "The Protestant Reformation", description: "Luther's 95 Theses, Calvin, Henry VIII and the Wars of Religion." },
        ],
      },
    ],
  },
  {
    id: "hist-revolutions",
    subjectId: "history",
    title: "Revolutions & Nationalism",
    description: "The American, French and Industrial Revolutions that transformed the modern world.",
    level: "intermediate",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "American Revolution", lessons: [
          { id: "l1", title: "Colonial Grievances & Enlightenment Ideas", description: "Taxation, Locke, Montesquieu, Common Sense and the path to independence." },
          { id: "l2", title: "The Revolution & Constitution", description: "Key battles, Declaration of Independence, Articles of Confederation and the 1787 Constitution." },
        ],
      },
      {
        id: "m2", title: "French Revolution", lessons: [
          { id: "l3", title: "Causes of the French Revolution", description: "Financial crisis, Estates system, Enlightenment ideas and the Estates-General." },
          { id: "l4", title: "Revolution to Terror", description: "Declaration of the Rights of Man, constitutional monarchy, the Terror and Robespierre." },
          { id: "l5", title: "Napoleon Bonaparte", description: "Rise of Napoleon, the Napoleonic Code, campaigns across Europe and the Congress of Vienna." },
        ],
      },
      {
        id: "m3", title: "Industrial Revolution", lessons: [
          { id: "l6", title: "Origins in Britain", description: "Steam engine, textile mills, coal and iron; why Britain industrialized first." },
          { id: "l7", title: "Social Impact of Industrialization", description: "Urbanization, working conditions, child labor, labor movements and socialism." },
          { id: "l8", title: "Spread to Europe & America", description: "Railroads, steel, factories across Europe; Gilded Age in the United States." },
        ],
      },
    ],
  },
  {
    id: "hist-ww",
    subjectId: "history",
    title: "World Wars I & II",
    description: "The causes, major events and consequences of both World Wars.",
    level: "intermediate",
    duration: "6 weeks",
    modules: [
      {
        id: "m1", title: "World War I", lessons: [
          { id: "l1", title: "Causes of WWI (MAIN)", description: "Militarism, Alliances, Imperialism, Nationalism and the assassination of Franz Ferdinand." },
          { id: "l2", title: "The War 1914–1918", description: "Western Front, trench warfare, new weapons and major battles (Somme, Verdun)." },
          { id: "l3", title: "End of WWI & Treaty of Versailles", description: "US entry, German defeat, the Fourteen Points and the harsh peace terms." },
        ],
      },
      {
        id: "m2", title: "Interwar Period", lessons: [
          { id: "l4", title: "Rise of Fascism & Nazism", description: "Great Depression, Mussolini, Hitler's rise to power, the Third Reich." },
          { id: "l5", title: "Appeasement & the Road to War", description: "Remilitarization, Munich Agreement, Spanish Civil War and the invasion of Poland." },
        ],
      },
      {
        id: "m3", title: "World War II", lessons: [
          { id: "l6", title: "European Theater", description: "Blitzkrieg, Fall of France, Battle of Britain, Operation Barbarossa and D-Day." },
          { id: "l7", title: "The Holocaust", description: "Nazi racial ideology, ghettos, Einsatzgruppen, the Final Solution and liberation." },
          { id: "l8", title: "Pacific Theater & End of War", description: "Pearl Harbor, island-hopping, Hiroshima and Nagasaki, V-J Day." },
        ],
      },
    ],
  },
  {
    id: "hist-coldwar",
    subjectId: "history",
    title: "Cold War & Contemporary World",
    description: "From 1945 to the present: the Cold War, decolonization, globalization and current geopolitics.",
    level: "intermediate",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "The Cold War", lessons: [
          { id: "l1", title: "Origins of the Cold War", description: "Iron Curtain, Truman Doctrine, Marshall Plan, NATO and the Berlin Blockade." },
          { id: "l2", title: "Korean War & Nuclear Arms Race", description: "Korean War 1950-53, Sputnik, MAD doctrine, and the Cuban Missile Crisis." },
          { id: "l3", title: "Vietnam & Détente", description: "Vietnam War, domino theory, Nixon's détente, Helsinki Accords." },
          { id: "l4", title: "End of the Cold War", description: "Reagan, Gorbachev's reforms, fall of the Berlin Wall (1989) and Soviet dissolution (1991)." },
        ],
      },
      {
        id: "m2", title: "Decolonization & Globalization", lessons: [
          { id: "l5", title: "Decolonization in Africa & Asia", description: "Independence movements, partition of India, African independence wave (1960s)." },
          { id: "l6", title: "The Middle East", description: "Creation of Israel, Arab-Israeli conflicts, oil crises and the Iranian Revolution." },
          { id: "l7", title: "Globalization", description: "Rise of multinational corporations, WTO, EU, digital revolution and global inequality." },
        ],
      },
    ],
  },

  // ─── BIOLOGY ──────────────────────────────────────────────────────────────
  {
    id: "bio-cell",
    subjectId: "biology",
    title: "Cell Biology",
    description: "The fundamental unit of life — cell structure, organelles, membranes and cell division.",
    level: "beginner",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "Cell Structure", lessons: [
          { id: "l1", title: "Prokaryotes vs Eukaryotes", description: "Key differences, examples and the endosymbiotic theory." },
          { id: "l2", title: "Animal Cell Organelles", description: "Nucleus, mitochondria, ER, Golgi, lysosomes and their functions." },
          { id: "l3", title: "Plant Cell Features", description: "Cell wall, chloroplasts, central vacuole and how plant cells differ from animal cells." },
        ],
      },
      {
        id: "m2", title: "Cell Membrane & Transport", lessons: [
          { id: "l4", title: "Fluid Mosaic Model", description: "Phospholipid bilayer, membrane proteins, cholesterol and membrane fluidity." },
          { id: "l5", title: "Passive Transport", description: "Diffusion, osmosis, facilitated diffusion and tonicity (hypotonic/hypertonic/isotonic)." },
          { id: "l6", title: "Active Transport", description: "Na⁺/K⁺ pump, endocytosis, exocytosis and the cost in ATP." },
        ],
      },
      {
        id: "m3", title: "Cell Division", lessons: [
          { id: "l7", title: "The Cell Cycle", description: "G1, S, G2 and M phases; checkpoints and regulation of the cell cycle." },
          { id: "l8", title: "Mitosis", description: "Prophase, metaphase, anaphase, telophase; cytokinesis and identical daughter cells." },
          { id: "l9", title: "Meiosis", description: "Two rounds of division, crossing over, genetic variation and haploid gametes." },
        ],
      },
    ],
  },
  {
    id: "bio-genetics",
    subjectId: "biology",
    title: "Genetics & Heredity",
    description: "Mendelian genetics, DNA structure, gene expression and modern genetics.",
    level: "intermediate",
    duration: "6 weeks",
    modules: [
      {
        id: "m1", title: "Mendelian Genetics", lessons: [
          { id: "l1", title: "Mendel's Laws", description: "Law of Segregation, Law of Independent Assortment and probability in genetics." },
          { id: "l2", title: "Punnett Squares & Genotypes", description: "Monohybrid and dihybrid crosses; dominant, recessive and codominant alleles." },
          { id: "l3", title: "Non-Mendelian Inheritance", description: "Incomplete dominance, codominance, multiple alleles (ABO blood type) and sex-linkage." },
        ],
      },
      {
        id: "m2", title: "DNA Structure & Replication", lessons: [
          { id: "l4", title: "DNA Double Helix", description: "Watson-Crick model, base pairing (A-T, G-C), antiparallel strands and histones." },
          { id: "l5", title: "DNA Replication", description: "Semi-conservative replication, helicase, primase, DNA polymerase and Okazaki fragments." },
          { id: "l6", title: "DNA Repair Mechanisms", description: "Proofreading by DNA polymerase, mismatch repair and nucleotide excision repair." },
        ],
      },
      {
        id: "m3", title: "Gene Expression", lessons: [
          { id: "l7", title: "Transcription", description: "RNA polymerase, promoters, the three types of RNA and mRNA processing." },
          { id: "l8", title: "Translation", description: "Ribosomes, codons, tRNA and the genetic code from start to stop codon." },
          { id: "l9", title: "Gene Regulation", description: "Lac operon, trp operon, eukaryotic gene regulation and epigenetics." },
        ],
      },
    ],
  },
  {
    id: "bio-evolution",
    subjectId: "biology",
    title: "Evolution & Natural Selection",
    description: "Darwin's theory, mechanisms of evolution, speciation and the evidence for evolution.",
    level: "intermediate",
    duration: "4 weeks",
    modules: [
      {
        id: "m1", title: "Foundations of Evolution", lessons: [
          { id: "l1", title: "Darwin & Natural Selection", description: "Darwin's voyage, observations, artificial selection and the four conditions of natural selection." },
          { id: "l2", title: "Evidence for Evolution", description: "Fossil record, comparative anatomy, biogeography, molecular evidence and vestigial structures." },
          { id: "l3", title: "Population Genetics & Hardy-Weinberg", description: "Allele frequencies, Hardy-Weinberg equilibrium and conditions for no evolution." },
        ],
      },
      {
        id: "m2", title: "Mechanisms of Evolution", lessons: [
          { id: "l4", title: "Genetic Drift & Gene Flow", description: "Bottleneck effect, founder effect and migration as evolutionary forces." },
          { id: "l5", title: "Types of Natural Selection", description: "Directional, stabilizing, disruptive and sexual selection with examples." },
          { id: "l6", title: "Speciation", description: "Allopatric and sympatric speciation, reproductive isolation and adaptive radiation." },
        ],
      },
    ],
  },
  {
    id: "bio-anatomy",
    subjectId: "biology",
    title: "Human Anatomy & Physiology",
    description: "The structure and function of the major organ systems of the human body.",
    level: "intermediate",
    duration: "8 weeks",
    modules: [
      {
        id: "m1", title: "Circulatory & Respiratory Systems", lessons: [
          { id: "l1", title: "The Heart & Blood Vessels", description: "Heart chambers, cardiac cycle, blood pressure, arteries, veins and capillaries." },
          { id: "l2", title: "Blood & Immune Function", description: "Red/white blood cells, platelets, ABO system and the lymphatic system." },
          { id: "l3", title: "Respiratory System", description: "Lungs, alveoli, gas exchange (O₂/CO₂), breathing mechanics and respiratory control." },
        ],
      },
      {
        id: "m2", title: "Digestive & Excretory Systems", lessons: [
          { id: "l4", title: "Digestive System", description: "From mouth to large intestine: enzymes, nutrient absorption and gut microbiome." },
          { id: "l5", title: "Kidneys & Excretion", description: "Nephron structure, filtration, reabsorption, secretion and urine formation." },
        ],
      },
      {
        id: "m3", title: "Nervous & Endocrine Systems", lessons: [
          { id: "l6", title: "Neurons & Action Potentials", description: "Resting potential, action potential, saltatory conduction and synaptic transmission." },
          { id: "l7", title: "The Brain & Nervous System", description: "CNS vs PNS, brain regions (cortex, cerebellum, brainstem) and their functions." },
          { id: "l8", title: "Hormones & the Endocrine System", description: "Pituitary, thyroid, adrenal glands; insulin/glucagon, negative feedback loops." },
        ],
      },
    ],
  },
  {
    id: "bio-ecology",
    subjectId: "biology",
    title: "Ecology & the Environment",
    description: "Ecosystems, food webs, population dynamics, biodiversity and environmental threats.",
    level: "intermediate",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "Ecosystems & Energy Flow", lessons: [
          { id: "l1", title: "Abiotic & Biotic Factors", description: "Components of ecosystems; producers, consumers, decomposers and trophic levels." },
          { id: "l2", title: "Food Webs & Energy Pyramids", description: "Energy transfer (10% rule), biomass pyramids and ecological efficiency." },
          { id: "l3", title: "Biogeochemical Cycles", description: "Carbon, nitrogen, phosphorus and water cycles and human impacts on each." },
        ],
      },
      {
        id: "m2", title: "Population Ecology", lessons: [
          { id: "l4", title: "Population Growth Models", description: "Exponential vs logistic growth, carrying capacity (K) and limiting factors." },
          { id: "l5", title: "Interspecific Interactions", description: "Predation, competition, mutualism, commensalism, parasitism with real examples." },
        ],
      },
      {
        id: "m3", title: "Biodiversity & Conservation", lessons: [
          { id: "l6", title: "Biomes of the World", description: "Tropical rainforest, tundra, desert, grassland, temperate forest — climate and species." },
          { id: "l7", title: "Threats to Biodiversity", description: "Habitat destruction, invasive species, pollution, climate change and overexploitation." },
          { id: "l8", title: "Conservation Strategies", description: "Protected areas, captive breeding, corridors, CITES and the IUCN Red List." },
        ],
      },
    ],
  },
  {
    id: "bio-molecular",
    subjectId: "biology",
    title: "Molecular Biology & Biotechnology",
    description: "Recombinant DNA, gene editing, genomics and the tools of modern molecular biology.",
    level: "advanced",
    duration: "6 weeks",
    modules: [
      {
        id: "m1", title: "Recombinant DNA Technology", lessons: [
          { id: "l1", title: "Restriction Enzymes & Cloning", description: "Restriction sites, ligation, plasmid vectors and transformation." },
          { id: "l2", title: "PCR", description: "Polymerase Chain Reaction: denaturation, annealing, extension and applications." },
          { id: "l3", title: "Gel Electrophoresis", description: "Separating DNA fragments by size; DNA fingerprinting and forensic applications." },
        ],
      },
      {
        id: "m2", title: "Gene Editing & Genomics", lessons: [
          { id: "l4", title: "CRISPR-Cas9", description: "Mechanism of CRISPR, guide RNA, off-target effects and therapeutic applications." },
          { id: "l5", title: "Genomics & Bioinformatics", description: "Whole-genome sequencing, BLAST, phylogenomics and the Human Genome Project." },
          { id: "l6", title: "Stem Cells & Genetic Engineering", description: "Pluripotency, iPSCs, transgenic organisms and ethical considerations." },
        ],
      },
    ],
  },

  // ─── GEOGRAPHY ────────────────────────────────────────────────────────────
  {
    id: "geo-physical",
    subjectId: "geography",
    title: "Physical Geography",
    description: "Landforms, tectonic plates, climate systems, biomes and hydrological processes.",
    level: "beginner",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "Earth's Structure & Plate Tectonics", lessons: [
          { id: "l1", title: "Interior of the Earth", description: "Crust, mantle, outer/inner core; seismic waves and how we know what's inside." },
          { id: "l2", title: "Plate Tectonics", description: "Divergent, convergent and transform boundaries; seafloor spreading and hot spots." },
          { id: "l3", title: "Earthquakes & Volcanoes", description: "Richter/Moment magnitude scales, epicenter, Ring of Fire and volcanic types." },
        ],
      },
      {
        id: "m2", title: "Landforms & Erosion", lessons: [
          { id: "l4", title: "Mountains & Valleys", description: "Fold, fault-block and dome mountains; river valleys and glacial landforms." },
          { id: "l5", title: "Coastal & Desert Landforms", description: "Cliffs, beaches, sand dunes, wadis and erosion by wind and water." },
        ],
      },
      {
        id: "m3", title: "Climate & Weather", lessons: [
          { id: "l6", title: "Atmospheric Circulation", description: "Coriolis effect, Hadley/Ferrel/Polar cells, trade winds and jet streams." },
          { id: "l7", title: "Climate Zones", description: "Köppen classification: tropical, arid, temperate, continental, polar." },
          { id: "l8", title: "Oceans & El Niño", description: "Ocean currents, thermohaline circulation, ENSO cycle and its global effects." },
        ],
      },
    ],
  },
  {
    id: "geo-human",
    subjectId: "geography",
    title: "Human Geography",
    description: "Population, migration, urbanization, culture and economic development across the world.",
    level: "beginner",
    duration: "4 weeks",
    modules: [
      {
        id: "m1", title: "Population", lessons: [
          { id: "l1", title: "Population Distribution & Density", description: "Where people live and why; ecumene, push and pull factors." },
          { id: "l2", title: "Demographic Transition Model", description: "Four stages, birth/death rates, natural increase and population pyramids." },
          { id: "l3", title: "Migration", description: "Types of migration, Ravenstein's laws, refugees and diaspora communities." },
        ],
      },
      {
        id: "m2", title: "Urbanization & Settlement", lessons: [
          { id: "l4", title: "Urban Structures", description: "CBD, suburban sprawl, concentric zone, sector and multiple nuclei models." },
          { id: "l5", title: "Megacities & Urbanization Trends", description: "Global urbanization rates, megacities (10M+), informal settlements and gentrification." },
        ],
      },
      {
        id: "m3", title: "Culture & Development", lessons: [
          { id: "l6", title: "Cultural Landscapes", description: "Language distribution, religion, ethnicity and cultural diffusion." },
          { id: "l7", title: "Development Indicators", description: "GDP, HDI, GNI per capita, education and health indices; core-periphery model." },
        ],
      },
    ],
  },
  {
    id: "geo-europe",
    subjectId: "geography",
    title: "European Geography",
    description: "Physical features, countries, capitals, economies and the political geography of Europe.",
    level: "intermediate",
    duration: "4 weeks",
    modules: [
      {
        id: "m1", title: "Physical Europe", lessons: [
          { id: "l1", title: "Major Landforms & Rivers", description: "Alps, Pyrenees, Scandinavian mountains; Rhine, Danube, Thames and Volga." },
          { id: "l2", title: "Climate Regions of Europe", description: "Atlantic, continental, Mediterranean, subarctic climates and their influence." },
        ],
      },
      {
        id: "m2", title: "Western & Northern Europe", lessons: [
          { id: "l3", title: "British Isles & Scandinavia", description: "UK, Ireland, Norway, Sweden, Denmark, Finland — geography and economies." },
          { id: "l4", title: "France, Germany & Benelux", description: "Key physical and human geography features of Western Europe's core." },
        ],
      },
      {
        id: "m3", title: "Southern & Eastern Europe", lessons: [
          { id: "l5", title: "Mediterranean Countries", description: "Spain, Portugal, Italy, Greece — climate, tourism, history and EU membership." },
          { id: "l6", title: "Eastern Europe & the Balkans", description: "Poland, Czech Republic, Hungary, Balkans — post-communist transitions." },
          { id: "l7", title: "The European Union", description: "EU institutions, Eurozone, Schengen Area, enlargement and Brexit." },
        ],
      },
    ],
  },
  {
    id: "geo-world",
    subjectId: "geography",
    title: "World Regional Geography",
    description: "Physical and human geography of the Americas, Asia, Africa and Oceania.",
    level: "intermediate",
    duration: "6 weeks",
    modules: [
      {
        id: "m1", title: "The Americas", lessons: [
          { id: "l1", title: "North America", description: "Rockies, Great Plains, Mississippi, climate zones; US, Canada and Mexico geography." },
          { id: "l2", title: "Latin America", description: "Andes, Amazon basin, tropical climates; Brazil, Argentina, Central America." },
        ],
      },
      {
        id: "m2", title: "Asia", lessons: [
          { id: "l3", title: "East & Southeast Asia", description: "China, Japan, Korea, monsoon Asia, ASEAN nations and Pacific Rim economies." },
          { id: "l4", title: "South Asia & Middle East", description: "Himalayas, Indian subcontinent, monsoon, Arabian Peninsula and oil geography." },
        ],
      },
      {
        id: "m3", title: "Africa & Oceania", lessons: [
          { id: "l5", title: "Africa", description: "Sahara, Sahel, Congo Basin, Great Rift Valley, Sub-Saharan development challenges." },
          { id: "l6", title: "Australia, New Zealand & Pacific", description: "Outback, Great Barrier Reef, Maori culture, Pacific Island nations and climate vulnerability." },
        ],
      },
    ],
  },
  {
    id: "geo-environment",
    subjectId: "geography",
    title: "Environmental Geography",
    description: "Climate change, resource management, sustainability and environmental geopolitics.",
    level: "advanced",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "Climate Change", lessons: [
          { id: "l1", title: "Greenhouse Effect & Global Warming", description: "Radiative forcing, greenhouse gases, temperature records and IPCC projections." },
          { id: "l2", title: "Impacts of Climate Change", description: "Sea level rise, extreme weather, Arctic melt, ocean acidification and biome shifts." },
          { id: "l3", title: "Climate Agreements & Policies", description: "Kyoto Protocol, Paris Agreement, COP summits and national emissions targets." },
        ],
      },
      {
        id: "m2", title: "Resources & Sustainability", lessons: [
          { id: "l4", title: "Water Scarcity & Management", description: "Global freshwater distribution, water stress, dams, irrigation and virtual water." },
          { id: "l5", title: "Energy Geography", description: "Fossil fuel distribution, renewable energy geography, energy security and transition." },
          { id: "l6", title: "Sustainable Development Goals", description: "UN SDGs, circular economy, ecological footprint and paths to sustainability." },
        ],
      },
    ],
  },

  // ─── ENGLISH ──────────────────────────────────────────────────────────────
  {
    id: "eng-grammar",
    subjectId: "english",
    title: "English Grammar Fundamentals",
    description: "Parts of speech, sentence structure, punctuation and common grammar errors.",
    level: "beginner",
    duration: "4 weeks",
    modules: [
      {
        id: "m1", title: "Parts of Speech", lessons: [
          { id: "l1", title: "Nouns, Pronouns & Adjectives", description: "Types of nouns, pronoun case (subjective/objective), adjective order and modifiers." },
          { id: "l2", title: "Verbs, Adverbs & Prepositions", description: "Verb forms, adverb placement, prepositions of time/place and phrasal verbs." },
          { id: "l3", title: "Conjunctions & Interjections", description: "Coordinating (FANBOYS), subordinating, correlative conjunctions and their use." },
        ],
      },
      {
        id: "m2", title: "Sentence Structure", lessons: [
          { id: "l4", title: "Simple & Compound Sentences", description: "Subject-predicate, independent clauses and combining with coordinating conjunctions." },
          { id: "l5", title: "Complex & Compound-Complex Sentences", description: "Dependent clauses, subordinators and varying sentence structure for style." },
          { id: "l6", title: "Common Errors", description: "Run-ons, comma splices, fragments, subject-verb agreement and dangling modifiers." },
        ],
      },
      {
        id: "m3", title: "Punctuation & Mechanics", lessons: [
          { id: "l7", title: "Commas & Semicolons", description: "Eight comma rules, semicolon for independent clauses and conjunctive adverbs." },
          { id: "l8", title: "Colons, Dashes & Apostrophes", description: "Colon usage, em vs en dash, possessive apostrophes and contractions." },
          { id: "l9", title: "Capitalization & Spelling", description: "Rules for capitalization, commonly misspelled words and homophones." },
        ],
      },
    ],
  },
  {
    id: "eng-reading",
    subjectId: "english",
    title: "Reading Comprehension",
    description: "Active reading strategies, inference, author's purpose, text structure and critical analysis.",
    level: "beginner",
    duration: "4 weeks",
    modules: [
      {
        id: "m1", title: "Reading Strategies", lessons: [
          { id: "l1", title: "Active Reading Techniques", description: "Annotating, questioning, predicting, visualizing and summarizing as you read." },
          { id: "l2", title: "Finding Main Idea & Supporting Details", description: "Topic sentence, thesis, identifying key details and distinguishing from minor points." },
          { id: "l3", title: "Making Inferences", description: "Reading between the lines using textual evidence and background knowledge." },
        ],
      },
      {
        id: "m2", title: "Author's Craft", lessons: [
          { id: "l4", title: "Author's Purpose & Tone", description: "Persuade, inform, entertain; identifying tone words and how word choice shapes meaning." },
          { id: "l5", title: "Text Structure", description: "Cause/effect, compare/contrast, chronological, problem/solution and description structures." },
          { id: "l6", title: "Point of View & Perspective", description: "First/third person narration, unreliable narrators and multiple perspectives." },
        ],
      },
    ],
  },
  {
    id: "eng-writing",
    subjectId: "english",
    title: "Writing Essentials",
    description: "The writing process, paragraph development, essay structure and argumentative writing.",
    level: "intermediate",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "The Writing Process", lessons: [
          { id: "l1", title: "Prewriting & Brainstorming", description: "Freewriting, mind mapping, outlining and narrowing a topic." },
          { id: "l2", title: "Drafting & Revising", description: "Getting ideas on paper, revision vs editing, peer review and self-editing strategies." },
          { id: "l3", title: "Editing & Proofreading", description: "Grammar, mechanics, word choice and final polishing checklist." },
        ],
      },
      {
        id: "m2", title: "Essay Structure", lessons: [
          { id: "l4", title: "Introduction & Thesis", description: "Hook strategies, background information and writing a strong thesis statement." },
          { id: "l5", title: "Body Paragraphs (PIE/PEEL)", description: "Topic sentence, evidence integration (quotes, paraphrase), analysis and transition." },
          { id: "l6", title: "Conclusion", description: "Restating thesis (differently), synthesizing evidence and ending with impact." },
        ],
      },
      {
        id: "m3", title: "Argumentation", lessons: [
          { id: "l7", title: "Claim, Evidence & Reasoning", description: "Toulmin model: claim, data, warrant, backing, qualifier and rebuttal." },
          { id: "l8", title: "Logical Fallacies", description: "Ad hominem, straw man, slippery slope, false dichotomy and how to avoid them." },
          { id: "l9", title: "Counterargument & Concession", description: "Acknowledging opposing views, conceding partial validity and refuting effectively." },
        ],
      },
    ],
  },
  {
    id: "eng-literature",
    subjectId: "english",
    title: "Literature Analysis",
    description: "Poetry, prose, drama and the literary devices that bring texts to life.",
    level: "intermediate",
    duration: "6 weeks",
    modules: [
      {
        id: "m1", title: "Literary Devices", lessons: [
          { id: "l1", title: "Figurative Language", description: "Simile, metaphor, personification, hyperbole, alliteration and their effects." },
          { id: "l2", title: "Narrative Elements", description: "Plot, conflict (internal/external), climax, setting and characterization." },
          { id: "l3", title: "Theme & Symbol", description: "Identifying theme vs topic, symbols, motifs and allegory in literary texts." },
        ],
      },
      {
        id: "m2", title: "Poetry", lessons: [
          { id: "l4", title: "Poetic Forms", description: "Sonnet, haiku, free verse, ode, ballad — structure, rhyme and meter." },
          { id: "l5", title: "Sound Devices", description: "Rhyme scheme, rhythm, assonance, consonance and onomatopoeia." },
          { id: "l6", title: "Analyzing a Poem (TPCASTT)", description: "Title, paraphrase, connotation, attitude, shifts, title revisited, theme." },
        ],
      },
      {
        id: "m3", title: "Drama & Prose", lessons: [
          { id: "l7", title: "Shakespeare & Drama", description: "Dramatic structure (Freytag's Pyramid), soliloquy, aside and staging conventions." },
          { id: "l8", title: "The Short Story", description: "Flash fiction to novella, narrative voice, unreliable narrator and open endings." },
          { id: "l9", title: "Writing a Literary Analysis Essay", description: "Thesis driven by a literary device, textual evidence selection and close reading." },
        ],
      },
    ],
  },
  {
    id: "eng-advanced-writing",
    subjectId: "english",
    title: "Advanced Writing & Rhetoric",
    description: "Research writing, rhetorical analysis, style and academic register.",
    level: "advanced",
    duration: "6 weeks",
    modules: [
      {
        id: "m1", title: "Research Writing", lessons: [
          { id: "l1", title: "Finding & Evaluating Sources", description: "Primary vs secondary, CRAAP test, databases, Wikipedia as a starting point." },
          { id: "l2", title: "Citation & Avoiding Plagiarism", description: "MLA, APA, Chicago — in-text citation, works cited/references and paraphrasing." },
          { id: "l3", title: "Synthesizing Sources", description: "Joining the scholarly conversation, agreeing/disagreeing with sources, synthesis matrix." },
        ],
      },
      {
        id: "m2", title: "Rhetorical Analysis", lessons: [
          { id: "l4", title: "Ethos, Pathos & Logos", description: "Identifying the three appeals in speeches, ads and texts; analyzing effectiveness." },
          { id: "l5", title: "Rhetorical Situation", description: "Author, audience, purpose, context, genre and how they shape communication." },
          { id: "l6", title: "Writing a Rhetorical Analysis Essay", description: "Analyzing choices, not summarizing; evaluating how an argument succeeds or fails." },
        ],
      },
    ],
  },
  {
    id: "eng-world-lit",
    subjectId: "english",
    title: "World Literature",
    description: "Literary traditions from around the globe — Africa, Latin America, Asia and beyond.",
    level: "advanced",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "Non-Western Literary Traditions", lessons: [
          { id: "l1", title: "African Literature", description: "Chinua Achebe, Chimamanda Ngozi Adichie, oral tradition and postcolonial themes." },
          { id: "l2", title: "Latin American Literature", description: "Magical realism (García Márquez, Borges), boom generation and social commentary." },
          { id: "l3", title: "Asian Literature", description: "Japanese mono no aware, Tagore, contemporary Chinese and Korean fiction." },
        ],
      },
      {
        id: "m2", title: "Cross-Cultural Themes", lessons: [
          { id: "l4", title: "Postcolonialism in Literature", description: "Colonial encounter, hybrid identity, resistance and the use of the colonizer's language." },
          { id: "l5", title: "Translation & Cultural Loss", description: "What gets lost in translation; translators as authors and reading in translation." },
          { id: "l6", title: "Comparing World Literatures", description: "Writing a comparative essay across two texts from different cultural traditions." },
        ],
      },
    ],
  },

  // ─── COMPUTER SCIENCE ─────────────────────────────────────────────────────
  {
    id: "cs-programming",
    subjectId: "computer-science",
    title: "Introduction to Programming",
    description: "Algorithms, computational thinking and Python basics — no prior experience needed.",
    level: "beginner",
    duration: "6 weeks",
    modules: [
      {
        id: "m1", title: "Computational Thinking", lessons: [
          { id: "l1", title: "What is an Algorithm?", description: "Defining algorithms, pseudocode, flowcharts and decomposition." },
          { id: "l2", title: "Problem-Solving Steps", description: "Understand, plan, code, test — the four-step approach to any programming problem." },
        ],
      },
      {
        id: "m2", title: "Python Basics", lessons: [
          { id: "l3", title: "Variables & Data Types", description: "int, float, str, bool in Python; assignment, type() and type conversion." },
          { id: "l4", title: "Control Flow (if/elif/else)", description: "Boolean expressions, comparison operators, logical operators and nested conditionals." },
          { id: "l5", title: "Loops (for & while)", description: "Iteration, range(), while conditions, break/continue and loop patterns." },
          { id: "l6", title: "Functions", description: "def, parameters, return values, scope and writing reusable code." },
        ],
      },
      {
        id: "m3", title: "Data Structures Intro", lessons: [
          { id: "l7", title: "Lists & Tuples", description: "Indexing, slicing, list methods, mutability and when to use each." },
          { id: "l8", title: "Dictionaries & Sets", description: "Key-value pairs, dictionary methods, sets for uniqueness and membership testing." },
          { id: "l9", title: "File I/O & Error Handling", description: "Reading/writing text files, try/except blocks and common exceptions." },
        ],
      },
    ],
  },
  {
    id: "cs-data-structures",
    subjectId: "computer-science",
    title: "Data Structures",
    description: "Arrays, linked lists, stacks, queues, trees, graphs and hash tables.",
    level: "intermediate",
    duration: "7 weeks",
    modules: [
      {
        id: "m1", title: "Linear Data Structures", lessons: [
          { id: "l1", title: "Arrays & Dynamic Arrays", description: "Memory layout, index access, resizing and amortized cost of appending." },
          { id: "l2", title: "Linked Lists", description: "Singly and doubly linked lists, node structure, insertion and deletion." },
          { id: "l3", title: "Stacks & Queues", description: "LIFO/FIFO, array vs linked-list implementation and use cases (undo, BFS)." },
        ],
      },
      {
        id: "m2", title: "Trees", lessons: [
          { id: "l4", title: "Binary Trees & BST", description: "Tree terminology, BST insert/search/delete and in-order traversal." },
          { id: "l5", title: "Balanced Trees (AVL, Red-Black)", description: "Why balance matters; rotations and the guarantee of O(log n) operations." },
          { id: "l6", title: "Heaps & Priority Queues", description: "Min/max heap, heapify, heap sort and priority queue applications." },
        ],
      },
      {
        id: "m3", title: "Graphs & Hash Tables", lessons: [
          { id: "l7", title: "Graph Representation", description: "Adjacency matrix vs list, directed vs undirected, weighted graphs." },
          { id: "l8", title: "Graph Traversal (BFS & DFS)", description: "Breadth-first and depth-first search algorithms, applications and complexity." },
          { id: "l9", title: "Hash Tables", description: "Hash functions, collision handling (chaining, open addressing) and O(1) lookups." },
        ],
      },
    ],
  },
  {
    id: "cs-algorithms",
    subjectId: "computer-science",
    title: "Algorithms & Complexity",
    description: "Sorting, searching, dynamic programming and Big-O analysis.",
    level: "intermediate",
    duration: "7 weeks",
    modules: [
      {
        id: "m1", title: "Big-O Analysis", lessons: [
          { id: "l1", title: "Time & Space Complexity", description: "O(1), O(log n), O(n), O(n log n), O(n²) — definitions and examples." },
          { id: "l2", title: "Best, Worst & Average Case", description: "Analyzing algorithms for different inputs; amortized analysis." },
        ],
      },
      {
        id: "m2", title: "Sorting Algorithms", lessons: [
          { id: "l3", title: "Quadratic Sorts (Bubble, Selection, Insertion)", description: "How they work, when insertion sort is preferred and their O(n²) cost." },
          { id: "l4", title: "Merge Sort", description: "Divide-and-conquer, merge procedure and O(n log n) proof." },
          { id: "l5", title: "Quick Sort", description: "Partition, pivot selection strategies, average vs worst-case and in-place sorting." },
          { id: "l6", title: "Radix & Counting Sort", description: "Non-comparison-based sorting, O(nk) and when to use them." },
        ],
      },
      {
        id: "m3", title: "Advanced Techniques", lessons: [
          { id: "l7", title: "Recursion & Divide-and-Conquer", description: "Recurrence relations, Master Theorem and classic D&C problems." },
          { id: "l8", title: "Dynamic Programming", description: "Memoization vs tabulation; Fibonacci, 0/1 knapsack and longest common subsequence." },
          { id: "l9", title: "Greedy Algorithms", description: "Greedy choice property, Dijkstra's algorithm and Huffman encoding." },
        ],
      },
    ],
  },
  {
    id: "cs-databases",
    subjectId: "computer-science",
    title: "Databases & SQL",
    description: "Relational databases, SQL queries, normalization and database design.",
    level: "intermediate",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "Relational Model", lessons: [
          { id: "l1", title: "Tables, Keys & Relationships", description: "Primary key, foreign key, one-to-many, many-to-many and entity-relationship diagrams." },
          { id: "l2", title: "Normalization", description: "1NF, 2NF, 3NF — eliminating redundancy and update anomalies." },
        ],
      },
      {
        id: "m2", title: "SQL Queries", lessons: [
          { id: "l3", title: "SELECT, WHERE & ORDER BY", description: "Basic retrieval, filtering rows, sorting results and limiting output." },
          { id: "l4", title: "JOINs", description: "INNER, LEFT, RIGHT, FULL OUTER JOIN — combining tables with examples." },
          { id: "l5", title: "Aggregations & GROUP BY", description: "COUNT, SUM, AVG, MIN, MAX with GROUP BY and HAVING clauses." },
          { id: "l6", title: "Subqueries & CTEs", description: "Nested queries, correlated subqueries and WITH clause for readability." },
        ],
      },
      {
        id: "m3", title: "Database Internals", lessons: [
          { id: "l7", title: "Indexes & Query Optimization", description: "B-tree indexes, covering indexes, EXPLAIN plans and avoiding table scans." },
          { id: "l8", title: "Transactions & ACID", description: "Atomicity, consistency, isolation, durability; rollback and concurrency issues." },
        ],
      },
    ],
  },
  {
    id: "cs-networks",
    subjectId: "computer-science",
    title: "Computer Networks",
    description: "OSI model, TCP/IP, protocols, DNS, HTTP and network security fundamentals.",
    level: "intermediate",
    duration: "5 weeks",
    modules: [
      {
        id: "m1", title: "Network Models", lessons: [
          { id: "l1", title: "OSI Model (7 Layers)", description: "Physical, Data Link, Network, Transport, Session, Presentation, Application layers." },
          { id: "l2", title: "TCP/IP Stack", description: "Comparing OSI to TCP/IP, IP addressing, subnetting (CIDR) and NAT." },
        ],
      },
      {
        id: "m2", title: "Core Protocols", lessons: [
          { id: "l3", title: "TCP & UDP", description: "Connection-oriented vs connectionless, three-way handshake, reliability and flow control." },
          { id: "l4", title: "DNS & DHCP", description: "Domain name resolution, recursive vs iterative queries, IP address assignment." },
          { id: "l5", title: "HTTP & HTTPS", description: "Request/response cycle, status codes, cookies, TLS handshake and certificates." },
        ],
      },
      {
        id: "m3", title: "Network Security", lessons: [
          { id: "l6", title: "Firewalls & VPNs", description: "Packet filtering, stateful inspection, VPN tunneling and split tunneling." },
          { id: "l7", title: "Common Attacks & Defenses", description: "DDoS, MITM, phishing, SQL injection, XSS and basic countermeasures." },
        ],
      },
    ],
  },
  {
    id: "cs-os",
    subjectId: "computer-science",
    title: "Operating Systems",
    description: "Processes, memory management, file systems, scheduling and concurrency.",
    level: "intermediate",
    duration: "6 weeks",
    modules: [
      {
        id: "m1", title: "Processes & Threads", lessons: [
          { id: "l1", title: "Process Concept", description: "Process states, PCB, context switching and system calls." },
          { id: "l2", title: "Threads & Concurrency", description: "User vs kernel threads, threading models and the advantages of multithreading." },
          { id: "l3", title: "CPU Scheduling", description: "FCFS, SJF, Round Robin, Priority scheduling — algorithms and Gantt charts." },
        ],
      },
      {
        id: "m2", title: "Memory Management", lessons: [
          { id: "l4", title: "Virtual Memory & Paging", description: "Address translation, page tables, TLB and demand paging." },
          { id: "l5", title: "Page Replacement Algorithms", description: "FIFO, LRU, Optimal — Belady's anomaly and thrashing." },
        ],
      },
      {
        id: "m3", title: "Synchronization & File Systems", lessons: [
          { id: "l6", title: "Deadlock", description: "Deadlock conditions, prevention, avoidance (Banker's algorithm) and detection." },
          { id: "l7", title: "Synchronization Primitives", description: "Mutex, semaphore, monitor and the producer-consumer problem." },
          { id: "l8", title: "File Systems", description: "Directory structures, inodes, FAT vs ext4, journaling and RAID." },
        ],
      },
    ],
  },
  {
    id: "cs-web",
    subjectId: "computer-science",
    title: "Web Development",
    description: "HTML, CSS, JavaScript, React and building modern web applications.",
    level: "intermediate",
    duration: "8 weeks",
    modules: [
      {
        id: "m1", title: "HTML & CSS", lessons: [
          { id: "l1", title: "HTML Structure & Semantics", description: "DOCTYPE, semantic elements (header, nav, main, article), forms and accessibility." },
          { id: "l2", title: "CSS Selectors & the Box Model", description: "Specificity, cascade, margin/padding/border and display types." },
          { id: "l3", title: "Flexbox & Grid", description: "One-dimensional (flex) and two-dimensional (grid) layout with practical examples." },
          { id: "l4", title: "Responsive Design", description: "Media queries, mobile-first, fluid grids and viewport meta tag." },
        ],
      },
      {
        id: "m2", title: "JavaScript", lessons: [
          { id: "l5", title: "JavaScript Fundamentals", description: "Variables (let/const), functions, arrays, objects and ES6+ syntax." },
          { id: "l6", title: "DOM Manipulation", description: "querySelector, event listeners, createElement and updating the page dynamically." },
          { id: "l7", title: "Async JavaScript", description: "Promises, async/await, fetch API and handling errors in async code." },
        ],
      },
      {
        id: "m3", title: "React Basics", lessons: [
          { id: "l8", title: "Components & JSX", description: "Functional components, JSX syntax, props and composing UI from components." },
          { id: "l9", title: "State & Hooks", description: "useState, useEffect, controlled inputs and lifting state up." },
          { id: "l10", title: "Routing & APIs", description: "React Router, fetching data from REST APIs and loading/error states." },
        ],
      },
    ],
  },
];

export function getCoursesBySubject(subjectId: string): Course[] {
  return COURSES.filter((c) => c.subjectId === subjectId);
}

export function getCourse(subjectId: string, courseId: string): Course | undefined {
  return COURSES.find((c) => c.subjectId === subjectId && c.id === courseId);
}

export function getLesson(subjectId: string, courseId: string, lessonId: string) {
  const course = getCourse(subjectId, courseId);
  if (!course) return undefined;
  for (const mod of course.modules) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return { lesson, module: mod, course };
  }
  return undefined;
}

export function getNextLesson(subjectId: string, courseId: string, lessonId: string) {
  const course = getCourse(subjectId, courseId);
  if (!course) return undefined;
  const allLessons = course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })));
  const idx = allLessons.findIndex((l) => l.id === lessonId);
  return idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : undefined;
}

export const LEVEL_LABEL = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" } as const;
export const LEVEL_COLOR = {
  beginner: { bg: "rgba(34,197,94,0.12)", text: "#86efac", border: "rgba(34,197,94,0.25)" },
  intermediate: { bg: "rgba(59,130,246,0.12)", text: "#93c5fd", border: "rgba(59,130,246,0.25)" },
  advanced: { bg: "rgba(249,115,22,0.12)", text: "#fdba74", border: "rgba(249,115,22,0.25)" },
} as const;
