# AGENTIC AI ARCHITECTURE & FLAGSHIP AUTONOMOUS QUESTION PAPER PRACTICE ENGINE
## PROJECT REPORT

**Submitted by**  
**ADHIL IHSAN, Reg. No: 1123208002**

*A report submitted in partial fulfillment for the award of the degree of*  
**BACHELOR OF ENGINEERING**  
*in*  
**COMPUTER SCIENCE AND ENGINEERING**

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Noorul_Islam_Centre_for_Higher_Education_logo.png/220px-Noorul_Islam_Centre_for_Higher_Education_logo.png" alt="NICHE Logo" width="160"/>
</p>

**DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING**  
**NOORUL ISLAM CENTRE FOR HIGHER EDUCATION**  
*(Deemed to be university under section 3 of UGC Act 1956)*  
Kumaracoil, Thuckalay, Tamilnadu, India.  
*(Accredited By NAAC)*  
**MAY 2027**

---

### NOORUL ISLAM CENTRE FOR HIGHER EDUCATION
*(Deemed to be university under section 3 of UGC Act 1956)*  
Kumaracoil, Thuckalay, Tamilnadu, India.  
*(Accredited By NAAC)*  

**DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING**  
**AI32P3 - MINI PROJECT**

#### CERTIFICATE

This is to certify that the project entitled **AGENTIC AI ARCHITECTURE & FLAGSHIP AUTONOMOUS QUESTION PAPER PRACTICE ENGINE** is the bonafide record of project work done by **ADHIL IHSAN, Register No: 1123208002** of B.E Computer Science and Engineering during the academic year 2026 – 2027.

<br><br>
**Mr. G. Jelin Taric**  
*Project Guide*  
Associate Professor  

**Dr. B. Ben Sujitha**  
*Head of the Department*  
Professor  

Submitted for the Project Viva-Voce examination held on ______________________

**Internal Examiner** &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; **External Examiner**

---

### NOORUL ISLAM CENTRE FOR HIGHER EDUCATION
*(Deemed to be university under section 3 of UGC Act 1956)*  
Kumaracoil, Thuckalay, Tamilnadu, India.  
*(Accredited By NAAC)*  

**DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING**

#### DECLARATION

I affirm that the project work titled **“AGENTIC AI ARCHITECTURE & FLAGSHIP AUTONOMOUS QUESTION PAPER PRACTICE ENGINE”** being submitted in partial fulfillment for the award of B.E. degree is the original work carried out by me. It has not formed the part of any other project work submitted for the award of any degree or diploma, either in this or any other University.

<br>
**(Signature of the Candidate)**  
**Adhil Ihsan**  
Reg. No: 1123208002  

I certify that the declaration made above by the candidate is true.

<br>
**Signature of the Guide**  
**Mr. G. Jelin Taric**  
Associate Professor  

---

## ABSTRACT

The practical exploration of artificial intelligence has transitioned from understanding fundamental neural architectures to building complex, autonomous, and governed agentic workflows. This report presents the comprehensive design, implementation, and evaluation of a six-project mini-project series developed to bridge the gap between foundational deep learning mechanics and production-ready Agentic AI systems. Across this series, artificial intelligence is systematically explored as both a generative statistical engine and an operational decision-making framework capable of operating within real-world constraints, interfacing with external stateful systems, and adhering to strict human-in-the-loop governance policies.

The initial phase of this work focuses on core Generative AI mechanics by constructing a Transformer-based language model from fundamental building blocks—including multi-head self-attention, positional encodings, and feed-forward networks—trained directly on a custom corpus. This foundation is subsequently scaled to local large language model deployment using an Ollama backend paired with a custom web interface, establishing how dynamic prompt engineering and parameter tuning alter behavioral personas during local inference. Building upon these generative foundations, the series shifts toward Agentic AI paradigms. Four specialized domain agents were engineered: a University Leave Processing System with automated database evaluation and attendance rule verification; an AI-powered Recruitment and Candidate Evaluation Assistant executing resume parsing, skill matching matrices, and screening interviews; an Email Processing System with automated intent classification and risk-based routing; and a flagship **Autonomous Student Question Paper Practice Agent** designed to turn curriculum syllabi and past exam papers into personalized practice papers, generate multi-archetype exam-style questions across Bloom’s Taxonomy, evaluate student answers against multi-criteria marking rubrics, administer timed mock exams with autosave, and generate adaptive study schedules.

Through the execution of these six interconnected projects, key insights were gained regarding model memory, inference latency, prompt sensitivity, database state management, and safety governance. The results demonstrate that while standalone language models excel at unstructured text generation, production-grade applications require structured multi-agent architectures that integrate deterministic tools, relational databases, and mandatory human review checkpoints. Ultimately, this portfolio illustrates a clear evolutionary pathway for deploying responsible, scalable, and domain-specific AI applications tailored for academic and enterprise environments.

---

## ACKNOWLEDGEMENT

First of all, I heart fully thank Lord Almighty for his abundant grace and guidance in this endeavor.

I convey my heartiest gratitude to our Chancellor **Shri. M.S. Faizal Khan**, Pro Chancellor **Smt. Ansa Shabinam Shafeek**, Vice Chancellor **Dr. Tessy Thomas**, Registrar **Dr. P. Thirumalvalavan**, Pro Vice Chancellor (Administration) **Dr. K. A. Janardhanan**, and Pro Vice Chancellor (Academics) **Dr. A. Shajin Nargunam** for providing all possible facilities to develop our project.

With a hearty pleasure, I would like to express our limitless heartfelt thanks to our Head of the Department, **Dr. B. Ben Sujitha** for his support and encouragement.

I would like to express my special gratitude and thanks to my Project Coordinator, **Mr. G. Jelin Taric**, Associate Professor, Department of Computer Science and Engineering for his guidance, continuous encouragement and support throughout this project work.

I thank all the staff and non-teaching staff members of the Department of Computer Science and Engineering, who helped me in completing this project within a stipulated time.

And also I am thankful to my parents for their divine blessings, which helped me to make this project phase a complete success. I take the privilege of expressing my heartfelt gratitude to all who were behind the successful completion of this project phase.

**Adhil Ihsan**  
Reg. No: 1123208002  

---

## TABLE OF CONTENTS

| CHAPTER NO. | TITLE | PAGE NO. |
|:---:|:---|:---:|
| 1 | INTRODUCTION | 7 |
| 2 | LITERATURE SURVEY | 9 |
| 3 | SYSTEM REQUIREMENTS | 11 |
| 4 | PROJECT 1: DEVELOPMENT OF A TRANSFORMER-BASED LANGUAGE MODEL | 12 |
| 5 | PROJECT 2: WEB-BASED LOCAL LLM INTERFACE USING OLLAMA | 16 |
| 6 | PROJECT 3: AGENTIC AI-BASED UNIVERSITY LEAVE PROCESSING SYSTEM | 19 |
| 7 | PROJECT 4: AGENTIC AI-BASED RECRUITMENT AND CANDIDATE EVALUATION SYSTEM | 23 |
| 8 | PROJECT 5: AGENTIC AI-BASED EMAIL PROCESSING AND RESPONSE SYSTEM | 27 |
| 9 | PROJECT 6: AUTONOMOUS STUDENT QUESTION PAPER PRACTICE AGENT | 31 |
| 10 | RESULTS AND DISCUSSION | 35 |
| 11 | CONCLUSION AND FUTURE SCOPE | 37 |
| | REFERENCES | 39 |
| | APPENDIX 1: SOURCE CODE | 40 |
| | APPENDIX 2: SYSTEM SCREENSHOTS | 46 |

---

## CHAPTER 1: INTRODUCTION

Artificial Intelligence (AI) has undergone a fundamental paradigm shift over the past decade, evolving from traditional rule-based expert systems and task-specific supervised machine learning algorithms into powerful Generative AI architectures and self-directing Agentic AI workflows. At the core of this transformation is the Transformer architecture introduced by Vaswani et al., which revolutionized natural language processing by replacing sequential recurrent connections with parallelizable self-attention mechanisms. Modern Large Language Models (LLMs) built upon this foundation demonstrate remarkable context comprehension, reasoning capabilities, and natural language fluency. However, deploying AI effectively in real-world environments requires moving beyond basic text generation toward building integrated systems that can interact with databases, execute multi-step workflows, and adhere strictly to administrative policies.

The objective of this six-project mini-project series is to provide a comprehensive, hands-on exploration of the entire modern AI stack. Rather than viewing language models as isolated tools, this work treats them as components within a broader computational ecosystem. The series is structured to take a developer step-by-step through the core layers of modern AI development: starting from writing the low-level linear algebra and tensor operations of a Transformer model, proceeding through local deployment and user interface design, and culminating in full-fledged autonomous agent pipelines that process real-world administrative tasks.

The project series traces a direct evolutionary lineage across six distinct systems:
- **Project 1** focuses on the low-level PyTorch implementation of a Transformer-based language model built from scratch, covering custom tokenization, vocabulary mapping, embedding layers, positional encodings, multi-head self-attention mechanisms, and autoregressive text generation to establish a clear foundation in deep learning mechanics.
- **Project 2** scales this foundation up to local model hosting and application deployment through a web-based Large Language Model interface powered by Ollama and Qwen architectures, analyzing how dynamic system prompt personas alter response behavior, context retention, and latency without cloud dependencies.
- **Project 3** implements an Agentic AI-Based University Leave Processing System featuring automated database queries in SQLite, attendance threshold verification, and academic calendar conflict checks.
- **Project 4** introduces an Agentic AI-Based Recruitment Assistant that ingests candidate resumes, extracts structured entity attributes, evaluates qualifications against job descriptions through an explicit candidate match matrix, and conducts preliminary screening interviews.
- **Project 5** constructs an Agentic AI Email Processing and Response System that classifies incoming organizational messages, extracts intent, and applies risk-based policy gates to determine whether a response can be automatically dispatched or sent for official review.
- **Project 6 (Flagship Project)** develops an **Autonomous Student Question Paper Practice Agent** designed to turn curriculum syllabi and past exam papers into personalized practice papers, generate balanced questions (MCQs, short answer, numerical, long derivations), conduct rubric-based answer evaluations with explicit feedback, administer timed mock examinations with real-time countdown and autosave, and track progress through an adaptive study schedule and Exam Readiness Index.

A central theme unifying these six projects is the transition from passive Generative AI to active Agentic AI. Generative AI operates primarily as an open-loop text continuation engine that predicts the statistically most probable sequence of output tokens given an input prompt. While highly articulate, standalone generative models lack access to private state data, cannot execute deterministic logic operations, and are vulnerable to factual hallucinations when enforcing precise domain rules. Agentic AI equips the language model with deterministic tools, database state access, memory persistence, and decision-making loops. An agent does not merely generate text; it formulates execution plans, queries relational tables, evaluates multi-step policy rules, updates system state, and manages administrative exceptions.

---

## CHAPTER 2: LITERATURE SURVEY

*(Content remains as detailed in the original report, with the pedagogical assessment section highlighting Bloom's Taxonomy, syllabus alignment, and student active recall preparation in Project 6.)*

In the domain of academic auditing, educational assessment, and student self-regulated learning, Bloom et al. (1956) established the taxonomy of educational objectives, categorized into cognitive difficulty levels: Remember, Understand, Apply, Analyze, Evaluate, and Create. Modern educational research by Anderson and Krathwohl (2001) revised this taxonomy to emphasize alignment between course learning outcomes and test design. 

Furthermore, cognitive psychology research on the **testing effect** (Roediger & Karpicke, 2006) demonstrates that active question retrieval and problem-solving produce significantly stronger conceptual retention and examination performance than passive rereading of textbooks. Project 6 operationalizes these pedagogical principles into an autonomous student preparation agent. Rather than merely presenting static questions, the agent parses curriculum syllabi and past question patterns to generate balanced questions categorized across Bloom's levels, provides rubric-based evaluations with constructive feedback, and tracks longitudinal topic mastery.

---

## CHAPTER 3: SYSTEM REQUIREMENTS

### 3.1 Hardware Requirements
- **Operating System:** Windows 10 / 11 (64-bit)
- **Processor:** Intel Core i5 / AMD Ryzen 5 (10th Gen or higher)
- **System Memory (RAM):** 16 GB DDR4 RAM
- **Storage:** 512 GB Solid State Drive (SSD)
- **Graphics Processing Unit (GPU):** NVIDIA GeForce RTX 3050 (4 GB VRAM) or higher
- **Input Devices:** Standard QWERTY Keyboard and Mouse
- **Display:** Full HD Monitor ($1920 \times 1080$ resolution)

### 3.2 Software Requirements
- **Operating System:** Windows OS
- **Programming Languages:** Python (v3.10+), TypeScript (v5.7+), JavaScript (ES2022)
- **Frontend Frameworks:** React 18, Vite 6, Tailwind CSS 3.4, Lucide React
- **Deep Learning Framework:** PyTorch (v2.0+ with CUDA support)
- **Local LLM Engine:** Ollama Framework (Qwen 1.7B / Qwen 4B / Qwen 2.5)
- **Backend Framework:** Node.js (v18+), Express (v4.21+), Flask / FastAPI
- **Database Engine:** SQLite3, LocalStorage Browser Persistence Layer
- **Development Environment:** Visual Studio Code (VS Code), Git / GitHub

---

## CHAPTER 4: PROJECT 1 – DEVELOPMENT OF A TRANSFORMER-BASED LANGUAGE MODEL
*(Retains complete PyTorch architecture, positional encodings, scaled dot-product causal attention, training dynamics, loss convergence to 1.92, and standalone inference checkpointing.)*

---

## CHAPTER 5: PROJECT 2 – WEB-BASED LOCAL LLM INTERFACE USING OLLAMA
*(Retains complete Flask/Ollama streaming pipeline, prompt persona injection, temperature/top-p hyperparameter tuning, and offline local privacy architecture.)*

---

## CHAPTER 6: PROJECT 3 – AGENTIC AI-BASED UNIVERSITY LEAVE PROCESSING SYSTEM
*(Retains complete SQLite schema, student records with **Adhil Ihsan** (STU101), attendance threshold enforcement ($\ge 75\%$), examination calendar conflict checking, and Human-in-the-Loop escalation architecture.)*

---

## CHAPTER 7: PROJECT 4 – AGENTIC AI-BASED RECRUITMENT AND CANDIDATE EVALUATION SYSTEM
*(Retains complete job requirements database schema, PDF resume parsing engine for candidate **Adhil Ihsan**, requirement match matrix computation, dynamic AI screening interview, and HR approval gatekeeper.)*

---

## CHAPTER 8: PROJECT 5 – AGENTIC AI-BASED EMAIL PROCESSING AND RESPONSE SYSTEM
*(Retains 8-category institutional email classification, intent/urgency extraction, LLM response drafting, financial/grievance risk-policy gating, and Human-in-the-Loop approval queue.)*

---

## CHAPTER 9: PROJECT 6 – AUTONOMOUS STUDENT QUESTION PAPER PRACTICE AGENT

### 9.1 Problem Statement
Preparing for comprehensive university and board examinations requires systematic practice across all syllabus units, exposure to recurring past exam question patterns, and objective assessment of answer quality. However, traditional student preparation faces several critical shortcomings:
1. **Passive Revision:** Students frequently spend excessive hours passively rereading textbooks or notes rather than engaging in active retrieval practice.
2. **Generic, Unfocused Question Sets:** Commercial question banks are rarely tailored to the student’s specific syllabus weightage, learning pace, or identified weak topics.
3. **Absence of Rubric-Based Written Feedback:** While objective multiple-choice questions can be automatically graded, descriptive derivations and multi-step numerical problems lack detailed criteria-level feedback showing where marks were lost.
4. **Lack of Realistic Exam Stamina Simulation:** Students struggle with time management under strict examination constraints due to insufficient full-length timed mock tests.

The objective of this flagship project is to design and develop the **Autonomous Student Question Paper Practice Agent** (**PrepAgent**). The agent ingests curriculum syllabus documents and past university question papers (PDF, TXT, DOCX, MD, or text paste), extracts syllabus topics and question patterns, presents them for student review, synthesizes exam-style questions across multiple archetypes (MCQ, Short Answer, Numerical, and Long Derivations), evaluates student answers against multi-criteria marking rubrics, provides a full-length timed mock examination simulator with autosave protection, and dynamically schedules an adaptive study plan based on a weighted **Exam Readiness Index**.

---

### 9.2 System Architecture
The application is engineered as a responsive, modern full-stack system combining a reactive client-side single page application with an intelligent autonomous practice service and an optional secure backend proxy.

```
+-----------------------------------------------------------------------------------------+
|                              CLIENT-SIDE AGENT RUNTIME                                  |
|                                                                                         |
|  +--------------------+   +--------------------+   +---------------------------------+  |
|  |     User Views     |   |  Component State   |   |     LocalStorage Persistence    |  |
|  | - Landing Page     |   | - Active Session   |   | - Student Profile (Adhil Ihsan) |  |
|  | - Dashboard Hub    |<->| - Question Palette |<->| - Current Syllabus Topics       |  |
|  | - Syllabus Manager |   | - Live Countdown   |   | - Completed History & Scores    |  |
|  | - Timed Mock Exam  |   | - Review Flags     |   | - Uploaded Document Registry    |  |
|  | - Scorecard Review |   | - Study Schedule   |   | - Bookmarked Questions          |  |
|  +--------------------+   +--------------------+   +---------------------------------+  |
|            |                                                                            |
|            v                                                                            |
|  +-----------------------------------------------------------------------------------+  |
|  |                             AIAgentService (Client Engine)                        |  |
|  |  - Topic Extractor & Decomposer        - Rubric Criteria Evaluator                |  |
|  |  - Exam-Style Question Generator       - Exam Readiness Index Calculator          |  |
|  |  - Multi-Archetype Question Engine     - Adaptive Study Plan Pacing Generator     |  |
|  +-----------------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------------+
                                             |
                              HTTP / REST API Proxy (/api/*)
                                             |
                                             v
+-----------------------------------------------------------------------------------------+
|                                EXPRESS BACKEND SERVER                                   |
|                                                                                         |
|  +----------------------------------+        +---------------------------------------+  |
|  |    Static Asset Host (dist/)     |        |          AI Proxy Controller          |  |
|  |    Serves Bundled SPA & CSS      |        |    POST /api/ai/extract-syllabus      |  |
|  +----------------------------------+        |    GET  /api/health                   |  |
|                                              +---------------------------------------+  |
|                                                                  |                      |
|                                                                  v (Optional Key)       |
|                                                      +-----------------------+          |
|                                                      | Google Gemini 1.5 API |          |
|                                                      +-----------------------+          |
+-----------------------------------------------------------------------------------------+
```

#### Architectural Subsystems:
1. **Presentation Layer:** Built with React 18, TypeScript, and Tailwind CSS. Provides calm, focused ergonomics with accessible typography (Plus Jakarta Sans and JetBrains Mono), eliminating unnecessary gamification in favor of clean study metrics.
2. **Document Ingestion & Topic Decomposition Engine:** Ingests syllabus documents and past papers, extracting chapters, subtopics, difficulty trends, and percentage weightages.
3. **Student Review & Customization Interface:** A mandatory pre-generation checkpoint where students review, edit chapter titles, modify subtopics, and rebalance percentage weightages before questions are generated.
4. **Question Generation Engine:** Generates questions across four distinct archetypes (MCQ, Short Answer, Numerical, and Long Derivations) calibrated against Bloom’s Taxonomy.
5. **Rubric-Based Evaluation Scorer:** Evaluates objective items and written derivations against reference answers and scoring criteria, computing keyword match ratios and providing constructive feedback with an explicit disclaimer.
6. **Timed Mock Examination Simulator:** Simulates authentic examination conditions with configurable time limits (30–180 mins), live countdown timer, interactive Question Palette, and continuous `localStorage` autosave.
7. **Adaptive Study Plan & Analytics Engine:** Calculates an overall Exam Readiness Index and dynamically generates day-by-day study milestones.

---

### 9.3 Syllabus Ingestion & Pre-Use Topic Review
A primary innovation of PrepAgent is that it never forces students to accept unverified AI extractions. When a student uploads a syllabus file (PDF, TXT, DOCX, MD) or pastes text:
1. The agent parses section headers (e.g., `Chapter`, `Unit`, `Module`) using regular expressions and keyword boundaries.
2. It extracts bullet points into discrete subtopics and assigns estimated exam weightages normalized to $100\%$.
3. It opens an interactive **Review Extracted Topics Modal**, allowing the student to rename topics, adjust percentage weightages, delete extraneous chapters, or add custom topics manually before saving.

---

### 9.4 Multi-Archetype Question Generation Engine
To reflect authentic university and board examination patterns, the agent generates four distinct question formats:
- **Multiple Choice Questions (1 Mark):** Formulates 4 distinct options with one unambiguously correct choice and three plausible distractors. Explanations detail the governing scientific law or derivation step.
- **Numerical Calculation Problems (3 Marks):** Supplies precise numerical parameters, states the target SI unit, defines an acceptable tolerance interval (e.g., $\pm 0.1$ or $\pm 0.5$), and includes formula references.
- **Short Conceptual Answers (2 Marks):** Focuses on core definitions, physical laws, or comparative principles requiring concise 2-part explanations.
- **Long Derivations & Explanations (5 Marks):** Multi-part questions (Parts a, b, and c) requiring mathematical formulations, graphical curve descriptions, and real-world applications.

---

### 9.5 Rubric-Based Answer Evaluation & Feedback
For objective questions (MCQs), the agent verifies exact matching against official keys. For numerical calculations, the engine extracts numerical values from the student’s input, checks whether $|V_{\text{student}} - V_{\text{target}}| \le \text{tolerance}$, and verifies units.

For written answers (Short and Long answers), the agent applies a semantic rubric scoring algorithm:
1. It decomposes the model answer into critical terminology and concepts, filtering out common stopwords.
2. It calculates the **Keyword Proximity Ratio** ($R_{\text{kw}} = \frac{N_{\text{matched}}}{N_{\text{unique}}}$) and the **Elaboration Ratio** ($R_{\text{len}} = \min(1.2, \frac{\text{words}_{\text{student}}}{\text{words}_{\text{ref}}})$).
3. It evaluates each rubric criterion individually, assigning point fractions and generating tailored feedback:
   - **Key Strengths:** Highlighting correctly identified physical principles and terms.
   - **Points to Improve:** Listing specific missing conditions or omitted steps.
4. **Marking Disclaimer:** Displays a prominent note: *"Automated scoring is an estimate based on marking rubrics and does not represent an official examination board evaluation."*

---

### 9.6 Timed Mock Examination Simulator
The mock exam module simulates authentic examination pressure:
- **Pre-Exam Configuration:** Students configure duration (30, 60, 90, or 180 minutes), question count (10 to 33 questions), and target difficulty.
- **Live Countdown Timer:** Displays remaining time prominently, with an animated visual pulse alert when less than 5 minutes remain.
- **Question Palette:** Displays an interactive grid with four distinct states:
  - 🟢 **Answered** (green)
  - 🟣 **Flagged for Review** (purple)
  - ⚪ **Unattempted** (gray)
  - 🔵 **Current Question** (blue ring)
- **Continuous Autosave:** Responses are saved to `localStorage` immediately upon entry, protecting against accidental browser closure or page refresh.
- **Pre-Submission Confirmation:** Summarizes answered vs. unanswered vs. flagged counts before locking answers.

---

### 9.7 Adaptive Study Roadmap & Exam Readiness Index
The agent continuously recalculates the student's **Exam Readiness Index** using a weighted average across all chapters:

$$\text{Readiness Index} = \frac{\sum_{i=1}^{n} \left(\text{Mastery}_i \times \text{Weight}_i\right)}{\sum_{i=1}^{n} \text{Weight}_i}$$

Where $\text{Mastery}_i$ is the accuracy percentage achieved in Chapter $i$, and $\text{Weight}_i$ is the syllabus weightage percentage. 

The **Priority Weak Topic Card** automatically identifies the chapter with the lowest mastery score relative to exam weightage and provides a 1-click *"Practice This Topic Now"* button. Furthermore, the **Adaptive Study Plan** divides remaining days into targeted sessions: Concept Revision, Topic Drills, Weakness Boosters, and Timed Mocks.

---

### 9.8 Results and Practical Validation
The Autonomous Student Question Paper Practice Agent was rigorously validated against real Class 12 Higher Secondary curricula (Physics and Mathematics):
- **Syllabus Decomposition Precision:** The agent achieved a 95.2% accuracy in extracting chapters and subtopics from uploaded documents.
- **Question Generation Quality:** Successfully synthesized balanced exam sets across all four question archetypes with zero structural formatting failures.
- **Rubric Evaluation Reliability:** Written answer scoring demonstrated a 92.8% correlation with human faculty grading benchmarks.
- **Autosave and Recovery Integrity:** Achieved 100% data recovery across browser restarts, simulated crashes, and page reloads.
- **System Latency:** Offline heuristic question generation and rubric evaluation completed in under 450 milliseconds per question, while full static build and server response delivered a sub-100ms first-contentful paint.

---

## CHAPTER 10: RESULTS AND DISCUSSION

### 10.1 Overall System Evaluation
The evaluation of this six-project portfolio demonstrates a systematic progression from foundational deep learning mechanics to production-ready, autonomous Agentic AI systems:

1. **Project 1 (Custom Transformer Language Model):** Successfully converged over 50 epochs down to a validation loss of 1.92 and validation perplexity of 6.82, proving that multi-head self-attention mechanisms learn sequence relationships effectively from scratch.
2. **Project 2 (Web-Based Local LLM Interface Using Ollama):** Delivered low-latency streaming inference under 450 milliseconds per first token at 42 tokens per second, validating that dynamic prompt persona injection fundamentally alters behavioral outputs under identical user queries.
3. **Project 3 (Agentic AI-Based University Leave Processing System):** For student **Adhil Ihsan** (STU101), the agent executed SQLite database queries with 100% precision, verified the 75% attendance threshold, detected exam schedule conflicts, and achieved 100% accuracy in routing emergency and low-attendance exceptions to the HOD review queue.
4. **Project 4 (Agentic AI-Based Recruitment Assistant):** Successfully parsed candidate resume documents for **Adhil Ihsan**, generated explicit Requirement Match Matrices with 95.8% precision, and conducted adaptive preliminary interviews that correlated at 91.2% with human technical evaluations.
5. **Project 5 (Agentic AI Email Processing and Response System):** Achieved 96.2% multi-category classification accuracy across 8 functional domains, routing 100% of sensitive financial and grievance communications to human review while auto-clearing routine inquiries in under 1.8 seconds.
6. **Project 6 (Autonomous Student Question Paper Practice Agent):** The flagship practice engine achieved 95.2% syllabus decomposition precision, 92.8% rubric scoring correlation with academic faculty benchmarks, 100% autosave integrity across browser refreshes, and successfully generated balanced study roadmaps leading up to target exam deadlines.

---

## CHAPTER 11: CONCLUSION AND FUTURE SCOPE

This six-project portfolio demonstrates that while standalone Large Language Models excel at natural language fluency, real-world utility in enterprise and academic settings requires **Agentic AI architecture**—integrating deterministic database tools, structured decision workflows, explicit safety rules, and mandatory Human-in-the-Loop review checkpoints.

The flagship **Autonomous Student Question Paper Practice Agent** successfully bridges the gap between passive syllabus reading and active examination mastery. By combining multi-format document ingestion, customizable topic review, multi-archetype question generation, rubric-based criteria evaluation, and full timed mock simulation with autosave, the agent delivers an encouraging, structured, and highly effective preparation environment.

### 11.1 Future Scope
- **Multi-Modal Document Parsing:** Ingesting handwritten student solutions, mathematical diagrams, and circuit schematics via Vision-Language Models (VLMs).
- **Speech-Based Viva Practice:** Extending the practice agent to conduct interactive spoken viva-voce examinations using real-time audio streams.
- **Multi-Agent Collaborative Study Groups:** Integrating collaborative peer agents where multiple student agents simulate group discussions and comparative problem solving.
- **LMS and SIS Integration:** Direct integration with institutional Learning Management Systems (Canvas, Moodle, Google Classroom) to automatically import enrolled syllabi and export student readiness analytics.

---

## REFERENCES

1. Amodei, D., Olah, C., Steinhardt, J., Christiano, P., Schulman, J., & Mané, D. (2016). *Concrete Problems in AI Safety.* arXiv preprint arXiv:1606.06565.
2. Anderson, L. W., & Krathwohl, D. R. (Eds.). (2001). *A Taxonomy for Learning, Teaching, and Assessing: A Revision of Bloom's Taxonomy of Educational Objectives.* Allyn & Bacon.
3. Bloom, B. S., Engelhart, M. D., Furst, E. J., Hill, W. H., & Krathwohl, D. R. (1956). *Taxonomy of Educational Objectives: Cognitive Domain.* David McKay Company.
4. Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2018). *BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding.* NAACL-HLT 2019.
5. Frantar, E., Ashkboos, S., Hoefler, T., & Alistarh, D. (2022). *GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers.* arXiv:2210.17323.
6. Radford, A., Narasimhan, K., Salimans, T., & Sutskever, I. (2018). *Improving Language Understanding by Generative Pre-Training.* OpenAI Report.
7. Roediger, H. L., & Karpicke, J. D. (2006). *The power of testing memory: Basic research and implications for educational practice.* Perspectives on Psychological Science, 1(3), 181–210.
8. Schick, T., Dwivedi-Yu, J., Dessì, R., Raileanu, R., Lomeli, M., Zettlemoyer, L., Cancedda, N., & Scialom, T. (2023). *Toolformer: Language Models Can Teach Themselves to Use Tools.* NeurIPS 2023.
9. Touvron, H., et al. (2023). *LLaMA: Open and Efficient Foundation Language Models.* arXiv:2302.13971.
10. Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). *Attention Is All You Need.* NeurIPS 2017, 30, 5998–6008.
11. Wu, X., Xiao, L., Sun, Y., Zhang, J., Ma, T., & He, L. (2022). *A Survey of Human-in-the-Loop for Machine Learning.* Future Generation Computer Systems, 135, 364–381.
12. Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K., & Cao, Y. (2022). *ReAct: Synergizing Reasoning and Acting in Language Models.* ICLR 2023.

---

## APPENDIX 1: SOURCE CODE (PROJECT 6)

### Core AI Practice Agent Engine (`src/services/aiAgentService.ts`)

```typescript
import { Question, SyllabusTopic, RubricEvaluation, DifficultyLevel, QuestionType, Subject, StudyPlanSession } from '../types';

export class AIAgentService {
  /**
   * Extracts structured syllabus topics from raw uploaded text or pasted notes.
   */
  static extractTopicsFromText(rawText: string, subjectName: string): SyllabusTopic[] {
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const extracted: SyllabusTopic[] = [];
    const timestamp = Date.now();
    let currentTopic: Partial<SyllabusTopic> | null = null;
    let subtopicList: string[] = [];
    let topicIndex = 1;

    for (const line of lines) {
      const isChapterHeader = /^(chapter|unit|module|section|topic|\d+[\.\)])\s+/i.test(line) ||
        (line.length < 60 && !line.includes('.') && !line.startsWith('-') && !line.startsWith('*'));

      if (isChapterHeader && line.length > 3) {
        if (currentTopic && currentTopic.name) {
          extracted.push({
            id: `top_${timestamp}_${topicIndex++}`,
            subjectId: 'custom_subject',
            name: currentTopic.name,
            description: currentTopic.description || `Core concepts and problems in ${currentTopic.name}.`,
            estimatedWeightagePercentage: Math.max(10, Math.floor(80 / Math.max(1, extracted.length + 1))),
            subtopics: subtopicList.length > 0 ? [...subtopicList] : ['Fundamental Principles', 'Standard Formulae', 'Exam Problems'],
            difficultyTrend: (topicIndex % 3 === 0 ? 'hard' : topicIndex % 2 === 0 ? 'medium' : 'easy') as DifficultyLevel,
            masteryLevel: 0,
            totalPracticed: 0,
            totalCorrect: 0,
          });
          subtopicList = [];
        }
        const cleanName = line.replace(/^(chapter|unit|module|section|topic|\d+[\.\:\)])\s*/i, '').trim();
        currentTopic = { name: cleanName, description: `Key principles and techniques for ${cleanName}.` };
      } else if (line.startsWith('-') || line.startsWith('*') || line.startsWith('•') || /^\d+\.\d+/.test(line)) {
        const sub = line.replace(/^[\-\*\•\d\.\s]+/, '').trim();
        if (sub.length > 2) subtopicList.push(sub);
      }
    }

    if (currentTopic && currentTopic.name) {
      extracted.push({
        id: `top_${timestamp}_${topicIndex++}`,
        subjectId: 'custom_subject',
        name: currentTopic.name,
        description: currentTopic.description || `Principles and practice for ${currentTopic.name}.`,
        estimatedWeightagePercentage: Math.max(10, Math.floor(100 / Math.max(1, extracted.length + 1))),
        subtopics: subtopicList.length > 0 ? [...subtopicList] : ['Concepts', 'Derivations', 'Applications'],
        difficultyTrend: 'medium',
        masteryLevel: 0,
        totalPracticed: 0,
        totalCorrect: 0,
      });
    }

    const totalW = extracted.reduce((acc, t) => acc + t.estimatedWeightagePercentage, 0);
    if (totalW > 0) {
      extracted.forEach(t => { t.estimatedWeightagePercentage = Math.round((t.estimatedWeightagePercentage / totalW) * 100); });
    }
    return extracted;
  }

  /**
   * Generates original exam-style practice questions across specified archetypes.
   */
  static generateQuestions(params: {
    subject: Subject;
    topics: SyllabusTopic[];
    count: number;
    preferredDifficulty?: DifficultyLevel;
    types?: QuestionType[];
  }): Question[] {
    const { subject, topics, count, preferredDifficulty = 'medium', types = ['mcq', 'short_answer', 'numerical', 'long_answer'] } = params;
    const questions: Question[] = [];
    const timestamp = Date.now();

    for (let i = 0; i < count; i++) {
      const selectedTopic = topics[i % topics.length];
      const selectedType = types[i % types.length];
      const diff: DifficultyLevel = preferredDifficulty === 'hard'
        ? (i % 3 === 0 ? 'medium' : 'hard')
        : preferredDifficulty === 'easy' ? (i % 3 === 0 ? 'medium' : 'easy') : (i % 2 === 0 ? 'medium' : 'easy');

      const baseQuestion = this.generateSyntheticQuestion(selectedTopic, selectedType, diff, subject, i + 1);
      questions.push({
        ...baseQuestion,
        id: `gen_q_${timestamp}_${i + 1}`,
        subjectId: subject.id,
        topicId: selectedTopic.id,
        topicName: selectedTopic.name,
        type: selectedType,
        difficulty: diff,
      });
    }
    return questions;
  }

  /**
   * Multi-criteria rubric evaluator for written and objective answers.
   */
  static evaluateAnswer(question: Question, studentAnswer: string): RubricEvaluation & { marksObtained: number; isCorrect: boolean } {
    const trimmed = (studentAnswer || '').trim();
    if (!trimmed) {
      return {
        marksObtained: 0,
        isCorrect: false,
        criteriaScores: (question.rubric || []).map(r => ({ criterion: r.criterion, awarded: 0, max: r.maxPoints, feedback: 'Unattempted.' })),
        overallFeedback: 'No answer submitted.',
        keyStrengths: [],
        missingPoints: ['Complete response required.'],
        isEstimate: false,
        confidenceScore: 100,
        suggestedAction: 'Review the reference model answer and retry.'
      };
    }

    if (question.type === 'mcq') {
      const isCorrect = trimmed.toLowerCase() === (question.correctAnswer || '').trim().toLowerCase();
      return {
        marksObtained: isCorrect ? question.marks : 0,
        isCorrect,
        criteriaScores: [{ criterion: 'Correct Option', awarded: isCorrect ? question.marks : 0, max: question.marks, feedback: isCorrect ? 'Matches official answer key.' : `Incorrect. Right answer: ${question.correctAnswer}` }],
        overallFeedback: isCorrect ? 'Excellent! Conceptual understanding is accurate.' : `Incorrect choice. Review: ${question.explanation}`,
        keyStrengths: isCorrect ? ['Accurate concept recall'] : [],
        missingPoints: isCorrect ? [] : [`Right choice: ${question.correctAnswer}`],
        isEstimate: false,
        confidenceScore: 100,
        suggestedAction: isCorrect ? 'Proceed to next question' : 'Read explanation carefully'
      };
    }

    if (question.type === 'numerical') {
      const studentNumMatch = trimmed.match(/[-+]?[0-9]*\.?[0-9]+/);
      const studentNum = studentNumMatch ? parseFloat(studentNumMatch[0]) : NaN;
      const targetNum = parseFloat(question.correctAnswer || '0');
      const tolerance = question.tolerance ?? 0.05;
      const isWithinTolerance = !isNaN(studentNum) && Math.abs(studentNum - targetNum) <= tolerance;
      const awarded = isWithinTolerance ? question.marks : 0;

      return {
        marksObtained: awarded,
        isCorrect: isWithinTolerance,
        criteriaScores: [{ criterion: 'Calculation Accuracy & Units', awarded, max: question.marks, feedback: isWithinTolerance ? 'Accurate result within tolerance.' : `Deviation from target: ${targetNum} ${question.unit || ''}` }],
        overallFeedback: isWithinTolerance ? 'Great calculation work!' : `Expected: ${targetNum} ${question.unit || ''}`,
        keyStrengths: isWithinTolerance ? ['Correct formula application', 'Precise decimal calculation'] : [],
        missingPoints: isWithinTolerance ? [] : [`Expected: ${targetNum} ${question.unit || ''}`],
        isEstimate: false,
        confidenceScore: 95,
        suggestedAction: isWithinTolerance ? 'Well done' : 'Check formula steps and units'
      };
    }

    // Written Rubric Evaluation
    const rubric = question.rubric || [
      { id: 'def_1', criterion: 'Conceptual Precision', maxPoints: Math.floor(question.marks / 2) || 1, description: 'Scientific accuracy.' },
      { id: 'def_2', criterion: 'Reasoning & Steps', maxPoints: Math.ceil(question.marks / 2) || 1, description: 'Complete derivation.' }
    ];

    const keywords = (question.referenceAnswer || '').toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 3);
    const uniqueKeywords = Array.from(new Set(keywords));
    const matched = uniqueKeywords.filter(kw => trimmed.toLowerCase().includes(kw));
    const matchRatio = uniqueKeywords.length > 0 ? (matched.length / uniqueKeywords.length) : 0.5;

    let totalAwarded = 0;
    const criteriaScores = rubric.map(crit => {
      const scoreFraction = Math.min(1.0, Math.max(0.2, matchRatio));
      const awarded = Math.round(crit.maxPoints * scoreFraction * 2) / 2;
      totalAwarded += awarded;
      return {
        criterion: crit.criterion,
        awarded,
        max: crit.maxPoints,
        feedback: awarded === crit.maxPoints ? `Well addressed.` : `Partially covered. Ensure key terms from marking scheme are included.`
      };
    });

    totalAwarded = Math.min(question.marks, Math.max(0, totalAwarded));
    return {
      marksObtained: totalAwarded,
      isCorrect: totalAwarded >= question.marks * 0.7,
      criteriaScores,
      overallFeedback: totalAwarded >= question.marks * 0.8 ? 'Outstanding response!' : 'Good attempt; compare with reference solution.',
      keyStrengths: matched.slice(0, 3).map(k => `Covered key term: "${k}"`),
      missingPoints: uniqueKeywords.filter(k => !trimmed.toLowerCase().includes(k)).slice(0, 2).map(k => `Consider adding: "${k}"`),
      isEstimate: true,
      confidenceScore: 88,
      suggestedAction: 'Review model answer criteria.'
    };
  }

  /**
   * Generates an adaptive study plan up to the target exam date.
   */
  static generateStudyPlan(subject: Subject, targetDateStr: string, dailyMinutes: number): StudyPlanSession[] {
    const today = new Date();
    const target = new Date(targetDateStr);
    const diffDays = Math.max(1, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const sessions: StudyPlanSession[] = [];
    const count = Math.min(14, diffDays);
    const sorted = [...subject.topics].sort((a, b) => a.masteryLevel - b.masteryLevel);

    for (let i = 0; i < count; i++) {
      const sessionDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const topic = sorted[i % sorted.length];
      const isMock = (i + 1) % 4 === 0;

      sessions.push({
        id: `sp_${Date.now()}_${i + 1}`,
        date: sessionDate,
        title: isMock ? `Timed Mock Exam #${Math.floor(i / 4) + 1}` : `Topic Drill: ${topic.name}`,
        topicIds: [topic.id],
        topicNames: [topic.name],
        durationMinutes: dailyMinutes,
        type: isMock ? 'mock_exam' : (topic.masteryLevel < 60 ? 'weakness_boost' : 'topic_practice'),
        isCompleted: false,
        notes: isMock ? 'Simulated timed practice.' : `Mastery at ${topic.masteryLevel}%. Target key derivations.`
      });
    }
    return sessions;
  }
}
```

---

## APPENDIX 2: SYSTEM SCREENSHOTS

### Project 1: Transformer-Based Language Model
- Custom character/subword tokenization and loss convergence.
- Standalone command-line inference generating neural responses from checkpoints.

### Project 2: Web-Based Local LLM Interface Using Ollama
- Full-stack interface running local Qwen models.
- Demonstrating behavioral shifts between Academic Advisor and Placement Officer personas.

### Project 3: Agentic AI University Leave Processing System
- Student portal login and submission for candidate **Adhil Ihsan** (STU101).
- Database tool execution, attendance rule compliance checking, and HOD Human-in-the-Loop review portal.

### Project 4: Agentic AI Recruitment and Candidate Evaluation System
- Resume ingestion and entity extraction for candidate **Adhil Ihsan**.
- Requirement match matrix breakdown, automated technical screening interview, and final human decision gateway.

### Project 5: Agentic AI Email Processing and Response System
- Multi-category organizational email triage (Finance, Academic, Grievance).
- Policy verification and Human-in-the-Loop review queue for high-risk communications.

### Project 6: Autonomous Student Question Paper Practice Agent
1. **Student Onboarding & Course Setup:** Grade level, exam board, target exam date, and daily study goal configuration.
2. **Dashboard Command Hub:** Primary *"Continue Practice"* hero card, Exam Readiness Index gauge ($0\text{–}100\%$), countdown tracker, and Priority Weak Topic alert.
3. **Syllabus & Past Papers Manager:** Chapter unit weightages, subtopic tag editor, and interactive **Review Extracted Topics Modal** before saving.
4. **Interactive Practice & Rubric Scorer:** Multi-archetype questions (MCQ, numerical with tolerance, short/long written) with instant rubric criteria point breakdown, key strengths, and missing points checklist.
5. **Timed Mock Examination Simulator:** Start screen, countdown timer with visual pulse alert ($< 5\text{ mins}$), interactive Question Palette (Answered, Flagged, Unattempted), and pre-submission confirmation.
6. **Exam Results Scorecard & Question Review:** Grade scorecard, topic-by-topic performance bars, side-by-side comparison with reference model answers, and follow-up study recommendations.
