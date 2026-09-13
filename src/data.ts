import { Course, ResultItem, Testimonial, QuizQuestion, FeatureCard } from './types';
import { getAcademicSessionInfo } from './utils/academicSession';

const defaultSessionInfo = getAcademicSessionInfo();

export const COURSES: Course[] = [
  {
    id: 'class-12-math',
    name: 'Class XII Mathematics',
    category: 'Boards',
    duration: `Session ${defaultSessionInfo.currentSession}`,
    timing: '7.00 PM TO 8.30 PM',
    days: 'THU, FRI & SAT',
    subjects: 'Mathematics (CBSE / ISC / IIT-JEE)',
    targetClass: 'Class XII',
    session: defaultSessionInfo.currentSession,
    description: 'Specialized batch for Class 12th students targeting 100/100 in CBSE & ISC Boards alongside IIT-JEE Mathematics synchronisation. Focus on Calculus, Vectors, 3D Geometry, and Probability.',
    features: [
      'CBSE & ISC Board step-by-step presentation & proofs',
      'NCERT & NCERT Exemplar line-by-line solved',
      'IIT-JEE shortcut methods & graphical techniques',
      'Special formula compendium for fast board revisions'
    ],
    tag: 'Class XII • 7:00-8:30 PM (Thu, Fri, Sat)',
    accentColor: 'emerald'
  },
  {
    id: 'class-11-math',
    name: 'Class XI Mathematics',
    category: 'Boards',
    duration: `Session ${defaultSessionInfo.currentSession}`,
    timing: '7.00 PM TO 8.30 PM',
    days: 'MON, TUE & WED',
    subjects: 'Mathematics (CBSE / ISC / IIT-JEE)',
    targetClass: 'Class XI',
    session: defaultSessionInfo.currentSession,
    description: 'The critical cornerstone of higher mathematics. Complete conceptual mastery of Trigonometric Functions, Complex Numbers, Conic Sections, Permutations & Combinations, and early Calculus.',
    features: [
      'Crystal-clear derivations and geometric intuition',
      'Smooth transition from Class 10 to 11th senior secondary math',
      'Hand-crafted classroom DPPs and notes by Rehman Sir',
      'Chapter-wise objective (JEE) and subjective board tests'
    ],
    tag: 'Class XI • 7:00-8:30 PM (Mon, Tue, Wed)',
    accentColor: 'indigo'
  },
  {
    id: 'class-10-math-science',
    name: 'Class X Mathematics & Science',
    category: 'Boards',
    duration: `Session ${defaultSessionInfo.currentSession}`,
    timing: '5.00 PM TO 6.00 PM',
    days: 'Regular Working Days',
    subjects: 'Mathematics & Science',
    targetClass: 'Class X',
    session: defaultSessionInfo.currentSession,
    description: 'Intensive dual preparation for Class 10th CBSE / ICSE Boards in Mathematics & Science. Comprehensive theorem proofs, numerical mastery in Physics/Chemistry, and board target 100/100.',
    features: [
      'Complete Mathematics & Science syllabus coverage',
      'Thorough proof of Triangles and Circles theorems',
      'Physics numericals, Chemistry equations & Biology diagrams',
      'Strict Board sample papers evaluation with personal feedback'
    ],
    tag: 'Class X • 5:00-6:00 PM (Maths & Science)',
    accentColor: 'orange'
  },
  {
    id: 'class-9-math-science',
    name: 'Class IX Mathematics & Science',
    category: 'Foundation',
    duration: `Session ${defaultSessionInfo.currentSession}`,
    timing: '4.00 PM TO 5.00 PM',
    days: 'Regular Working Days',
    subjects: 'Mathematics & Science',
    targetClass: 'Class IX',
    session: defaultSessionInfo.currentSession,
    description: 'Build an invincible foundation in 9th grade Mathematics & Science. Demystifying Coordinate Geometry, Polynomials, Linear Equations, Motion, Forces, and Matter with visual experiments.',
    features: [
      'Mathematics & Science foundation for senior competitive exams',
      'Visual proofs and logical reasoning drills',
      'Weekly diagnostic tests and school exam preparation',
      'Personal mentorship by Rehman Sir to build love for math'
    ],
    tag: 'Class IX • 4:00-5:00 PM (Maths & Science)',
    accentColor: 'amber'
  },
  {
    id: 'jee-math',
    name: 'IIT-JEE Mains & Advanced Mathematics',
    category: 'JEE',
    duration: '1 Year / 2 Years Program',
    timing: '7.00 PM TO 8.30 PM',
    days: 'Advanced Track',
    subjects: 'Pure Mathematics (JEE Mains & Adv)',
    targetClass: 'Class XI & XII',
    session: defaultSessionInfo.currentSession,
    description: 'Designed specifically for engineering aspirants aiming for top percentiles in JEE Main and Advanced. Master Differential & Integral Calculus, Coordinate Geometry, Vectors & 3D, and Probability.',
    features: [
      'Advanced graphical calculus visualizations & shortcuts',
      'Daily Practice Problems (DPPs) with step-by-step analysis',
      'Previous 20 Years JEE Main & Advanced papers analysis',
      'High-speed calculation shortcuts & Vedic Math methods'
    ],
    tag: 'IIT-JEE Mains & Advanced',
    accentColor: 'blue'
  },
  {
    id: 'boards-crash',
    name: 'CBSE / ISC Board Booster Crash Course',
    category: 'Boards',
    duration: 'Intensive Fast-Track',
    timing: 'Flexible Evening Batches',
    days: 'Special Doubt Schedule',
    subjects: 'Mathematics & Science Revision',
    targetClass: 'Class X & XII',
    session: defaultSessionInfo.currentSession,
    description: 'Fast-track revision covering high-frequency board questions, derivation tricks, formula sheets, and simulated mock tests with strict step-marking criteria.',
    features: [
      'Top 100 guaranteed board questions analyzed',
      'Mistake-prevention techniques in long calculation steps',
      'Formula sheets & quick memory maps',
      'One-on-one doubt clearing sessions with Rehman Sir'
    ],
    tag: 'Crash Course',
    accentColor: 'rose'
  }
];

export const RESULTS: ResultItem[] = [
  {
    id: 'res-1',
    name: 'Aarav Sharma',
    rank: '99.85 %ile',
    exam: 'JEE Mains Math',
    score: '96/100 in Maths',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300&h=300',
    achievement: 'Admitted to IIT Delhi (Computer Science)'
  },
  {
    id: 'res-2',
    name: 'Zaid Khan',
    rank: 'AIR 142',
    exam: 'JEE Advanced',
    score: '114/120 in Maths',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
    achievement: 'Admitted to IIT Bombay Electrical Engineering'
  },
  {
    id: 'res-3',
    name: 'Ananya Singh',
    rank: '100/100',
    exam: 'CBSE Class 12 Boards',
    score: '100% in Mathematics',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300',
    achievement: 'Ghaziabad District Mathematics Topper'
  },
  {
    id: 'res-4',
    name: 'Faizan Rehman',
    rank: 'AIR 280',
    exam: 'JEE Advanced',
    score: '108/120 in Maths',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300',
    achievement: 'Admitted to IIT Roorkee'
  },
  {
    id: 'res-5',
    name: 'Riya Tyagi',
    rank: '99.6 %ile',
    exam: 'JEE Mains',
    score: '98/100 in Maths',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300&h=300',
    achievement: 'Silver Shine School Alumna • 100/100 in Class 12 Boards'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Aditya Rajput',
    role: 'Student',
    review: 'Rehman Sir makes Calculus feel completely intuitive. I was terrified of integration and 3D geometry, but his graphical proofs and shortcut methods helped me score 99.85 %ile in JEE Mathematics!',
    rating: 5,
    course: 'JEE Mains & Advanced Mathematics',
    avatarSeed: 'Aditya'
  },
  {
    id: 'test-2',
    name: 'Dr. Alok Verma',
    role: 'Parent',
    review: 'We were looking for the best mathematics coaching near Silver Shine School. Rehman Sir provides dedicated personal attention to each student. My daughter Ananya scored a perfect 100/100 in CBSE Class 12 Mathematics.',
    rating: 5,
    course: 'Parent of Ananya (Shastri Nagar, Ghaziabad)',
    avatarSeed: 'Alok'
  },
  {
    id: 'test-3',
    name: 'Mohit Sharma',
    role: 'Student',
    review: 'The daily DPPs and Sunday mock tests mirror actual NTA and CBSE exam patterns. Rehman Sir is always available at the doubt desk to solve every problem step-by-step.',
    rating: 5,
    course: 'Class 12th Mathematics (Boards + JEE)',
    avatarSeed: 'Mohit'
  },
  {
    id: 'test-4',
    name: 'Mrs. Sunita Tyagi',
    role: 'Parent',
    review: 'Having an institute of this caliber right here in Mahendra Enclave, Shastri Nagar has saved so much travel time for my son. His math score jumped from 65% to 95% in pre-boards.',
    rating: 5,
    course: 'Parent of Aman (Mahendra Enclave)',
    avatarSeed: 'Sunita'
  }
];

export const FEATURES: FeatureCard[] = [
  {
    title: '100% Concept Clarity',
    description: 'No rote formula memorization. Every theorem, geometrical identity, and calculus differentiation rule is derived from first logical principles.',
    iconName: 'Calculator',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    title: 'Small Focused Batches',
    description: 'Strict batch size limits so Rehman Sir can track each student\'s problem-solving speed, accuracy, and homework completion personally.',
    iconName: 'Users',
    color: 'from-orange-500 to-amber-600'
  },
  {
    title: 'Daily Practice Problems (DPP)',
    description: 'Carefully curated question sets divided into Board Level, JEE Mains, and Advanced tiers to build gradual mastery.',
    iconName: 'ClipboardCheck',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    title: 'Dedicated Doubt Desk',
    description: 'Instant 1-on-1 doubt clearing after every lecture. Never take an unsolved equation home—get clarity directly from Rehman Sir.',
    iconName: 'Sparkles',
    color: 'from-pink-500 to-rose-600'
  },
  {
    title: 'Formula & Shortcut Sheets',
    description: 'Concise, high-yield formula compendiums, trigonometry transformation maps, and graphical transformation cheatsheets.',
    iconName: 'BookOpen',
    color: 'from-amber-500 to-orange-600'
  },
  {
    title: 'Regular Testing & Analytics',
    description: 'Weekly chapter assessments, computerized mock test reports, and transparent parent updates via WhatsApp and SMS.',
    iconName: 'LineChart',
    color: 'from-purple-500 to-indigo-600'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the value of ∫ (1 / (1 + x²)) dx ?',
    options: ['tan⁻¹(x) + C', 'ln(1 + x²) + C', 'sin⁻¹(x) + C', 'sec⁻¹(x) + C'],
    correctAnswer: 0,
    explanation: 'By standard calculus integration formulas, the derivative of tan⁻¹(x) is 1 / (1 + x²), so the indefinite integral is tan⁻¹(x) + C.'
  },
  {
    id: 2,
    question: 'What is the limit of (sin x) / x as x approaches 0?',
    options: ['0', '1', 'Does not exist', '∞'],
    correctAnswer: 1,
    explanation: 'Using the squeeze theorem or L\'Hôpital\'s Rule: lim(x→0) cos(x)/1 = cos(0) = 1. This is a fundamental trigonometric limit.'
  },
  {
    id: 3,
    question: 'If the roots of the quadratic equation ax² + bx + c = 0 are equal, what is the discriminant (D)?',
    options: ['D > 0', 'D = 0', 'D < 0', 'D = b'],
    correctAnswer: 1,
    explanation: 'A quadratic equation has real and equal (coincident) roots if and only if the discriminant D = b² - 4ac equals 0.'
  }
];
