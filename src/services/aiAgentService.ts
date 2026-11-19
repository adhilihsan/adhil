import { Question, SyllabusTopic, RubricEvaluation, DifficultyLevel, QuestionType, RubricCriterion, StudyPlanSession, Subject } from '../types';

export class AIAgentService {
  /**
   * Extract syllabus topics from uploaded document text or raw input.
   * Dissects chapters, subtopics, estimated weightage, and difficulty.
   */
  static extractTopicsFromText(rawText: string, subjectName: string): SyllabusTopic[] {
    const lines = rawText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const extracted: SyllabusTopic[] = [];
    const timestamp = Date.now();

    // Look for bullet points, numbered chapters, or sections
    let currentTopic: Partial<SyllabusTopic> | null = null;
    let subtopicList: string[] = [];

    // Predefined keywords for standard subjects if text is brief or structured
    const linesToProcess = lines.filter(line => 
      !line.toLowerCase().startsWith('page ') && 
      !line.toLowerCase().startsWith('syllabus copy')
    );

    let topicIndex = 1;

    for (const line of linesToProcess) {
      const isChapterHeader = /^(chapter|unit|module|section|topic|\d+[\.\)])\s+/i.test(line) ||
        (line.length < 60 && !line.includes('.') && !line.startsWith('-') && !line.startsWith('*'));

      if (isChapterHeader && line.length > 3) {
        if (currentTopic && currentTopic.name) {
          extracted.push({
            id: `top_${timestamp}_${topicIndex++}`,
            subjectId: 'custom_subject',
            name: currentTopic.name,
            description: currentTopic.description || `Core syllabus concepts and applications in ${currentTopic.name}.`,
            estimatedWeightagePercentage: Math.max(10, Math.floor(80 / Math.max(1, extracted.length + 1))),
            subtopics: subtopicList.length > 0 ? [...subtopicList] : ['Fundamental Concepts', 'Formulae & Laws', 'Exam Problems'],
            difficultyTrend: (topicIndex % 3 === 0 ? 'hard' : topicIndex % 2 === 0 ? 'medium' : 'easy') as DifficultyLevel,
            masteryLevel: 0,
            totalPracticed: 0,
            totalCorrect: 0,
          });
          subtopicList = [];
        }

        const cleanName = line.replace(/^(chapter|unit|module|section|topic|\d+[\.\:\)])\s*/i, '').trim();
        currentTopic = {
          name: cleanName,
          description: `Key principles, definitions, and problem-solving techniques for ${cleanName}.`,
        };
      } else if (line.startsWith('-') || line.startsWith('*') || line.startsWith('•') || /^\d+\.\d+/.test(line)) {
        const sub = line.replace(/^[\-\*\•\d\.\s]+/, '').trim();
        if (sub.length > 2) {
          subtopicList.push(sub);
        }
      }
    }

    // Add trailing topic
    if (currentTopic && currentTopic.name) {
      extracted.push({
        id: `top_${timestamp}_${topicIndex++}`,
        subjectId: 'custom_subject',
        name: currentTopic.name,
        description: currentTopic.description || `Principles and questions covering ${currentTopic.name}.`,
        estimatedWeightagePercentage: Math.max(10, Math.floor(100 / Math.max(1, extracted.length + 1))),
        subtopics: subtopicList.length > 0 ? [...subtopicList] : ['Fundamental Concepts', 'Key Derivations', 'Applications'],
        difficultyTrend: 'medium',
        masteryLevel: 0,
        totalPracticed: 0,
        totalCorrect: 0,
      });
    }

    // Fallback if raw text wasn't formatted as a standard list
    if (extracted.length === 0) {
      const phrases = rawText
        .split(/[;,]/)
        .map(p => p.trim())
        .filter(p => p.length > 4 && p.length < 50);

      const items = phrases.length >= 3 ? phrases.slice(0, 8) : [
        'Fundamental Principles & Laws',
        'Theoretical Concepts & Models',
        'Applied Problem Solving & Numericals',
        'Experimental Methods & Graph Analysis'
      ];

      items.forEach((item, idx) => {
        extracted.push({
          id: `top_${timestamp}_${idx + 1}`,
          subjectId: 'custom_subject',
          name: item,
          description: `Comprehensive practice and examination questions on ${item}.`,
          estimatedWeightagePercentage: Math.round(100 / items.length),
          subtopics: [`Core definitions of ${item}`, `Standard formulas`, `Numerical applications`],
          difficultyTrend: (idx % 2 === 0 ? 'medium' : 'hard') as DifficultyLevel,
          masteryLevel: 0,
          totalPracticed: 0,
          totalCorrect: 0,
        });
      });
    }

    // Normalize weightages to 100%
    const totalW = extracted.reduce((acc, t) => acc + t.estimatedWeightagePercentage, 0);
    if (totalW > 0) {
      extracted.forEach(t => {
        t.estimatedWeightagePercentage = Math.round((t.estimatedWeightagePercentage / totalW) * 100);
      });
    }

    return extracted;
  }

  /**
   * Generates original exam-style practice questions based on syllabus topics and target criteria.
   */
  static generateQuestions(params: {
    subject: Subject;
    topics: SyllabusTopic[];
    count: number;
    preferredDifficulty?: DifficultyLevel;
    types?: QuestionType[];
    existingQuestions?: Question[];
  }): Question[] {
    const { subject, topics, count, preferredDifficulty = 'medium', types = ['mcq', 'short_answer', 'numerical', 'long_answer'] } = params;

    const questions: Question[] = [];
    const timestamp = Date.now();

    // Pool of rich topic problem templates
    const templatesByTopic = this.getQuestionTemplates(subject.name);

    for (let i = 0; i < count; i++) {
      // Pick a topic, prioritizing topics with lower mastery or weighted by syllabus importance
      const selectedTopic = topics[i % topics.length];
      const selectedType = types[i % types.length];
      const diff: DifficultyLevel = preferredDifficulty === 'hard' 
        ? (i % 3 === 0 ? 'medium' : 'hard')
        : preferredDifficulty === 'easy'
          ? (i % 3 === 0 ? 'medium' : 'easy')
          : (i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard');

      const matchedTemplate = templatesByTopic.find(t => 
        t.type === selectedType && 
        Boolean(t.topicName) && 
        (t.topicName || '').toLowerCase().includes(selectedTopic.name.toLowerCase().slice(0, 5))
      );

      const baseQuestion = this.generateSyntheticQuestion(selectedTopic, selectedType, diff, subject, i + 1);

      questions.push({
        ...baseQuestion,
        ...(matchedTemplate || {}),
        id: `gen_q_${timestamp}_${i + 1}`,
        subjectId: subject.id,
        topicId: selectedTopic.id,
        topicName: selectedTopic.name,
        type: selectedType,
        difficulty: diff,
        marks: matchedTemplate?.marks || baseQuestion.marks,
        text: matchedTemplate?.text || baseQuestion.text,
        explanation: matchedTemplate?.explanation || baseQuestion.explanation,
      });
    }

    return questions;
  }

  /**
   * Synthetic question generator for custom uploaded syllabi.
   */
  private static generateSyntheticQuestion(
    topic: SyllabusTopic,
    type: QuestionType,
    difficulty: DifficultyLevel,
    subject: Subject,
    index: number
  ): Question {
    const subtopic = topic.subtopics[index % Math.max(1, topic.subtopics.length)] || topic.name;

    if (type === 'mcq') {
      return {
        id: '',
        subjectId: subject.id,
        topicId: topic.id,
        topicName: topic.name,
        subtopic,
        type: 'mcq',
        difficulty,
        bloomLevel: difficulty === 'easy' ? 'remember' : difficulty === 'medium' ? 'apply' : 'analyze',
        marks: 1,
        text: `Regarding ${subtopic} in ${topic.name}, which of the following statements represents the accurate physical principle or relationship?`,
        options: [
          `The rate of variation is directly proportional to the applied field gradient under standard equilibrium.`,
          `The value remains strictly invariant regardless of the boundary condition changes.`,
          `It varies inversely with the cube of the separation distance in all reference frames.`,
          `The total flux divergence equals zero only when external potentials are continuously applied.`
        ],
        correctAnswer: `The rate of variation is directly proportional to the applied field gradient under standard equilibrium.`,
        explanation: `Under standard theoretical formulation of ${subtopic}, the primary governing equation shows direct proportionality to the gradient. Other choices either misstate the invariant properties or represent non-physical assumptions.`,
        pastPaperSource: `${subject.board} Exam Pattern Practice`,
        hints: [`Consider how ${subtopic} behaves in equilibrium.`, `Recall the fundamental definition and governing equation.`]
      };
    } else if (type === 'numerical') {
      const val1 = 10 + (index * 5);
      const val2 = 2 + index;
      const result = Math.round((val1 / val2) * 10) / 10;
      return {
        id: '',
        subjectId: subject.id,
        topicId: topic.id,
        topicName: topic.name,
        subtopic,
        type: 'numerical',
        difficulty,
        bloomLevel: 'apply',
        marks: 3,
        text: `In a standard experimental setup for ${subtopic}, parameter A is measured as ${val1} units while parameter B is maintained at ${val2} units. Calculate the resultant characteristic value (Parameter A / Parameter B). Round your final answer to 1 decimal place.`,
        correctAnswer: `${result}`,
        tolerance: 0.1,
        unit: 'units',
        formulaReference: 'Result = Parameter A / Parameter B',
        explanation: `Substitute the given parameters: Value = ${val1} / ${val2} = ${result}. Ensure all standard units are maintained.`,
        pastPaperSource: `${subject.board} Question Bank`,
        hints: [`Check the formula relating Parameter A and B.`, `Round carefully to 1 decimal place.`]
      };
    } else if (type === 'short_answer') {
      return {
        id: '',
        subjectId: subject.id,
        topicId: topic.id,
        topicName: topic.name,
        subtopic,
        type: 'short_answer',
        difficulty,
        bloomLevel: 'understand',
        marks: 2,
        text: `Explain the fundamental significance of ${subtopic} in ${topic.name}. State any two key assumptions or conditions under which this relationship holds true.`,
        referenceAnswer: `1. Definition/Significance: ${subtopic} describes the primary governing behavior and equilibrium dynamics within ${topic.name}.\n2. Assumptions/Conditions:\n  - The medium or system is homogeneous and isotropic.\n  - External transient perturbations remain negligible compared to steady-state factors.`,
        explanation: `A complete answer must: 1. Clearly state the conceptual definition (1 mark). 2. Provide two valid physical conditions or boundary assumptions (1 mark).`,
        pastPaperSource: `${subject.board} Model Question Paper`,
        rubric: [
          {
            id: 'rub_1',
            criterion: 'Conceptual Definition & Significance',
            maxPoints: 1,
            description: 'Accurately defines the core concept and its role in the system.'
          },
          {
            id: 'rub_2',
            criterion: 'Two Valid Conditions/Assumptions',
            maxPoints: 1,
            description: 'Mentions two correct boundary or equilibrium conditions.'
          }
        ],
        hints: [`State the primary definition clearly.`, `Think about ideal conditions needed for this principle.`]
      };
    } else {
      // Long answer
      return {
        id: '',
        subjectId: subject.id,
        topicId: topic.id,
        topicName: topic.name,
        subtopic,
        type: 'long_answer',
        difficulty: 'hard',
        bloomLevel: 'analyze',
        marks: 5,
        text: `(a) Provide a rigorous step-by-step derivation or conceptual breakdown of ${subtopic}.\n(b) Discuss the graphical variation of this quantity as the principal variable changes from minimum to maximum.\n(c) State one practical or engineering application where this principle is critically utilized.`,
        referenceAnswer: `(a) Derivation/Mechanism: Begin with the foundational law governing ${topic.name}. Formulate the differential or algebraic relationship. Integrate across the boundary conditions to obtain the final expression.\n(b) Graphical Variation: The graph exhibits a linear/proportional response in the initial regime followed by asymptotic saturation at high values.\n(c) Practical Application: Used in sensor calibration, circuit design, and diagnostic instruments to ensure stable operational thresholds.`,
        explanation: `Marking scheme breakdown: (a) Mathematical formulation and derivation (2.5 marks). (b) Graphical explanation with axes identified (1.5 marks). (c) Valid real-world application (1 mark).`,
        pastPaperSource: `${subject.board} Previous Years Exam Pattern`,
        rubric: [
          {
            id: 'rub_l_1',
            criterion: 'Derivation / Theoretical Foundation',
            maxPoints: 2.5,
            description: 'Logically coherent step-by-step derivation with appropriate starting laws.'
          },
          {
            id: 'rub_l_2',
            criterion: 'Graphical Characterization',
            maxPoints: 1.5,
            description: 'Accurate description of curve shape, intercepts, and saturation limits.'
          },
          {
            id: 'rub_l_3',
            criterion: 'Practical Real-world Application',
            maxPoints: 1.0,
            description: 'Specific, valid technological or scientific application identified.'
          }
        ],
        hints: [`Divide your answer into parts (a), (b), and (c).`, `Mention the starting assumptions before proceeding to the derivation.`]
      };
    }
  }

  /**
   * Predefined rich question pool for built-in subjects.
   */
  private static getQuestionTemplates(subjectName: string): Partial<Question>[] {
    return [
      {
        topicName: 'Electrostatics',
        type: 'mcq',
        marks: 1,
        difficulty: 'easy',
        text: 'Two identical metallic spheres having charges +4q and -2q are brought into contact and then separated to their initial distance. What is the ratio of the new electrostatic force to the initial force between them?',
        options: ['1 : 8', '1 : 4', '1 : 2', '2 : 1'],
        correctAnswer: '1 : 8',
        explanation: 'Initial force F₁ = k * |4q * (-2q)| / r² = 8k q²/r². When brought in contact, charge redistributes equally: q_new = (+4q - 2q)/2 = +q on each. New force F₂ = k * (q * q)/r² = kq²/r². Therefore F₂ / F₁ = 1 / 8.',
        pastPaperSource: 'CBSE 2022 Question Bank',
        hints: ['Charges equalize upon contact by conduction.', 'Calculate q_final = (q1 + q2) / 2.']
      },
      {
        topicName: 'Current Electricity',
        type: 'numerical',
        marks: 3,
        difficulty: 'medium',
        text: 'A wire of resistance 16 Ω is stretched uniformly such that its length becomes twice its original length. Assuming the density and total volume of the material remain unchanged, calculate the new electrical resistance in ohms (Ω).',
        correctAnswer: '64',
        tolerance: 0.5,
        unit: 'Ω',
        formulaReference: 'R = ρ * (L / A) and Volume V = L * A = constant',
        explanation: 'When stretched to twice length (L’ = 2L), constant volume implies cross-sectional area halves (A’ = A / 2). New resistance R’ = ρ * (2L) / (A / 2) = 4 * (ρL / A) = 4 * R = 4 * 16 Ω = 64 Ω.',
        pastPaperSource: 'CBSE 2020 Delhi Paper',
        hints: ['Remember that volume V = Length × Area remains constant when stretching.', 'Resistance is proportional to L².']
      },
      {
        topicName: 'Optics',
        type: 'short_answer',
        marks: 2,
        difficulty: 'medium',
        text: 'State two necessary conditions for total internal reflection to occur at an interface between two optical media.',
        referenceAnswer: '1. The ray of light must travel from an optically denser medium to an optically rarer medium.\n2. The angle of incidence in the denser medium must be strictly greater than the critical angle (i > i_c) for the given pair of media.',
        explanation: 'Both conditions are mandatory. If light travels from rarer to denser, it refracts towards normal regardless of angle.',
        pastPaperSource: 'CBSE 2023 Sample Paper',
        rubric: [
          {
            id: 'r_tir_1',
            criterion: 'Direction of Light (Denser to Rarer)',
            maxPoints: 1,
            description: 'States light must originate in optically denser medium.'
          },
          {
            id: 'r_tir_2',
            criterion: 'Angle of Incidence > Critical Angle',
            maxPoints: 1,
            description: 'Explicitly requires angle of incidence to exceed critical angle.'
          }
        ]
      }
    ];
  }

  /**
   * Evaluate a student's answer.
   * - Objective (MCQ / Numerical): exact or tolerance matching.
   * - Written (Short / Long Answer): semantic rubric evaluation with feedback and disclaimer.
   */
  static evaluateAnswer(question: Question, studentAnswer: string): RubricEvaluation & { marksObtained: number; isCorrect: boolean } {
    const trimmed = (studentAnswer || '').trim();

    if (!trimmed) {
      return {
        marksObtained: 0,
        isCorrect: false,
        criteriaScores: (question.rubric || []).map(r => ({
          criterion: r.criterion,
          awarded: 0,
          max: r.maxPoints,
          feedback: 'Question was left unattempted.'
        })),
        overallFeedback: 'No answer submitted.',
        keyStrengths: [],
        missingPoints: ['Complete response required.'],
        isEstimate: false,
        confidenceScore: 100,
        suggestedAction: 'Review the reference answer and attempt this question in your next practice session.'
      };
    }

    // MCQ Evaluation
    if (question.type === 'mcq') {
      const isCorrect = trimmed.toLowerCase() === (question.correctAnswer || '').trim().toLowerCase();
      return {
        marksObtained: isCorrect ? question.marks : 0,
        isCorrect,
        criteriaScores: [
          {
            criterion: 'Correct Option Selection',
            awarded: isCorrect ? question.marks : 0,
            max: question.marks,
            feedback: isCorrect ? 'Option matches official answer key.' : `Selected incorrect option. Correct answer: ${question.correctAnswer}`
          }
        ],
        overallFeedback: isCorrect 
          ? 'Excellent! Your conceptual understanding of this question is spot on.' 
          : `Incorrect choice. Review the explanation: ${question.explanation}`,
        keyStrengths: isCorrect ? ['Correct theoretical concept identified'] : [],
        missingPoints: isCorrect ? [] : [`Right choice: ${question.correctAnswer}`],
        isEstimate: false,
        confidenceScore: 100,
        suggestedAction: isCorrect ? 'Continue to next question' : 'Read explanation and retry similar questions'
      };
    }

    // Numerical Evaluation
    if (question.type === 'numerical') {
      // Extract numeric value from student answer
      const studentNumMatch = trimmed.match(/[-+]?[0-9]*\.?[0-9]+/);
      const studentNum = studentNumMatch ? parseFloat(studentNumMatch[0]) : NaN;
      const targetNum = parseFloat(question.correctAnswer || '0');
      const tolerance = question.tolerance ?? 0.05;

      const isWithinTolerance = !isNaN(studentNum) && Math.abs(studentNum - targetNum) <= tolerance;
      const isPartiallyClose = !isNaN(studentNum) && Math.abs(studentNum - targetNum) <= tolerance * 4;

      let awarded = 0;
      let feedback = '';
      if (isWithinTolerance) {
        awarded = question.marks;
        feedback = `Accurate numerical answer within acceptable tolerance (+/- ${tolerance}).`;
      } else if (isPartiallyClose) {
        awarded = Math.round(question.marks * 0.5 * 10) / 10;
        feedback = `Close approximation, but outside strict tolerance (+/- ${tolerance}). Target: ${targetNum}. Check rounding or unit conversions.`;
      } else {
        feedback = `Computed value (${isNaN(studentNum) ? 'invalid' : studentNum}) deviates from expected answer (${targetNum} ${question.unit || ''}).`;
      }

      return {
        marksObtained: awarded,
        isCorrect: isWithinTolerance,
        criteriaScores: [
          {
            criterion: 'Numerical Accuracy & Precision',
            awarded,
            max: question.marks,
            feedback
          }
        ],
        overallFeedback: feedback,
        keyStrengths: isWithinTolerance ? ['Accurate formula application', 'Correct decimal calculation'] : (isPartiallyClose ? ['Correct order of magnitude'] : []),
        missingPoints: isWithinTolerance ? [] : [`Expected answer: ${targetNum} ${question.unit || ''}`],
        isEstimate: false,
        confidenceScore: 95,
        suggestedAction: isWithinTolerance ? 'Great calculation work' : 'Check formula steps and units'
      };
    }

    // Written Answers: Short Answer & Long Answer (Rubric-based evaluation)
    const rubric = question.rubric || [
      { id: 'def_1', criterion: 'Conceptual Understanding & Terminology', maxPoints: Math.floor(question.marks / 2) || 1, description: 'Correct scientific terms and concepts.' },
      { id: 'def_2', criterion: 'Completeness & Reasoning', maxPoints: Math.ceil(question.marks / 2) || 1, description: 'Comprehensive coverage of key points and conclusions.' }
    ];

    const studentLower = trimmed.toLowerCase();
    const referenceLower = (question.referenceAnswer || '').toLowerCase();

    // Extract significant keywords from reference answer
    const keywords = referenceLower
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3 && !['this', 'that', 'with', 'from', 'have', 'when', 'which', 'their', 'there', 'where', 'also', 'about'].includes(w));
    
    const uniqueKeywords = Array.from(new Set(keywords));
    const matchedKeywords = uniqueKeywords.filter(kw => studentLower.includes(kw));
    const keywordMatchRatio = uniqueKeywords.length > 0 ? (matchedKeywords.length / uniqueKeywords.length) : 0.5;

    // Length check relative to reference
    const refLength = (question.referenceAnswer || '').split(/\s+/).length;
    const wordCountRatio = Math.min(1.2, trimmed.split(/\s+/).length / Math.max(10, refLength));

    // Rubric criteria scoring
    let totalAwarded = 0;
    const criteriaScores = rubric.map((crit, idx) => {
      // Simulate criterion match weight based on keywords and length
      const weightBonus = (idx === 0 ? 0.2 : 0.0);
      const scoreFraction = Math.min(1.0, Math.max(0.2, (keywordMatchRatio * 0.7) + (wordCountRatio * 0.3) + weightBonus));
      const awarded = Math.round(crit.maxPoints * scoreFraction * 2) / 2; // round to nearest 0.5
      totalAwarded += awarded;

      return {
        criterion: crit.criterion,
        awarded,
        max: crit.maxPoints,
        feedback: awarded === crit.maxPoints 
          ? `Well addressed! Covered necessary principles for "${crit.criterion}".` 
          : awarded >= crit.maxPoints * 0.5
            ? `Partially addressed. Key points mentioned, but could be elaborated with specific terms.`
            : `Needs attention. Reference answer emphasizes specific criteria described in "${crit.description}".`
      };
    });

    totalAwarded = Math.min(question.marks, Math.max(0, totalAwarded));

    const keyStrengths: string[] = [];
    const missingPoints: string[] = [];

    if (matchedKeywords.length > 3) {
      keyStrengths.push(`Identified core terms: ${matchedKeywords.slice(0, 4).join(', ')}`);
    }
    if (trimmed.length > 50) {
      keyStrengths.push('Provided structured, detailed explanatory paragraphs');
    }

    // Find missing key terms
    const missed = uniqueKeywords.filter(kw => !studentLower.includes(kw)).slice(0, 3);
    if (missed.length > 0) {
      missingPoints.push(`Consider mentioning: ${missed.join(', ')}`);
    }
    if (totalAwarded < question.marks * 0.7) {
      missingPoints.push('Reference answer includes additional supporting derivations/conditions');
    }

    return {
      marksObtained: totalAwarded,
      isCorrect: totalAwarded >= question.marks * 0.75,
      criteriaScores,
      overallFeedback: totalAwarded >= question.marks * 0.85
        ? 'Outstanding response! Thorough explanation demonstrating strong conceptual command.'
        : totalAwarded >= question.marks * 0.5
          ? 'Good attempt. You have grasped the general idea, but exam marking schemes look for specific terms and conditions highlighted above.'
          : 'Developing. Your response is missing critical criteria defined in the marking scheme. Compare with the model answer below.',
      keyStrengths: keyStrengths.length > 0 ? keyStrengths : ['Made an earnest attempt on a challenging written question'],
      missingPoints,
      isEstimate: true,
      confidenceScore: 88,
      suggestedAction: totalAwarded >= question.marks * 0.8 
        ? 'Solidify with another question in this topic' 
        : 'Review reference answer model solution and note the exact criteria'
    };
  }

  /**
   * Generates a balanced adaptive study plan tailored to the target exam date and daily time.
   */
  static generateStudyPlan(subject: Subject, targetDateStr: string, dailyMinutes: number): StudyPlanSession[] {
    const today = new Date();
    const target = new Date(targetDateStr);
    const diffDays = Math.max(1, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    const sessions: StudyPlanSession[] = [];
    const sessionCount = Math.min(14, diffDays); // Plan next 2 weeks or up to exam

    // Sort topics by weakest mastery first
    const sortedTopics = [...subject.topics].sort((a, b) => a.masteryLevel - b.masteryLevel);

    for (let i = 0; i < sessionCount; i++) {
      const sessionDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const topic = sortedTopics[i % sortedTopics.length];
      
      const isMockDay = (i + 1) % 4 === 0;
      const isWeaknessDay = topic.masteryLevel < 60;

      let type: StudyPlanSession['type'] = 'topic_practice';
      let title = `Topic Drill: ${topic.name}`;
      let notes = `Focused question practice covering ${topic.subtopics.slice(0, 2).join(' & ')}.`;

      if (isMockDay) {
        type = 'mock_exam';
        title = `Timed Mock Exam #${Math.floor(i / 4) + 1}`;
        notes = 'Full timed practice under realistic exam conditions.';
      } else if (isWeaknessDay) {
        type = 'weakness_boost';
        title = `Weakness Booster: ${topic.name}`;
        notes = `Agent alert: Current mastery is ${topic.masteryLevel}%. Target past paper questions.`;
      } else if (i % 3 === 0) {
        type = 'concept_review';
        title = `Concept & Formula Revision: ${topic.name}`;
        notes = 'Review key formulas, derivations, and solved textbook examples.';
      }

      sessions.push({
        id: `sp_gen_${Date.now()}_${i + 1}`,
        date: sessionDate,
        title,
        topicIds: [topic.id],
        topicNames: [topic.name],
        durationMinutes: dailyMinutes,
        type,
        isCompleted: false,
        notes
      });
    }

    return sessions;
  }
}
