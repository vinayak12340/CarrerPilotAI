import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Standard type definitions for CareerPilot AI
interface StudentData {
  resumeText: string;
  targetRole: string;
  skills: string;
  resumeFile?: {
    data: string;
    mimeType: string;
  };
}

interface ChatMessage {
  role: "mentor" | "student";
  content: string;
  feedback?: string;
}

// Function to generate high-quality mock data for demo mode
function generateMockResponse(action: string, body: any) {
  if (action === "analyze") {
    const studentData: StudentData = body.studentData || { resumeText: "", targetRole: "Software Engineer", skills: "HTML, CSS, JS" };
    const role = studentData.targetRole.toLowerCase();

    let gaps = ["Data Structures & Algorithms (LeetCode level)", "System Design fundamentals", "Fullstack project deployment"];
    let roadmap = [
      { day: 1, title: "Optimize Resume & Github", description: "Format resume to highlight projects. Set up a clean GitHub profile with READMEs." },
      { day: 2, title: "Data Structures Crash Course", description: "Solve 2 Medium problems on Arrays & Strings. Learn Big O analysis." },
      { day: 3, title: "Core System Design", description: "Study MVC architecture, horizontal/vertical scaling, and SQL vs NoSQL databases." },
      { day: 4, title: "API and DB Integration", description: "Build a REST API endpoint using Node.js/Express, connect it to MongoDB or PostgreSQL." },
      { day: 5, title: "Mock Aptitude Test", description: "Solve 10 quantitative aptitude and 10 logical reasoning questions online." },
      { day: 6, title: "Behavioral Prep (STAR method)", description: "Draft stories for 'Tell me about a time you resolved a conflict' and 'Describe a challenging project'." },
      { day: 7, title: "Full Portfolio Deploy", description: "Deploy a project on Vercel or Render. Write a clear project write-up on LinkedIn." }
    ];
    let mockQuestion = "Explain the difference between SQL and NoSQL databases, and when you would choose one over the other.";
    let weakestRound = "Technical";
    let weakestRoundReason = "Current skills list lacks experience in back-end databases and structured data management needed for SDE roles.";
    let dailyTask = "Solve 1 Medium LeetCode question on Arrays and understand its time complexity.";

    if (role.includes("frontend") || role.includes("web dev")) {
      gaps = ["Advanced CSS layouting & Flexbox/Grid", "React state management (Redux/Zustand)", "Web performance optimization & Core Web Vitals"];
      roadmap[1] = { day: 2, title: "Advanced CSS & React Hooks", description: "Study React Custom Hooks and practice absolute/relative positioning & responsive design." };
      roadmap[2] = { day: 3, title: "Frontend State Management", description: "Build a small application using Context API or Zustand to manage global user state." };
      roadmap[3] = { day: 4, title: "Web Performance Tuning", description: "Understand lazy loading, bundle optimization, and image formats like WebP." };
      mockQuestion = "React component render cycle me 'useEffect' dependency array missing hone par kya problem design hoti hai? Explain standard solution.";
      weakestRound = "Technical";
    } else if (role.includes("data") || role.includes("analyst")) {
      gaps = ["Advanced SQL query optimization", "Data visualization with Tableau or PowerBI", "Statistical analysis using Python (Pandas/NumPy)"];
      roadmap[1] = { day: 2, title: "Advanced SQL Queries", description: "Practice joins, subqueries, and window functions on LeetCode Database section." };
      roadmap[2] = { day: 3, title: "Pandas & Python Dataframes", description: "Write clean Python scripts to clean and manipulate a CSV dataset using Pandas." };
      roadmap[3] = { day: 4, title: "Data Visualization Dashboard", description: "Create a simple interactive dashboard using Streamlit or clean Tableau sheets." };
      mockQuestion = "Can you explain what a Left Join is in SQL and how it differs from an Inner Join with a practical example?";
      weakestRound = "Aptitude";
    }

    return {
      summary: `Placement-ready student targeting a ${studentData.targetRole} role, possessing foundational skills in ${studentData.skills || "web technologies"}. Needs target improvement in core engineering concepts.`,
      gaps,
      roadmap,
      readinessScore: 65,
      weakestRound,
      weakestRoundReason,
      dailyTask,
      mockQuestion
    };
  } else {
    // Action is 'answer'
    const chatHistory: ChatMessage[] = body.chatHistory || [];
    const latestAnswer: string = body.latestAnswer || "";
    const question = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].content : "What is your main technical strength?";
    
    let feedback = "Aapka answer average tha. SQL vs NoSQL difference accurately address kiya, but try adding practical projects references next time.";
    let nextQuestion = "Project optimization process: Aapne standard project load speed load improve karne ke liye kya technical steps liye? Detail parameters.";
    let nextAction = "Explain with STAR framework: Situation, Task, Action, Result.";
    let readinessScore = 70;
    let weakestRound = "Technical";
    let weakestRoundReason = "Need to emphasize real-world project scenarios rather than textbook definitions.";

    if (latestAnswer.length < 15) {
      feedback = "Answer details thode short hain. Ek industry mentor standard structure detail appreciate karega. Give specific examples and explain technologies used.";
      readinessScore = 60;
    } else if (latestAnswer.toLowerCase().includes("index") || latestAnswer.toLowerCase().includes("scaling")) {
      feedback = "Very sharp details! Databases scaling standards understand karna placement interview technical rounds me critical helpful score increment dega.";
      readinessScore = 80;
    }

    return {
      feedback,
      readinessScore,
      weakestRound,
      weakestRoundReason,
      nextQuestion,
      nextAction
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, studentData, chatHistory, latestAnswer } = body;

    // Retrieve API key from client header or environment variables
    const headerApiKey = request.headers.get("x-gemini-key");
    const apiKey = headerApiKey || process.env.GEMINI_API_KEY;

    // Use Demo Mode Fallback if API key is missing or explicitly 'demo'
    if (!apiKey || apiKey === "demo") {
      const mockResult = generateMockResponse(action, body);
      return NextResponse.json({ ...mockResult, isDemo: true });
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    if (action === "analyze") {
      const prompt = `
        You are CareerPilot AI, a sharp, friendly, and motivational AI Placement Mentor for college students.
        Your job is to read the student's resume, target role, and current skills, and generate a structured gap analysis and roadmap.

        STUDENT PROFILE:
        - Target Role: ${studentData.targetRole}
        - Current Skills: ${studentData.skills}
        - Resume Text (parsed): ${studentData.resumeText}

        INSTRUCTIONS:
        1. Write a short, motivating student summary (1-2 sentences).
        2. Identify EXACTLY 3 key technical or project gaps keeping them from this role.
        3. Create a 7-day action-focused roadmap. Each day should have a clear, achievable title and short description.
        4. Predict their weakest interview round (Technical, HR, Aptitude, or Communication) and explain why in 1 sentence.
        5. Calculate a placement readiness score out of 100 based on their initial skills and resume contents.
        6. Select a single, actionable mentor task for today (Daily One-Task Mentor Mode).
        7. Ask the first mock interview question tailored to test their profile and gaps.

        *BILINGUAL RULE*: If the student's input contains mixed Hindi-English (Hinglish), or if you detect typical Indian college student phrasing, write your summary, roadmap descriptions, reasoning, and interview questions in natural, friendly Hinglish (Hindi-English mix, like: "Aapka system design core basics thoda weak lag raha hai..."). Keep response keys in English.

        Output must be a JSON object with this EXACT structure:
        {
          "summary": "...",
          "gaps": ["gap 1", "gap 2", "gap 3"],
          "roadmap": [
            {"day": 1, "title": "...", "description": "..."},
            {"day": 2, "title": "...", "description": "..."},
            {"day": 3, "title": "...", "description": "..."},
            {"day": 4, "title": "...", "description": "..."},
            {"day": 5, "title": "...", "description": "..."},
            {"day": 6, "title": "...", "description": "..."},
            {"day": 7, "title": "...", "description": "..."}
          ],
          "readinessScore": 65,
          "weakestRound": "HR" | "Technical" | "Aptitude" | "Communication",
          "weakestRoundReason": "...",
          "dailyTask": "...",
          "mockQuestion": "..."
        }
      `;

      const promptParts: any[] = [];
      if (studentData.resumeFile) {
        promptParts.push({
          inlineData: {
            data: studentData.resumeFile.data,
            mimeType: studentData.resumeFile.mimeType
          }
        });
      }
      promptParts.push(prompt);

      const response = await model.generateContent(promptParts);
      const responseText = response.response.text();
      return NextResponse.json(JSON.parse(responseText));

    } else if (action === "answer") {
      const historyText = chatHistory
        .map((m: any) => `${m.role === "mentor" ? "Mentor Q" : "Student A"}: ${m.content}`)
        .join("\n");

      const prompt = `
        You are CareerPilot AI, a sharp, friendly, and motivational AI Placement Mentor.
        The student is participating in a mock interview.
        Evaluate their latest answer, update stats, and ask the next question.

        STUDENT PROFILE:
        - Target Role: ${studentData.targetRole}
        - Current Skills: ${studentData.skills}

        MOCK INTERVIEW SESSION:
        - History:
        ${historyText}
        - Student's latest answer: "${latestAnswer}"

        INSTRUCTIONS:
        1. Evaluate the student's latest answer. Give short, useful feedback (1-2 sentences) on what was good or what was missing (be honest and encouraging).
        2. Adjust the placement readiness score (0-100) based on their answer quality. Make sure it fluctuates realistically (e.g. increases for good answers, drops/stalls for poor/shallow answers).
        3. Recalculate/update the weakest round prediction and provide a short reason.
        4. Select the next mock interview question. Mix technical, HR, or communication questions based on their performance.
        5. Define the next best action clearly (1 short sentence, e.g. "Focus on explaining project architectures using diagrams next time").

        *BILINGUAL RULE*: If the student writes or replies in Hinglish, write the feedback, next question, and next action in a natural, bilingual Hinglish style. Keep response keys in English.

        Output must be a JSON object with this EXACT structure:
        {
          "feedback": "...",
          "readinessScore": 72,
          "weakestRound": "HR" | "Technical" | "Aptitude" | "Communication",
          "weakestRoundReason": "...",
          "nextQuestion": "...",
          "nextAction": "..."
        }
      `;

      const response = await model.generateContent(prompt);
      const responseText = response.response.text();
      return NextResponse.json(JSON.parse(responseText));
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    console.error("API Error in CareerPilot mentor:", error);
    // Return a clean error response, suggesting user to check API key
    return NextResponse.json(
      {
        error: "Failed to generate AI response. If you've entered a custom key, check its validity or switch to Demo Mode.",
        details: error?.message || ""
      },
      { status: 500 }
    );
  }
}
