import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Results from "./Results";
const API_URL = process.env.REACT_APP_API_URL || "";

// ─── Survey Questions — 7 sections ───────────────────────────────────────────
const SECTIONS = [
  { id: 1, title: "Session Information", emoji: "📋", color: "#3b82f6" },
  { id: 2, title: "Reaction",            emoji: "💬", color: "#10b981" },
  { id: 3, title: "Learning",            emoji: "🧠", color: "#f97316" },
  { id: 4, title: "Behaviour",            emoji: "🚀", color: "#a78bfa" },
  { id: 5, title: "Results",             emoji: "📈", color: "#f43f5e" },
  { id: 6, title: "Meaningfulness",      emoji: "❤️", color: "#fbbf24" },
  { id: 7, title: "Final Thoughts",      emoji: "✨", color: "#06b6d4" },
];

const QUESTIONS = [
  // ── Section 1: Session Information ──
  {
    id: 1, section: 1,
    text: "Which sessions did you attend?",
    type: "checkbox_other",
    options: ["Session 1: Self-Awareness", "Session 2: Collaboration", "Session 3: Time Management", "Session 4: Presentation Techniques"],
  },
  {
    id: 2, section: 1,
    text: "Trainer(s):",
    type: "checkbox",
    options: ["Pinja", "Kimberley"],
  },
  // ── Section 2: Level 1 — Reaction ──
  {
    id: 3, section: 2,
    text: "Overall, how satisfied were you with the 4 sessions?",
    type: "linear",
    scaleLabel: { low: "Not satisfied", high: "Very satisfied" },
  },
  {
    id: 4, section: 2,
    text: "How engaging did you find the sessions?",
    type: "linear",
    scaleLabel: { low: "Low", high: "High" },
  },
  {
    id: 5, section: 2,
    text: "How relevant was the content to your personal or professional life?",
    type: "linear",
    scaleLabel: { low: "Not relevant", high: "Very relevant" },
  },
  {
    id: 6, section: 2,
    text: "What part of the sessions felt most valuable to you?",
    type: "paragraph",
  },
  {
    id: 7, section: 2,
    text: "What, if anything, felt unclear or less useful?",
    type: "paragraph",
  },
  // ── Section 3: Level 2 — Learning ──
  {
    id: 8, section: 3,
    text: "To what extent did you gain new insights or perspectives?",
    type: "linear",
    scaleLabel: { low: "Low", high: "High" },
  },
  {
    id: 9, section: 3,
    text: "Which skills or concepts did you learn?",
    type: "checkbox_other",
    options: ["Self awareness", "Communication", "Emotional regulation", "Collaboration", "Problem solving"],
  },
  {
    id: 10, section: 3,
    text: "How confident do you feel applying what you learned?",
    type: "linear",
    scaleLabel: { low: "Not confident", high: "Very confident" },
  },
  {
    id: 11, section: 3,
    text: "What is one idea, tool or learning you will take with you from these sessions?",
    type: "paragraph",
  },
  // ── Section 4: Level 3 — Behavior ──
  {
    id: 12, section: 4,
    text: "How likely are you to apply something from these sessions in the next week?",
    type: "linear",
    scaleLabel: { low: "Not At All", high: "Very Likely" },
  },
  {
    id: 13, section: 4,
    text: "Which situations do you expect to apply the learning to?",
    type: "checkbox_other",
    options: ["Work tasks", "Team interactions", "Personal relationships", "Self management", "Decision making"],
  },
  {
    id: 14, section: 4,
    text: "What would support you in applying these skills?",
    type: "paragraph",
  },
  {
    id: 15, section: 4,
    text: "What would make it difficult to apply these skills?",
    type: "paragraph",
  },
  // ── Section 5: Level 4 — Results ──
  {
    id: 16, section: 5,
    text: "How much potential impact do you see from the sessions on your work or life or professional skillset?",
    type: "linear",
    scaleLabel: { low: "Low", high: "High" },
  },
  {
    id: 17, section: 5,
    text: "If you imagine applying these skills consistently, what positive changes do you expect?",
    type: "paragraph",
  },
  {
    id: 18, section: 5,
    text: "Do you see any long term value in continuing this training program (if more interactive sessions would be offered)?",
    type: "multiple_choice_comment",
    options: ["Yes", "No", "Maybe"],
  },
  // ── Section 6: Level 5 — Meaningfulness ──
  {
    id: 19, section: 6,
    text: "How meaningful were the sessions for you personally?",
    type: "linear",
    scaleLabel: { low: "Not meaningful", high: "Very meaningful" },
  },
  {
    id: 20, section: 6,
    text: "Did the sessions help you reflect on yourself in a new or deeper way?",
    type: "radio",
    options: ["Yes", "No", "Somewhat"],
  },
  {
    id: 21, section: 6,
    text: "Which part of the session felt most personally meaningful or resonant?",
    type: "paragraph",
  },
  {
    id: 22, section: 6,
    text: "In which ways did the sessions connect to something important in your life, values, or goals?",
    type: "paragraph",
  },
  {
    id: 23, section: 6,
    text: "If you could describe the \"human value\" of this session in one sentence, what would it be?",
    type: "paragraph",
  },
  // ── Section 7: Final Thoughts ──
  {
    id: 24, section: 7,
    text: "Is there anything you would like us to improve for the next session?",
    type: "paragraph",
  },
  {
    id: 25, section: 7,
    text: "Any additional comments or reflections? (Anything not addressed that you would like to highlight or comment?)",
    type: "paragraph",
  },
];

// Group questions by section for the 4-section flow
const SECTION_QUESTIONS = SECTIONS.map(sec => ({
  ...sec,
  questions: QUESTIONS.filter(q => q.section === sec.id),
}));

function SparkLogoWhite() {
  return (
    <img
      src="https://sparktraineeships.com/wp-content/uploads/2025/05/Main-Logo.svg"
      alt="Spark Logo"
      className="h-20 w-auto object-contain"
    />
  );
}


// ─── Build 25 pipe segments ───────────────────────────────────────────────────
function buildPipeSegments() {
  const waypoints = [
    [430,185],[430,230],[430,255],[370,255],[310,255],[250,255],[190,255],[130,255],[80,255],
    [80,285],[130,285],[190,285],[250,285],[310,285],[370,285],[420,285],
    [420,315],[370,315],[310,315],[250,315],[190,315],[130,315],[80,315],
    [80,345],[60,345],[60,185],
  ];
  let totalLen = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const dx = waypoints[i+1][0]-waypoints[i][0], dy = waypoints[i+1][1]-waypoints[i][1];
    totalLen += Math.sqrt(dx*dx+dy*dy);
  }
  const segLen = totalLen / 25;
  let wpIdx = 0, posOnSeg = 0;
  const lerp = (a,b,t) => a+(b-a)*t;
  const cutPoints = [[waypoints[0][0],waypoints[0][1]]];
  for (let s = 1; s <= 25; s++) {
    let remaining = segLen;
    while (remaining > 0 && wpIdx < waypoints.length-1) {
      const ax=waypoints[wpIdx][0],ay=waypoints[wpIdx][1],bx=waypoints[wpIdx+1][0],by=waypoints[wpIdx+1][1];
      const segDist = Math.sqrt((bx-ax)**2+(by-ay)**2);
      const leftOnCurrent = segDist - posOnSeg;
      if (remaining <= leftOnCurrent) {
        posOnSeg += remaining;
        const t = posOnSeg/segDist;
        cutPoints.push([lerp(ax,bx,t),lerp(ay,by,t)]);
        remaining = 0;
      } else {
        remaining -= leftOnCurrent; wpIdx++; posOnSeg = 0;
      }
    }
    if (wpIdx >= waypoints.length-1) cutPoints.push([waypoints[waypoints.length-1][0],waypoints[waypoints.length-1][1]]);
  }
  const segs = [];
  for (let i = 0; i < 25; i++) {
    segs.push({ x1:cutPoints[i][0],y1:cutPoints[i][1],x2:cutPoints[i+1]?cutPoints[i+1][0]:cutPoints[i][0],y2:cutPoints[i+1]?cutPoints[i+1][1]:cutPoints[i][1] });
  }
  return segs;
}
const ALL_PIPE_SEGS = buildPipeSegments();

// ─── Fish Game ────────────────────────────────────────────────────────────────
function FishGame({ progress, total, isComplete, pondJumping }) {
  const waterLevel = Math.min(progress / total, 1);
  const fishHappy = isComplete || pondJumping || waterLevel > 0.6;
  const pondMaxH = 55, pondWaterH = Math.round(waterLevel * pondMaxH);
  const pondX=20,pondY=130,pondW=90,pondH=65,lakeX=385,lakeY=100,lakeW=105,lakeH=90,groundY=185;
  const fishCX = pondX+pondW/2, fishCY = pondY+pondH-14;
  const waterSurfaceY = pondY + pondH + (groundY - pondY) - pondWaterH;

  return (
   
    <div className="w-full relative">
      <svg viewBox="0 0 500 380" width="100%" xmlns="http://www.w3.org/2000/svg">
        {/* Sky */}
        <rect x="0" y="0" width="500" height={groundY} fill="#0a1628"/>
        {[[30,18],[90,10],[160,22],[240,8],[310,20],[390,12],[460,25],[70,38],[200,42],[430,40]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="1.2" fill="#fff" opacity={0.4+(i%3)*0.2}/>
        ))}
        {/* Grass */}
        <rect x="0" y={groundY} width="500" height="10" fill="#2d6a2d"/>
        {[30,80,150,220,290,340,470].map((x,i)=>(
          <g key={i}>
            <rect x={x} y={groundY-4} width="3" height="7" fill="#3a8a3a" rx="1"/>
            <rect x={x+5} y={groundY-6} width="3" height="9" fill="#45a045" rx="1"/>
            <rect x={x+10} y={groundY-3} width="3" height="6" fill="#3a8a3a" rx="1"/>
          </g>
        ))}
        {/* Soil layers */}
        <rect x="0" y={groundY+10} width="500" height="35" fill="#5c3d1e"/>
        <rect x="0" y={groundY+45} width="500" height="40" fill="#4a2e14"/>
        <rect x="0" y={groundY+85} width="500" height="40" fill="#3d2410"/>
        <rect x="0" y={groundY+125} width="500" height="40" fill="#2d1c0c"/>
        <rect x="0" y={groundY+165} width="500" height="30" fill="#1e1208"/>
        {/* Soil dots */}
        {[[50,210],[120,225],[200,215],[280,230],[360,218],[450,222],[70,250],[140,265],[220,258],[300,270],[380,255],[460,262],[40,290],[110,305],[190,295],[270,310],[350,298],[430,305]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="2" fill="#000" opacity="0.15"/>
        ))}
        {/* Rocks */}
        {[[60,335],[160,340],[260,332],[360,338],[450,335]].map(([x,y],i)=>(
          <ellipse key={i} cx={x} cy={y} rx="14" ry="8" fill="#1a1008" opacity="0.6"/>
        ))}
        {/* Pond walls */}
        <rect x={pondX-4} y={pondY} width={pondW+8} height={pondH+groundY-pondY+5} fill="#6b4c2a" rx="3"/>
        {[pondY+15,pondY+30,pondY+45,pondY+60,pondY+75,pondY+90,pondY+105,pondY+120,pondY+135,pondY+150].map((y,i)=>(
          <line key={i} x1={pondX-4} y1={y} x2={pondX+pondW+4} y2={y} stroke="#5a3d1f" strokeWidth="1"/>
        ))}
        <rect x={pondX} y={pondY} width={pondW} height={pondH+(groundY-pondY)} fill="#2a1a0a"/>
        {/* Pond water */}
        <clipPath id="pondWaterClip">
          <rect x={pondX} y={pondY} width={pondW} height={pondH+(groundY-pondY)}/>
        </clipPath>
        <rect x={pondX} y={pondY+pondH+(groundY-pondY)-pondWaterH} width={pondW} height={pondWaterH+5} fill="#1a5fa0" clipPath="url(#pondWaterClip)"/>
        {pondWaterH > 8 && <line x1={pondX+5} y1={pondY+pondH+(groundY-pondY)-pondWaterH+3} x2={pondX+pondW-5} y2={pondY+pondH+(groundY-pondY)-pondWaterH+3} stroke="#60a5fa" strokeWidth="1.5" opacity="0.5"/>}
        {/* Dry cracks */}
        {waterLevel < 0.15 && (
          <>
            <line x1={pondX+15} y1={pondY+pondH+(groundY-pondY)-5} x2={pondX+25} y2={pondY+pondH+(groundY-pondY)-15} stroke="#5a3010" strokeWidth="1" opacity="0.7"/>
            <line x1={pondX+45} y1={pondY+pondH+(groundY-pondY)-3} x2={pondX+55} y2={pondY+pondH+(groundY-pondY)-12} stroke="#5a3010" strokeWidth="1" opacity="0.7"/>
            <line x1={pondX+70} y1={pondY+pondH+(groundY-pondY)-6} x2={pondX+78} y2={pondY+pondH+(groundY-pondY)-18} stroke="#5a3010" strokeWidth="1" opacity="0.7"/>
          </>
        )}
        <text x={pondX+pondW/2} y={pondY-6} textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="700">DRY POND</text>
        {/* Lake walls */}
        <rect x={lakeX-4} y={lakeY} width={lakeW+8} height={lakeH+(groundY-lakeY)+5} fill="#6b4c2a" rx="3"/>
        {[lakeY+15,lakeY+30,lakeY+45,lakeY+60,lakeY+75,lakeY+90,lakeY+105,lakeY+120,lakeY+135].map((y,i)=>(
          <line key={i} x1={lakeX-4} y1={y} x2={lakeX+lakeW+4} y2={y} stroke="#5a3d1f" strokeWidth="1"/>
        ))}
        <rect x={lakeX} y={lakeY} width={lakeW} height={lakeH+(groundY-lakeY)} fill="#1a5fa0"/>
        <line x1={lakeX+8} y1={lakeY+12} x2={lakeX+lakeW-8} y2={lakeY+12} stroke="#60a5fa" strokeWidth="2" opacity="0.4"/>
        <line x1={lakeX+15} y1={lakeY+22} x2={lakeX+lakeW-20} y2={lakeY+22} stroke="#60a5fa" strokeWidth="1.5" opacity="0.3"/>
        <text x={lakeX+lakeW/2} y={lakeY+lakeH/2+5} textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="700">LAKE</text>
        <text x={lakeX+lakeW/2} y={lakeY-6} textAnchor="middle" fill="#93c5fd" fontSize="8">Vesijärvi </text>
        {/* Trees */}
        <rect x={lakeX+10} y={groundY-30} width="6" height="30" fill="#5d4037"/>
        <rect x={lakeX+10-8} y={groundY-48} width="22" height="22" fill="#2e7d32" rx="2"/>
        <rect x={lakeX+lakeW-20} y={groundY-24} width="5" height="24" fill="#5d4037"/>
        <rect x={lakeX+lakeW-20-7} y={groundY-40} width="19" height="19" fill="#388e3c" rx="2"/>
        {/* Goldfish — hidden during pond jump (replaced by jumping fish below) */}
        {!pondJumping && (
        <motion.g
          animate={fishHappy ? {y:[0,-5,0,-3,0],rotate:[0,8,-8,4,0]} : {y:[0,-1.5,0],rotate:[0,3,0]}}
          transition={{ repeat:Infinity, duration:fishHappy?1.1:2.5 }}
          style={{ originX:`${fishCX}px`, originY:`${fishCY}px` }}
        >
          <polygon points={`${fishCX+13},${fishCY} ${fishCX+22},${fishCY-8} ${fishCX+22},${fishCY+8}`} fill="#ea580c"/>
          <ellipse cx={fishCX} cy={fishCY} rx="14" ry="9" fill="#f97316"/>
          <path d={`M ${fishCX-2} ${fishCY-9} Q ${fishCX+4} ${fishCY-16} ${fishCX+8} ${fishCY-9}`} fill="#fb923c"/>
          <circle cx={fishCX-6} cy={fishCY-3} r="3" fill="#fff"/>
          <circle cx={fishCX-6} cy={fishCY-3} r="1.5" fill="#1e2d5a"/>
          <circle cx={fishCX-5} cy={fishCY-4} r="0.6" fill="#fff"/>
          {fishHappy
            ? <path d={`M ${fishCX-13} ${fishCY+3} Q ${fishCX-10} ${fishCY+7} ${fishCX-7} ${fishCY+3}`} stroke="#fff" strokeWidth="1.2" fill="none"/>
            : <path d={`M ${fishCX-13} ${fishCY+6} Q ${fishCX-10} ${fishCY+3} ${fishCX-7} ${fishCY+6}`} stroke="#fff" strokeWidth="1.2" fill="none"/>
          }
          {!fishHappy && waterLevel < 0.25 && (
            <>
              <motion.ellipse cx={fishCX-7} cy={fishCY} rx="1.8" ry="3" fill="#60a5fa" opacity="0.9" animate={{cy:[fishCY,fishCY+5],opacity:[0.9,0]}} transition={{repeat:Infinity,duration:0.9}}/>
              <motion.ellipse cx={fishCX-4} cy={fishCY+2} rx="1.4" ry="2.5" fill="#60a5fa" opacity="0.7" animate={{cy:[fishCY+2,fishCY+7],opacity:[0.7,0]}} transition={{repeat:Infinity,duration:1.1,delay:0.3}}/>
            </>
          )}
          {fishHappy && [0,1,2].map(i=>(
            <motion.circle key={i} cx={fishCX-8+i*5} cy={fishCY-12} r="2" fill="none" stroke="#60a5fa" strokeWidth="1" animate={{cy:[fishCY-12,fishCY-28],opacity:[0.8,0]}} transition={{repeat:Infinity,duration:1.2,delay:i*0.3}}/>
          ))}
        </motion.g>
        )}

        {/* ── POND JUMP overlay — one dramatic leap out and back in ── */}
        {pondJumping && (
          <>
            {/* Splash ring expanding at water surface on launch */}
            {[0,1,2].map(i => (
              <motion.ellipse key={`sr${i}`}
                cx={fishCX} cy={waterSurfaceY}
                rx="8" ry="4" fill="none" stroke="#60a5fa" strokeWidth={2-i*0.5}
                initial={{ rx:8, ry:4, opacity:0.9 }}
                animate={{ rx:[8, 55+i*18], ry:[4, 14+i*5], opacity:[0.9,0] }}
                transition={{ duration:0.7, delay:i*0.15, ease:"easeOut" }}
              />
            ))}

            {/* Water droplets spraying sideways on jump */}
            {[-1,-0.6,-0.3,0.3,0.6,1].map((dir,i) => (
              <motion.ellipse key={`wd${i}`}
                cx={fishCX} cy={waterSurfaceY}
                rx="3" ry="5" fill="#60a5fa" opacity="0.85"
                initial={{ cx:fishCX, cy:waterSurfaceY, opacity:0.9 }}
                animate={{
                  cx: fishCX + dir * 38,
                  cy: waterSurfaceY - 22 - (i%2)*10,
                  opacity: 0,
                  ry: 2,
                }}
                transition={{ duration:0.6, delay:0.05*i, ease:"easeOut" }}
              />
            ))}

            {/* The fish leaping — arc up HIGH above the pond, rotates mid-air, splashes back */}
            {/* keyframes: sit at waterSurface → soar up to sky → peak → fall back → splash */}
            <motion.g
              initial={{ y: 0, rotate: 0 }}
              animate={{
                y:      [0, -40, -100, -155, -185, -155, -100, -40, 0,  8,  0],
                rotate: [0, -25,  -18,    0,   22,   18,   10,  20, 0, -5,  0],
              }}
              transition={{
                duration: 2.6,
                ease: "easeInOut",
                times: [0, 0.1, 0.22, 0.36, 0.5, 0.62, 0.74, 0.86, 0.92, 0.96, 1],
              }}
              style={{ originX:`${fishCX}px`, originY:`${waterSurfaceY}px` }}
            >
              {/* Tail */}
              <polygon
                points={`${fishCX+13},${waterSurfaceY} ${fishCX+24},${waterSurfaceY-10} ${fishCX+24},${waterSurfaceY+10}`}
                fill="#c2410c"
              />
              <polygon
                points={`${fishCX+13},${waterSurfaceY} ${fishCX+21},${waterSurfaceY-7} ${fishCX+21},${waterSurfaceY+7}`}
                fill="#ea580c" opacity="0.7"
              />
              {/* Body */}
              <ellipse cx={fishCX} cy={waterSurfaceY} rx="15" ry="10" fill="#f97316"/>
              {/* Belly */}
              <ellipse cx={fishCX-2} cy={waterSurfaceY+3} rx="9" ry="5" fill="#fb923c" opacity="0.4"/>
              {/* Top fin */}
              <path
                d={`M ${fishCX-3} ${waterSurfaceY-10} Q ${fishCX+3} ${waterSurfaceY-19} ${fishCX+9} ${waterSurfaceY-10}`}
                fill="#fb923c"
              />
              {/* Eye */}
              <circle cx={fishCX-7} cy={waterSurfaceY-3} r="3.2" fill="#fff"/>
              <circle cx={fishCX-7} cy={waterSurfaceY-3} r="1.6" fill="#0f172a"/>
              <circle cx={fishCX-6} cy={waterSurfaceY-4} r="0.7" fill="#fff"/>
              {/* Big joyful smile */}
              <path
                d={`M ${fishCX-14} ${waterSurfaceY+3} Q ${fishCX-10} ${waterSurfaceY+8} ${fishCX-6} ${waterSurfaceY+3}`}
                stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"
              />
              {/* Rosy cheek */}
              <ellipse cx={fishCX-10} cy={waterSurfaceY+4} rx="4" ry="2.5" fill="#f43f5e" opacity="0.4"/>

              {/* Joy sparkles burst at peak */}
              {[0,1,2,3].map(i => {
                const angle = (i/4)*Math.PI*2;
                return (
                  <motion.text key={i}
                    x={fishCX + Math.cos(angle)*28 - 6}
                    y={waterSurfaceY + Math.sin(angle)*18 + 5}
                    fontSize="13"
                    initial={{ opacity:0, scale:0 }}
                    animate={{ opacity:[0,0,0,1,1,0], scale:[0,0,0,1.3,1,0] }}
                    style={{ originX:`${fishCX + Math.cos(angle)*28}px`, originY:`${waterSurfaceY + Math.sin(angle)*18}px` }}
                    transition={{ duration:2.6, times:[0,0.3,0.45,0.52,0.65,0.8] }}
                  >
                    {["✨","⭐","💛","🌟"][i]}
                  </motion.text>
                );
              })}

              {/* "WOOHOO!" text pops at peak */}
              <motion.text
                x={fishCX - 28} y={waterSurfaceY - 30}
                fontSize="11" fill="#fbbf24" fontWeight="800"
                initial={{ opacity:0, y: waterSurfaceY - 20 }}
                animate={{ opacity:[0,0,0,1,1,0], y:[waterSurfaceY-20, waterSurfaceY-20, waterSurfaceY-20, waterSurfaceY-38, waterSurfaceY-44, waterSurfaceY-52] }}
                transition={{ duration:2.6, times:[0,0.3,0.44,0.52,0.65,0.82] }}
              >
                WOOHOO! 🎉
              </motion.text>
            </motion.g>

            {/* Re-entry splash rings — appear as fish falls back in */}
            {[0,1,2].map(i => (
              <motion.ellipse key={`re${i}`}
                cx={fishCX} cy={waterSurfaceY}
                rx="5" ry="3" fill="none" stroke="#93c5fd" strokeWidth={2-i*0.5}
                initial={{ rx:5, ry:3, opacity:0 }}
                animate={{
                  rx:[5, 60+i*20],
                  ry:[3, 16+i*6],
                  opacity:[0, 0, 0, 0, 0, 0.9, 0],
                }}
                transition={{ duration:2.6, times:[0,0.1,0.3,0.5,0.85,0.9,1], ease:"easeOut" }}
              />
            ))}
          </>
        )}
        {/* Tunnel outline */}
        <polyline points={ALL_PIPE_SEGS.map(s=>`${s.x1},${s.y1}`).join(' ')+` ${ALL_PIPE_SEGS[24].x2},${ALL_PIPE_SEGS[24].y2}`} fill="none" stroke="#3a2510" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
        <polyline points={ALL_PIPE_SEGS.map(s=>`${s.x1},${s.y1}`).join(' ')+` ${ALL_PIPE_SEGS[24].x2},${ALL_PIPE_SEGS[24].y2}`} fill="none" stroke="#1a0f05" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
        {/* 25 pipe segments */}
        {ALL_PIPE_SEGS.slice(0,progress).map((seg,i)=>(
          <motion.g key={i} initial={{opacity:0,scaleX:0,scaleY:0}} animate={{opacity:1,scaleX:1,scaleY:1}} transition={{duration:0.5,ease:"easeOut"}} style={{transformOrigin:`${seg.x1}px ${seg.y1}px`}}>
            <line x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2} stroke="#92400e" strokeWidth="11" strokeLinecap="round"/>
            <line x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2} stroke="#d97706" strokeWidth="8" strokeLinecap="round"/>
            <line x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2} stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
            <motion.line x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2} stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:0.6,delay:0.2}}/>
            <circle cx={seg.x1} cy={seg.y1} r="6" fill="#b45309"/>
            <circle cx={seg.x1} cy={seg.y1} r="3.5" fill="#d97706"/>
          </motion.g>
        ))}
        {progress > 0 && <circle cx={ALL_PIPE_SEGS[Math.min(progress-1,24)].x2} cy={ALL_PIPE_SEGS[Math.min(progress-1,24)].y2} r="6" fill="#b45309"/>}
        {/* Water pour when complete */}
        {isComplete && [0,1,2,3,4].map(i=>(
          <motion.circle key={i} cx={pondX+pondW/2+(i%2===0?3:-3)} cy={pondY+pondH+(groundY-pondY)-pondWaterH-10} r="3" fill="#60a5fa" opacity="0.8" animate={{cy:[pondY+pondH+(groundY-pondY)-pondWaterH-10,pondY+pondH+(groundY-pondY)-pondWaterH+5],opacity:[0.8,0]}} transition={{repeat:Infinity,duration:0.6,delay:i*0.12}}/>
        ))}
        <text x="250" y="375" textAnchor="middle" fill="#64748b" fontSize="8">{progress}/{total} pipe segments laid</text>
        {isComplete && (
          <motion.text x="250" y="16" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="700" animate={{opacity:[0.6,1,0.6]}} transition={{repeat:Infinity,duration:1.4}}>
            FISH SAVED! PIPE COMPLETE!
          </motion.text>
        )}
      </svg>
    </div>
  );
}

// ─── Celebration Screen ───────────────────────────────────────────────────────
function CelebrationScreen({ name, onDone }) {
  const [countdown, setCountdown] = useState(8);

  // Tick every second for countdown display
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(c => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Navigate to thank you after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => onDone(), 8000);
    return () => clearTimeout(timer);
  }, [onDone]);

  // 40 confetti pieces with varied shapes
  const confetti = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: 5 + (i * 23 + i * i * 3) % 490,
    color: ["#f97316","#fbbf24","#3b82f6","#10b981","#f43f5e","#a78bfa","#06b6d4","#84cc16"][i % 8],
    delay: (i * 0.09) % 2.2,
    duration: 2.0 + (i % 5) * 0.35,
    size: 7 + (i % 5) * 2.5,
    shape: i % 3, // 0=rect, 1=circle, 2=triangle
    spin: i % 2 === 0 ? 1 : -1,
  }));

  // Floating emoji bursts — hearts, stars, sparkles
  const floaters = [
    { emoji:"❤️",  x:60,  delay:0.0, dur:2.2 },
    { emoji:"⭐",  x:100, delay:0.3, dur:2.5 },
    { emoji:"✨",  x:160, delay:0.6, dur:2.0 },
    { emoji:"💛",  x:220, delay:0.1, dur:2.3 },
    { emoji:"🌟",  x:270, delay:0.5, dur:2.6 },
    { emoji:"💙",  x:330, delay:0.2, dur:2.1 },
    { emoji:"🎉",  x:380, delay:0.7, dur:2.4 },
    { emoji:"💖",  x:430, delay:0.4, dur:2.2 },
    { emoji:"🌊",  x:80,  delay:1.0, dur:2.8 },
    { emoji:"🐟",  x:250, delay:1.2, dur:2.3 },
    { emoji:"✨",  x:310, delay:0.9, dur:2.5 },
    { emoji:"⭐",  x:460, delay:1.1, dur:2.0 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: "linear-gradient(180deg, #040d1e 0%, #0a1f3a 50%, #071428 100%)" }}
    >
      {/* ── CONFETTI RAIN ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map(c => (
          <motion.div
            key={c.id}
            className="absolute"
            style={{
              left: c.x,
              top: -30,
              width: c.shape === 1 ? c.size : c.size * 1.4,
              height: c.shape === 1 ? c.size : c.size * 0.55,
              backgroundColor: c.color,
              borderRadius: c.shape === 1 ? "50%" : c.shape === 2 ? "0" : "3px",
              clipPath: c.shape === 2 ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "none",
              opacity: 0.9,
            }}
            animate={{
              y: ["0px", "105vh"],
              rotate: [0, 360 * c.spin * 3],
              opacity: [0, 1, 1, 0.7, 0],
            }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* ── FLOATING EMOJI BURSTS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floaters.map((f, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{ left: f.x, bottom: -40 }}
            animate={{
              y: [0, -window.innerHeight - 60],
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.2, 1, 0.8],
            }}
            transition={{
              duration: f.dur,
              delay: f.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            {f.emoji}
          </motion.div>
        ))}
      </div>

      {/* ── PULSING GLOW RINGS ── */}
      {[1, 1.6, 2.2].map((scale, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 200,
            height: 200,
            border: "2px solid rgba(96,165,250,0.3)",
          }}
          animate={{ scale: [scale, scale + 0.5, scale], opacity: [0.6, 0, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, delay: i * 0.55 }}
        />
      ))}

      {/* ── RADIAL GLOW BEHIND FISH ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 340,
          height: 340,
          background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, rgba(59,130,246,0.12) 50%, transparent 75%)",
        }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 1.3 }}
      />

      {/* ── MAIN FISH SCENE ── */}
      <div className="relative z-10" style={{ width: 380, maxWidth: "92vw" }}>
        <svg viewBox="0 0 380 310" width="100%" xmlns="http://www.w3.org/2000/svg">

          {/* ── WATER POOL ── */}
          {/* Pool glow */}
          <motion.ellipse cx="190" cy="270" rx="130" ry="28"
            fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.35"
            animate={{ rx:[130,148,130], ry:[28,22,28] }}
            transition={{ repeat:Infinity, duration:0.85 }}
          />
          {/* Pool body */}
          <motion.ellipse cx="190" cy="272" rx="122" ry="24"
            fill="#1a5fa0"
            animate={{ rx:[122,138,122], ry:[24,19,24] }}
            transition={{ repeat:Infinity, duration:0.85 }}
          />
          {/* Pool shimmer lines */}
          <motion.line x1="140" y1="265" x2="240" y2="265"
            stroke="#93c5fd" strokeWidth="2" opacity="0.4"
            animate={{ x1:[140,155,140], x2:[240,225,240], opacity:[0.4,0.7,0.4] }}
            transition={{ repeat:Infinity, duration:1.2 }}
          />
          <motion.line x1="160" y1="275" x2="210" y2="275"
            stroke="#93c5fd" strokeWidth="1.5" opacity="0.25"
            animate={{ x1:[160,170,160], x2:[210,200,210] }}
            transition={{ repeat:Infinity, duration:0.9, delay:0.3 }}
          />

          {/* ── ENTRY SPLASH when fish hits water ── */}
          {/* Concentric splash rings */}
          {[0,1,2].map(i => (
            <motion.ellipse key={i} cx="190" cy="270" rx="20" ry="8"
              fill="none" stroke="#60a5fa" strokeWidth={2 - i*0.5} opacity="0.7"
              animate={{
                rx: [20, 90 + i*20],
                ry: [8,  28 + i*6],
                opacity: [0.8, 0],
              }}
              transition={{ repeat:Infinity, duration:0.9, delay: i*0.22, ease:"easeOut" }}
            />
          ))}

          {/* Splash droplets flying outward */}
          {[0,1,2,3,4,5,6,7,8,9].map(i => {
            const angle = (i / 10) * Math.PI * 2;
            const dist  = 70 + (i % 3) * 25;
            const tx = 190 + Math.cos(angle) * dist;
            const ty = 270 + Math.sin(angle) * (dist * 0.38);
            return (
              <motion.ellipse key={i}
                cx="190" cy="268"
                rx={3 + (i%3)} ry={5 + (i%3)}
                fill="#60a5fa" opacity="0.9"
                animate={{
                  cx: [190, tx],
                  cy: [268, ty - 35],
                  opacity: [1, 0],
                  ry: [5, 2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.75,
                  delay: (i * 0.075) % 0.6,
                  ease: "easeOut",
                }}
              />
            );
          })}

          {/* ── THE JUMPING FISH ── */}
          {/* 
            Jump arc: resting in water (y=0) → launch up (y=-80) → peak (y=-170)
            → flip at peak → come back down → splash → bounce → repeat
            rotate: tilt back on way up, straighten at peak, tilt forward on way down
          */}
          <motion.g
            animate={{
              y:      [0,  -55, -130, -175, -130, -55,  0,  12,  0],
              rotate: [0,  -22,  -5,   12,    5,   18,  0,  -6,  0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
              ease: "easeInOut",
              times: [0, 0.15, 0.32, 0.5, 0.65, 0.82, 0.9, 0.95, 1],
            }}
            style={{ originX: "190px", originY: "248px" }}
          >
            {/* ── TAIL — static, no wiggle ── */}
            <g>
              <polygon points="214,248 248,228 248,268" fill="#c2410c"/>
              <polygon points="214,248 242,232 242,264" fill="#ea580c" opacity="0.65"/>
              <line x1="214" y1="248" x2="248" y2="238" stroke="#f97316" strokeWidth="1" opacity="0.5"/>
              <line x1="214" y1="248" x2="248" y2="248" stroke="#f97316" strokeWidth="1" opacity="0.5"/>
              <line x1="214" y1="248" x2="248" y2="258" stroke="#f97316" strokeWidth="1" opacity="0.5"/>
            </g>

            {/* ── BODY ── */}
            <ellipse cx="185" cy="248" rx="32" ry="19" fill="#f97316"/>
            {/* body gradient sheen */}
            <ellipse cx="182" cy="252" rx="19" ry="9" fill="#fb923c" opacity="0.4"/>
            <ellipse cx="180" cy="242" rx="14" ry="5" fill="#fed7aa" opacity="0.25"/>

            {/* Scale arcs */}
            {[[178,243],[190,241],[202,243],[176,252],[188,251],[200,252],[212,252]].map(([sx,sy],si)=>(
              <ellipse key={si} cx={sx} cy={sy} rx="6" ry="4" fill="none" stroke="#ea580c" strokeWidth="0.9" opacity="0.55"/>
            ))}

            {/* ── DORSAL FIN (top) — flapping hard ── */}
            <motion.path
              fill="#fb923c"
              animate={{ d:[
                "M 176 229 Q 182 212 190 218 Q 196 208 204 215 Q 210 222 208 229 Z",
                "M 176 229 Q 180 208 188 216 Q 195 204 203 212 Q 212 220 208 229 Z",
                "M 176 229 Q 184 214 192 220 Q 198 210 205 217 Q 211 224 208 229 Z",
                "M 176 229 Q 182 212 190 218 Q 196 208 204 215 Q 210 222 208 229 Z",
              ]}}
              transition={{ repeat:Infinity, duration:0.28, ease:"easeInOut" }}
            />
            {/* Dorsal fin rays */}
            <motion.line x1="182" y1="229" x2="184" y2="216"
              stroke="#f97316" strokeWidth="1" opacity="0.5"
              animate={{ x2:[184,182,186,184], y2:[216,212,214,216] }}
              transition={{ repeat:Infinity, duration:0.28 }}
            />

            {/* ── PECTORAL FIN (side) — flapping vigorously ── */}
            <motion.path
              fill="#fb923c"
              animate={{ d:[
                "M 174 252 Q 160 266 152 258 Q 156 242 174 246 Z",
                "M 174 252 Q 158 272 148 262 Q 153 240 174 246 Z",
                "M 174 252 Q 162 260 154 252 Q 158 242 174 246 Z",
                "M 174 252 Q 160 266 152 258 Q 156 242 174 246 Z",
              ]}}
              transition={{ repeat:Infinity, duration:0.22, ease:"easeInOut" }}
            />

            {/* ── VENTRAL FIN (belly) ── */}
            <motion.path
              fill="#ea580c" opacity="0.7"
              animate={{ d:[
                "M 185 267 Q 180 278 188 276 Q 192 278 190 267 Z",
                "M 185 267 Q 178 282 186 280 Q 191 282 190 267 Z",
                "M 185 267 Q 180 278 188 276 Q 192 278 190 267 Z",
              ]}}
              transition={{ repeat:Infinity, duration:0.3, ease:"easeInOut" }}
            />

            {/* ── EYE ── */}
            <circle cx="158" cy="244" r="6" fill="#fff"/>
            <circle cx="157" cy="243" r="3.5" fill="#0f172a"/>
            <circle cx="155.5" cy="241.5" r="1.3" fill="#fff"/>
            {/* Eyelid squint (happy) */}
            <path d="M 152 240 Q 157 236 163 240" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.5"/>

            {/* ── BIG HAPPY SMILE ── */}
            <path d="M 149 249 Q 155 259 162 249" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* smile cheek rosy */}
            <ellipse cx="152" cy="252" rx="5" ry="3" fill="#f43f5e" opacity="0.45"/>

            {/* ── MUSICAL NOTES flying off ── */}
            {[
              { note:"♪", startX:142, startY:238, endX:120, endY:200, color:"#fbbf24", delay:0.0, dur:1.0 },
              { note:"♫", startX:148, startY:230, endX:122, endY:188, color:"#34d399", delay:0.35, dur:1.1 },
              { note:"♬", startX:138, startY:244, endX:112, endY:210, color:"#f97316", delay:0.7,  dur:0.9 },
            ].map((n,i) => (
              <motion.text key={i}
                x={n.startX} y={n.startY}
                fontSize={15 - i*1.5} fill={n.color} fontWeight="bold" opacity="0"
                animate={{
                  x: [n.startX, n.endX],
                  y: [n.startY, n.endY],
                  opacity: [0, 1, 1, 0],
                  fontSize: [15 - i*1.5, 10 - i],
                }}
                transition={{ repeat:Infinity, duration:n.dur, delay:n.delay, ease:"easeOut" }}
              >
                {n.note}
              </motion.text>
            ))}

            {/* ── SPARKLE BURSTS around body ── */}
            {[0,1,2,3,4,5].map(i => {
              const angle = (i / 6) * Math.PI * 2;
              const r = 45 + (i%2)*12;
              return (
                <motion.g key={i}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.4, 1.4, 0.4],
                  }}
                  style={{ originX:`${185 + Math.cos(angle)*r}px`, originY:`${248 + Math.sin(angle)*r*0.6}px` }}
                  transition={{ repeat:Infinity, duration:0.85, delay:i*0.14 }}
                >
                  <text
                    x={185 + Math.cos(angle)*r - 7}
                    y={248 + Math.sin(angle)*r*0.6 + 5}
                    fontSize="14"
                  >
                    {["✨","⭐","💛","✨","🌟","💙"][i]}
                  </text>
                </motion.g>
              );
            })}

            {/* ── HEART bursting from mouth ── */}
            <motion.text x="136" y="248" fontSize="16"
              animate={{ x:[136,108], y:[248,218], opacity:[0,1,1,0], scale:[0.5,1.2,1,0] }}
              style={{ originX:"136px", originY:"248px" }}
              transition={{ repeat:Infinity, duration:1.3, delay:0.5, ease:"easeOut" }}
            >❤️</motion.text>

            <motion.text x="140" y="242" fontSize="12"
              animate={{ x:[140,115], y:[242,208], opacity:[0,1,1,0] }}
              transition={{ repeat:Infinity, duration:1.1, delay:1.1, ease:"easeOut" }}
            >💛</motion.text>

          </motion.g>

          {/* ── WATER RIPPLE RINGS beneath fish ── */}
          {[0,1].map(i => (
            <motion.ellipse key={i} cx="190" cy="272" rx="15" ry="6"
              fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.5"
              animate={{ rx:[15,70+i*30], ry:[6,18+i*8], opacity:[0.6,0] }}
              transition={{ repeat:Infinity, duration:1.2, delay:i*0.5, ease:"easeOut" }}
            />
          ))}

        </svg>
      </div>

      {/* ── TEXT BLOCK ── */}
      <motion.div
        className="relative z-10 text-center px-4 -mt-2"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
      >
        {/* Headline pulses */}
        <motion.h1
          className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight"
          animate={{ scale:[1, 1.06, 1], textShadow:["0 0 0px #f97316","0 0 24px #f97316","0 0 0px #f97316"] }}
          transition={{ repeat:Infinity, duration:1.0 }}
        >
          🎉 You Saved the Fish! 🎉
        </motion.h1>

        <motion.p
          className="text-blue-200 text-base md:text-xl font-semibold mb-1"
          animate={{ opacity:[0.7,1,0.7] }}
          transition={{ repeat:Infinity, duration:1.5 }}
        >
          All 25 pipes connected — water flows freely!
        </motion.p>

        <p className="text-slate-400 text-sm mb-4">The goldfish is overjoyed! 🐟💦</p>

        {/* Countdown bar */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            className="h-2 rounded-full bg-orange-500"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 8, ease: "linear" }}
            style={{ width: 220, transformOrigin: "left center" }}
          />
          <motion.p
            className="text-orange-300 text-xs font-medium"
            animate={{ opacity:[0.5,1,0.5] }}
            transition={{ repeat:Infinity, duration:1.0 }}
          >
            Taking you to results in {countdown}s...
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Thank You Screen ─────────────────────────────────────────────────────────
function ThankYou({ name }) {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | loading | success | error

  const handleContactSubmit = async () => {
    if (!contactName.trim() && !contactEmail.trim()) return;
    setSubmitStatus("loading");
    try {
      await fetch(`${API_URL}/api/submit-contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alias: name,
          contactName: contactName.trim(),
          contactEmail: contactEmail.trim(),
          submittedAt: new Date().toISOString(),
        }),
      });
      setSubmitStatus("success");
    } catch (e) {
      console.log("Backend not connected — demo mode");
      setSubmitStatus("success"); // show success anyway in demo mode
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#0f172a" }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="text-center max-w-lg w-full"
      >
        <motion.div
          animate={{ rotate:[0,10,-10,6,-6,0], y:[0,-6,0] }}
          transition={{ repeat:Infinity, duration:2.2 }}
          className="text-7xl mb-6 select-none"
        >🐟</motion.div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
          Thank you, {name}!
        </h1>
        <p className="text-blue-200 text-lg mb-2">The goldfish is swimming happily thanks to you.</p>

        <div className="bg-white rounded-2xl p-8 border border-white/10 shadow-2xl flex flex-col items-center">
          <div className="flex justify-center text-center items-center mb-4 w-20 h-10">
            <img className="" src="https://sparktraineeships.com/wp-content/uploads/2025/05/Main-Logo.svg" alt="" />
          </div>
          <p className="text-black text-sm leading-relaxed">
            Our team will review your responses.
          </p>

          {/* ── Optional contact section ── */}
          <div className="w-full mt-6 border-t border-slate-200 pt-6">
            <p className="text-slate-700 text-sm font-semibold mb-1 text-center">
              Would you like Spark Traineeships to contact you?
            </p>
            <p className="text-slate-500 text-xs mb-4 text-center">
              If so, please add your name and email address below. This is completely optional.
            </p>

            {submitStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-2 py-3"
              >
                <span className="text-3xl">🎉</span>
                <p className="text-green-600 font-semibold text-sm">Details saved! We'll be in touch.</p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-orange-400 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-orange-400 transition-colors"
                />
                <motion.button
                  onClick={handleContactSubmit}
                  disabled={submitStatus === "loading" || (!contactName.trim() && !contactEmail.trim())}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                    (!contactName.trim() && !contactEmail.trim()) || submitStatus === "loading"
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer shadow-md"
                  }`}
                >
                  {submitStatus === "loading" ? "Saving..." : "Send my details →"}
                </motion.button>
              </div>
            )}
          </div>
          {/* ── end optional contact section ── */}

          <div className="mt-6 flex justify-center gap-3">
            <span className="text-2xl">🌊</span>
            <span className="text-2xl">🐟</span>
            <span className="text-2xl">✨</span>
            <span className="text-2xl">🎉</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Agreement Popup ──────────────────────────────────────────────────────────
function AgreementPopup({ onAgree }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(10,18,50,0.92)", backdropFilter:"blur(6px)" }}>
      <motion.div
        initial={{ scale:0.85, opacity:0, y:30 }}
        animate={{ scale:1, opacity:1, y:0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative"
      >
        <div className="flex justify-center">
          <SparkLogoWhite />
        </div>
        <h2 className="text-2xl font-bold text-[#1e2d5a] text-center mb-2">Welcome to Spark Traineeships Survey</h2>
        <p className="text-slate-500 text-center text-sm mb-6">Before you begin, please review and accept our terms.</p>
        <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 h-40 overflow-y-auto mb-6 border border-slate-200 leading-relaxed">
          <p className="font-semibold text-slate-700 mb-2">Data Collection Agreement</p>
          <p className="mb-2">By participating in this survey, you agree that Spark Traineeships Oy may collect and process your responses for the purpose of improving our traineeship matching services.</p>
          <p className="mb-2">Your data will be stored securely and will not be shared with third parties without your explicit consent. You may request deletion of your data at any time by contacting us at privacy@sparktraineeships.fi.</p>
          <p className="mb-2">Participation is entirely voluntary and your responses will be kept confidential. Aggregated, anonymised data may be used for internal reporting and service improvement.</p>
          <p>By checking the box below, you confirm that you have read and understood this agreement and consent to the collection of your survey responses.</p>
        </div>
        <label className="flex items-center gap-3 cursor-pointer mb-6 select-none">
          <div
            onClick={() => setChecked(!checked)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${checked ? "bg-orange-500 border-orange-500" : "border-slate-300 bg-white"}`}
          >
            {checked && <svg viewBox="0 0 12 12" width="12" height="12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <span className="text-sm text-slate-700">I have read and agree to the data collection agreement</span>
        </label>
        <motion.button
          onClick={() => checked && onAgree()}
          whileTap={{ scale:0.96 }}
          className={`w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-200 ${checked ? "bg-orange-500 hover:bg-orange-600 cursor-pointer shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
        >
          {checked ? "Begin Survey →" : "Please accept to continue"}
        </motion.button>
      </motion.div>
    </div>
  );
}

// ─── Name Screen ──────────────────────────────────────────────────────────────
function NameScreen({ onNext }) {
  const [name, setName] = useState("");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background:"#0f172a" }}>
      <motion.div
        initial={{ opacity:0, y:40 }}
        animate={{ opacity:1, y:0 }}
        className="bg-white rounded-2xl p-10 max-w-md w-full shadow-2xl text-center"
      >
        <div className="flex justify-center">
          <SparkLogoWhite />
          </div>
        <h1 className="text-3xl font-bold text-[#1e2d5a] mb-2">Let's get started!</h1>
        <p className="text-[#1e2d5a] text-sm mb-8">To personalise your experience submit your alias.</p>
        <input
          type="text"
          placeholder="Alias"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key==="Enter" && name.trim() && onNext(name.trim())}
          className="w-full bg-[#1e2d5a] border border-white/20 text-white placeholder-blue-300 rounded-xl px-5 py-4 text-base mb-3 outline-none focus:border-orange-400 transition-colors"
        />
        <p className="mb-3 text-red-900 font-semibold">Please don't share your personal information to keep the survey 100% anonomous </p>
        <motion.button
          onClick={() => name.trim() && onNext(name.trim())}
          whileTap={{ scale:0.96 }}
          className={`w-full py-4 rounded-xl font-bold text-[#1e2d5a] text-base transition-all duration-200 ${name.trim() ? "bg-orange-500 hover:bg-orange-600 shadow-lg cursor-pointer" : "bg-white/10 text-white/30 cursor-not-allowed"}`}
        >
          Start Survey →
        </motion.button>
      </motion.div>
    </div>
  );
}

// ─── Question Card ────────────────────────────────────────────────────────────
function QuestionCard({ question, answer, onChange }) {
  const handleCheckbox = (opt) => {
    const base = Array.isArray(answer?.selected) ? [...answer.selected] : [];
    const next = base.includes(opt) ? base.filter(x => x !== opt) : [...base, opt];
    onChange({ ...(answer || {}), selected: next });
  };

  // For simple checkbox (no other)
  const handleSimpleCheckbox = (opt) => {
    const arr = Array.isArray(answer) ? [...answer] : [];
    if (arr.includes(opt)) onChange(arr.filter(x => x !== opt));
    else onChange([...arr, opt]);
  };

  return (
    <div>
      <p className="text-white font-semibold text-base md:text-lg mb-5 leading-relaxed">{question.text}</p>

      {/* Radio (single select) */}
      {question.type === "radio" && (
        <div className="flex flex-col gap-2">
          {question.options.map(opt => (
            <motion.button key={opt} onClick={() => onChange(opt)} whileTap={{ scale: 0.97 }}
              className={`text-left px-5 py-3 rounded-xl text-sm font-medium transition-all duration-150 border ${answer === opt ? "bg-orange-500 border-orange-400 text-white" : "bg-white/5 border-white/10 text-blue-100 hover:bg-white/10 hover:border-orange-400/50"}`}>
              {opt}
            </motion.button>
          ))}
        </div>
      )}

      {/* Simple checkbox (no other field) */}
      {question.type === "checkbox" && (
        <div className="flex flex-col gap-2">
          {question.options.map(opt => {
            const ch = Array.isArray(answer) && answer.includes(opt);
            return (
              <motion.button key={opt} onClick={() => handleSimpleCheckbox(opt)} whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 text-left px-5 py-3 rounded-xl text-sm font-medium transition-all duration-150 border ${ch ? "bg-orange-500 border-orange-400 text-white" : "bg-white/5 border-white/10 text-blue-100 hover:bg-white/10"}`}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${ch ? "bg-white border-white" : "border-white/30"}`}>
                  {ch && <svg viewBox="0 0 12 12" width="10" fill="none"><path d="M2 6l3 3 5-5" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                {opt}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Checkbox with "Other" short-answer field */}
      {question.type === "checkbox_other" && (
        <div className="flex flex-col gap-2">
          {question.options.map(opt => {
            const ch = Array.isArray(answer?.selected) && answer.selected.includes(opt);
            return (
              <motion.button key={opt} onClick={() => handleCheckbox(opt)} whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 text-left px-5 py-3 rounded-xl text-sm font-medium transition-all duration-150 border ${ch ? "bg-orange-500 border-orange-400 text-white" : "bg-white/5 border-white/10 text-blue-100 hover:bg-white/10"}`}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${ch ? "bg-white border-white" : "border-white/30"}`}>
                  {ch && <svg viewBox="0 0 12 12" width="10" fill="none"><path d="M2 6l3 3 5-5" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                {opt}
              </motion.button>
            );
          })}
          {/* Other option */}
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium border transition-all duration-150 cursor-pointer ${answer?.otherChecked ? "bg-orange-500 border-orange-400" : "bg-white/5 border-white/10"}`}
            onClick={() => onChange({ ...(answer || {}), otherChecked: !answer?.otherChecked, otherText: answer?.otherText || "" })}>
            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${answer?.otherChecked ? "bg-white border-white" : "border-white/30"}`}>
              {answer?.otherChecked && <svg viewBox="0 0 12 12" width="10" fill="none"><path d="M2 6l3 3 5-5" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span className={answer?.otherChecked ? "text-white" : "text-blue-100"}>Other</span>
          </div>
          {answer?.otherChecked && (
            <input
              type="text"
              placeholder="Please specify..."
              value={answer?.otherText || ""}
              onChange={e => onChange({ ...(answer || {}), otherText: e.target.value })}
              onClick={e => e.stopPropagation()}
              className="w-full bg-white/5 border border-white/20 text-white placeholder-blue-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors"
            />
          )}
        </div>
      )}

      {/* Linear scale 1–5 */}
      {question.type === "linear" && (
        <div>
          <div className="flex justify-between text-xs text-blue-300 mb-3 px-1">
            <span>1 = {question.scaleLabel?.low || "Not satisfied"}</span>
            <span>5 = {question.scaleLabel?.high || "Very satisfied"}</span>
          </div>
          <div className="flex gap-3 justify-center">
            {[1, 2, 3, 4, 5].map(n => (
              <motion.button key={n} onClick={() => onChange(n)} whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 rounded-xl font-bold text-base transition-all ${answer === n ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : "bg-white/10 text-blue-200 hover:bg-white/20"}`}>
                {n}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Paragraph (long text) */}
      {question.type === "paragraph" && (
        <textarea
          placeholder="Your thoughts here..."
          value={answer || ""}
          onChange={e => onChange(e.target.value)}
          rows={4}
          className="w-full bg-white/5 border border-white/10 text-white placeholder-blue-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 resize-none transition-colors"
        />
      )}

      {/* Legacy text (short) */}
      {question.type === "text" && (
        <textarea
          placeholder="Your thoughts here..."
          value={answer || ""}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className="w-full bg-white/5 border border-white/10 text-white placeholder-blue-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 resize-none transition-colors"
        />
      )}

      {/* Multiple choice with optional comment */}
      {question.type === "multiple_choice_comment" && (
        <div className="flex flex-col gap-2">
          {question.options.map(opt => (
            <motion.button key={opt} onClick={() => onChange({ ...(answer || {}), choice: opt })} whileTap={{ scale: 0.97 }}
              className={`text-left px-5 py-3 rounded-xl text-sm font-medium transition-all duration-150 border ${answer?.choice === opt ? "bg-orange-500 border-orange-400 text-white" : "bg-white/5 border-white/10 text-blue-100 hover:bg-white/10 hover:border-orange-400/50"}`}>
              {opt}
            </motion.button>
          ))}
          <input
            type="text"
            placeholder="Optional comment..."
            value={answer?.comment || ""}
            onChange={e => onChange({ ...(answer || {}), comment: e.target.value })}
            className="w-full bg-white/5 border border-white/10 text-white placeholder-blue-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors mt-1"
          />
        </div>
      )}

      {/* Legacy 1–10 scale */}
      {question.type === "scale" && (
        <div>
          <div className="flex justify-between text-xs text-blue-300 mb-2 px-1"><span>Not important</span><span>Very important</span></div>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <motion.button key={n} onClick={() => onChange(n)} whileTap={{ scale: 0.9 }}
                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${answer === n ? "bg-orange-500 text-white" : "bg-white/10 text-blue-200 hover:bg-white/20"}`}>
                {n}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section Complete Overlay ─────────────────────────────────────────────────
const SECTION_MESSAGES = [
  { headline: "Great start!", sub: "Session info recorded. On to your experience! 💪", stars: 5 },
  { headline: "Nicely done!", sub: "Your reactions are noted. Keep going! 🌟", stars: 5 },
  { headline: "Halfway hero!", sub: "Learning section complete. You're doing great!", stars: 5 },
  { headline: "4 of 7 done!", sub: "Behaviour section complete. More than halfway! 🚀", stars: 5 },
  { headline: "5 of 7 done!", sub: "Results section in the bag. Almost there! 📈", stars: 5 },
  { headline: "Nearly there!", sub: "Meaningfulness captured. One final section! ❤️", stars: 5 },
  { headline: "All done!", sub: "Final thoughts submitted. You saved the fish! 🐟", stars: 5 },
];

function SectionCompleteOverlay({ sectionIndex, onContinue }) {
  const sec = SECTIONS[sectionIndex];
  const msg = SECTION_MESSAGES[sectionIndex];
  const nextSec = SECTIONS[sectionIndex + 1];

  // Burst particles
  const particles = Array.from({ length: 18 }, (_, i) => ({
    angle: (i / 18) * 360,
    color: ["#f97316","#fbbf24","#3b82f6","#10b981","#f43f5e","#a78bfa"][i % 6],
    dist: 80 + (i % 3) * 30,
  }));

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,18,50,0.88)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Burst particles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{ backgroundColor: p.color }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((p.angle * Math.PI) / 180) * p.dist,
              y: Math.sin((p.angle * Math.PI) / 180) * p.dist,
              opacity: 0,
              scale: 0.3,
            }}
            transition={{ duration: 0.7, delay: i * 0.02, ease: "easeOut" }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center relative overflow-hidden"
      >
        {/* Top color bar matching section color */}
        <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl" style={{ background: sec.color }} />

        {/* Big emoji */}
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, 15, -15, 10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {sec.emoji}
        </motion.div>

        {/* Stars */}
        <div className="flex justify-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.span
              key={i}
              className="text-2xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >⭐</motion.span>
          ))}
        </div>

        {/* Section badge */}
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3"
          style={{ background: sec.color }}
        >
          Section {sec.id} of 7 — {sec.title}
        </div>

        <h2 className="text-2xl font-black text-[#1e2d5a] mb-2">{msg.headline}</h2>
        <p className="text-slate-500 text-sm mb-6">{msg.sub}</p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {SECTIONS.map((s, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{ background: i <= sectionIndex ? s.color : "#e2e8f0" }}
              initial={{ scale: i === sectionIndex ? 0.5 : 1 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
            />
          ))}
        </div>

        {nextSec ? (
          <motion.button
            onClick={onContinue}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="w-full py-3.5 rounded-xl font-bold text-white text-base shadow-lg"
            style={{ background: SECTIONS[sectionIndex + 1]?.color || "#f97316" }}
          >
            Next: {nextSec.emoji} {nextSec.title} →
          </motion.button>
        ) : (
          <motion.button
            onClick={onContinue}
            whileTap={{ scale: 0.96 }}
            className="w-full py-3.5 rounded-xl font-bold text-white text-base bg-orange-500 shadow-lg"
          >
            Submit &amp; Save the Fish! 🐟
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  
  // phases: agreement | name | survey | section-complete | pond-jump | celebrating | done
  const [phase, setPhase] = useState("agreement");
  const [userName, setUserName] = useState("");

  // Section & question tracking
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0); // 0-3
  const [currentQInSection, setCurrentQInSection] = useState(0); // 0-N within section

  // answers keyed by question id: { 1: "Social media", 2: "Bachelor's", ... }
  const [answers, setAnswers] = useState({});

  // Total answered = how many pipes laid
  const [answered, setAnswered] = useState(0);

  // Which section just completed (for overlay)
  const [completedSectionIdx, setCompletedSectionIdx] = useState(null);

  if (window.location.pathname === "/result") return <Results />;

  const handleAgree = () => setPhase("name");
  const handleName  = (n) => { setUserName(n); setPhase("survey"); };

  // Current section data
  const currentSection   = SECTION_QUESTIONS[currentSectionIdx];
  const currentQuestion  = currentSection?.questions[currentQInSection];
  const isLastQInSection = currentQInSection === (currentSection?.questions.length ?? 1) - 1;
  const isLastSection    = currentSectionIdx === SECTIONS.length - 1;

  const handleAnswer = (val) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
  };

  // Save one section's answers to MongoDB via /api/submit-section
  const saveSectionToMongo = async (sectionIdx, currentAnswers) => {
    const sec = SECTION_QUESTIONS[sectionIdx];
    const payload = {
      username:     userName,
      section:      sec.id,
      sectionTitle: sec.title,
      responses:    sec.questions.map(q => ({
        questionId:   q.id,
        questionText: q.text,
        answer:       currentAnswers[q.id] ?? null,
      })),
      submittedAt: new Date().toISOString(),
    };
    try {
      await fetch(`${API_URL}/api/submit-section`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
    } catch (e) {
      console.log("Backend not connected — demo mode");
    }
  };

  const handleNext = async () => {
    const newAnswered = answered + 1;
    setAnswered(newAnswered);

    if (!isLastQInSection) {
      // Move to next question within same section
      setCurrentQInSection(q => q + 1);
    } else {
      // Section finished — save to MongoDB
      await saveSectionToMongo(currentSectionIdx, answers);

      if (!isLastSection) {
        // Show section complete overlay
        setCompletedSectionIdx(currentSectionIdx);
        setPhase("section-complete");
      } else {
        // All sections done — trigger pond jump then celebrate
        setPhase("pond-jump");
        setTimeout(() => setPhase("celebrating"), 2900);
      }
    }
  };

  const handleSectionContinue = () => {
    setCurrentSectionIdx(i => i + 1);
    setCurrentQInSection(0);
    setCompletedSectionIdx(null);
    setPhase("survey");
  };

  const canProceed = () => {
    if (!currentQuestion) return false;
    const a = answers[currentQuestion.id];
    if (a === undefined || a === null || a === "") return false;
    // checkbox: must pick at least one
    if (Array.isArray(a) && a.length === 0) return false;
    // checkbox_other: must pick at least one option or check Other
    if (currentQuestion.type === "checkbox_other") {
      const hasSelected = Array.isArray(a?.selected) && a.selected.length > 0;
      const hasOther = a?.otherChecked;
      return hasSelected || hasOther;
    }
    // multiple_choice_comment: must pick a choice (comment optional)
    if (currentQuestion.type === "multiple_choice_comment") {
      return !!a?.choice;
    }
    // paragraph / text: any non-empty string
    if (currentQuestion.type === "paragraph" || currentQuestion.type === "text") {
      return typeof a === "string" && a.trim().length > 0;
    }
    return true;
  };

  const progress = answered;
  const pct = Math.round((progress / QUESTIONS.length) * 100);

  // Phase routing
  if (phase === "agreement")   return <AgreementPopup onAgree={handleAgree} />;
  if (phase === "name")        return <NameScreen onNext={handleName} />;
  if (phase === "celebrating") return <CelebrationScreen name={userName} onDone={() => setPhase("done")} />;
  if (phase === "done")        return <ThankYou name={userName} />;

  const isPondJump = phase === "pond-jump";

  return (
    <div className="min-h-screen" style={{ fontFamily:"'Segoe UI', sans-serif" }}>

      {/* Section Complete Overlay */}
      <AnimatePresence>
        {phase === "section-complete" && completedSectionIdx !== null && (
          <SectionCompleteOverlay
            sectionIndex={completedSectionIdx}
            onContinue={handleSectionContinue}
          />
        )}
      </AnimatePresence>

      {/* Progress % */}
      <div className="flex justify-center items-center">
        <div className="bg-white rounded-full py-1 text-s text-orange-600 font-semibold">{pct}% done</div>
      </div>
      <div className="h-1 bg-white/5">
        <motion.div className="h-1 bg-gradient-to-r from-orange-400 to-orange-500" animate={{ width:`${pct}%` }} transition={{ duration:0.5 }}/>
      </div>

      {/* Section tab strip */}
      {!isPondJump && (
        <div className="flex bg-[#0f172a] border-b border-white/5">
          {SECTIONS.map((sec, i) => (
            <div key={sec.id}
              className={`flex-1 py-2 text-center text-xs font-semibold transition-all duration-300 ${
                i === currentSectionIdx ? "text-white border-b-2"
                : i < currentSectionIdx ? "text-green-400 opacity-80"
                : "text-white/25"
              }`}
              style={{ borderColor: i === currentSectionIdx ? sec.color : "transparent" }}
            >
              {i < currentSectionIdx ? "✓ " : ""}{sec.emoji} <span className="hidden sm:inline">{sec.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-56px)]">

        {/* Game panel */}
        <div className="bg-[#0f172a] w-full lg:w-1/2 flex flex-col items-center justify-center p-4 lg:p-8 order-1 lg:order-none" style={{ minHeight:"280px" }}>
          <motion.div className="w-full rounded-2xl overflow-hidden border border-white/10"
            style={{ background:"#0f1f4a", maxWidth:500 }}
            initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }}>
              <div className="flex justify-center"><AnimatePresence mode="wait">
            {isPondJump ? (
              <motion.p key="jumping" initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                className="text-yellow-300 text-sm font-bold text-center mt-3 max-w-xs">
                🐟 The fish is SO happy it jumped for joy! 🎉
              </motion.p>
            ) : (
              <motion.p key={progress} initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }}
                className="text-white font-semibold text-xs text-center mt-3 max-w-xs">
                {progress === 0  && "🐠 The goldfish is sad and thirsty. Answer questions to build the pipe!"}
                {progress > 0   && progress < 10  && "🔧 Great start! The pipe is being laid toward the lake..."}
                {progress >= 10 && progress < 20  && "💧 Almost halfway there! The fish can sense water coming..."}
                {progress >= 20 && progress < QUESTIONS.length && "🌊 So close! Just a few more questions to save the fish!"}
              </motion.p>
            )}
          </AnimatePresence></div>
            <div className="px-4 py-2 flex items-center gap-2 border-b border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-400"/>
              <span className="text-xs text-white font-medium">Hi, {userName}! Save The Fish 🐟</span>
              <span className="ml-auto text-xs text-orange-400">{progress}/{QUESTIONS.length} pipes laid</span>
            </div>
            <FishGame progress={progress} total={QUESTIONS.length} isComplete={false} pondJumping={isPondJump} />
          </motion.div>

          
        </div>

        {/* Question panel */}
        <div className="bg-white w-full lg:w-1/2 flex flex-col justify-center p-4 lg:p-8 order-2 lg:order-none border-t lg:border-t-0 lg:border-l border-white/10">
          <AnimatePresence mode="wait">
            {isPondJump ? (
              <motion.div key="frozen" initial={{ opacity:0 }} animate={{ opacity:1 }}
                className="flex flex-col items-center justify-center gap-5 py-10">
                <motion.div animate={{ scale:[1,1.12,1], rotate:[0,4,-4,0] }} transition={{ repeat:Infinity, duration:0.9 }} className="text-6xl">🎉</motion.div>
                <h2 className="text-2xl font-black text-[#1e2d5a] text-center">All 25 questions answered!</h2>
                <p className="text-[#1e2d5a] text-center text-sm max-w-xs">The pipe is complete — water is rushing in. Watch the fish celebrate!</p>
                <motion.div className="flex gap-2" animate={{ opacity:[0.4,1,0.4] }} transition={{ repeat:Infinity, duration:1 }}>
                  {[0,1,2].map(i=>(<div key={i} className="w-2.5 h-2.5 rounded-full bg-orange-400"/>))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key={`${currentSectionIdx}-${currentQInSection}`}
                initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>

                {/* Question counter */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex text-center items-center">
                      <div className="text-s text-[#1e2d5a] mb-0.5 flex items-center gap-1">
                        <span>Question</span>
                        <span className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {currentQInSection + 1}
                        </span>
                        <span>of {currentSection.questions.length}</span>
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full text-white font-semibold"
                          style={{ background: currentSection.color }}>
                          {currentSection.emoji} {currentSection.title}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full mt-1">
                      <div className="h-1.5 rounded-full transition-all duration-500"
                        style={{ width:`${((currentQInSection+1)/currentSection.questions.length)*100}%`, background: currentSection.color }}/>
                    </div>
                  </div>
                </div>

                {/* Question card + button */}
                <div className="bg-[#1e2d5a] rounded-2xl p-5 md:p-6 border border-white/10 mb-5">
                  <QuestionCard question={currentQuestion} answer={answers[currentQuestion.id]} onChange={handleAnswer} />
                  <motion.button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    whileTap={{ scale:0.97 }}
                    className={`w-full py-1 mt-2 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
                      canProceed()
                        ? "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer shadow-lg shadow-orange-500/20"
                        : "bg-white/5 text-white/25 cursor-not-allowed"
                    }`}
                  >
                    {isLastQInSection && isLastSection
                      ? <>Submit &amp; Save the Fish! 🐟</>
                      : isLastQInSection
                      ? <>Complete Section {currentSection.id} ✓</>
                      : <>Next Question <span className="text-lg">→</span></>
                    }
                  </motion.button>
                </div>

                {!canProceed() && <p className="text-center text-xs text-blue-500 mt-2">Please select an answer to continue</p>}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logo bottom */}
          <nav className="bg-white border-b h-full border-white/10 px-4 md:px-8 pt-2 flex items-center text-center justify-center gap-5 sticky top-0 z-40">
            <div className="flex justify-center bg-white">
              <SparkLogoWhite />
            </div>
          </nav>
        </div>

      </div>
    </div>
  );
}
